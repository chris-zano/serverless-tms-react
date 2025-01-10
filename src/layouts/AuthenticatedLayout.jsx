import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import NavBar from "../components/Navbar.jsx";
import decodeJWT from "../data/decode-jwt.js";

const AuthenticatedLayout = () => {
  const auth = useAuth();
  
  if (auth.isAuthenticated) {
    const user_groups = auth.user.profile['cognito:groups']
    console.log(user_groups);
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <NavBar /> 
      <Outlet />
    </>
  );
};

export default AuthenticatedLayout;
