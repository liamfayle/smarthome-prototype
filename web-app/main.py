from flask import Flask, render_template, Response, request
import pandas as pd
import json
from copy import deepcopy
import sqlite3

'''
TODO
Clean and comment
switch csv to sql
'''

'''
Data dictionary for storing rooms with defaults initialized
'''
data_schema = {
    "name": None,
    "table_position": 0,
    "current_mode": "Heat",
    "current_setting": "Constant",
    "cool_constant_sp": 20.0,
    "heat_constant_sp": 20.0,
    "cool_motion_isp": 22.0,
    "cool_motion_asp": 20.0,
    "heat_motion_isp": 18.0,
    "heat_motion_asp": 20.0,
    "schedule_1_cool": "None",
    "schedule_2_cool": "None",
    "schedule_3_cool": "None",
    "schedule_4_cool": "None",
    "schedule_5_cool": "None",
    "schedule_6_cool": "None",
    "schedule_7_cool": "None",
    "schedule_8_cool": "None",
    "schedule_9_cool": "None",
    "schedule_10_cool": "None",
    "hybrid_1_cool": "None",
    "hybrid_2_cool": "None",
    "hybrid_3_cool": "None",
    "hybrid_4_cool": "None",
    "hybrid_5_cool": "None",
    "hybrid_6_cool": "None",
    "hybrid_7_cool": "None",
    "hybrid_8_cool": "None",
    "hybrid_9_cool": "None",
    "hybrid_10_cool": "None",
    "schedule_1_heat": "None",
    "schedule_2_heat": "None",
    "schedule_3_heat": "None",
    "schedule_4_heat": "None",
    "schedule_5_heat": "None",
    "schedule_6_heat": "None",
    "schedule_7_heat": "None",
    "schedule_8_heat": "None",
    "schedule_9_heat": "None",
    "schedule_10_heat": "None",
    "hybrid_1_heat": "None",
    "hybrid_2_heat": "None",
    "hybrid_3_heat": "None",
    "hybrid_4_heat": "None",
    "hybrid_5_heat": "None",
    "hybrid_6_heat": "None",
    "hybrid_7_heat": "None",
    "hybrid_8_heat": "None",
    "hybrid_9_heat": "None",
    "hybrid_10_heat": "None",
    "current_temp": 0,
}



'''
Start app and app functions
'''
app = Flask(__name__, template_folder='static/templates')

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/api/connect")
def connect():
    try:
        data_table = pd.read_csv("data/data_table.csv")
        if data_table.empty:
            return Response(json.dumps({'error': 0}), status=200) #error 0, no table found
    except Exception as e:
        print(e)
        return Response(json.dumps({'error': 0}), status=200) #error 0, no table found
    json_list = json.loads(json.dumps(list(data_table.T.to_dict().values())))
    return Response(json.dumps(json_list), status=200)
    

@app.route("/api/addRoom", methods=['POST'])
def addRoom():
    data_table = None
    try:
        data_table = pd.read_csv("data/data_table.csv")
    except Exception as e:
        print(e)
    newName = request.json['name']
    if data_table is not None:
        if newName in data_table['name'].values:
            return Response(json.dumps({'error': 1}), status=200) #error 1, name already exists
        else:
            newData = deepcopy(data_schema)
            newData["name"] = newName
            data_table['table_position'] += 1
            data_table = pd.concat([pd.DataFrame(newData, index=[0]), data_table], ignore_index=True)
            data_table.to_csv("data/data_table.csv", index=False)
            json_list = json.loads(json.dumps(list(data_table.T.to_dict().values())))
            return Response(json.dumps(json_list), status=200)
    else:
        newData = deepcopy(data_schema)
        newData["name"] = newName
        data_table = pd.DataFrame(newData, index=[0])
        data_table.to_csv("data/data_table.csv", index=False)
        json_list = json.loads(json.dumps(list(data_table.T.to_dict().values())))
        return Response(json.dumps(json_list), status=200)


@app.route("/api/adjustRooms", methods=['POST'])
def adjustRooms():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    i = 0
    for d in data:
        if d in data_table['name'].values:
            data_table.loc[data_table['name'] == d, 'table_position'] = i
        i += 1
    data_table.sort_values(by=["table_position"], ascending=True, inplace=True)
    data_table.to_csv("data/data_table.csv", index=False)
    return Response("ok", status=200)


@app.route("/api/removeRoom", methods=['POST'])
def removeRoom():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    if data in data_table['name'].values:
        index = data_table[data_table.name == data].index.values[0]
        data_table.loc[index:, "table_position"] = data_table.loc[index:, "table_position"] - 1
        data_table.drop(data_table[data_table.name == data].index, inplace=True)
        data_table.reset_index(inplace=True, drop=True)
        data_table.to_csv("data/data_table.csv", index=False)
        return Response("ok", status=200)

