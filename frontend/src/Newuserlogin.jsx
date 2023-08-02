import React, {useState} from 'react';
import {Link} from "react-router-dom";


export const Newuserlogin = (props) =>{
    const [fname,setFname]=useState('');
    const [lname,setLname]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
  

    const handleSubmit=(e) =>{
        e.preventDefault()
        console.log(email) 
        console.log(password)
        const data = {
            fname:fname,
            lname:lname,
            email: email,
            password: password
        };
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
        };
        fetch("http://localhost:5000/registration", {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        })
        .then((response)=>{
            response.text()
        })
        .then((data) => {
            console.log('Success:', data);
            setFname('');
            setLname('');
            setEmail('');
            setPassword('');

        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
    
return(
    <>
    <div class="registration_page">
        <form class="registration_form"onSubmit={handleSubmit}>
            <label class="info_label">First Name</label>
            <input class="input_person" type='fname' onChange={(e)=>setFname(e.target.value)} value={fname}/>
            <label class="info_label">Last Name</label>
            <input class="input_person" type='lname' onChange={(e)=>setLname(e.target.value)} value={lname}/>
            <label class="info_label">Email</label>
            <input class="input_email"  type='email' onChange={(e)=>setEmail(e.target.value)} value={email}/>
            <label class="info_label">Password</label>
            <input class="input_password" type='password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
            <input class='submit_login' type='submit'  />
            <label class="promt2">Already a user? <Link to="/" class="register">login </Link></label>
        </form>
    </div>
    <div>
        
    </div>
    </>
    )
}
