import './scss/login.scss';

function LoginForm() {
    return (
      <form className="login-form">
          <input type="text" placeholder="Username" required></input>
          <input type="password" placeholder="Password" required></input>
      </form>
    );
  }
  
  export default LoginForm;