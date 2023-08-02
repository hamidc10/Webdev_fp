from flask import Flask ,request,jsonify,render_template,redirect,flash
from flask_cors import CORS
import sqlite3
# from sqlalchemy import text
app = Flask(__name__,template_folder='../frontend/public')
CORS(app)  

conn=sqlite3.connect("test.db",check_same_thread=False)
cur=conn.cursor()
cur.execute("""
CREATE TABLE IF NOT EXISTS customer (
    fname text, 
    lname text,
    email text,
    password text)""")
conn.commit()






@app.route('/', methods=["POST"])
def get_User():
  email=request.get_json().get("email")
  password=request.get_json().get("password")
  query=f'SELECT * FROM customer WHERE email = "{email}" AND password = "{password}"'
  print(email)
  print(password)
  checker=cur.execute(query).fetchall() 
  conn.commit()
  if len(checker)==1:
    return "ya"

  
  return checker

  
  
@app.route('/registration', methods=["POST"])
def get_Info():
  fname=request.get_json().get("fname")
  lname=request.get_json().get("lname")
  email=request.get_json().get("email")
  password=request.get_json().get("password")
  conn.execute('INSERT INTO customer(fname,lname,email,password) VALUES (?,?,?,?)',(fname,lname,email,password))
  conn.commit()
 
  return  "Ya"

@app.route('/main')
def get_Home():
  print("works")
  return "pog"

if __name__ == "__main__":
  app.run(debug=False)



