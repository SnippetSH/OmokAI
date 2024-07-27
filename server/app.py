from flask import Flask, send_from_directory, request, jsonify
from cal_with_models import predict_move
import os
import numpy as np
from tensorflow.keras.models import load_model, model_from_json

app = Flask(__name__, static_folder='dist', static_url_path='')
host_addr = "0.0.0.0"
host_port = 5000

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

@app.route('/', methods=['GET'])
def root():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def static_proxy(path):
    # Dist 폴더에 있는 파일이 있는지 확인합니다.
    if os.path.isfile(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    # Dist 폴더에 파일이 없으면 index.html을 반환하여 React 라우터가 처리하게 합니다.
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/ai-move', methods=['GET'])
def CalAI():
    board = request.args.get('board')
    print(board)
    if not board:
        return jsonify({'error': 'No board provided'}), 404
    x, y = predict_move(board, loaded_model)
    return jsonify({'output_x': int(x), 'output_y': int(y), 'success': True})

@app.errorhandler(404)
def page_not_found(e):
    # 404 페이지를 반환하거나 사용자 정의 404 페이지로 리디렉션
    return send_from_directory(app.static_folder, 'index.html'), 404

if __name__ == '__main__':
    app.run(debug=True,
            host=host_addr,
            port=host_port)
