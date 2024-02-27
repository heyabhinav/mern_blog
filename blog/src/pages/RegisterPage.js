import React,{useState} from 'react';
import axios from 'axios';

export default function RegisterPage(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function register(e){
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:4000/register", {username, password});
            console.log(response);
            alert("Successfull");
            setUsername("");
            setPassword("");
        }catch(e){
            alert("Failed");
        }
    }

    return (
    <>
    <form className='register' onSubmit={register}>
        <h1>Register</h1>
        <input 
        type='text' 
        placeholder='username' 
        value={username}
        onChange={e=>setUsername(e.target.value)}
        />
        <input 
        type='password' 
        placeholder='password' 
        value={password}
        onChange={e=>setPassword(e.target.value)}
        />
        <button>Register</button>
    </form>
    </>)
}