import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [name, setName] = React.useState(localStorage.getItem('name'));

  const handleLogin = (token, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('name', name);
    setToken(token);
    setName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setToken(null);
    setName(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            token ? (
              <Dashboard token={token} name={name} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
