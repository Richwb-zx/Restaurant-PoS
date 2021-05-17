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
  }

  updatefieldState(event){
    const stateKey = event.target.dataset.name;
    this.setState({[stateKey]: event.target.value});
  }

  render(){
    return (
      <form id="loginform" className="login-form">
          <input type="text" placeholder="Username" value={this.state.username} onChange={this.updatefieldState} data-name="username" required />
          <input type="password" placeholder="Password" value={this.state.password} onChange={this.updatefieldState} data-name="password" required></input>
          <input type="submit" value="Login"/>
      </form>
    );
  }
}

export default LoginForm;