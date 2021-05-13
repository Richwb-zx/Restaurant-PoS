import React from 'react';
import ReactDOM from 'react-dom';
import Login from './components/login/Login';
import './styling/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <div className="login-wrapper">
    <Login />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);