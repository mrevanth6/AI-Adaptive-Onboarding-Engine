import React from "react";
import { NavLink } from "react-router-dom";
import { CircleUserRound, Menu } from "lucide-react"
import "./Header.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Header() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    function handleLogOut() {
        setExpanded(false);
        setOpen(false);
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
    }

    return (
        <header className="header">
            <div className='header-wrapper'>
                <h2>AI Resume Analyzer</h2>
            </div>
            <div className='menu-icon' onClick={() => setExpanded(!expanded)}>
                <Menu size={24} />
            </div>
            {expanded && (
                <div className='dropdown-menu'>
                    <div className='menu-item'>
                        <NavLink to="/analyzer" className="dropdown-link" onClick={() => setExpanded(false)}>
                            Generate Roadmap
                        </NavLink>
                    </div>
                    <div className='menu-item'>
                        <NavLink to="/saved-roadmaps" className="dropdown-link" onClick={() => setExpanded(false)}>
                            Saved Roadmaps
                        </NavLink>
                    </div>
                    <div className='menu-item'>
                        <NavLink to="/profile" className="dropdown-link" onClick={() => setExpanded(false)}>
                            Profile
                        </NavLink>
                    </div>
                    <div className='menu-item'>
                        <NavLink to="/login" className="dropdown-link" onClick={() => {
                            handleLogOut();
                            setExpanded(false);
                        }}>
                            Logout
                        </NavLink>
                    </div>

                </div>
            )}

            <div className='menu-container'>
                <div className='menu-cards'>
                    <NavLink to="/analyzer" className="menu-link">
                        Generate Roadmap
                    </NavLink>
                </div>
                <div className='menu-cards'>
                    <NavLink to="/saved-roadmaps" className="menu-link">
                        Saved Roadmaps
                    </NavLink>
                </div>
                <div className='profile-container' onClick={() => setOpen(!open)}>

                    <CircleUserRound size={24} className="profile-icon" />

                </div>
                {open && (
                    <div className='dropdown-menu' onClick={() => setOpen(false)}>
                        <NavLink to="/profile" className="dropdown-link">
                            Profile
                        </NavLink>
                        <NavLink to="/login" className="dropdown-link" onClick={handleLogOut}>
                            Logout
                        </NavLink>
                    </div>
                )}
            </div>


        </header >
    );
}

export default Header;