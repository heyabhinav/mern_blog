import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';
import Editor from '../Editor';


export default function EditPost(){
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [files, setFiles] = useState([]);
    const [content, setContent] = useState("");

    const {id} = useParams();
    
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(()=>{
        axios.get(`http://localhost:4000/post/${id}`)
        .then(response=>response.data)
        .then(postInfo=>{
            setTitle(postInfo.title);
            setSummary(postInfo.summary);
            setContent(postInfo.content);
        })
    }, [id]);

    async function updatePost(e){
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', title);
            data.append('summary', summary);
            data.append('content', content);
            data.append('id', id);
            console.log(files);

            if(files){
                data.append('file', files);
                console.log(files.length);
            }

            const response = await axios.put('http://localhost:4000/post', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                  },
            });

            // console.log(response);
    
            if (response.status === 200) {
                navigate(`/post/${id}`);
                alert('Post Edited successfully');
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <form id="" onSubmit={updatePost}>
            <input type='text'
             placeholder="Title"
             value={title}
             onChange={e=>setTitle(e.target.value)}
            />

            <input type='text' 
            placeholder="Summary"
            value={summary}
            onChange={e=>setSummary(e.target.value)}
            />

            <input type='file'
            onChange={e=>setFiles(e.target.files[0])}
            />

            <Editor value={content} onChange={newValue=>setContent(newValue)}/>

            <button type='submit' style={{marginTop:'15px'}}>Edit Post</button>
        </form>
    )
}