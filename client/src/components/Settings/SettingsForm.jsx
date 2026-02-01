import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import closebtn from "../../assets/icons/symbols_close.png";
import "../../styles/Settings/SettingsForm.css";
import { useNavigate } from "react-router-dom";

const SettingsForm = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      }));
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/editprofile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Profile updated!");
      login({ token: localStorage.getItem("token"), user: data.user });
    } else {
      alert(data.error);
    }
  };
  return (
    <div className="setting-container">
      <h3 id="s-h3">Home</h3>
      <hr className="custom-line-3" />
      <form className="settingForm" action="" onSubmit={handleSubmit}>
        <div className="setting-header">
          <img
            src={closebtn}
            alt="close"
            className="close-icon"
            onClick={() => navigate("/home")}
          />

          <h4 id="s-h4">Edit Profile</h4>
        </div>
        <hr className="custom-line-4" />
        <hr className="custom-line-5" />
        <label className="formlabel">First name</label>
        <input
          className="forminput"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />

        <label className="formlabel">Last name</label>
        <input
          className="forminput"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />

        <label className="formlabel">Email</label>
        <input
          className="forminput"
          type="email"
          name="email"
          value={formData.email}
          disabled
        />

        <label className="formlabel">Password</label>
        <input
          className="forminput"
          type="password"
          name="password"
          onChange={handleChange}
        />

        <label className="formlabel">Confirm Password</label>
        <input
          className="forminput"
          type="password"
          name="confirmPassword"
          onChange={handleChange}
        />

        <button id="save-btn" type="submit">
          Save
        </button>
      </form>
    </div>
  );
};

export default SettingsForm;
