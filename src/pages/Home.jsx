import { useAuth } from "react-oidc-context";

const Home = () => {
      const auth = useAuth();
    
    return (
        <div>
        <h1>Home</h1>
        <p>
            This is the home page. It is a public page that anyone can see.
        </p>
        <button onClick={() => auth.removeUser()}>Sign out</button>
        </div>
    );
}

export default Home;