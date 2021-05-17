import React from 'react';
import './scss/loginForm.scss';
class LoginForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      displayloginMsg: false,
      errorMessage: '',
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
    this.setState({'displayloginMsg': false});

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
      if(data.success === true){
        console.log(data);
      }else{
        this.setState({'displayloginMsg': true, 'errorMessage': data.response});
      }
    })
    .catch(() => {
      this.setState({'displayloginMsg': true, 'errorMessage': 'An error occured while logging in'});
    });
  }

  displayError(){

  }

  render(){
    let loginMsg = this.state.displayloginMsg;
    let errorMsg = '';
    if(loginMsg === true){
      errorMsg = <div>{this.state.errorMessage}</div>
    }
    return (
      <div>
        {errorMsg}
        <form className="login-form" onSubmit={this.loginSubmit}>
            <input type="text" name="username" value={this.state.username} onChange={this.updatefieldState} placeholder="Username" required />
            <input type="password" name="password" value={this.state.password} onChange={this.updatefieldState} placeholder="Password" required />
            <input type="submit" value="Login"/>
        </form>
      </div>
    );
  }
}

export default LoginForm;