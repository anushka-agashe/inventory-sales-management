import { useState } from "react";
import "../../styles/auth/ResetPasswordForm.css";
import eyeIcon from "../../assets/icons/eyeIcon.png";

const ResetPasswordForm = ({ email, otp }) => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword)
      return setError("All fields are required");
    if (password.length < 8)
      return setError("Password must be at least 8 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/user/resetpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newpassword: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Password reset successful! You can now login.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="resetPasswordContainer">
      <h1 id="rp-intro-h1">Create New Password</h1>
      <p className="rp-intro-p">
        Today is a new day. It's your day. You shape it.{" "}
      </p>
      <p className="rp-intro-p">Sign in to start managing your projects.</p>

      <form action="" className="resetPasswordForm" onSubmit={handleSubmit}>
        <label className="rp-label" htmlFor="new-password">
          Enter New Password
        </label>
        <div className="rp-password-container">
          <input
            className="rp-passwordLoginInput"
            type={showNewPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="at least 8 characters"
          />

          <img
            src={eyeIcon}
            alt=""
            className="rp-eyeIcon"
            onClick={() => setShowNewPassword(!showNewPassword)}
          />
        </div>
        <label className="rp-label" htmlFor="confirm-password">
          Confirm Password
        </label>
        <div className="rp-password-container">
          <input
            className="rp-passwordLoginInput"
            type={showConfirmPassword ? "text" : "password"}
            name="cnf-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="at least 8 characters"
          />

          <img
            src={eyeIcon}
            alt=""
            className="rp-eyeIcon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button id="reset-btn" type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
