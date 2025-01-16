import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons';

// Helper function to format date to human-readable format
const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);

    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
        day === 2 || day === 22 ? 'nd' :
            day === 3 || day === 23 ? 'rd' : 'th';

    const formattedDate = date.toLocaleDateString('en-GB', options); // Format to "Sun, 3rd March 2025"

    return formattedDate.replace(day, `${day}${suffix}`);
};

const TaskDetail = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [newStartDate, setNewStartDate] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [teamMembers, setTeamMembers] = useState([]);

    const navigator = useNavigate();

    // Fetch the task details from the API
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await fetch(`https://fkmhrzyttd.execute-api.eu-west-1.amazonaws.com/tasks/task?id=${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch task');
                }
                const data = await response.json();
                setTask(data);
                setNewStartDate(data.start_date);
                setNewDueDate(data.due_date);
                setNewStatus(data.status);
                setAssignedUsers(data.assigned_to);
            } catch (error) {
                setFetchError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    // Handle task deletion
    const handleDelete = async () => {
        try {
            const response = await fetch(`https://9d4a8pap3d.execute-api.eu-west-1.amazonaws.com/tasks/delete?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Task deleted successfully');
                navigator('/admin/tasks');
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await fetch('https://j5tva2aa4m.execute-api.eu-west-1.amazonaws.com/members');
                if (!response.ok) {
                    throw new Error('Failed to fetch team members');
                }

                if (response.ok) {
                    const data = await response.json();
                    setTeamMembers(data);
                }
                else {
                    setTeamMembers([])
                }

            } catch (error) {
                setFetchError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamMembers();
    }, []);

    // Handle the update of task
    const handleUpdate = async (e) => {
        if (task.status === 'completed') {
            alert('Task is already completed');
            return;
        }
        e.preventDefault();
        try {
            const updatedTask = { id, title: task.title, description: task.description, start_date: newStartDate, due_date: newDueDate, status: newStatus, assigned_to: assignedUsers };

            console.log({ updatedTask });

            const response = await fetch('https://iw2vls7a3b.execute-api.eu-west-1.amazonaws.com/tasks/task/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedTask),
            });
            if (response.ok) {
                alert('Task updated successfully');
            } else {
                throw new Error('Failed to update task');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <>
            <div className="flex justify-center items-start h-screen bg-gray-100 p-5">
                {loading ? (
                    <p className="text-gray-800">Loading task details...</p>
                ) : fetchError ? (
                    <p className="text-red-500">{fetchError}</p>
                ) : task ? (
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                        <form onSubmit={handleUpdate}>
                            {/* Title */}
                            <div>
                                <strong className="text-gray-800 mb-2">Title</strong>
                                <input
                                    type="text"
                                    value={task.title}
                                    onChange={(e) => setTask({ ...task, title: e.target.value })}
                                    className="text-gray-800 mb-4 border py-2 px-4 rounded-md mt-2 w-full"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <strong className="text-gray-800 mb-2">Description</strong>
                                <textarea
                                    value={task.description}
                                    onChange={(e) => setTask({ ...task, description: e.target.value })}
                                    className="text-gray-800 mb-4 border py-2 px-4 rounded-md mt-2 w-full"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <strong className="text-gray-800 mb-2">Status</strong>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    disabled
                                    className="text-gray-800 mb-4 border py-2 px-4 rounded-md mt-2 w-full"
                                >
                                    {['not-started', 'in-progress', 'completed'].map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Start Date (conditionally editable) */}
                            <div className="flex justify-between">
                                <div>
                                    <strong className="text-gray-800">Start Date:</strong>
                                    <input
                                        type="date"
                                        value={newStartDate}
                                        onChange={(e) => setNewStartDate(e.target.value)}
                                        disabled={newStatus !== 'not-started'}  // Disable if the status is "not-started"
                                        className="text-gray-800 mb-4 border py-2 px-4 rounded-md mt-2 w-full"
                                    />
                                </div>

                                {/* Due Date */}
                                <div>
                                    <strong className="text-gray-800">Due Date:</strong>
                                    <input
                                        type="date"
                                        value={newDueDate}
                                        onChange={(e) => setNewDueDate(e.target.value)}
                                        className="text-gray-800 mb-4 border py-2 px-4 rounded-md mt-2 w-full"
                                    />
                                </div>
                            </div>

                            {/* Assigned Users */}
                            <div className="mb-4">
                                <strong className="text-gray-800">Assigned Users:</strong>
                                <div className="flex flex-col gap-1">
                                    {task.assigned_to.map((user, index) => (
                                        <label key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                value={user.id}
                                                checked={assignedUsers.some((assignedUser) => assignedUser.id === user.id)}
                                                onChange={() => {
                                                    setAssignedUsers(prevAssignedUsers =>
                                                        prevAssignedUsers.some((assignedUser) => assignedUser.id === user.id)
                                                            ? prevAssignedUsers.filter((assignedUser) => assignedUser.id !== user.id)
                                                            : [...prevAssignedUsers, user]
                                                    );
                                                }}
                                            />
                                            <span className="ml-2 font-semibold">{user.email}</span>
                                        </label>
                                    ))}
                                    {teamMembers.map((teamMember, index) => {
                                        <p>{task.assigned_to.some((user) => user.id === teamMember.Sub)}</p>
                                        if (!task.assigned_to.some((user) => user.id === teamMember.Sub)) {
                                            return (<label key={index} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={teamMember.Sub}
                                                    onChange={() => {
                                                        setAssignedUsers(prevAssignedUsers =>
                                                            prevAssignedUsers.some((assignedUser) => assignedUser.id === teamMember.Sub)
                                                                ? prevAssignedUsers.filter((assignedUser) => assignedUser.id !== teamMember.Sub)
                                                                : [...prevAssignedUsers, { email: teamMember.Email, id: teamMember.Sub }]
                                                        );
                                                    }}
                                                />
                                                <span className="ml-2 font-semibold">{teamMember.Email}</span>
                                            </label>)
                                        }
                                    })}
                                </div>
                            </div>

                            <details className='cursor-pointer p-4 mb-4 rounded-md'>
                                <summary>Completed By</summary>
                                <div>
                                    <ul className='mt-3'>
                                        { task.completed_by.map(user => (
                                            <li key={user.id} className='cursor-pointer p-4 border border-gray-100 rounded-md'>
                                                <span><strong>Username</strong>: {user.username}</span><br />
                                                <span><strong>Email</strong>: {user.email}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </details>

                            {/* Update and Delete Buttons */}
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition-all"
                                >
                                    Update Task
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="border border-pink-600 text-black font-semibold hover:bg-gray-100 transition-all px-6 py-2 rounded-md"
                                >
                                    Delete Task
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <p className="text-gray-800"></p>
                )}

                <br />

            </div>
        </>
    );
};

export default TaskDetail;
