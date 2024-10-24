import { useState } from 'react';
import HeroImg from '../../components/heroImg/heroImg';
import './signup.css';
import apiRequest from '../../lib/apiRequest';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [error,setError] = useState("");
    const navigate = useNavigate();

    const submitHandler = async (event) => {
        event.preventDefault();
        setError("");
        const formData = new FormData(event.target);
        const {firstname, lastname, email, password } = Object.fromEntries(formData); 
        
        try{
            const res = await apiRequest.post("/auth/signup", {
                firstname, lastname, email, password
            });
            navigate('/login'); 
        }catch (err ){
            setError(err.response.data.message);
        }
    }

    return (
        <div className='signup-page'>
            <div className="form-container">
                <form onSubmit={submitHandler}>
                    <h2>Create an Account</h2>
                    <input type="text" name='firstname' placeholder='First name' required />
                    <input type="text" name='lastname' placeholder='Last name' required />
                    <input type="email" name="email" placeholder='Email' required />
                    <input type="password" name='password' placeholder='Password' required />
                    {error && <span>{error}</span>}
                    <button className='btn'>Sign Up</button>
                    <Link to={'/login'}>Already have an account ? <span className="text-[#888] hover:text-blue-600">Log In</span></Link>
                </form>
            </div>
            <HeroImg></HeroImg>
        </div>
    )
};

export default Signup;