//Used a tutorial to help with switching pages ,props,usestate and handlesubmit
//https://www.w3schools.com/react/react_props.asp
//https://www.w3schools.com/react/react_forms.asp
//Learned that I was having an issue due to not using self closing inputs
// https://stackoverflow.com/questions/37182100/reactjs-warning-input-is-a-void-element-tag-and-must-not-have-children-or-use
import React, {useState} from 'react';
import {Link} from "react-router-dom";


export const Userlogin = (props) =>{
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    
   

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(email) 
        console.log(password)
        const data = {
            email: email,
            password: password
        };
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'
            
        };
        fetch("http://localhost:5000/", {
            mode:'cors',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        })
        .then((response)=>{
            response.text()
        })
        .then((data) => {
            console.log('Success:', data);
            setEmail('');
            setPassword('');
            window.location='/main'
        })
        .catch((error) => {
            console.error('Error:', error);
            
        });
    }
    return(
    <>
        <div class="Login_page">
            <form class="login_form" onSubmit={handleSubmit}>
                <label class="info_label">Email</label>
                <input class="input_email" type='email' onChange={(e)=>setEmail(e.target.value)} value={email} />
                <label class="info_label">Password</label>
                <input class="input_password" type='password' onChange={(e)=>setPassword(e.target.value)} value={password}/>
                <input class='submit_login' type='submit'  />
                <label class="promt1">Don't have an account? <Link to="/registration" class="register">Sign up</Link></label>
            </form>
        </div>
        
    </>
    )
}