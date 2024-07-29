import json
from datetime import datetime

def Make_User(id, password, name):
    date = datetime.today().strftime("%Y/%m/%d %H:%M:%S")
    json_path = "./user.json"
    origin_data = {}
    with open(json_path, "r") as json_file:
        origin_data = json.load(json_file)
    
    origin_data[name] = {
        "id": id,
        "password": password,
        "date": date
    }

    with open(json_path, "w") as json_file:
        json.dump(origin_data, json_file, indent=4)


def Load_User(name):
    json_path = "./user.json"
    with open(json_path, "r") as json_file:
        data = json.load(json_file)
        if name in data:
            return False
        else:
            return True
        
def Login(id, password):
    json_path = "./user.json"
    data = {}
    with open(json_path, "r") as json_file:
        data = json.load(json_file)

    for k, v in data.items():
        if v["id"] == id and v["password"] == password:
            return True, k
        
    return False, "none"
        
if __name__ == "__main__":
    Make_User("gccs457", "1234", "babo")
    print(Login("gccs457", "1234"))
    