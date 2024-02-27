import axios from "axios";
import { useContext, useEffect} from "react";
import { Link } from "react-router-dom";
import { UserContext} from './UserContext';

export default function Header(){

    // const [username, setUsername] = useState(null);
    const {setUserInfo, userInfo} = useContext(UserContext);

    const token = localStorage.getItem('token');
    // const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        axios.get('http://localhost:4000/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
          .then((response) => response.data)
          .then((userInfo) => {
            setUserInfo(userInfo);
            // console.log(username);
            console.log(userInfo);
          })
          .catch((error) => {
            console.log('Error fetching user profile:', error);
          });
    }, [token, setUserInfo]);

    function logout(){
        localStorage.removeItem('token');
        setUserInfo(null);
    }

    const username = userInfo?.username;

    return (
        <header>
            <Link to="/" className="logo">My blog</Link>
            <nav>
                {username && (
                    <>
                        <Link to='/create'>New Post</Link>
                        <a href='/' onClick={logout}>Logout</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    )
}