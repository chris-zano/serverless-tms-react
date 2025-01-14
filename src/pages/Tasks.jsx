import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const Tasks = () => {
  const auth = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'due_date', direction: 'asc' });
  const [completedTasks, setCompletedTasks] = useState([]);

  const formatDate = (dueDate) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dueDate);
    return date.toLocaleDateString('en-GB', options);
  };

  const calculateDaysRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysRemaining === 0 ? "Today" : daysRemaining === 1 ? `${daysRemaining} day from now` : `${daysRemaining} days from now`;
  };

  const calculateDaysRemainingClass = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due - now;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysRemaining === 0) {
      return 'today';
    } else if (daysRemaining > 0) {
      return 'upcoming';
    } else {
      return 'overdue';
    }
  };

  const sortTasks = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });

    const sortedTasks = [...tasks].sort((a, b) => {
      if (key === 'due_date') {
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (key === 'status') {
        const statusA = a.status.toLowerCase();
        const statusB = b.status.toLowerCase();
        return direction === 'asc' ? statusA.localeCompare(statusB) : statusB.localeCompare(statusA);
      }
      return 0;
    });

    setTasks(sortedTasks);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://v0cia3z14m.execute-api.eu-west-1.amazonaws.com/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();

        const userId = auth.user?.profile?.sub;
        const filteredTasks = data.filter(task => task.assigned_to.some(user => user.id === userId));
        const scheduled_tasks = filteredTasks.filter(task => task.status !== "completed");
        const completed_tasks = filteredTasks.filter(task => task.status === "completed");
        setTasks(scheduled_tasks);
        setCompletedTasks(completed_tasks);
      } catch (error) {
        setFetchError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [auth.user]);

  return (
    <div className="table-wrap">
      <div className="flex justify-center w-full px-4">
        <table className="table-auto w-full motion-preset-blur-right ">
          <thead className="bg-gray-300 cursor-pointer">
            <tr>
              <th className="border border-gray-400">No.</th>
              <th className="border border-gray-400" onClick={() => sortTasks("title")}>Task Title</th>
              <th className="border border-gray-400" onClick={() => sortTasks("description")}>Description</th>
              <th className="border border-gray-400" onClick={() => sortTasks("status")}>
                <FontAwesomeIcon
                  icon="check-circle"
                  style={{ marginRight: "1rem" }}
                />
                <span>Status</span>
              </th>
              <th className="border border-gray-400" onClick={() => sortTasks("due_date")}>
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
                  <td className="border border-gray-400 text-center">
                    <NavLink to={`/members/tasks/task/${task.id}`}>{index + 1}</NavLink>

                  </td>
                  <td className="border border-gray-400 text-center">
                    <NavLink to={`/members/tasks/task/${task.id}`}>
                      {task.title}
                    </NavLink>
                  </td>
                  <td className="border border-gray-400 text-center">
                    <NavLink to={`/members/tasks/task/${task.id}`}>
                      {task.description}
                    </NavLink>
                  </td>
                  <td className="border border-gray-400 text-center">
                    <NavLink to={`/members/tasks/task/${task.id}`}>
                      <span
                        className={`task-status ${task.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {calculateDaysRemainingClass(task.due_date) === "overdue"
                          ? "Overdue"
                          : task.status}
                      </span>
                    </NavLink>
                  </td>
                  <td className="border border-gray-400 text-center">
                    <NavLink to={`/members/tasks/task/${task.id}`}>
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

      <div className="mt-[4rem] px-4">
        <details className="cursor-pointer p-4 border border-gray-100 rounded-md">
          <summary className="cursor-pointer">Completed tasks</summary>
          <div>
            <div className="flex justify-center w-full px-4">
              <table className="table-auto w-full  ">
                <thead className="bg-gray-300 cursor-pointer">
                  <tr>
                    <th className="border border-gray-400">No.</th>
                    <th className="border border-gray-400" onClick={() => sortTasks("title")}>Task Title</th>
                    <th className="border border-gray-400" onClick={() => sortTasks("description")}>Description</th>
                    <th className="border border-gray-400" onClick={() => sortTasks("status")}>
                      <FontAwesomeIcon
                        icon="check-circle"
                        style={{ marginRight: "1rem" }}
                      />
                      <span>Status</span>
                    </th>
                    <th className="border border-gray-400" onClick={() => sortTasks("due_date")}>
                      <FontAwesomeIcon
                        icon="calendar-days"
                        style={{ marginRight: "1rem" }}
                      />
                      <span>Due Date</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {completedTasks.length > 0 ? (
                    completedTasks.map((task, index) => (
                      <tr key={task.id} className="cursor-pointer hover:bg-gray-100">
                        <td className="border border-gray-400 text-center">
                          <NavLink to={`/members/tasks/task/${task.id}`}>{index + 1}</NavLink>

                        </td>
                        <td className="border border-gray-400 text-center">
                          <NavLink to={`/members/tasks/task/${task.id}`}>
                            {task.title}
                          </NavLink>
                        </td>
                        <td className="border border-gray-400 text-left">
                          <NavLink to={`/members/tasks/task/${task.id}`}>
                            {task.description}
                          </NavLink>
                        </td>
                        <td className="border border-gray-400 text-center">
                          <NavLink to={`/members/tasks/task/${task.id}`}>
                            <span
                              className={`task-status ${task.status
                                .toLowerCase()
                                .replace(" ", "-")}`}
                            >
                              {calculateDaysRemainingClass(task.due_date) === "overdue"
                                ? "Overdue"
                                : task.status}
                            </span>
                          </NavLink>
                        </td>
                        <td className="border border-gray-400 text-center">
                          <NavLink to={`/members/tasks/task/${task.id}`}>
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
          </div>
        </details>
      </div>

    </div>
  );
};

export default Tasks;
