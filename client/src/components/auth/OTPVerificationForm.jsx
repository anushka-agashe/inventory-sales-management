import "../../styles/auth/OTPVerificationForm.css";
import { useState } from "react";

const OTPVerificationForm = ({ onNext, setOtp }) => {
  const [otp, setLocalOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp) return setError("OTP is required");
    setOtp(otp);
    onNext();
  };
  return (
    <div className="otpVerificationContainer">
      <h1 id="otp-intro-h1">Enter Your OTP</h1>
      <p className="otp-intro-p">We’ve sent a 6-digit OTP to your </p>
      <p className="otp-intro-p">registered mail.</p>
      <p className="otp-intro-p">Please enter it below to sign in.</p>
      <form action="" className="otpVerificationForm" onSubmit={handleSubmit}>
        <label id="otp-label" htmlFor="otp">
          OTP
        </label>
        <input
          id="otp"
          type="number"
          name="otp"
          value={otp}
          onChange={(e) => setLocalOtp(e.target.value)}
          placeholder="6-digit OTP"
        />
        {error && <p className="error">{error}</p>}
        <button id="confirm-btn">Confirm</button>
      </form>
    </div>
  );
};

export default OTPVerificationForm;
