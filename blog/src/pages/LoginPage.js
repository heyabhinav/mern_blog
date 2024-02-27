import React,{useContext, useState} from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function LoginPage(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setUserInfo} = useContext(UserContext);

    const navigate = useNavigate();

    async function login(e){
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:4000/login", {username, password});
            // console.log(response);
            if(response.status === 200){
                const userInfo = response.data;
                setUserInfo(userInfo);
                localStorage.setItem('token', response.data.token); // Store token securely
                navigate('/');
            }
        }catch(e){
            console.log(e);
            alert("Failed");
        }
    }
    return (
    <>
    <form className='login' onSubmit={login}>
        <h1>Login</h1>
        <input 
        type='text' 
        placeholder='username' 
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
        />
        <input 
        type='password' 
        placeholder='password' 
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        <button >Login</button>
    </form>
    </>)
}