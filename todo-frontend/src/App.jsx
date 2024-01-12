import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import TodoList from './Todo';
function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    checkToken();
  }, []);

  async function checkToken() {
    const token = localStorage.getItem('access_token');
    try {
      if (token) {
        const decoded = jwtDecode(token);
        console.log(decoded);
        const res = await axios.get(`http://localhost:3000/auth/me`, {
          headers: 'Authorization: Bearer ' + token,
        });

        setUser(res.data);
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem('access_token');
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const res = await axios.post('http://localhost:3000/auth/login', {
      username: e.target[0].value,
      password: e.target[1].value,
    });
    localStorage.setItem('access_token', res.data.access_token);
    checkToken();
    console.log(res.data);
  }

  async function handleSignUp(e) {
    e.preventDefault();
    const res = await axios.post('http://localhost:3000/auth/signup', {
      username: e.target[0].value,
      password: e.target[1].value,
    });
    localStorage.setItem('access_token', res.data.access_token);
    checkToken();
    console.log(res.data);
  }

  if (!user)
    return (
      <>
        <div>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
          </form>
        </div>
        <div>
          <h1>SignUp</h1>
          <form onSubmit={handleSignUp}>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">SignUp</button>
          </form>
        </div>
      </>
    );

  return <TodoList />;
}

export default App;
