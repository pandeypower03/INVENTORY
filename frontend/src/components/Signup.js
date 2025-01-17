import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    user_type: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Sending data:", formData); // Debug log

      const response = await axios.post(
        "http://localhost:8000/api/register/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response:", response.data); // Debug log
      navigate("/login");
    } catch (err) {
      console.error("Full error:", err);
      console.error("Error response:", err.response?.data);

      if (err.response?.data?.error) {
        if (typeof err.response.data.error === "object") {
          // Handle validation errors
          const errors = Object.entries(err.response.data.error)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");
          setError(errors);
        } else {
          setError(err.response.data.error);
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <div>
          <h2 className="signup-heading">Create your account</h2>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-alert" role="alert">
              <pre>{error}</pre>
            </div>
          )}
          <div className="input-stack">
            <div>
              <input
                name="email"
                type="email"
                required
                className="form-input input-top"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="username"
                type="text"
                required
                className="form-input input-middle"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="form-input input-middle"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <select
                name="user_type"
                className="form-input form-select input-bottom"
                value={formData.user_type}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </div>
        </form>

        <div className="login-link">
          <Link to="/login">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
