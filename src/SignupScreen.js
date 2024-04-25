import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'; // Ensure you import createUserWithEmailAndPassword
import { doc, setDoc, getFirestore } from 'firebase/firestore'; // Firebase Firestore functions
import './SignupScreen.css'; // Ensure CSS is properly linked

const SignupScreen = () => {
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase Auth
  const firestore = getFirestore(); // Initialize Firestore

  // State hooks for form data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handler for creating a new user
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Adding user details to Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        firstName,
        lastName,
        username,
        email,
      });
      console.log("User profile created in Firestore");
      navigate("/account"); // Adjust the route as necessary after sign up
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="titleContainer">
          <h1 className="title">NICO STUDIOS</h1>
          <h2 className="subtitle">for songwriters</h2>
        </div>
        <div className="loginContainer">
          <input className="input" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <input className="input" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
          <input className="input" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" />
          <input className="input" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" />
          <input className="input" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" />
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button className="button" onClick={handleSignUp}>Create</button>
          <div className="separator"></div>
          <button className="button" onClick={() => navigate('/')}>Back to Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
