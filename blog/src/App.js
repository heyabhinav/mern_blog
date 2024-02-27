import {Routes, Route} from 'react-router-dom';

import './App.css';
import Layout from './pages/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';
import IndexPage from './pages/IndexPage';
import SinglePostPage from './pages/SinglePostPage';
import EditPost from './pages/EditPost';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<IndexPage/>}/>
          <Route path={'/login'} element={<LoginPage/>}/>
          <Route path={'/register'} element={<RegisterPage/>}/>
          <Route path={'/create'} element={<CreatePost/>}/>
          <Route path={'/post/:id'} element={<SinglePostPage/>}/>
          <Route path={'/edit/:id'} element={<EditPost/>}/>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
