from flask import Flask ,request,jsonify,render_template,redirect,flash
from flask_cors import CORS
import threading
import os
import sqlite3
# from sqlalchemy import text
app = Flask(__name__,template_folder='../frontend/public')
CORS(app)  

users_conn=sqlite3.connect("users.db",check_same_thread=False)
users_cur=users_conn.cursor()
users_cur.execute("""
CREATE TABLE IF NOT EXISTS customer (
    fname text, 
    lname text,
    email text,
    password text)""")
users_conn.commit()



vehicles_conn=sqlite3.connect("vehicles.db",check_same_thread=False)
vehicles_cur=vehicles_conn.cursor()
vehicles_cur.execute("""
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id INTEGER PRIMARY KEY,
    make text, 
    model text,
    year int,
    current_odometer int,
    last_service_date text,
    last_service_id int,
    notes text)""")
vehicles_conn.commit()




@app.route('/', methods=["POST"])
def get_User():
  email=request.get_json().get("email")
  password=request.get_json().get("password")
  query=f'SELECT * FROM customer WHERE email = "{email}" AND password = "{password}"'
  print(email)
  print(password)
  checker=users_cur.execute(query).fetchall() 
  users_conn.commit()
  print(checker)
  if(len(checker) > 0):
    return {"valid_login": 1}, 200
  else:
    return {"valid_login": 0}, 200

  
  
@app.route('/registration', methods=["POST"])
def get_Info():
  fname=request.get_json().get("fname")
  lname=request.get_json().get("lname")
  email=request.get_json().get("email")
  password=request.get_json().get("password")
  users_conn.execute('INSERT INTO customer(fname,lname,email,password) VALUES (?,?,?,?)',(fname,lname,email,password))
  users_conn.commit()
 
  return  "Ya"


# @app.route('/add_vehicle', methods=["POST"])
# def add_vehicle():
#   make=request.get_json().get("make")
#   model=request.get_json().get("model")
#   year=request.get_json().get("year")
#   odometer=request.get_json().get("odometer")
#   vehicles_conn.execute('INSERT INTO vehicles(vehicle_id,make,model,year,current_odometer) VALUES (NULL,?,?,?,?)',(make,model,year,odometer))
#   vehicles_conn.commit()
#   query=f'SELECT vehicle_id FROM vehicles WHERE make="{make}" AND model="{model}" AND year="{year}" AND current_odometer="{odometer}"'
#   vehicle_id=vehicles_cur.execute(query).fetchall()[-1][0]
#   vehicles_conn.commit()
#   print(vehicle_id)
#   return {"vehicle_id": vehicle_id}, 200


@app.route('/update_vehicle', methods=["POST"])
def update_vehicle():
  vehicle_id=str(request.get_json().get("vehicle_id"))
  make=request.get_json().get("make")
  model=request.get_json().get("model")
  year=request.get_json().get("year")
  odometer=request.get_json().get("odometer")
  print("Vehicle ID: "+str(vehicle_id))
  print("Vehicle ID Length: "+str(len(vehicle_id)))
  if(len(vehicle_id) > 0):
    print("Old Vehicle")
    vehicles_conn.execute(f'UPDATE vehicles SET make="{make}", model="{model}",year={year},current_odometer={odometer} WHERE vehicle_id={vehicle_id};')

  else:
    print("New Vehicle")
    vehicles_conn.execute('INSERT INTO vehicles(vehicle_id,make,model,year,current_odometer) VALUES (NULL,?,?,?,?)',(make,model,year,odometer))

  vehicles_conn.commit()
  query=f'SELECT vehicle_id FROM vehicles WHERE make="{make}" AND model="{model}" AND year="{year}" AND current_odometer="{odometer}"'
  vehicle_id=vehicles_cur.execute(query).fetchall()[-1][0]
  vehicles_conn.commit()
  print(vehicle_id)
  return {"vehicle_id": vehicle_id}, 200
  

@app.route('/remove_vehicle', methods=["POST"])
def remove_vehicle():
  id=request.get_json().get("vehicle_id")
  print(id)
  vehicles_conn.execute(f'DELETE FROM vehicles WHERE vehicle_id={id}')
  vehicles_conn.commit()
 
  return  "Ya"

@app.route('/get_vehicles', methods=["GET"])
def get_vehicles():
  query=f'SELECT * FROM vehicles;'
  data=vehicles_cur.execute(query).fetchall()
  vehicles_conn.commit()
  # print(data)
  return {"vehicles": data}

@app.route('/main')
def get_Home():
  print("works")
  return "pog"

def run_flask():
  app.run(debug=False)

def run_npm():
  os.system("cd ../frontend && npm start")

if __name__ == "__main__":
  threads = []
  threads.append(threading.Thread(target=run_npm))
  threads.append(threading.Thread(target=run_flask))
  
  for i in threads:
    i.start()
  for i in threads:
    i.join()

