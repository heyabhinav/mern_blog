import { useEffect, useState } from "react";
import Post from "../Post";
import axios from "axios";

export default function IndexPage(){
    const [posts, setPosts] = useState([]);
    useEffect(()=>{
        axios.get('http://localhost:4000/post').then(response=>{
            console.log(response.data);
            setPosts(response.data);
        })
    },[]);
    return (
        <>
            {posts.length > 0 && posts.map(post => (
                <Post {...post}/>
            ))}
        </>
    )
}