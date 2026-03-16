# 📐 Gram-Schmidt Visualizer R³

Este proyecto es una herramienta educativa e interactiva diseñada para calcular y visualizar el **Proceso de Gram-Schmidt** en el espacio tridimensional ($\mathbb{R}^3$). Permite transformar cualquier conjunto de vectores linealmente independientes en una base ortonormal, facilitando la comprensión geométrica y algebraica del teorema.

## 🚀 Propuesta del Proyecto

La aplicación busca cerrar la brecha entre la teoría abstracta del álgebra lineal y la intuición visual. A diferencia de una calculadora estándar, este visualizador desglosa cada proyección vectorial y muestra la transformación física de los vectores en un espacio 3D interactivo, permitiendo al usuario rotar, acercar y analizar la ortogonalidad resultante.

## 🧠 ¿Cómo funciona?

El sistema procesa la entrada de datos a través de cuatro etapas lógicas:

1.  **Validación de Independencia:** El backend utiliza **NumPy** para calcular el rango de la matriz formada por los vectores. Si el rango es menor al número de vectores, el sistema detiene el proceso e informa que los vectores son linealmente dependientes.
2.  **Ortogonalización (Vectores $U$):** Se aplica el algoritmo de Gram-Schmidt para obtener vectores perpendiculares entre sí:
    $$u_k = v_k - \sum_{j=1}^{k-1} \text{proj}_{u_j}(v_k)$$
3.  **Normalización (Vectores $E$):** Se calcula la norma euclidiana de cada vector $u_i$ y se divide el vector por este escalar para obtener vectores unitarios:
    $$e_i = \frac{u_i}{||u_i||}$$
4.  **Renderizado Dinámico:** 
    *   **Matemáticas:** Los pasos se formatean en cadenas LaTeX y se renderizan en el navegador con **MathJax**.
    *   **Gráficos:** Se generan trazados dinámicos en **Plotly.js** para representar los vectores originales, ortogonales y ortonormales.

## 🛠️ Tecnologías Usadas

El proyecto utiliza un stack moderno optimizado para cálculos numéricos y visualización web:

*   **Backend:** 
    *   [Python](https://www.python.org/): Lenguaje de programación base.
    *   [Flask](https://flask.palletsprojects.com/): Micro-framework para la gestión de la API y rutas.
    *   [NumPy](https://numpy.org/): Biblioteca para computación científica y álgebra lineal.
*   **Frontend:**
    *   [Plotly.js](https://plotly.com/javascript/): Motor gráfico para la visualización de vectores en 3D.
    *   [MathJax](https://www.mathjax.org/): Librería para el renderizado de notación matemática compleja.
    *   [Bootstrap 5](https://getbootstrap.com/): Framework para el diseño responsivo y moderno.
    *   [Google Fonts](https://fonts.google.com/): Tipografías "Poppins" y "Fira Code" para legibilidad.

## 📂 Estructura del Proyecto

```text
├── app.py                  # Servidor Flask y manejo de peticiones POST/GET
├── requirements.txt        # Dependencias (Flask, NumPy, Gunicorn)
├── utils/
│   └── gram_schmidt.py     # Lógica matemática y generación de pasos en LaTeX
├── static/
│   ├── css/
│   │   └── style.css       # Estilos personalizados y paleta de colores "Ice Blue"
│   ├── js/
│   │   └── main.js         # Lógica de cliente, Fetch API y gráficos Plotly
│   └── favicon.ico         # Icono de la aplicación
├── templates/
│   └── index.html          # Interfaz de usuario y contenedores de visualización
└── README.md               # Documentación del proyecto
