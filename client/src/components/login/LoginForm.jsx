import './scss/login.scss';

function LoginForm() {
    return (
      <form className="login-form">
          <input type="text" placeholder="Username"></input>
          <input type="password" placeholder="Password"></input>
      </form>
    );
  }
  
  export default LoginForm;