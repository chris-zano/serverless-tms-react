import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import NavBar from "../components/Navbar.jsx";

const AuthenticatedLayout = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <NavBar /> 
      <Outlet />
    </>
  );
};

export default AuthenticatedLayout;
