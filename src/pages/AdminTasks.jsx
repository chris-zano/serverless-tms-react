import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import TaskCreationForm from "../components/taskCreationForm.jsx";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminTasks = () => {
  const auth = useAuth();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });

  const toggleTaskCreation = () => {
    console.log(isCreatingTask);
    setIsCreatingTask(!isCreatingTask);
  };

  const calculateDaysRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysRemaining === 0 ? "Today" : daysRemaining < 0 ? "Overdue" : daysRemaining === 1 ? `${daysRemaining} day from now` : `${daysRemaining} days from now`;
  };

  const calculateDaysRemainingClass = (dueDate) => {
    const now = new Date().getTime();
    const due = new Date(dueDate).getTime();
    const timeDiff = due - now;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysRemaining === 0) return "today";
    if (daysRemaining > 0) return "upcoming";
    if (daysRemaining < 0) return "overdue";
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "https://49sb9n3ej2.execute-api.eu-west-1.amazonaws.com/tasks",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.user.access_token}`,
            "Content-Type": "application/json",
          },
        
        }
      );
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const sortTasks = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedTasks = [...tasks].sort((a, b) => {
      if (key === "due_date") {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      } else if (key === "title" || key === "status") {
        return direction === "ascending"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
      return 0;
    });

    setTasks(sortedTasks);
    setSortConfig({ key, direction });
  };

  return (
    <div className="table-wrap">
      <div style={{ textAlign: "right", padding: "1ch 2ch" }}>
        <button
          onClick={toggleTaskCreation}
          className={
            isCreatingTask ?
              "px-4 py-2 border border-gray-300 hover:bg-gray-100 rounded-md text-black font-medium"
              :
              "px-4 py-2 bg-green-500 rounded-md text-white font-bold hover:bg-green-600"
          }
        >
          {isCreatingTask ? "Cancel Creation" : "New Task"}
        </button>
      </div>
      {isCreatingTask ? (
        <TaskCreationForm isOpen={toggleTaskCreation} onClose={toggleTaskCreation} />
      ) : (
        <div>
          {loading ? (
            <p>Loading tasks...</p>
          ) : fetchError ? (
            <p style={{ color: "red" }}>{fetchError}</p>
          ) : (
            <div className="flex justify-center w-full px-12">
              <table className="table-auto w-full motion-preset-blur-right rounded-l-full">
                <thead className="bg-gray-200 cursor-pointer">
                  <tr>
                    <th className="py-4 px-4 rounded-tl-[5ch]">No.</th>
                    <th className="py-4 px-4 text-left" onClick={() => sortTasks("title")}>Task Title</th>
                    <th className="py-4 px-4 text-left" onClick={() => sortTasks("description")}>Description</th>
                    <th className="py-4 px-4 text-left" onClick={() => sortTasks("status")}>
                      <FontAwesomeIcon
                        icon="check-circle"
                        style={{ marginRight: "1rem" }}
                      />
                      <span>Status</span>
                    </th>
                    <th className="py-4 px-4 rounded-tr-[5ch] text-left" onClick={() => sortTasks("due_date")}>
                      <FontAwesomeIcon
                        icon="calendar-days"
                        style={{ marginRight: "1rem" }}
                      />
                      <span>Due Date</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length > 0 ? (
                    tasks.map((task, index) => (
                      <tr key={task.id} className="cursor-pointer hover:bg-gray-100">
                        <td className="py-4 px-4 text-center">
                          <NavLink to={`/admin/tasks/task/${task.id}`}>{index + 1}</NavLink>

                        </td>
                        <td className="py-4 px-4 text-left">
                          <NavLink to={`/admin/tasks/task/${task.id}`}>
                            {task.title}
                          </NavLink>
                        </td>
                        <td className="py-4 px-4 text-left">
                          <NavLink to={`/admin/tasks/task/${task.id}`}>
                            {task.description}
                          </NavLink>
                        </td>
                        <td className="py-4 px-4 text-left">
                          <NavLink to={`/admin/tasks/task/${task.id}`}>
                            <span
                              className={`task-status ${task.status
                                .toLowerCase()
                                .replace(" ", "-")}`}
                            >
                              {calculateDaysRemainingClass() === "overdue"
                                ? "Overdue"
                                : task.status}
                            </span>
                          </NavLink>
                        </td>
                        <td className="py-4 px-4 text-left">
                          <NavLink to={`/admin/tasks/task/${task.id}`}>
                            <span
                              className={`task-due-date ${calculateDaysRemainingClass(
                                task.due_date
                              )}`}
                            >
                              {calculateDaysRemaining(task.due_date)}
                            </span>
                          </NavLink>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No tasks available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
