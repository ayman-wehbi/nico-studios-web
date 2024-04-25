import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Adjust the path as necessary
import './LoginScreen.css'; // Assuming you've created a CSS file with similar styles

const SignupScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential.user.email);
      navigate("/songs"); // Adjust the route as necessary
    } catch (error) {
      let message = "Invalid Email or Password";
      // Handle errors
      setErrorMessage(message);
    }
  };

  // Removed the font loading and splash screen logic
  // Removed the ErrorModal component for simplicity, you can adapt it similarly

  return (
    <div className="container">
      <div className="titleContainer">
        <h1 className="title">NICO STUDIOS</h1>
        <h2 className="subtitle">for songwriters</h2>
      </div>
      <div className="loginContainer">
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
        <input
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <button className="button" onClick={handleSignIn}>Sign In</button>
        <div className="separator"></div>
        <button className="button" onClick={handleGoToSignUp}>Sign Up</button>
      </div>
    </div>
  );
};

export default SignupScreen;
