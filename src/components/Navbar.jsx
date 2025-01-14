import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "react-oidc-context";

const NavBar = () => {
  const auth = useAuth();
  const [home, setHome] = useState();
  const isAuthenticated = auth.isAuthenticated;
  const userName = auth.user?.profile["cognito:username"];

  return (
    <nav className="flex w-full justify-between p-4 items-center sticky border-b-2 border-gray-100">
      <div className="nav-brand">
        <NavLink to={home}>
          <h2 className='text-xl font-black hover:text-orange-500'>TMS</h2>
        </NavLink>
      </div>
      <div className="">
        {!isAuthenticated ? (
          <button onClick={() => auth.signinRedirect()} className="sign-in-btn">
            Sign In
          </button>
        ) : (
          <div className=" flex gap-2 items-center">
            <span className="text-xl">👤</span>
            <span>{userName}</span>
            <button onClick={() => auth.removeUser()}
            className='bg-orange-600 px-4 py-2 rounded-lg cursor-pointer text-white font-bold hover:bg-orange-800'
              >Sign out</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
