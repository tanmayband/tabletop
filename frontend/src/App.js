import React from 'react';
import {
  Link
} from "react-router-dom";

import logo from './logo.svg';
import './App.css';

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p style={{"fontSize": "50px"}}>
            Welcome to DnD
          </p>
          <Link to="/game" className="App-link">
              Begin
          </Link>
        </header>
      </div>
  );
}

export default App;
