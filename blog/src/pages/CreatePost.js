import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Editor from '../Editor';

export default function CreatePost(){

    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");
    const [files, setFiles] = useState([]);
    const [content, setContent] = useState("");
    
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const createNewPost = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('title', title);
            data.append('summary', summary);
            data.append('file', files);
            data.append('content', content);
    
            const response = await axios.post('http://localhost:4000/post', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                  },
            });

            console.log(response);
    
            if (response.status === 200) {
                navigate('/');
                alert('Post created successfully');
            }
        } catch (err) {
            console.log(err);
        }
    };
    
    return (
        <form id="" onSubmit={createNewPost}>
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

            <button type='submit' style={{marginTop:'15px'}}>Create Post</button>
        </form>
    )
}