import './App.css';
import React, {useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { openDatabase } from 'react-native-sqlite-storage'
// import SQLite from 'react-native-sqlite-storage'
import { Userlogin } from './Userlogin'
import { Newuserlogin } from './Newuserlogin'
import { Homepage } from './Homepage';


 //pog

function App() {
  const [loginForm,setLoginForm]=useState('login');
  const change_page =(pageName)=>{
    setLoginForm(pageName);
  }
  return (
    <div className="App">
      {/* {
        loginForm === 'login' ? <Userlogin onFormSwitch={change_form} /> : <Newuserlogin onFormSwitch={change_form}/>    
      }     */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Userlogin element={<Newuserlogin/>} />}/>
          <Route path="/registration" element={<Newuserlogin element={<Userlogin/>}/>} />
          <Route path="/main" element={<Homepage />} />

      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
