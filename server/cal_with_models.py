import numpy as np
from tensorflow.keras.models import model_from_json
import json

def predict_move(board, model, session_id, session_predictions):
    board = json.loads(board)

    isFirst = False
    tmp_cnt = 0
    white_cnt = 0
    target_x, target_y = 0, 0
    for i in range(15):
        for j in range(15):
            if int(board[i][j]) == 1:
                tmp_cnt += 1
                target_x = j
                target_y = i
            elif int(board[i][j]) == -1:
                white_cnt += 1

    if tmp_cnt == 1 and white_cnt == 0:
        isFirst = True

    input_data = np.expand_dims(board, axis=(0, -1)).astype(np.float32)
    output = model.predict(input_data).squeeze()
    output = output.reshape((15, 15))

    previous_predictions = session_predictions.get(session_id, [])
    for (y, x) in previous_predictions:
        output[y, x] -= 1e3

    if isFirst:
        move = [(-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]
        r = np.random.randint(0, 8)
        if target_y == 7 and target_x == 7:
            return target_x + move[r][0], target_y + move[r][1]
        else:
            return 7, 7

    tmp_board = np.array(board).reshape((15, 15))
    mask = (tmp_board == 0)

    output = output * mask

    mod_output = np.array([arr[:] for arr in output])

    nonzero = np.count_nonzero(tmp_board)
    
    if nonzero < 5:
        print("nonzero count", nonzero)
        mod_output[[0, 1, 2, 3, 4, 10, 11, 12, 13, 14], :] -= 1e-7
        mod_output[:, [0, 1, 2, 3, 4, 10, 11, 12, 13, 14]] -= 1e-7

    output_y, output_x = np.unravel_index(np.argmax(mod_output), mod_output.shape)

    previous_predictions.append((output_y, output_x))
    session_predictions[session_id] = previous_predictions

    if board[7][7] == 0 and len(previous_predictions) == 1:
        previous_predictions.pop()
        previous_predictions.append((7, 7))
        return 7, 7
    
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
