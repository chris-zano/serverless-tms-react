import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

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
                const response = await fetch(`https://49sb9n3ej2.execute-api.eu-west-1.amazonaws.com/tasks/get-one?id=${id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${auth.user.access_token}`,
                            "Content-Type": "application/json",
                        },

                    })
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
        if (!auth.isAuthenticated) {
            alert('You need to be logged in to start a task');
            return;
        }
        const user_id = auth.user?.profile.sub;
        const user_email = auth.user?.profile.email;
        const user_name = auth.user?.profile['cognito:username'];

        const user_data = {
            id: user_id,
            email: user_email,
            username: user_name,
        };

        try {
            const response = await fetch(`https://49sb9n3ej2.execute-api.eu-west-1.amazonaws.com/tasks/update-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.user?.access_token}`,
                },
                body: JSON.stringify({
                    user: user_data,
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

    const completeTask = async (taskId) => {
        if (!auth.isAuthenticated) {
            alert('You need to be logged in to start a task');
            return;
        }
        const user_id = auth.user?.profile.sub;
        const user_email = auth.user?.profile.email;
        const user_name = auth.user?.profile['cognito:username'];

        const user_data = {
            id: user_id,
            email: user_email,
            username: user_name,
        };
        try {
            const response = await fetch(`https://49sb9n3ej2.execute-api.eu-west-1.amazonaws.com/tasks/update-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${auth.user?.access_token}`,
                },
                body: JSON.stringify({
                    user: user_data,
                    id: taskId,
                    status: 'completed',
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to complete task');
            }

            const updatedTask = await response.json();
            setTask(updatedTask);
        } catch (error) {
            setFetchError(error.message);
        }
    };

    return (
        <div className='w-full flex justify-center mt-6 p-4'>
            {loading ? (
                <p>Loading task details...</p>
            ) : fetchError ? (
                <p className=''>{fetchError}</p>
            ) : task ? (
                <div className='flex-col justify-center items-center py-6 px-4 shadow-xl rounded-md'>
                    <div>
                        <h2 className='text-xl font-bold'>Title</h2>
                        <h3 className='p-[1ch] border border-gray-300 rounded-md my-2 w-80'>{task.title}</h3>
                    </div>
                    <div>
                        <strong>Description:</strong>
                        <p className='p-[1ch] border border-gray-300 rounded-md my-2 w-80'>{task.description}</p>
                    </div>
                    <div>
                        <strong>Status:</strong>
                        <p className='p-[1ch] border border-gray-300 rounded-md my-2 w-80'>{task.status}</p>
                    </div>
                    <div className='flex-col justify-between gap-3'>
                        <div>
                            <strong>Start Date:</strong>
                            <p className='text-sm p-[1ch] border border-gray-300 rounded-md'>{formatDate(task.start_date)}</p>
                        </div>
                        <div>
                            <strong>Due Date:</strong>
                            <p className='text-sm p-[1ch] border border-gray-300 rounded-md'>{formatDate(task.due_date)}</p>
                        </div>
                    </div>

                    {task.status === 'not-started' && (
                        <button
                            className='mt-4 float-end px-4 py-2 bg-green-500 rounded-md text-white font-bold hover:bg-green-600'
                            onClick={() => startTask(task.id)}
                        >
                            Start Task
                        </button>
                    )}

                    {task.status === 'in-progress' && (
                        <button
                            className='mt-4 float-end px-4 py-2 bg-blue-500 rounded-md text-white font-bold hover:bg-blue-600'

                            onClick={() => completeTask(task.id)}
                        >
                            Complete Task
                        </button>
                    )}

                    {task.status === 'completed' && (
                        <div
                            className='mt-4 float-end px-4 py-2  rounded-md text-blue-500'
                        >
                            Task Completed
                        </div>
                    )}

                </div>
            ) : (
                <p>Task not found</p>
            )}
        </div>
    );
};

export default MemberTaskDetail;
