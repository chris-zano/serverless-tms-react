import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import User from "../models/user.model.js";

const UnauthenticatedNavBar = () => {
    const auth = useAuth();
    const isAuthenticated = auth.isAuthenticated;
    const userName = auth.user?.profile["cognito:username"];

    const signOutRedirect = () => {
        const clientId = "1iuqdni6sn39h36qune4dhcp3a";
        const logoutUri = "http://localhost:5173";
        const cognitoDomain = "https://eu-west-1xep7m4wpv.auth.eu-west-1.amazoncognito.com";
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };

    async function getUser() {
        const navigate = useNavigate(); 

        if (isAuthenticated) {
            const { email, sub } = auth.user.profile;
            const username = auth.user.profile["cognito:username"];

            const user = new User(sub, email, "member", username);
            const userExists = await user.checkUser();

            if (!userExists['status']) {
                await user.createUser();
                navigate("/members");
            } else {
                const _user = userExists['message'];
                if (_user.role === "member") {
                    console.log("User is a member");
                    navigate("/members"); 
                } else if (_user.role === "admin") {
                    console.log("User is an admin");
                    navigate("/admin"); 
                }
            }
        }
    }

    getUser();


    return (
        <nav className="navbar">
            <div className="nav-brand">
                <h2>TMS</h2>
            </div>
            <ul className="nav-links">
                <li>Home</li>
                <li>Teams</li>
                <li>Tasks</li>
            </ul>
            <div className="auth-section">
                {!isAuthenticated ? (
                    <button onClick={() => auth.signinRedirect()} className="sign-in-btn">
                        Sign In
                    </button>
                ) : (
                    <div className="profile">
                        <span className="profile-icon">👤</span>
                        <span>{userName}</span>
                        <button onClick={() => signOutRedirect()}>Sign out</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default UnauthenticatedNavBar;
