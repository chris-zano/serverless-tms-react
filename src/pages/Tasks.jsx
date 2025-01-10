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
    return daysRemaining === 0 ? "Today" : `${daysRemaining} days from now`;
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
        setTasks(filteredTasks);
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
      <h3 style={{ paddingInline: '2ch' }}>Task List</h3>
      {loading ? (
        <p>Loading tasks...</p>
      ) : fetchError ? (
        <p style={{ color: 'red' }}>{fetchError}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th onClick={() => sortTasks('title')}>Task Title</th>
              <th onClick={() => sortTasks('title')}>Description</th>
              <th onClick={() => sortTasks('status')}>
                <FontAwesomeIcon icon="check-circle" style={{marginRight: '1rem' }} />
                <span>Status</span>
              </th>
              <th onClick={() => sortTasks('due_date')}>
                <FontAwesomeIcon icon="calendar-days" style={{marginRight: '1rem' }} />
                <span>Due Date</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <tr key={task.id}>
                    <td>
                        {index+1}
                    </td>
                  <td>
                    <NavLink to={`/members/tasks/task/${task.id}`}>
                      {task.title}
                    </NavLink>
                  </td>
                  <td>
                    <NavLink to={`/members/tasks/task/${task.id}`}>
                      {task.description}
                    </NavLink>
                  </td>
                  <td>
                    <span className={`task-status ${task.status.toLowerCase().replace(' ', '-')}`}>
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <span className={`task-due-date ${calculateDaysRemainingClass(task.due_date)}`}>
                      {calculateDaysRemaining(task.due_date)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No tasks available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Tasks;
