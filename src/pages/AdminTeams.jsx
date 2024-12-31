import { useAuth } from "react-oidc-context";

const AdminTeams = () => {
      const auth = useAuth();
    
    return (
        <div>
        <h1>AdminTeams</h1>
        <p>
            This is the AdminTeams page. It is a public page that anyone can see.
        </p>
        <button onClick={() => auth.removeUser()}>Sign out</button>
        </div>
    );
}

export default AdminTeams;