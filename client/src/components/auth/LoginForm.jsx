import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth/LoginForm.css";
import eyeIcon from "../../assets/icons/eyeIcon.png";
import { AuthContext } from "../../context/AuthContext";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password && form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log("API URL:", import.meta.env.VITE_API_URL)
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data);
      navigate("/home");
    } catch (err) {
      setErrors({ general: err.message });
    }
  };

  return (
    <div className="loginContainer">
      <h1 id="login-intro-h1">Log in to your account</h1>
      <p id="login-intro-p">Welcome back! Please enter your details.</p>
      <form action="" className="loginForm" onSubmit={handleSubmit}>
        <label className="login-label">Email</label>
        <input
          id="emailLoginInput"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
          placeholder="Example@email.com"
        />

        {errors.email && <p className="error">{errors.email}</p>}

        <label className="login-label">Password</label>
        <div className="login-password-container">
          <input
            id="passwordLoginInput"
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "input-error" : ""}
            placeholder="at least 8 characters"
          />

          <img
            src={eyeIcon}
            alt=""
            className="eyeIcon"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        {errors.password && <p className="error">{errors.password}</p>}

        {errors.general && <p className="error">{errors.general}</p>}
        <Link
          to="/auth/forgetpassword"
          style={{
            textDecoration: "none",
            color: "blue",
            fontSize: "16px",
            alignSelf: "flex-end",
          }}
        >
          Forgot Password?
        </Link>
        <button id="signin-btn">Sign in</button>
        <p id="p-login">
          Don't you have an account?{" "}
          <Link
            to="/auth/signup"
            style={{ textDecoration: "none", color: "blue", fontSize: "16px" }}
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
