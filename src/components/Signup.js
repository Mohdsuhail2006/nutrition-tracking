import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      setSuccess('Signup successful, please login');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl mb-4 text-center">Sign Up</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-500 mb-2">{success}</div>}
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="w-full mb-2 p-2 border rounded" required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mb-2 p-2 border rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mb-4 p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
