import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import './LoginScreen.css';

const SignupScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    const isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
    if (isMobile) {
      navigate("/MobilePage");
    }
  }, [navigate]);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential.user.email);
      navigate("/account");
    } catch (error) {
      let message = "Invalid Email or Password";
      setErrorMessage(message);
    }
  };

  const handleGoToSignUp = () => {
    navigate("/SignupScreen");
  };

  const handleForgotPassword = () => {
    setIsModalOpen(true);
  };

  const requestResetEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert('Reset email sent successfully. Please check your inbox.');
      setIsModalOpen(false);
    } catch (error) {
      alert('Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="container">
       <div className="image-container">
        <img src="https://nicostudios.s3.us-east-2.amazonaws.com/Screenshots.png" style={{ width: '550px', height: 'auto' }} alt="Screenshot 1" />
        <div className="additional-container">
            <div className="additional-card">
              <a href="https://drive.google.com/file/d/1IyVio7RHcatCANd1Vnzd5tUVJyu-uXh1/view?usp=sharing" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <button className="button-special">Download for Android</button>
              </a>
            </div>
        </div>
      </div>
      <div className="card-container">
        <div className="card2">
          <div className="titleContainer">
            <h1 className="title">NICO STUDIOS</h1>
            <h2 className="subtitle">for songwriters</h2>
          </div>
          <div className="loginContainer">
            <input className="input2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email"/>
            <input className="input2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password"/>
            <button className="button" onClick={handleSignIn}>Sign In</button>
            <button className="button-fp" onClick={handleForgotPassword}>Forgot Password?</button>
            {isModalOpen && (
              <div className="modal-fp">
                <div className="modal-content-fp">
                  <input type="email" placeholder="Enter your email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                  <button onClick={requestResetEmail}>Request Reset Email</button>
                </div>
              </div>
            )}
            <div className="separator"></div>
            <button className="button" onClick={handleGoToSignUp}>Create Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
