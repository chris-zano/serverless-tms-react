import { Outlet } from "react-router-dom";
import UnauthenticatedNavBar from "../components/UnauthenticatedNavbar.jsx";

const PublicLayout = () => {
  return (
    <>
      <UnauthenticatedNavBar /> 
      <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        sign in to continue...
      </div>
    </>
  );
};

export default PublicLayout;
