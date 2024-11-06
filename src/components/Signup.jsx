// src/components/Signup.jsx

import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../login.css'; // Reuse the same CSS file

function Signup() {
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
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User created
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error('Signup error:', error);
        alert(`Error creating account: ${error.message}`);
      });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
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
          placeholder="Create a password" // Placeholder added
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
          Sign Up
        </button>
        <div className="signup-link">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Signup;
