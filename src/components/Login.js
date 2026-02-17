import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // ✅ navigation hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // clear old error

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password }
      );

      // ✅ Make sure token exists
      if (res.data.token) {
        onLogin(res.data.token, res.data.name);
        navigate('/'); // 🔥 THIS WAS MISSING
      } else {
        setError('Login failed: no token received');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl mb-4 text-center">Login</h2>

        {error && (
          <div className="text-red-500 mb-2 text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <span>Don’t have an account? </span>
          <a
            href="/signup"
            className="text-blue-500 hover:underline"
          >
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}

export default Login;
