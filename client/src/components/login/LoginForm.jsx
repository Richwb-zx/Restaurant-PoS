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
    const stateName = event.target.name;
    this.setState({[stateName]: event.target.value});
  }

  render(){
    return (
      <form id="loginform" className="login-form">
          <input type="text" name="username" value={this.state.username} onChange={this.updatefieldState} placeholder="Username" required />
          <input type="password" name="password" value={this.state.password} onChange={this.updatefieldState} placeholder="Password"  required></input>
          <input type="submit" value="Login"/>
      </form>
    );
  }
}

export default LoginForm;