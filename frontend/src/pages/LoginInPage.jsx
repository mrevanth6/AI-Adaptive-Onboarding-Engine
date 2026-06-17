import "./LoginInPage.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import learrning_illustration from "../assets/learning_illustration.svg";
import { Lock, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";
function LoginInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isemailValid, setIsEmailValid] = useState(true);
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    function onEmailChange(e) {

        const emailValue = e.target.value;
        setEmail(emailValue);

    }

    function handleSubmit(e) {
        e.preventDefault();
        setIsButtonClicked(true);

        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailValue = e.target.value;
        setEmail(emailValue);
        setIsEmailValid(re.test(emailValue));
    }
    return (
        <div className='login-page'>
            <div className='login-page-image'>
                <img src={learrning_illustration} alt="Learning Illustration" id="learning-illustration" />
            </div>

            <div className="login-container">
                <div className="login-container-header">
                    <h1>Login</h1>
                    <p>Glad to see you again!</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form" noValidate>

                    <div className="form-group">
                        <label htmlFor="email" className="required">Email Address</label>

                        <div className={`input-wrapper ${!isemailValid && isButtonClicked ? "error-input" : ""}`}>
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
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                            />
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
                    <div className="divider-container">
                        <hr className="divider" />
                        <span className="divider-text">Or Continue with</span>
                        <hr className="divider" />
                    </div>
                    {/* <p className="divider">Or Continue with</p> */}
                    <div className="social-login">
                        <button className="social-btn">
                            <FcGoogle size={20} />
                            Google
                        </button>

                        <button className="social-btn">
                            <FaGithub size={20} />
                            GitHub
                        </button>

                        <button className="social-btn">
                            <FaLinkedin size={20} />
                            LinkedIn
                        </button>
                    </div>

                </form>
                <div className="signup-link">
                    <p>Don't have an account?</p>
                    <Link to="/signup" className="signup-link-text">Sign Up</Link>
                </div >
            </div >
        </div>
    );


}
export default LoginInPage;