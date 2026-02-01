
import LoginForm from "../../components/auth/LoginForm";
import pieFrame from "../../assets/auth/pieFrame.png";
import loginHero from "../../assets/auth/LoginHero.png";
import "../../styles/auth/Login.css";
const Login = () => {

  
  return (
    <div className="login">
      <div className="sidebar-login">
        <LoginForm />
      </div>
      <div className="heroSection-login">
        <div className="section-login">
          <div className="heading">
            <h1>Welcome to</h1>
            <h1>Company Name</h1>
          </div>
          <img id="login-pieFrame" src={pieFrame} alt="" />
        </div>
        <img id='loginHero' src={loginHero} alt="" />
      </div>
    </div>
  );
};

export default Login;
