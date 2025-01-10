import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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

    // Inline styles for the component
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'start',
            height: '100vh',
            backgroundColor: '#121212',
            color: '#fff',
            padding: '20px',
        },
        taskDetail: {
            backgroundColor: '#1e1e1e',
            padding: '20px',
            borderRadius: '2ch',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            width: '90%',
            maxWidth: '500px',
        },
        button: {
            backgroundColor: '#e91e63',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '10px 20px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        buttonHover: {
            backgroundColor: '#c2185b',
        },
        error: {
            color: 'red',
        },
        heading: {
            fontSize: '1.8rem',
            marginBottom: '20px',
        },
        paragraph: {
            fontSize: '1rem',
            marginBottom: '10px',
        },
    };

    return (
        <div style={styles.container}>
            {loading ? (
                <p>Loading task details...</p>
            ) : fetchError ? (
                <p style={styles.error}>{fetchError}</p>
            ) : task ? (
                <div style={styles.taskDetail}>
                    <h3 style={styles.heading}>{task.title}</h3>
                    <p style={styles.paragraph}><strong>Description:</strong> {task.description}</p>
                    <p style={styles.paragraph}><strong>Status:</strong> {task.status}</p>
                    <p style={styles.paragraph}><strong>Start Date:</strong> {formatDate(task.start_date)}</p>
                    <p style={styles.paragraph}><strong>Due Date:</strong> {formatDate(task.due_date)}</p>
                    <button
                        style={styles.button}
                        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                        onClick={handleDelete}
                    >
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
