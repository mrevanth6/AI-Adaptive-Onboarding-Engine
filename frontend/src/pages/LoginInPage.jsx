import "./LoginInPage.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import learrning_illustration from "../assets/learning_illustration.svg";
import { Lock, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleLogin } from "@react-oauth/google";
const API_URL = import.meta.env.VITE_API_URL;
function LoginInPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isemailValid, setIsEmailValid] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    function onEmailChange(e) {
        setEmail(e.target.value);
    }
    function handlePasswordChange(e) {
        setPassword(e.target.value);
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
            const response = await axios.post("https://ai-adaptive-onboarding-engine-d0qy.onrender.com/api/auth/login", { email, password });
            if (response.status === 200) {
                const { token, savedRoadmaps } = response.data;
                localStorage.setItem("token", token);
                // Save the savedRoadmaps to localStorage
                if (savedRoadmaps && Array.isArray(savedRoadmaps)) {
                    localStorage.setItem("savedRoadmaps", JSON.stringify(savedRoadmaps));
                }
                else {
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
            toast.error(error.response?.data?.message || "An error occurred during login. Please try again.");
        }
    }


    const signInWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {

            console.log(tokenResponse.access_token);
            try {
                const response = await axios.post("https://ai-adaptive-onboarding-engine-d0qy.onrender.com/api/auth/google-login", { access_token: tokenResponse.access_token });
                console.log(response);
                if (response.status === 200) {
                    const { token, savedRoadmaps } = response.data;
                    localStorage.setItem("token", token);
                    localStorage.setItem("savedRoadmaps", JSON.stringify(savedRoadmaps));
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
        <div className='login-page'>

            <div className='login-page-image'>
                <h1>Welcome Back!</h1>
                <p>To keep connected with us please login with your personal info</p>
            </div>

            <div className="login-container">

                <div className="login-container-header">
                    <h1>Login</h1>
                    <p>Glad to see you again!</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form" noValidate>

                    <div className="form-group">
                        <label htmlFor="email" className="required">Email Address</label>

                        <div className={`input-wrapper ${!isemailValid ? "error-input" : ""}`}>
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
                        <label htmlFor="password" className="required">Password</label>

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
                            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                        </div>
                    </div>
                    <div className="form-options">

                        <label>
                            <input type="checkbox" />
                            Remember me
                        </label>

                        <a href="/">
                            Forgot Password?
                        </a>

                    </div>

                    <button
                        type="submit"
                        className="login-btn"

                    >
                        Login
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
                        <Link to="/signup" className="signup-link-text">Sign Up</Link>
                    </div >
                </div>

            </div >
        </div >
    );
}

export default LoginInPage;