import React from "react";
import { NavLink } from "react-router-dom";
import { CircleUserRound } from "lucide-react"
import "./Header.css";
function Header() {

    return (
        <header className="header">
            <div className='header-wrapper'>
                <h2>AI Resume Analyzer</h2>
            </div>
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
                <div className='menu-cards'>
                    <NavLink to="/profile" className="menu-link ">
                        <CircleUserRound size={20} className="profile-icon" />
                    </NavLink>
                </div>
            </div>


        </header >
    );
}

export default Header;