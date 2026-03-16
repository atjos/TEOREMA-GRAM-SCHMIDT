let vectorCount = 1;

// --- GESTIÓN DE LA INTERFAZ ---

document.getElementById("add-vector").addEventListener("click", () => {
  if (vectorCount < 3) {
    vectorCount++;
    const container = document.getElementById("vector-inputs");
    const div = document.createElement("div");
    div.className = "vector-input-group mb-3 animate__animated animate__fadeIn";
    div.innerHTML = `
            <label class="small fw-semibold text-primary">Vector $v_{${vectorCount}}$</label>
            <div class="row g-2">
                <div class="col-4"><input type="number" step="any" class="form-control form-control-sm coord-x" value="0" placeholder="x"></div>
                <div class="col-4"><input type="number" step="any" class="form-control form-control-sm coord-y" value="1" placeholder="y"></div>
                <div class="col-4"><input type="number" step="any" class="form-control form-control-sm coord-z" value="0" placeholder="z"></div>
            </div>
        `;
    container.appendChild(div);
    // Volver a procesar LaTeX en el nuevo label
    MathJax.typeset();
  } else {
    alert("En R³ solo podemos tener un máximo de 3 vectores para una base.");
  }
});

document.getElementById("reset-btn").addEventListener("click", () => {
  location.reload();
});

// --- CÁLCULO Y COMUNICACIÓN CON EL BACKEND ---

document.getElementById("calculate-btn").addEventListener("click", async () => {
  const vectorGroups = document.querySelectorAll(".vector-input-group");
  const vectors = [];

  vectorGroups.forEach((group) => {
    vectors.push([
      parseFloat(group.querySelector(".coord-x").value) || 0,
      parseFloat(group.querySelector(".coord-y").value) || 0,
      parseFloat(group.querySelector(".coord-z").value) || 0,
    ]);
  });

  // Mostrar loader
  document.getElementById("plot-loader").classList.remove("d-none");

  try {
    const response = await fetch("/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vectors }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert("Error: " + data.error);
      document.getElementById("plot-loader").classList.add("d-none");
      return;
    }

    // 1. Mostrar resultados y pasos
    renderSteps(data.steps);
    renderFinalSummary(data.orthogonal_vectors, data.orthonormal_vectors);

    // 2. Dibujar Gráfico 3D
    render3DPlot(data);

    // 3. Mostrar la sección de resultados
    document.getElementById("results-area").classList.remove("d-none");
    document.getElementById("plot-loader").classList.add("d-none");

    // Scroll suave al resultado
    window.scrollTo({
      top: document.getElementById("results-area").offsetTop - 50,
      behavior: "smooth",
    });
  } catch (error) {
    console.error("Error:", error);
    alert("Ocurrió un error al procesar los datos.");
    document.getElementById("plot-loader").classList.add("d-none");
  }
});

// --- RENDERIZADO DE CONTENIDO MATEMÁTICO ---

function renderSteps(steps) {
  const container = document.getElementById("steps-content");
  container.innerHTML = "";

  steps.forEach((step, index) => {
    const stepDiv = document.createElement("div");
    stepDiv.className =
      "step-box p-4 mb-4 rounded-3 border-start border-4 border-info bg-white shadow-sm";

    let projHtml = "";
    if (step.projections && step.projections.length > 0) {
      projHtml = `
                <div class="projections-list my-3 p-3 bg-light rounded">
                    <h6 class="text-secondary small fw-bold">Cálculo de Proyecciones:</h6>
                    ${step.projections.map((p) => `<p class="mb-2">$$ ${p} $$</p>`).join("")}
                </div>
            `;
    }

    stepDiv.innerHTML = `
            <h5 class="fw-bold text-dark"><span class="badge bg-primary me-2">${index + 1}</span> Paso ${step.step}</h5>
            <div class="math-display overflow-auto py-2">
                <p>Fórmula principal:</p>
                <p class="fs-5 text-center">$$ ${step.formula} $$</p>
                ${projHtml}
                <div class="row mt-3 text-center">
                    <div class="col-md-6">
                        <p class="mb-1 small text-muted">Vector ortogonal resultante ($u_{${step.step}}$):</p>
                        <p class="text-primary fw-bold fs-5">$$ u_{${step.step}} = ${step.result_u} $$</p>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-1 small text-muted">Norma y Normalización ($e_{${step.step}}$):</p>
                        <p class="text-success fw-bold fs-5">$$ ||u_{${step.step}}|| = ${step.norm} \\implies e_{${step.step}} = ${step.result_e} $$</p>
                    </div>
                </div>
            </div>
        `;
    container.appendChild(stepDiv);
  });

  // Indicar a MathJax que procese todo el nuevo HTML
  MathJax.typesetPromise();
}

function renderFinalSummary(u, e) {
  const formatSet = (arr) =>
    `\\left\\{ ${arr.map((v) => "(" + v.map((n) => n.toFixed(2)).join(",") + ")").join(", \\\\ ")} \\right\\}`;

  document.getElementById("final-ortho").innerHTML =
    `$$ U = ${formatSet(u)} $$`;
  document.getElementById("final-norm").innerHTML = `$$ E = ${formatSet(e)} $$`;
  MathJax.typesetPromise();
}

// --- GRÁFICO 3D INTERACTIVO ---

function render3DPlot(data) {
  const traces = [];

  // Estilo para los vectores
  const createVector = (vec, color, name, visible = true) => {
    return {
      type: "scatter3d",
      mode: "lines+markers",
      x: [0, vec[0]],
      y: [0, vec[1]],
      z: [0, vec[2]],
      line: { color: color, width: 8 },
      marker: {
        size: 5,
        symbol: "diamond",
        color: color,
      },
      name: name,
      visible: visible ? true : "legendonly",
    };
  };

  // 1. Vectores Originales (Rojos)
  data.original_vectors.forEach((v, i) => {
    traces.push(createVector(v, "#ff4757", `v${i + 1} (Original)`));
  });

  // 2. Vectores Ortogonales (Azules)
  data.orthogonal_vectors.forEach((u, i) => {
    traces.push(createVector(u, "#2e86de", `u${i + 1} (Ortogonal)`, false)); // Ocultos por defecto para no saturar
  });

  // 3. Vectores Ortonormales (Verdes)
  data.orthonormal_vectors.forEach((e, i) => {
    traces.push(createVector(e, "#2ed573", `e${i + 1} (Ortonormal)`));
  });

  const layout = {
    title: "Representación Espacial R³",
    autosize: true,
    showlegend: true,
    legend: { x: 0, y: 1 },
    margin: { l: 0, r: 0, b: 0, t: 30 },
    scene: {
      xaxis: {
        title: "X",
        zeroline: true,
        zerolinecolor: "#000",
        gridcolor: "#ddd",
      },
      yaxis: {
        title: "Y",
        zeroline: true,
        zerolinecolor: "#000",
        gridcolor: "#ddd",
      },
      zaxis: {
        title: "Z",
        zeroline: true,
        zerolinecolor: "#000",
        gridcolor: "#ddd",
      },
      aspectmode: "cube",
    },
  };

  const config = { responsive: true, displaylogo: false };

  Plotly.newPlot("plot-container", traces, layout, config);
}
