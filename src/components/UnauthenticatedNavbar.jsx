import React from 'react';
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { REDIRECT_URL } from '../data/contants.js';

const UnauthenticatedNavBar = () => {
    const auth = useAuth();
    const isAuthenticated = auth.isAuthenticated;
    const userName = auth.user?.profile["cognito:username"];

    const signOutRedirect = () => {
        const clientId = "1iuqdni6sn39h36qune4dhcp3a";
        const logoutUri = REDIRECT_URL;
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
                auth.removeUser();
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
        <nav className="flex w-full justify-between p-4 items-center sticky border-b-2 border-gray-100">
            <div className="nav-brand">
                <h2 className='text-xl font-black' >TMS</h2>
            </div>
            <ul className="nav-links" style={{cursor: "no-drop"}}>
            </ul>
            <div className="auth-section">
                {!isAuthenticated ? (
                    <button onClick={() => auth.signinRedirect()} className="bg-orange-600 px-4 py-2 rounded-lg cursor-pointer text-white font-bold hover:bg-orange-800">
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
