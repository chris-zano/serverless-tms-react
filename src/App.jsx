
import { useAuth } from "react-oidc-context";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import PublicLayout from "./layouts/PublicLayout";
import NotFound from "./pages/NotFound";
import Tasks from "./pages/Tasks.jsx";
import AdminTasks from "./pages/AdminTasks.jsx";
import TaskDetail from "./pages/TaskDetails.jsx";
import MemberTaskDetail from "./pages/MemberTaskDetails.jsx";



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
      { path: "tasks", element: <AdminTasks />,},
      { path: "tasks/task/:id", element: <TaskDetail />},
    ],
  },
  {
    path: "/members",
    element: <AuthenticatedLayout />,
    children: [
      { index: true, element: <Tasks /> },
      { path: "tasks", element: <Tasks /> },
      { path: "tasks/task/:id", element: <MemberTaskDetail />},

    ],
  },
  { path: "*", element: <NotFound /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;