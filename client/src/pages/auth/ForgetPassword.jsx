import { useState } from "react";
import heroImg2 from "../../assets/auth/heroImg2.png";
import heroImg3 from "../../assets/auth/heroImg3.png";
import heroImg4 from "../../assets/auth/heroImg4.png";
import ForgetPasswordForm from "../../components/auth/ForgetPasswordForm.jsx";
import OTPVerificationForm from "../../components/auth/OTPVerificationForm.jsx";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm.jsx";
import "../../styles/auth/ForgetPassword.css";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const heroImages = {
    1 : heroImg2,
    2 : heroImg3,
    3 : heroImg4
  }

  return (
    <div className="forgetEmail">
      <div className="sidebar">
        {/* <ForgetPasswordForm /> */}
        {step === 1 && <ForgetPasswordForm onNext={() => setStep(2)} setEmail={setEmail}  />}
        {step === 2 && <OTPVerificationForm onNext={() => setStep(3)} setOtp={setOtp}  />}
        {step === 3 && <ResetPasswordForm email={email} otp={otp} />}
      </div>
      <div className="heroSection">
        <img id="heroImg2" src={heroImages[step]} alt="" />
      </div>
    </div>
  );
};

export default ForgetPassword;
