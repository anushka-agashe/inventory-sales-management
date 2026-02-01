import React, { useState ,useContext  } from "react";
import eyeIcon from "../../assets/icons/eyeIcon.png";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth/SignupForm.css";
import { AuthContext } from "../../context/AuthContext";

const SignupForm = () => {
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const nameParts = form.fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "-";

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      login(data);
      navigate("/home");
    } catch (err) {
      setErrors({ general: err.message }); 
    }
  };

  return (
    <div className="signupContainer">
      <h1 id="signup-intro-h1">Create an account</h1>
      <p id="signup-intro-p">Start inventory management.</p>
      <form action="" className="signupForm" onSubmit={handleSubmit}>
        <label className="signup-label">Name</label>
        <input
          id="nameSignupInput"
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Name"
        />
        {errors.fullName && <p className="error">{errors.fullName}</p>}

        <label className="signup-label">Email</label>
        <input
          id="emailSignupInput"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Example@email.com"
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label className="signup-label">Create Password</label>
        <div className="signup-password-container">
          <input
            id="passwordSignupInput"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="at least 8 characters"
          />

          <img
            src={eyeIcon}
            alt=""
            className="signup-eyeIcon"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
        {errors.password && <p className="error">{errors.password}</p>}

        <label className="signup-label">Confirm Password</label>
        <div className="signup-password-container">
          <input
            id="passwordSignupInput"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="at least 8 characters"
          />

          <img
            src={eyeIcon}
            alt=""
            className="signup-eyeIcon"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
        {errors.confirmPassword && (
          <p className="error">{errors.confirmPassword}</p>
        )}

        <button id="signup-btn">Sign up</button>
        <p id="p-signup">
          Do you have an account?{" "}
          <Link
            to="/auth/login"
            style={{ textDecoration: "none", color: "blue", fontSize: "16px" }}
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
