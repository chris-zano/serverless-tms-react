import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "react-oidc-context";

const NavBar = () => {
  const auth = useAuth();
  const isAuthenticated = auth.isAuthenticated;
  const userName = auth.user?.profile["cognito:username"];

  const signOutRedirect = () => {
    const clientId = "1iuqdni6sn39h36qune4dhcp3a";
    const logoutUri = "http://localhost:5173";
    const cognitoDomain = "https://eu-west-1xep7m4wpv.auth.eu-west-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };


  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>TMS</h2>
      </div>
      <ul className="nav-links">
      <li>
          <NavLink to="tasks" className={({ isActive }) => isActive ? 'active' : ''}>Tasks</NavLink>
        </li>
        <li>
          <NavLink to="teams" className={({ isActive }) => isActive ? 'active' : ''}>Teams</NavLink>
        </li>
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

export default NavBar;
