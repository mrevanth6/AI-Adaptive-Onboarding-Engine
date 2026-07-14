import "./LoginInPage.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
const API_URL = import.meta.env.VITE_API_URL;
function LoginInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isemailValid, setIsEmailValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authView, setAuthView] = useState("login");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  function onEmailChange(e) {
    setEmail(e.target.value);
  }
  function onOtpChange(e) {
    setOtp(e.target.value);
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }
  async function sendOtp(e) {
    e.preventDefault();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = re.test(email);
    setIsEmailValid(isEmailValid);
    if (!isEmailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/auth/otp/send`, {
        email: email,
        type: "reset-password",
      });
      if (response.status === 200) {
        toast.success("OTP sent to your email address!");
        setAuthView("otp-verification");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while sending OTP. Please try again.",
      );
    }
  }
  async function verifyOtp(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/otp/verify`, {
        email: email,
        otp: otp,
        type: "reset-password",
      });
      if (response.status === 200) {
        toast.success("OTP verified successfully!Please reset your password.");
        setAuthView("reset-password");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while verifying OTP. Please try again.",
      );
    }
  }
  async function resetPassword(e) {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
        email: email,
        newPassword: newPassword,
      });
      if (response.status === 200) {
        toast.success(
          "Password reset successfully! Please login with your new password.",
        );
        setAuthView("login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred while resetting password. Please try again.",
      );
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = re.test(email);
    setIsEmailValid(isEmailValid);
    if (!isEmailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      if (response.status === 200) {
        const { token, savedRoadmaps } = response.data;
        localStorage.setItem("token", token);
        // Save the savedRoadmaps to localStorage
        if (savedRoadmaps && Array.isArray(savedRoadmaps)) {
          localStorage.setItem("savedRoadmaps", JSON.stringify(savedRoadmaps));
        } else {
          localStorage.setItem("savedRoadmaps", JSON.stringify([]));
        }
        // Save the token to localStorage
        localStorage.setItem("token", token);
        toast.success("Login successful!");
        navigate("/analyzer");
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during login. Please try again.",
      );
    }
  }

  const signInWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse.access_token);
      try {
        const response = await axios.post(`${API_URL}/api/auth/google-login`, {
          access_token: tokenResponse.access_token,
        });
        console.log(response);
        if (response.status === 200) {
          const { token } = response.data;
          localStorage.setItem("token", token);

          toast.success("Login successful!");
          navigate("/analyzer");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "An error occurred during login. Please try again.",
        );
      }
    },
    onError: () => {
      toast.error("Google login failed. Please try again.");
    },
  });
  return (
    <div className="login-page">
      <div className="login-page-image">
        <h1>Welcome Back!</h1>
        <p>To keep connected with us please login with your personal info</p>
      </div>

      {authView === "login" && (
        <div className="login-container">
          <div className="login-container-header">
            <h2>Login</h2>
            <p>Glad to see you again!</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="form-group">
              <label htmlFor="email" className="required">
                Email Address
              </label>

              <div
                className={`input-wrapper ${!isemailValid ? "error-input" : ""}`}
              >
                <Mail size={18} className="input-icon" />

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  onChange={onEmailChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="required">
                Password
              </label>

              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  onChange={handlePasswordChange}
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
            <div className="form-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  setAuthView("forgot-password");
                }}
              >
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
          <div className="footer">
            <div className="divider-container">
              <hr className="divider" />
              <span className="divider-text">Or Continue with</span>
              <hr className="divider" />
            </div>
            {/* <p className="divider">Or Continue with</p> */}
            <div className="social-login">
              <button className="social-btn" onClick={() => signInWithGoogle()}>
                <FcGoogle size={20} />
                Google
              </button>

              {/* <button className="social-btn">
                            <FaGithub size={20} />
                            GitHub
                        </button>

                        <button className="social-btn">
                            <FaLinkedin size={20} />
                            LinkedIn
                        </button> */}
            </div>

            <div className="signup-link">
              <p>Don't have an account?</p>
              <Link to="/signup" className="signup-link-text">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
      {authView === "forgot-password" && (
        <div className="forgot-password-container">
          <div className="forgot-password-header">
            <h2>Forgot Password</h2>
            <p>Please enter your email address to reset your password.</p>
          </div>
          <form
            className="forgot-password-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="form-group">
              <label htmlFor="email-verification" className="required">
                Email Address
              </label>

              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />

                <input
                  type="email"
                  id="email-verification"
                  name="email-verification"
                  placeholder="Enter your email"
                  required
                  onChange={onEmailChange}
                />
              </div>
            </div>
            <button type="submit" className="send-otp-btn" onClick={sendOtp}>
              Send OTP
            </button>
          </form>
        </div>
      )}
      {authView === "otp-verification" && (
        <div className="otp-verification-container">
          <div className="otp-verification-header">
            <h2>OTP Verification</h2>
            <p>Please enter the OTP sent to your email address.</p>
          </div>
          <form
            className="otp-verification-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="form-group">
              <label htmlFor="otp" className="required">
                OTP
              </label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="Enter OTP"
                  required
                  onChange={onOtpChange}
                />
              </div>
            </div>
            <button
              type="submit"
              className="verify-otp-btn"
              onClick={verifyOtp}
            >
              Verify OTP
            </button>
          </form>
        </div>
      )}
      {authView === "reset-password" && (
        <div className="reset-password-container">
          <div className="reset-password-header">
            <h2>Reset Password</h2>
            <p>Please enter your new password.</p>
          </div>
          <form
            className="reset-password-form"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="form-group">
              <label htmlFor="new-password" className="required">
                New Password
              </label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  id="new-password"
                  name="new-password"
                  placeholder="Enter your new password"
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirm-new-password" className="required">
                Confirm New Password
              </label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  id="confirm-new-password"
                  name="confirm-new-password"
                  placeholder="Confirm your new password"
                  required
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              className="reset-password-btn"
              onClick={resetPassword}
            >
              Reset Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default LoginInPage;
