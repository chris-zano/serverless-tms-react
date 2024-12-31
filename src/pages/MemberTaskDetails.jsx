import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

const MemberTaskDetail = () => {
    const auth = useAuth();
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

    const startTask = async (taskId) => {
        try {
            const response = await fetch(`https://iw2vls7a3b.execute-api.eu-west-1.amazonaws.com/tasks/task/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.user?.access_token}`,
                },
                body: JSON.stringify({
                    id: taskId,
                    status: 'in-progress',
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to start task');
            }
    
            const updatedTask = await response.json();
            setTask(updatedTask);
        } catch (error) {
            setFetchError(error.message);
        }
    };

    const completeTask  = async (taskId) => {
        try {
            const response = await fetch(`https://iw2vls7a3b.execute-api.eu-west-1.amazonaws.com/tasks/task/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.user?.access_token}`,
                },
                body: JSON.stringify({
                    id: taskId,
                    status: 'completed',
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to start task');
            }
    
            const updatedTask = await response.json();
            setTask(updatedTask);
        } catch (error) {
            setFetchError(error.message);
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
    
                    {task.status === 'not-started' && (
                        <button 
                            onClick={() => startTask(task.id)} 
                            style={{ backgroundColor: 'green', color: 'white' }}>
                            Start Task
                        </button>
                    )}
    
                    {task.status === 'in-progress' && (
                        <button 
                            onClick={() => completeTask(task.id)} 
                            style={{ backgroundColor: 'blue', color: 'white' }}>
                            Complete Task
                        </button>
                    )}
                </div>
            ) : (
                <p>Task not found</p>
            )}
        </div>
    );
    
};

export default MemberTaskDetail;
