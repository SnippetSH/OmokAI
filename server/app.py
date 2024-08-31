from flask import Flask, send_from_directory, request, jsonify, redirect
from cal_with_models import predict_move
from new_predict import predict
import os
import numpy as np
from keras.models import model_from_json
from keras import models

app = Flask(__name__, static_folder='dist', static_url_path='')
host_addr = "0.0.0.0"
host_port = 5000
session_predictions = {}

with open("./models/cur_best.json", "r") as json_file:
    hard_model_json = json_file.read()

hard_model = model_from_json(hard_model_json)
hard_model.load_weights("./models/Cur_best.h5")
hard_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['acc'])

with open("./models/model_optional.json") as json_file:
    option = json_file.read()

option_model = model_from_json(option)
option_model.load_weights("./models/model_optional_learned.h5")
option_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['acc'])

with open(os.path.join("models", "default.json"), "r") as f:
    model_layer = f.read()
    
model = models.model_from_json(model_layer)
model.load_weights(os.path.join("models", "new1.h5"))
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['acc'])


with open(os.path.join("models", "new_2.json"), "r") as f:
    model_layer = f.read()
    
easy_model = models.model_from_json(model_layer)
easy_model.load_weights(os.path.join("models", "new2.h5"))
easy_model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['acc'])


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
    again = request.args.get('again') == 'true'
    print(again)
    print(board)
    print("\n\n\n\n", session_id)
    if not board or not session_id:
        return jsonify({'error': 'No board or session ID provided'}), 404

    if not again:
        if session_id in session_predictions:
            del session_predictions[session_id]
    
    print(type(diff))
    # if(diff == "0"):
    #     print("별 2개")
    #     x, y = predict_move(board, hard_model, session_id, session_predictions)
    # elif diff == "1":
    #     print("별 1개")
    #     x, y = predict_move(board, model, session_id, session_predictions)
    # else:
    #     print("별 3개")
    #     x, y = predict_move(board, option_model, session_id, session_predictions)

    if(diff == "0"):
        print("별 1개")
        x, y = predict_move(board, easy_model, session_id, session_predictions)
    elif diff == "1":
        print("별 2개")
        x, y = predict_move(board, hard_model, session_id, session_predictions)
    elif diff == "2":
        print("별 3개")
        x, y = predict_move(board, option_model, session_id, session_predictions)
    elif diff == "10":
        print("별 4개")
        x, y = predict_move(board, model, session_id, session_predictions)
    else:
        print("별 4개")
        x, y = predict(model, easy_model, hard_model, option_model, board, session_id, session_predictions)

    print(f"x:{x}, y:{y}")
    return jsonify({'output_x': int(x), 'output_y': int(y), 'success': True})


@app.route('/api/ai-reset', methods=["POST"])
def reset_session():
    session_id = request.json.get('session_id')
    if session_id in session_predictions:
        del session_predictions[session_id]
    return jsonify({'success': True})

@app.errorhandler(404)
def page_not_found(e):
    # 404 페이지를 반환하거나 사용자 정의 404 페이지로 리디렉션
    return send_from_directory(app.static_folder, 'index.html'), 404

if __name__ == '__main__':
    app.run(debug=True,
            host=host_addr,
            port=host_port)