@app.route("/api/adjustName", methods=['POST'])
def adjustName():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    
    data_table.loc[data['index'], 'name'] = data['name']
    data_table.to_csv("data/data_table.csv", index=False)
    return Response("ok", status=200)

@app.route("/api/loadData", methods=['POST'])
def loadData():
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)


    json_list = json.loads(json.dumps(list(data_table[data_table['table_position'] == 0].T.to_dict().values())))
    return Response(json.dumps(json_list), status=200)


@app.route("/api/changeMotionActive", methods=['POST'])
def changeMotionActive():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    if data['mode'] == "Cool":
        data_table.loc[0, "cool_motion_asp"] = data['value']
    else:
        data_table.loc[0, "heat_motion_asp"] = data['value']

    data_table.to_csv("data/data_table.csv", index=False)
    return Response("ok", status=200)

@app.route("/api/changeMotionInactive", methods=['POST'])
def changeMotionInactive():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    if data['mode'] == "Cool":
        data_table.loc[0, "cool_motion_isp"] = data['value']
    else:
        data_table.loc[0, "heat_motion_isp"] = data['value']

    data_table.to_csv("data/data_table.csv", index=False)
    return Response("ok", status=200)

@app.route("/api/changeConstant", methods=['POST'])
def changeConstant():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    if data['mode'] == "Cool":
        data_table.loc[0, "cool_constant_sp"] = data['value']
    else:
        data_table.loc[0, "heat_constant_sp"] = data['value']

    data_table.to_csv("data/data_table.csv", index=False)
    return Response("ok", status=200)

@app.route("/api/changeMode", methods=['POST'])
def changeMode():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
       
    data_table["current_mode"] = data['mode']

    data_table.to_csv("data/data_table.csv", index=False)
    return Response("ok", status=200)


@app.route("/api/changeSetting", methods=['POST'])
def changeSetting():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
       
    data_table.loc[0, "current_setting"] = data['setting']

    data_table.to_csv("data/data_table.csv", index=False)
    return Response("ok", status=200)


@app.route("/api/addSchedule", methods=['POST'])
def addSchedule():
    response = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    

    data = json.dumps(response[1])
    mode = response[0]['mode']



    for i in range (1,11):
        if data_table.loc[0, "schedule_{}_{}".format(i, mode)] == "None":
            data_table.loc[0, "schedule_{}_{}".format(i, mode)] = data
            break

    data_table.to_csv("data/data_table.csv", index=False)

    return Response("ok", status=200)

@app.route("/api/getSchedule", methods=['POST'])
def getSchedule():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    

    json = data_table.loc[0, "schedule_{}_{}".format(data['id'], data['mode'])]

    return Response(json, status=200)

@app.route("/api/removeSchedule", methods=['POST'])
def removeSchedule():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    

    data_table.loc[0, "schedule_{}_{}".format(data['id'], data['mode'])] = "None"
    data_table.to_csv("data/data_table.csv", index=False)

    return Response("ok", status=200)


@app.route("/api/editSchedule", methods=['POST'])
def editSchedule():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    

    data_table.loc[0, "schedule_{}_{}".format(data[0]['id'], data[0]['mode'])] = json.dumps(data[1])
    data_table.to_csv("data/data_table.csv", index=False)

    return Response("ok", status=200)




#hybrid
@app.route("/api/addHybrid", methods=['POST'])
def addHybrid():
    response = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    

    data = json.dumps(response[1])
    mode = response[0]['mode']



    for i in range (1,11):
        if data_table.loc[0, "hybrid_{}_{}".format(i, mode)] == "None":
            data_table.loc[0, "hybrid_{}_{}".format(i, mode)] = data
            break

    data_table.to_csv("data/data_table.csv", index=False)

    return Response("ok", status=200)

@app.route("/api/getHybrid", methods=['POST'])
def getHybrid():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    

    json = data_table.loc[0, "hybrid_{}_{}".format(data['id'], data['mode'])]

    return Response(json, status=200)

@app.route("/api/removeHybrid", methods=['POST'])
def removeHybrid():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    

    data_table.loc[0, "hybrid_{}_{}".format(data['id'], data['mode'])] = "None"
    data_table.to_csv("data/data_table.csv", index=False)

    return Response("ok", status=200)


@app.route("/api/editHybrid", methods=['POST'])
def editHybrid():
    data = request.json
    data_table = None
    while 1:
        try:
            data_table = pd.read_csv("data/data_table.csv")
            break
        except Exception as e:
            print(e)
    

    data_table.loc[0, "hybrid_{}_{}".format(data[0]['id'], data[0]['mode'])] = json.dumps(data[1])
    data_table.to_csv("data/data_table.csv", index=False)

    return Response("ok", status=200)




if __name__ == "__main__":
    app.run(debug=True)
