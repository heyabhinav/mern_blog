import {formatISO9075} from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({_id,title, summary, cover, content, createdAt, author}){
    return (
        <>
        <div className='post'>
            <div className='image'>
                <Link to={`/post/${_id}`}>
                    <img src={'http://localhost:4000/'+cover} alt=""/>
                </Link>
            </div>
            <div className="text">
                <Link to={`/post/${_id}`}>
                    <h2>{title}</h2>
                </Link>
                <p className="info">
                    <p className="author">{author.username}</p>
                    <time>{formatISO9075(new Date(createdAt))}</time>
                </p>
                <p className="summary">
                    {/* I can treat you better than he can. you should be with me instead. better than he can, give me a sign, just you dont need to this alone. i can treat you better you deserv that. */}
                    {summary}
                </p>
            </div>
        </div>
        </>
    )
}