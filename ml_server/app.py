from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
import os

app = Flask(__name__)

# 모델을 전역 변수로 초기화 (처음에는 None)
model = None
model_path = 'color_prediction_model.h5'

def load_model_if_not_loaded():
    global model
    if model is None:
        print(f"DEBUG: Current working directory: {os.getcwd()}")
        print(f"DEBUG: Checking if model file exists at {os.path.abspath(model_path)}: {os.path.exists(model_path)}")
        if os.path.exists(model_path):
            try:
                model = tf.keras.models.load_model(model_path, custom_objects={'MeanSquaredError': tf.keras.losses.MeanSquaredError})
                print("Model loaded successfully (lazy load).")
            except Exception as e:
                print(f"Error loading model: {e}")
                model = None # 로드 실패 시 모델을 None으로 유지
        else:
            print(f"Model file not found at {model_path}. Waiting for model to be trained.")

@app.route('/predict', methods=['POST'])
def predict():
    # 요청이 들어올 때마다 모델 로드를 시도 (아직 로드되지 않았다면)
    load_model_if_not_loaded()

    if model is None:
        return jsonify({'error': 'Model not yet available. Please ensure it is trained and saved.'}), 500

    data = request.json
    if 'challenge_color' not in data:
        return jsonify({'error': 'challenge_color is required.'}), 400

    challenge_color = np.array(data['challenge_color']).reshape(1, -1) / 255.0

    predicted_scaled = model.predict(challenge_color)
    predicted_color = (predicted_scaled * 255).astype(int).tolist()[0]

    return jsonify({'predicted_color': predicted_color})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)