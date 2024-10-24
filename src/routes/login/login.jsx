import HeroImg from '../../components/heroImg/heroImg';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';
import { useContext, useState } from 'react';
import apiRequest from '../../lib/apiRequest';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {

  const [error, setError] = useState("");
  const {updateUser} = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        email, password
      });
      updateUser(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response.data.message);
    }
  }

  return (
    <div className='login-page'>
      <div className="form-container">
        <form onSubmit={submitHandler}>
          <h2>Welcome back</h2>
          <input type="email" name="email" placeholder='Email' required />
          <input type="password" name='password' placeholder='Password' required />
          {error && <span>{error}</span>}
          <button className='btn'>Login</button>
          <Link to={'/signup'}>Dont have an account ? Signup</Link>
        </form>
      </div>
      <HeroImg></HeroImg>
    </div>
  )
};

export default Login;