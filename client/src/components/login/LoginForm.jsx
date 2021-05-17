import React from 'react';
import './scss/loginForm.scss';
class LoginForm extends React.Component{
  render(){
    return (
      <form id="loginform" className="login-form" onSubmit="login">
          <input type="text" placeholder="Username" required></input>
          <input type="password" placeholder="Password" required></input>
          <input type="submit" value="Login"/>
      </form>
    );
  }
}

export default LoginForm;