import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Make sure this path is correct if you have a global CSS file
import App from './App'; // Ensure this is the correct path to your App component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
