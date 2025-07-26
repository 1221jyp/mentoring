import psycopg2
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
import os

# 데이터베이스 연결 설정 (환경 변수에서 가져오기)
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_NAME = os.getenv('DB_NAME', 'your_db_name') # 실제 DB 이름으로 변경 필요
DB_USER = os.getenv('DB_USER', 'your_db_user') # 실제 DB 유저로 변경 필요
DB_PASSWORD = os.getenv('DB_PASSWORD', 'your_db_password') # 실제 DB 비밀번호로 변경 필요

def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    return conn

def load_data():
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT challenge_color_r, challenge_color_g, challenge_color_b, submitted_color_r, submitted_color_g, submitted_color_b FROM color_submissions;")
        data = cur.fetchall()
        cur.close()
        
        X = [] # challenge_color (입력)
        y = [] # submitted_color (출력)
        for row in data:
            X.append([row[0], row[1], row[2]])
            y.append([row[3], row[4], row[5]])
            
        return np.array(X), np.array(y)
    except Exception as e:
        print(f"Error loading data: {e}")
        return None, None
    finally:
        if conn:
            conn.close()

def build_model():
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(3,)), # RGB 3개 값 입력
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(3, activation='sigmoid') # RGB 3개 값 출력 (0-1 범위)
    ])
    model.compile(optimizer='adam', loss=tf.keras.losses.MeanSquaredError()) # 평균 제곱 오차 사용
    return model

def train_and_save_model():
    X, y = load_data()
    if X is None or y is None or len(X) == 0:
        print("No data to train the model.")
        return

    # RGB 값을 0-1 범위로 정규화
    X_scaled = X / 255.0
    y_scaled = y / 255.0

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y_scaled, test_size=0.2, random_state=42)

    model = build_model()
    model.fit(X_train, y_train, epochs=50, batch_size=32, validation_split=0.1)

    # 모델 저장
    model_path = 'color_prediction_model.h5'
    model.save(model_path)
    print(f"Model saved to {model_path}")

if __name__ == '__main__':
    train_and_save_model()
