import React, { useState, useEffect } from 'react';

const TaskCreationForm = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        dueDate: '',
        assignedTo: []
    });

    const [errors, setErrors] = useState({});
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [isSubmitting, setSubmissionState] = useState(false)


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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleCheckboxChange = (id, email) => {
        const oldAssignedTo = formData.assignedTo;
        const userAssigned = oldAssignedTo.find((member) => member.id === id);
        
        if (userAssigned) {
            
            setFormData(prev => ({
                ...prev,
                assignedTo: oldAssignedTo.filter((member) => member.id !== id)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                assignedTo: [...oldAssignedTo, { id, email }]
            }));
        }
    };


    const handleLoadingSubmission = async (event) => {
        if (isSubmitting) {
            event.target.textContent = 'Loading...';
            event.target.style.backgroundColor = 'gray';
            return;
        }
    }

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required';
        } else if (formData.startDate && new Date(formData.dueDate) < new Date(formData.startDate)) {
            newErrors.dueDate = 'Due date must be after start date';
        }

        if (formData.assignedTo.length === 0) {
            newErrors.assignedTo = 'Please assign to at least one team member';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            setSubmissionState(true)
            try {

                const taskData = {
                    title: formData.title,
                    description: formData.description,
                    startDate: formData.startDate,
                    dueDate: formData.dueDate,
                    assigned_to: formData.assignedTo
                };


                const response = await fetch('https://c0sl1f9s07.execute-api.eu-west-1.amazonaws.com/Development/tasks/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(taskData)
                });


                if (!response.ok) {
                    throw new Error('Failed to submit task');
                }


                const result = await response.json();


                setFormData({
                    title: '',
                    description: '',
                    startDate: '',
                    dueDate: '',
                    assignedTo: []
                });
                setErrors({});
                onClose();

            } catch (error) {
                console.error('Error submitting form:', error);
                setFetchError(error.message);
            }
        } else {
            setErrors(newErrors);
        }
    };


    if (loading) {
        return <p>Loading team members...</p>;
    }

    if (fetchError) {
        return <p className="text-red-500">{fetchError}</p>;
    }

    return (
        <div className={`dialog ${isOpen ? 'flex ' : 'hidden'}  justify-center w-full px-4 py-8`} role="dialog" aria-labelledby="dialog-title">
            <div className="dialog-content">
                

                <form onSubmit={handleSubmit} 
                className="space-y-7 border motion-preset-expand border-gray-900/10 p-6 rounded-lg motion-preset-expand ">
                <div className="dialog-header">
                    <h3 id="dialog-title" className='font-bold text-xl'>Create New Ticket</h3>
                </div>
                    <div className="space-y-2">
                        <label className='block text-sm/6 font-medium text-gray-900' htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className='border border-gray-300 rounded-lg w-full p-2'
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className='block text-sm/6 font-medium text-gray-900' htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className='block text-sm/6 font-medium text-gray-900' htmlFor="startDate">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className='border border-gray-300 rounded-lg w-full p-2'
                            />
                            {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className='block text-sm/6 font-medium text-gray-900' htmlFor="dueDate">Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className='border border-gray-300 rounded-lg w-full p-2'
                            />
                            {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label>Assign To</label>
                        <div className="space-y-2">
                            {teamMembers && teamMembers.map(member => (
                                <div key={member.Sub} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`member-${member.Sub}`}
                                        checked={formData.assignedTo.some((m) => m.id === member.Sub)}
                                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                        onChange={() => handleCheckboxChange(member.Sub, member.Email)}
                                    />
                                    <label className='block text-sm/6 font-medium text-gray-900' htmlFor={`member-${member.Sub}`}>
                                        {`${member.Username} (${member.Email})`}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.assignedTo && <p className="text-sm text-red-500">{errors.assignedTo}</p>}
                    </div>

                    <div className="dialog-footer space-x-2 flex justify-end">
                        <button type="button" onClick={onClose} className="border px-4 py-2 rounded-md hover:bg-gray-100">
                            Cancel
                        </button>
                        <button type="submit" 
                        className="px-4 py-2 bg-green-500 rounded-md text-white font-bold hover:bg-green-600" 
                        style={{marginLeft: '1rem'}}
                        onClick={handleLoadingSubmission}
                        >
                            Create Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskCreationForm;
