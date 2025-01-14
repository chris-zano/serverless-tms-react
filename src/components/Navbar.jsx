import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "react-oidc-context";

const NavBar = () => {
  const auth = useAuth();
  const [home, setHome] = useState();
  const isAuthenticated = auth.isAuthenticated;
  const userName = auth.user?.profile["cognito:username"];

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <NavLink to={home}>
          <h2>TMS</h2>
        </NavLink>
      </div>
      <ul className="nav-links">
        {/* <NavLink
          to="tasks"
        >
          Tasks
        </NavLink>
        <NavLink
          to="teams"
        >
          Teams
        </NavLink> */}
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

export default NavBar;
