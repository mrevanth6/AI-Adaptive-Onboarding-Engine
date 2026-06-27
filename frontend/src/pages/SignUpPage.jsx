import { Link } from "react-router-dom";
import { useState } from "react";
import learrning_illustration from "../assets/learning_illustration.svg";
import { Lock, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { toast } from "react-toastify";
import { Eye, EyeOff, CircleCheckBig } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import "./SignUpPage.css";
const API_URL = import.meta.env.VITE_API_URL;
function SignUpPage() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    function onEmailChange(e) {
        setEmail(e.target.value);
    }
    function onPasswordChange(e) {
        setPassword(e.target.value);
    }
    function onConfirmPasswordChange(e) {
        setConfirmPassword(e.target.value);
    }
    function onOtpChange(e) {
        const otp = e.target.value;
        setOtp(otp);
    }
    // Function to send OTP
    function sendOtp() {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = re.test(email);
        if (!isEmailValid) {
            toast.error("Please enter a valid email address.");
            return;
        }
        console.log("OTP SENT");
        setOtpSent(true);
    }
    // Function to verify OTP
    const verifyOtp = () => {
        if (otp === "123456") {
            setOtpVerified(true);
        }
    };
    // Function to handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = re.test(email);
        if (!isEmailValid) {
            toast.error("Please enter a valid email address.");
        }
        const isPasswordMatch = password.length > 0 && password === confirmPassword;
        if (!isPasswordMatch) {
            toast.error("Passwords do not match.");
        }
        if (isEmailValid && isPasswordMatch) {
            // Proceed with sign-up logic
            try {
                const response = await axios.post(`${API_URL}/api/auth/register`, { email, password });
                if (response.status === 201) {
                    toast.success("Account created successfully! Please log in.");

                    navigate("/login");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "An error occurred during registration. Please try again.");
                console.error(error);

            }
        }
    }

    const signInWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const response = await axios.post(`${API_URL}/api/auth/google-login`, { access_token: tokenResponse.access_token });
                if (response.status === 200) {
                    const { token } = response.data;
                    localStorage.setItem("token", token);
                    toast.success("Login successful!");
                    navigate("/analyzer");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "An error occurred during login. Please try again.");
            }
        },
        onError: (error) => {
            toast.error("Google login failed. Please try again.");
        }
    });
    return (
        <div className="signup-page">
            <div className="signup-page-image">
                <h1>Create Your Account</h1>
                <p>Join us today! It takes only a few steps to create your account.</p>
            </div>
            <div className="signup-container">
                <div className="signup-container-header">
                    <h2>Register</h2>
                    <p>Create your account to get started.</p>
                </div>
                <form onSubmit={handleSubmit} className="signup-form" noValidate>

                    <div className="form-group">
                        <label htmlFor="email" className="required">Email Address</label>

                        <div className="input-wrapper">
                            <Mail size={18} className="input-icon" />

                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                required
                                onChange={onEmailChange}

                            />
                            <CircleCheckBig size={18} className='verified-icon' display={`${otpVerified ? "block" : "none"}`} />
                        </div>
                        <button type="button"
                            className={`send-otp-btn ${otpVerified ? "hide" : ""}`}
                            onClick={sendOtp}
                            disabled={otpVerified}
                        >
                            Send OTP
                        </button>
                    </div>
                    <div className={`form-group ${!otpSent || otpVerified ? "hide" : ""}`}>
                        <label htmlFor="otp" className="required">One-Time Password</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                placeholder="Enter the OTP sent to your email"
                                required
                                onChange={onOtpChange}
                            />
                        </div>
                        <button type="button"
                            className="verify-otp-btn"
                            onClick={verifyOtp}
                            disabled={!otpSent || otpVerified}
                        >
                            Verify OTP
                        </button>
                    </div>
                    <div className={`form-group ${!otpVerified ? "hide" : ""}`}>
                        <label htmlFor="password" className="required">Password</label>

                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />

                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                                onChange={onPasswordChange}
                                disabled={!otpVerified}

                            />
                            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                        </div>
                    </div>
                    <div className={`form-group ${!otpVerified ? "hide" : ""}`}>
                        <label htmlFor="confirmPassword" className="required">Confirm Password</label>

                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                required
                                onChange={onConfirmPasswordChange}
                                disabled={!otpVerified}
                            />
                            <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>

                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`signup-btn ${!otpVerified ? "hide" : ""}`}
                        disabled={!otpVerified}

                    >
                        Register
                    </button>
                </form>
                < div className="footer" >
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
                        {/* 
                        <button className="social-btn">
                            <FaGithub size={20} />
                            GitHub
                        </button>

                        <button className="social-btn">
                            <FaLinkedin size={20} />
                            LinkedIn0
                        </button> */}
                    </div>


                    <div className="signup-link">
                        <p>Already have an account?</p>
                        <Link to="/login" className="signup-link-text">Log In</Link>
                    </div >
                </div>

            </div >
        </div >

    )

}
export default SignUpPage;