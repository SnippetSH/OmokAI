import numpy as np
from tensorflow.keras.models import model_from_json
import json

def predict_move(board, model):
    board = json.loads(board)

    input_data = np.expand_dims(board, axis=(0, -1)).astype(np.float32)
    output = model.predict(input_data).squeeze()
    output = output.reshape((15, 15))
    output_y, output_x = np.unravel_index(np.argmax(output), output.shape)
    
    return output_x, output_y

if __name__ == "__main__":
    # JSON 파일에서 모델 구조 로드
    with open("./models/model.json", "r") as json_file:
        loaded_model_json = json_file.read()

    loaded_model = model_from_json(loaded_model_json)

    # HDF5 파일에서 가중치 로드
    loaded_model.load_weights("./models/model_weights.h5")

    # 모델 컴파일 (원래 모델의 컴파일 옵션과 동일하게 설정)
    loaded_model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['acc']
    )

    # 테스트용 보드 데이터
    arr = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
    
    # 예측 수행
    output_x, output_y = predict_move(arr)

    print(f"Predicted Move: x={output_x}, y={output_y}")
