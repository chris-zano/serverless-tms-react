import { useAuth } from "react-oidc-context";

const AdminTasks = () => {
      const auth = useAuth();
    
    return (
        <div>
        <h1>AdminTasks</h1>
        <p>
            This is the AdminTasks page. It is a public page that anyone can see.
        </p>
        <button onClick={() => auth.removeUser()}>Sign out</button>
        </div>
    );
}

export default AdminTasks;