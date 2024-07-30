from flask import Flask, send_from_directory, request, jsonify, redirect
from cal_with_models import predict_move
import os
import numpy as np
from tensorflow.keras.models import model_from_json
from manage_user import Make_User, Load_User, Login
from manage_board import save_board, load_board

app = Flask(__name__, static_folder='dist', static_url_path='')
host_addr = "0.0.0.0"
host_port = 5000
session_predictions = {}

# 입력 데이터를 4차원으로 변환하고 예측 수행
with open("./models/model.json", "r") as json_file:
    loaded_model_json = json_file.read()

# HDF5 파일에서 가중치 로드
loaded_model = model_from_json(loaded_model_json)
loaded_model.load_weights("./models/model_weights.h5")
loaded_model.compile(
    optimizer='adam', 
    loss='binary_crossentropy',
    metrics=['acc']
    )

with open("./models/cur_best.json", "r") as json_file:
    hard_model_json = json_file.read()

hard_model = model_from_json(hard_model_json)
hard_model.load_weights("./models/Cur_best.h5")
hard_model.compile(
    optimizer='adam', 
    loss='binary_crossentropy',
    metrics=['acc']
    )

with open("./models/model_optional.json") as json_file:
    option = json_file.read()

option_model = model_from_json(option)
option_model.load_weights("./models/model_optional_learned.h5")
option_model.compile(
    optimizer='adam', 
    loss='binary_crossentropy',
    metrics=['acc']
    )

@app.route('/', methods=['GET'])
def root():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/board')
def board():
    # '/board'로 요청이 오면 '/'로 리디렉션
    return redirect('/')

@app.route('/<path:path>', methods=['GET'])
def static_proxy(path):
    # Dist 폴더에 있는 파일이 있는지 확인
    if os.path.isfile(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # Dist 폴더에 파일이 없으면 index.html을 반환하여 React 라우터가 처리
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/api/ai-move', methods=['GET'])
def CalAI():
    board = request.args.get('board')
    session_id = request.args.get('session_id')
    diff = request.args.get('diff')
    print(board)
    print("\n\n\n\n", session_id)
    if not board or not session_id:
        return jsonify({'error': 'No board or session ID provided'}), 404
    
    print(type(diff))
    if(diff == "0"):
        print("별 2개")
        x, y = predict_move(board, hard_model, session_id, session_predictions)
    elif diff == "1":
        print("별 1개")
        x, y = predict_move(board, loaded_model, session_id, session_predictions)
    else:
        print("별 3개")
        x, y = predict_move(board, option_model, session_id, session_predictions)
    return jsonify({'output_x': int(x), 'output_y': int(y), 'success': True})


@app.route('/api/ai-reset', methods=["POST"])
def reset_session():
    session_id = request.json.get('session_id')
    if session_id in session_predictions:
        del session_predictions[session_id]
    return jsonify({'success': True})

@app.route('/api/signup', methods=["POST"])
def sign_up():
    name = request.json.get('name')
    id = request.json.get('id')
    password = request.json.get('password')

    if Load_User(name):
        Make_User(id, password, name)
        return jsonify({'isSuc': 'Success', 'name': name})
    else:
        return jsonify({'isSuc': 'Failed', 'name': name})
    
@app.route('/api/signin', methods=['GET'])
def sign_in():
    id = request.args.get('id')
    password = request.args.get('password')

    s, k = Login(id, password)
    if s:
        return jsonify({'isSuc': 'Success', 'name': k})
    else:
        return jsonify({'isSuc': 'Failed', 'name': k})
    
@app.route('/api/post-board', methods=['POST'])
def save():
    name = request.json.get('name')
    board = request.json.get('board')

    if name and board:
        save_board(name, board)
        return jsonify({'isSuc': True, 'name': name})
    else:
        return jsonify({'isSuc': False, 'name': name})
    
@app.route('/api/get-board', methods=['GET'])
def load():
    name = request.args.get('name')

    x, v = load_board(name)
    if x:
        return jsonify({'isSuc': True, "board": v})
    else:
        return jsonify({'isSuc': False, "board": []})

@app.errorhandler(404)
def page_not_found(e):
    # 404 페이지를 반환하거나 사용자 정의 404 페이지로 리디렉션
    return send_from_directory(app.static_folder, 'index.html'), 404

if __name__ == '__main__':
    app.run(debug=True,
            host=host_addr,
            port=host_port)
