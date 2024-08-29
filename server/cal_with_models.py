import numpy as np
from tensorflow.keras.models import model_from_json
import json

def predict_move(board, model, session_id, session_predictions):
    board = json.loads(board)

    target_x, target_y = next(((j, i) for i in range(15) for j in range(15) if board[i][j] == 1), (0, 0))
    tmp_cnt = sum(board[i][j] == 1 for i in range(15) for j in range(15))
    white_cnt = sum(board[i][j] == -1 for i in range(15) for j in range(15))

    isFirst = (tmp_cnt == 1 and white_cnt == 0)
    if isFirst:
        move = [(-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]
        r = np.random.randint(0, 8)
        if target_y == 7 and target_x == 7:
            return target_x + move[r][0], target_y + move[r][1]
        else:
            return 7, 7
        
    if tmp_cnt == 0 and white_cnt == 0:
        return 7, 7

    input_board = np.expand_dims(board, axis=(0, -1)).astype(np.float32)
    output = model.predict(input_board, verbose=0).squeeze()
    output = output.reshape((15, 15))

    # 현재 보드에서 0인 부분(돌이 놓여지지 않은 부분)에 대한 masking 처리
    tmp_board = np.array(board).reshape((15, 15))
    mask = (tmp_board == 0)
    output = output * mask

    mod_output = np.array([arr[:] for arr in output])

    nonzero = np.count_nonzero(tmp_board)
    
    if nonzero < 5:
        print("nonzero count", nonzero)
        mod_output[[0, 1, 2, 3, 4, 10, 11, 12, 13, 14], :] -= 1e-7
        mod_output[:, [0, 1, 2, 3, 4, 10, 11, 12, 13, 14]] -= 1e-7

    
    y, x = np.unravel_index(np.argmax(mod_output), mod_output.shape)
    # print(board[y][x])

    tx = x
    ty = y
    if board[y][x] != 0:
        while True:
            tmp = [arr[:] for arr in output]
            tmp[ty][tx] -= 1e2
            ty, tx = np.unravel_index(np.argmax(tmp), tmp.shape)

            if(board[ty][tx] == 0):
                break

            
    if session_id in session_predictions and len(session_predictions[session_id]) > 0:
        while (tx, ty) in session_predictions[session_id]:
            mod_output[ty][tx] -= 1e2
            ty, tx = np.unravel_index(np.argmax(mod_output), mod_output.shape)

    # 예측된 위치 저장
    if session_id not in session_predictions:
        session_predictions[session_id] = []
    session_predictions[session_id].append((tx, ty))

    return tx, ty


# def predict(model, board):
#     board = json.loads(board)

#     target_x, target_y = next(((j, i) for i in range(15) for j in range(15) if board[i][j] == 1), (0, 0))
#     tmp_cnt = sum(board[i][j] == 1 for i in range(15) for j in range(15))
#     white_cnt = sum(board[i][j] == -1 for i in range(15) for j in range(15))

#     isFirst = (tmp_cnt == 1 and white_cnt == 0)
#     if isFirst:
#         move = [(-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)]
#         r = np.random.randint(0, 8)
#         if target_y == 7 and target_x == 7:
#             return target_x + move[r][0], target_y + move[r][1]
#         else:
#             return 7, 7
        
#     if tmp_cnt == 0 and white_cnt == 0:
#         return 7, 7

#     input_board = np.expand_dims(board, axis=(0, -1)).astype(np.float32)
#     output = model.predict(input_board, verbose=0).squeeze()
#     output = output.reshape((15, 15))

#     # 현재 보드에서 0인 부분(돌이 놓여지지 않은 부분)에 대한 masking 처리
#     tmp_board = np.array(board).reshape((15, 15))
#     mask = (tmp_board == 0)
#     output = output * mask

#     mod_output = np.array([arr[:] for arr in output])

#     nonzero = np.count_nonzero(tmp_board)
    
#     if nonzero < 5:
#         print("nonzero count", nonzero)
#         mod_output[[0, 1, 2, 3, 4, 10, 11, 12, 13, 14], :] -= 1e-7
#         mod_output[:, [0, 1, 2, 3, 4, 10, 11, 12, 13, 14]] -= 1e-7

    
#     y, x = np.unravel_index(np.argmax(mod_output), mod_output.shape)
#     # print(board[y][x])

#     tx = x
#     ty = y
#     if board[y][x] != 0:
#         while True:
#             tmp = [arr[:] for arr in output]
#             tmp[ty][tx] -= 1e2
#             ty, tx = np.unravel_index(np.argmax(tmp), tmp.shape)

#             if(board[ty][tx] == 0):
#                 break

#     return tx, ty

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
