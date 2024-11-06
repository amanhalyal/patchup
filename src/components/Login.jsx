// src/components/Login.jsx

import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../login.css'; // Import the CSS file

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  // Form validation
  useEffect(() => {
    // Basic validation: email includes "@" and password is at least 6 characters
    const emailValid = email.includes('@');
    const passwordValid = password.length >= 6;
    setIsValid(emailValid && passwordValid);
  }, [email, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return; // Prevent submission if form is invalid
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Login error:', error);
        alert('Invalid email or password');
      });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email" // Placeholder added
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password" // Placeholder added
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={!isValid}
          style={{
            backgroundColor: isValid ? '#4caf50' : '#f44336', // Green if valid, red if invalid
          }}
        >
          Login
        </button>
        <div className="signup-link">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
