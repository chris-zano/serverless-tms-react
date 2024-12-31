import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { NavLink } from "react-router-dom";

const Tasks = () => {
    const auth = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

  
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

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('https://v0cia3z14m.execute-api.eu-west-1.amazonaws.com/tasks');
                if (!response.ok) {
                    throw new Error('Failed to fetch tasks');
                }
                const data = await response.json();

                const userId = auth.user?.profile?.sub;
                const filteredTasks = data.filter(task => task.assigned_to.includes(userId));
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
        <div>
            <h3 style={{ paddingInline: '2ch' }}>Task List</h3>
            {loading ? (
                <p>Loading tasks...</p>
            ) : fetchError ? (
                <p style={{ color: 'red' }}>{fetchError}</p>
            ) : (
                <ul className="task-list">
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <li key={task.id} className="task-card">
                                <NavLink to={`/members/tasks/task/${task.id}`}>
                                    <div className="task-content">
                                        <h4>{task.title.length > 25 ? task.title.substring(0, 25) + '...' : task.title}</h4>
                                        <span className={`task-status ${task.status.toLowerCase().replace(' ', '-')}`}>
                                            {task.status}
                                        </span>
                                        <p className={`task-due-date ${calculateDaysRemainingClass(task.due_date)}`}>
                                            {calculateDaysRemaining(task.due_date)}
                                        </p>
                                    </div>
                                </NavLink>
                            </li>
                        ))
                    ) : (
                        <li>No tasks available</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Tasks;
