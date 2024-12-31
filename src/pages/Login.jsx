import { useAuth } from "react-oidc-context";

const Login = () => {
  const auth = useAuth();

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
  );
};

export default Login;
