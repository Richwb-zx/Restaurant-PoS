import React from 'react';
import ReactDOM from 'react-dom';
import LoginForm from'./components/login/Login';
import './styling/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <div className="login-wrapper">
      <LoginForm />
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);