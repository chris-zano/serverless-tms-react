import React from 'react';
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

const UnauthenticatedNavBar = () => {
    const auth = useAuth();
    const isAuthenticated = auth.isAuthenticated;
    const userName = auth.user?.profile["cognito:username"];

    const signOutRedirect = () => {
        const clientId = "1iuqdni6sn39h36qune4dhcp3a";
        const logoutUri = "http://localhost:5173/";
        const cognitoDomain = "https://eu-west-1xep7m4wpv.auth.eu-west-1.amazoncognito.com";
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };

    async function getUser() {
        const navigate = useNavigate(); 

        if (isAuthenticated) {
            const { email, sub } = auth.user.profile;
            const username = auth.user.profile["cognito:username"];
            const userGroups = auth.user.profile['cognito:groups'];

            if (userGroups && userGroups.includes("Administrators")) {
                console.log("User is an admin");
                navigate("/admin/tasks");
            }
            else if (userGroups && userGroups.includes("Team-Members")) {
                console.log("User is a member");
                navigate("/members/tasks");
            }
            else {
                console.log("User is neither an admin nor a member");
                alert("User is neither an admin nor a member.Please select")
                // TODO: Place user in members group
                signOutRedirect();
            }
        }
    }

    getUser();


    return (
        <nav className="navbar">
            <div className="nav-brand">
                <h2>TMS</h2>
            </div>
            <ul className="nav-links" style={{cursor: "no-drop"}}>
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
                        <button onClick={() => auth.removeUser()}>Sign out</button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default UnauthenticatedNavBar;
