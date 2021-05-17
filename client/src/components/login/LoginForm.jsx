import React from 'react';
import './scss/loginForm.scss';
class LoginForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
    };

    this.updatefieldState = this.updatefieldState.bind(this);
    this.loginSubmit = this.loginSubmit.bind(this);
  }

  updatefieldState(event){
    const stateName = event.target.name;
    this.setState({[stateName]: event.target.value});
  }

  loginSubmit(event){
    event.preventDefault();
    const userName = this.state.username;
    const password = this.state.password;
    const loginData = {'username': userName, 'password': password};

    fetch('/loginauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.log('error',error);
    });
  }

  render(){
    return (
      <form className="login-form" onSubmit={this.loginSubmit}>
          <input type="text" name="username" value={this.state.username} onChange={this.updatefieldState} placeholder="Username" required />
          <input type="password" name="password" value={this.state.password} onChange={this.updatefieldState} placeholder="Password" required />
          <input type="submit" value="Login"/>
      </form>
    );
  }
}

export default LoginForm;