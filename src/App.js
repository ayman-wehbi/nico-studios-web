import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IndexScreen from './IndexScreen';
import AccountScreen from './AccountScreen'; // Import the AccountScreen component
import SignupScreen from './SignupScreen';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IndexScreen />} />
        <Route path="/account" element={<AccountScreen />} />
        <Route path="/SignupScreen" element={<SignupScreen />} /> {/* Add the route for AccountScreen */}
        {/* Add more routes here as needed */}
      </Routes>
    </Router>
  );
};

export default App;

