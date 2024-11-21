import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation(); // Access navigation state
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    email: "",
    sem: "",
    branch: "",
    password: "",
    confirmPassword: "",
  });
  const [isStudentFound, setIsStudentFound] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Check if the user has completed email verification
  useEffect(() => {
    const isVerified = localStorage.getItem("isVerified");
    if (isVerified !== "true") {
      alert("Access denied! Complete email verification first.");
      navigate("/otpverify");
    } else {
      setFormData((prev) => ({
        ...prev,
        email: location.state?.email || "", // Retrieve email from navigation state if available
      }));
    }
  }, [navigate, location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "password") {
      setPasswordStrength(calculateStrength(e.target.value));
    }
  };

  const calculateStrength = (password) => {
    let strength = 0;
    if (password.length > 8) strength += 1; // Length
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase
    if (/[a-z]/.test(password)) strength += 1; // Lowercase
    if (/[0-9]/.test(password)) strength += 1; // Numbers
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1; // Special chars
    return strength;
  };

  const handleFindStudent = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/student/register",
        {
          rollNumber: formData.rollNumber,
        }
      );
      setFormData({
        ...formData,
        ...response.data, // Pre-fill details
        password: "",
        confirmPassword: "",
      });
      setIsStudentFound(true);
    } catch {
      setError("Student not found. Please check the roll number.");
      setIsStudentFound(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/student/register", {
        rollNumber: formData.rollNumber,
        password: formData.password,
      });
      alert("Password updated successfully!");
      navigate("/login");
    } catch {
      setError("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthLabel = () => {
    const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
    return labels[passwordStrength] || "";
  };

  const getStrengthColor = () => {
    const colors = ["#F44336", "#FF9800", "#FFEB3B", "#8BC34A", "#4CAF50"];
    return colors[passwordStrength] || "#e0e0e0";
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Update Password
      </h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="rollNumber"
          placeholder="Enter your roll number"
          value={formData.rollNumber}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button
          type="button"
          onClick={handleFindStudent}
          disabled={isLoading || !formData.rollNumber}
          style={{
            ...inputStyle,
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Finding Student..." : "Find Student"}
        </button>

        {isStudentFound && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              disabled
              style={inputStyle}
            />
            <input
              type="text"
              name="sem"
              placeholder="Semester"
              value={formData.sem}
              disabled
              style={inputStyle}
            />
            <input
              type="text"
              name="branch"
              placeholder="Branch"
              value={formData.branch}
              disabled
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              disabled
              style={inputStyle}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <div style={{ marginBottom: "10px" }}>
              <div
                style={{
                  height: "10px",
                  width: "100%",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${(passwordStrength / 4) * 100}%`,
                    backgroundColor: getStrengthColor(),
                    borderRadius: "5px",
                  }}
                />
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontSize: "12px",
                  color: getStrengthColor(),
                }}
              >
                {getStrengthLabel()}
              </div>
            </div>
          </>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {isStudentFound && (
          <button
            type="submit"
            disabled={
              isLoading || !formData.password || !formData.confirmPassword
            }
            style={{
              ...inputStyle,
              padding: "10px",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        )}
      </form>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <p style={{ fontSize: "14px" }}>
          Already registered?{" "}
          <Link to="/login" style={{ color: "#007bff" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
