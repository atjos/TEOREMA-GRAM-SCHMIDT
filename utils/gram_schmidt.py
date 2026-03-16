import numpy as np


def format_vector(v):
    """Formatea un vector para mostrarlo en LaTeX."""
    return f"({', '.join([str(round(x, 4)) for x in v])})"


def gram_schmidt_process(vectors_input):
    """
    Implementa el proceso de Gram-Schmidt paso a paso.
    """
    v = [np.array(vec, dtype=float) for vec in vectors_input]
    n = len(v)

    # 1. Verificación de independencia lineal
    matrix = np.array(v)
    if np.linalg.matrix_rank(matrix) < n:
        raise ValueError(
            "Los vectores son linealmente dependientes. No pueden formar una base.")

    u = []  # Vectores ortogonales
    e = []  # Vectores ortonormales
    steps = []

    for i in range(n):
        projection_sum = np.zeros(3)
        projection_details = []

        for j in range(i):
            num = np.dot(v[i], u[j])
            den = np.dot(u[j], u[j])
            proj_scalar = num / den
            projection_sum += proj_scalar * u[j]

            # Corregido: La barra invertida está fuera de las llaves
            p_text = "\\text{proj}_{u_" + str(j+1) + "}(v_" + str(i+1) + ")"
            proj_full = f"{p_text} = \\frac{{v_{i+1} \\cdot u_{j+1}}}{{u_{j+1} \\cdot u_{j+1}}} u_{j+1} = {round(proj_scalar, 4)} u_{j+1}"
            projection_details.append(proj_full)

        ui = v[i] - projection_sum
        u.append(ui)

        norm_ui = np.linalg.norm(ui)
        ei = ui / norm_ui
        e.append(ei)

        # --- LÓGICA DE FÓRMULA CORREGIDA PARA EVITAR EL SYNTAX ERROR ---
        if i > 0:
            # Construimos la lista de proyecciones fuera de la f-string
            projs_list = [
                f"\\text{{proj}}_{{u_{j+1}}}(v_{i+1})" for j in range(i)]
            projs_str = " - ".join(projs_list)
            formula_val = f"u_{i+1} = v_{i+1} - {projs_str}"
        else:
            formula_val = f"u_{1} = v_{1}"
        # --------------------------------------------------------------

        step_description = {
            "step": i + 1,
            "formula": formula_val,
            "projections": projection_details,
            "result_u": format_vector(ui),
            "norm": round(norm_ui, 4),
            "result_e": format_vector(ei)
        }
        steps.append(step_description)

    return {
        "original_vectors": [v_i.tolist() for v_i in v],
        "orthogonal_vectors": [u_i.tolist() for u_i in u],
        "orthonormal_vectors": [e_i.tolist() for e_i in e],
        "steps": steps
    }
