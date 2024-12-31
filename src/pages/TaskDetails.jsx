import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const TaskDetail = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

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
            const response = await fetch(`https://v0cia3z14m.execute-api.eu-west-1.amazonaws.com/tasks/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Task deleted successfully');
                navigator.navigate('/admin/tasks');
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            {loading ? (
                <p>Loading task details...</p>
            ) : fetchError ? (
                <p style={{ color: 'red' }}>{fetchError}</p>
            ) : task ? (
                <div className="task-detail">
                    <h3>{task.title}</h3>
                    <p><strong>Description:</strong> {task.description}</p>
                    <p><strong>Status:</strong> {task.status}</p>
                    <p><strong>Start Date:</strong> {task.start_date}</p>
                    <p><strong>Due Date:</strong> {task.due_date}</p>
                    <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
                        Delete Task
                    </button>
                </div>
            ) : (
                <p>Task not found</p>
            )}
        </div>
    );
};

export default TaskDetail;
