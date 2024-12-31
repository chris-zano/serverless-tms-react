
import { useAuth } from "react-oidc-context";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Teams from "./pages/Teams.jsx";
import Tasks from "./pages/Tasks.jsx";
import AdminTeams from "./pages/AdminTeams.jsx";
import AdminTasks from "./pages/AdminTasks.jsx";



const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />
  },
  {
    path: "/admin",
    element: <AuthenticatedLayout />,
    children: [
      { index: true, element: <AdminTasks /> },
      { path: "teams", element: <AdminTeams /> ,},
      { path: "tasks", element: <AdminTasks /> },
    ],
  },
  {
    path: "/members",
    element: <AuthenticatedLayout />,
    children: [
      { index: true, element: <Tasks /> },
      { path: "teams", element: <Teams /> ,},
      { path: "tasks", element: <Tasks /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;