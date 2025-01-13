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
    console.log(dueDate);
    const now = new Date().getTime();
    const due = new Date(dueDate).getTime();
    console.log({now, due});
    const timeDiff = due - now;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    console.log(daysRemaining);

    if (daysRemaining === 0) return "today";
    if (daysRemaining > 0) return "upcoming";
    if (daysRemaining < 0) return "overdue";
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        "https://v0cia3z14m.execute-api.eu-west-1.amazonaws.com/tasks"
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
          style={{ backgroundColor: "#1ed34c", color: "white" }}
        >
          {isCreatingTask ? "Cancel Creation" : "Create New Task"}
        </button>
      </div>
      {isCreatingTask ? (
        <TaskCreationForm onClose={toggleTaskCreation} />
      ) : (
        <div>
          <h3 style={{ paddingInline: "2ch" }}>Task List</h3>
          {loading ? (
            <p>Loading tasks...</p>
          ) : fetchError ? (
            <p style={{ color: "red" }}>{fetchError}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>No.</th>
                  <th onClick={() => sortTasks("title")}>Task Title</th>
                  <th onClick={() => sortTasks("description")}>Description</th>
                  <th onClick={() => sortTasks("status")}>
                    <FontAwesomeIcon
                      icon="check-circle"
                      style={{ marginRight: "1rem" }}
                    />
                    <span>Status</span>
                  </th>
                  <th onClick={() => sortTasks("due_date")}>
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
                    <tr key={task.id}>
                      <td>{index + 1}</td>
                      <td>
                        <NavLink to={`/admin/tasks/task/${task.id}`}>
                          {task.title}
                        </NavLink>
                      </td>
                      <td>
                        <NavLink to={`/admin/tasks/task/${task.id}`}>
                          {task.description}
                        </NavLink>
                      </td>
                      <td>
                        <span
                          className={`task-status ${task.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {calculateDaysRemainingClass() === "overdue"
                            ? "Overdue"
                            : task.status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`task-due-date ${calculateDaysRemainingClass(
                            task.due_date
                          )}`}
                        >
                          {calculateDaysRemaining(task.due_date)}
                        </span>
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
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTasks;
