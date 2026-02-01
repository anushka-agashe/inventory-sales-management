import SignupForm from '../../components/auth/SignupForm'
import pieFrame from '../../assets/auth/pieFrame.png'
import loginHero from '../../assets/auth/loginHero.png'
import '../../styles/auth/Signup.css'

const SignUp = () => {
  return (
    <div className="signup">
          <div className="signup-sidebar">
            <SignupForm />
          </div>
           <div className="signup-heroSection">
            <div className="section-signup">
              <div className="heading-signup">
                <h1>Welcome to</h1>
                <h1>Company Name</h1>
              </div>
              <img id="signup-pieFrame" src={pieFrame} alt="" />
            </div>
            <img id='signupHero' src={loginHero} alt="" />
          </div>
        </div>
  )
}

export default SignUp
