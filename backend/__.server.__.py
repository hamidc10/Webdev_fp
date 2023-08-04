from flask import Flask ,request,jsonify,render_template,redirect,flash
from flask_cors import CORS
from discord_webhook import DiscordWebhook
import threading
import os
import sqlite3

# Paste Discord Webhook Here
webhook_url = "https://discord.com/api/webhooks/1136901349330657330/_s8ddeKBj7RB8mr5VzCrS5RVxhoHZVXHw3gbXTXnnUYb2mPJNXiBoo6zPAlieb3fR_47"


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
users_cur.close()



vehicles_conn=sqlite3.connect("vehicles.db",check_same_thread=False)
vehicles_cur=vehicles_conn.cursor()
vehicles_cur.execute("""
CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id INTEGER PRIMARY KEY,
    make text, 
    model text,
    year int,
    current_odometer int,
    service_history text)""")
vehicles_conn.commit()
vehicles_cur.close()




@app.route('/', methods=["POST"])
def get_User():
  users_cur=users_conn.cursor()
  email=request.get_json().get("email")
  password=request.get_json().get("password")
  query=f'SELECT * FROM customer WHERE email = "{email}" AND password = "{password}"'
  print(email)
  print(password)
  checker=users_cur.execute(query).fetchall() 
  users_conn.commit()
  print(checker)
  users_cur.close()
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


@app.route('/update_vehicle', methods=["POST"])
def update_vehicle():
  vehicles_cur=vehicles_conn.cursor()
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
  vehicles_cur.close()
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
  vehicles_cur=vehicles_conn.cursor()
  query=f'SELECT * FROM vehicles;'
  data=vehicles_cur.execute(query).fetchall()
  vehicles_conn.commit()
  vehicles_cur.close()
  # print(data)
  return {"vehicles": data}

@app.route('/get_vehicle', methods=["POST"])
def get_vehicle():
  vehicles_cur=vehicles_conn.cursor()
  vehicle_id=str(request.get_json().get("vehicle_id"))
  query=f'SELECT * FROM vehicles WHERE vehicle_id={vehicle_id};'
  data=vehicles_cur.execute(query).fetchall()
  vehicles_conn.commit()
  vehicles_cur.close()
  # print(data)
  return {"vehicle": data}

@app.route('/update_vehicle_service_history', methods=["POST"])
def update_vehicle_service_history():
  vehicle_id=str(request.get_json().get("vehicle_id"))
  service_history=str(request.get_json().get("service_history"))
  vehicles_conn.execute(f'UPDATE vehicles SET service_history="{service_history}" WHERE vehicle_id={vehicle_id};')
  vehicles_conn.commit()
  # print(data)
  return {"response": 200}, 200

@app.route('/send_reminder', methods=["POST"])
def send_reminder():
  make=request.get_json().get("make")
  model=request.get_json().get("model")
  year=request.get_json().get("year")
  odometer=request.get_json().get("odometer")
  webhook = DiscordWebhook(url=webhook_url, content=f"Your {year} {make} {model} w/ {odometer} miles requires maintenance, please check the maintenance history on the Vehicle Management Server for more info.")
  response = webhook.execute()
  return {"response": response}, 200

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

