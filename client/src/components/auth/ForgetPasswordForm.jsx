import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/auth/ForgetPasswordForm.css";

const ForgetPasswordForm = ({ onNext, setEmail }) => {
  const [email, setLocalEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) return setError("Email is required");
    try {
      const res = await fetch("http://localhost:4000/api/user/forgetpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEmail(email);
      onNext();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="forgetPasswordContainer">
      <h1 id="fp-intro-h1">Company name</h1>
      <p className="fp-intro-p">Please enter your registered email ID to</p>
      <p className="fp-intro-p">receive an OTP</p>
      <form action="" className="forgetPasswordForm" onSubmit={handleSubmit}>
        <label className="fp-label" htmlFor="email">
          E-mail
        </label>
        <input
          id="fpemailInput"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setLocalEmail(e.target.value)}
          placeholder="Enter your registered email "
        />
        {error && <p className="error">{error}</p>}
        <button id="send-btn">Send Mail</button>
      </form>
    </div>
  );
};

export default ForgetPasswordForm;
