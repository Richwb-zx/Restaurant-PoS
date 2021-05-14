import './scss/login.scss';

function LoginForm() {
    return (
      <form id="loginform" className="login-form">
          <input type="text" placeholder="Username" required></input>
          <input type="password" placeholder="Password" required></input>
          <input type="submit" value="Login"/>
      </form>
    );
  }
  
  export default LoginForm;