import SignupForm from '../../components/auth/SignupForm'
import pieFrame from '../../assets/auth/pieFrame.png'
import loginHero from '../../assets/auth/loginHero.png'
import '../../styles/auth/Signup.css'

const SignUp = () => {
  return (
    <div className="signup">
          <div className="sidebar">
            <SignupForm />
          </div>
          {window.innerWidth > 768 && (
          <div className="heroSection">
            <div className="section1">
              <div className="heading">
                <h1>Welcome to</h1>
                <h1>Company Name</h1>
              </div>
              <img id="pieFrame" src={pieFrame} alt="" />
            </div>
            <img id='signupHero' src={loginHero} alt="" />
          </div>)}
        </div>
  )
}

export default SignUp
