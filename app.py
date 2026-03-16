from flask import Flask, render_template, request, jsonify
from utils.gram_schmidt import gram_schmidt_process
import numpy as np

app = Flask(__name__)

@app.route('/')
def index():
    """Renderiza la página principal."""
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    """
    Recibe los vectores del frontend, aplica Gram-Schmidt
    y devuelve los pasos y resultados en JSON.
    """
    try:
        data = request.json
        vectors_raw = data.get('vectors')

        # 1. Validación básica de entrada
        if not vectors_raw or len(vectors_raw) < 1:
            return jsonify({"error": "Debes ingresar al menos un vector."}), 400

        # Convertir a flotantes y limpiar datos
        vectors = []
        for v in vectors_raw:
            try:
                vec = [float(x) for x in v]
                if len(vec) != 3:
                    return jsonify({"error": "Cada vector debe tener 3 componentes (R3)."}), 400
                vectors.append(vec)
            except ValueError:
                return jsonify({"error": "Los componentes deben ser números válidos."}), 400

        # 2. Verificar si hay vectores nulos
        for v in vectors:
            if np.allclose(v, [0, 0, 0]):
                return jsonify({"error": "No se pueden procesar vectores nulos (0,0,0)."}), 400

        # 3. Llamar a la lógica matemática (creada en el paso anterior)
        result = gram_schmidt_process(vectors)

        return jsonify(result)

    except ValueError as e:
        # Aquí capturamos el error de dependencia lineal definido en utils/gram_schmidt.py
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Error inesperado: {str(e)}"}), 500

if __name__ == '__main__':
    # Ejecución en modo debug para desarrollo
    app.run(debug=True)