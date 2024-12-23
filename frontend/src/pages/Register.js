// D:\Git-Hub\Repositories\financial-health-check-calculator\frontend\src\pages

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        email,
        name,
        password,
      });

      const { token } = response.data;
      login(token);  
      navigate('/results'); // Redirect to a protected page upon successful registration
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      {error && <div className="text-danger mb-3">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input 
            type="text"
            className="form-control"
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <input 
            type="email"
            className="form-control"
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="mb-3">
          <input 
            type="password"
            className="form-control"
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button className="btn btn-primary" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
