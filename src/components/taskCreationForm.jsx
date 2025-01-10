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


    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await fetch('https://j5tva2aa4m.execute-api.eu-west-1.amazonaws.com/members');
                if (!response.ok) {
                    throw new Error('Failed to fetch team members');
                }

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
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
            try {

                const taskData = {
                    title: formData.title,
                    description: formData.description,
                    startDate: formData.startDate,
                    dueDate: formData.dueDate,
                    assigned_to: formData.assignedTo
                };

                console.log(taskData);

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
                console.log('Task created:', result);


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
        <div className={`dialog ${isOpen ? 'block' : 'hidden'}`} role="dialog" aria-labelledby="dialog-title">
            <div className="dialog-content">
                <div className="dialog-header">
                    <h3 id="dialog-title">Create New Ticket</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={errors.title ? 'border-red-500' : ''}
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={errors.description ? 'border-red-500' : ''}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className={errors.startDate ? 'border-red-500' : ''}
                            />
                            {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="dueDate">Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className={errors.dueDate ? 'border-red-500' : ''}
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
                                        checked={formData.assignedTo.indexOf(member => member.id === member.Sub) > 0 ? 'true' : 'false'}
                                        // checked={formData.assignedTo.some(member => member.id === member.Sub)}
                                        onChange={() => handleCheckboxChange(member.Sub, member.Email)}
                                    />
                                    <label htmlFor={`member-${member.Sub}`} className="cursor-pointer">
                                        {`${member.Username} (${member.Email})`}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.assignedTo && <p className="text-sm text-red-500">{errors.assignedTo}</p>}
                    </div>

                    <div className="dialog-footer space-x-2">
                        <button type="button" onClick={onClose} className="btn-outline">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Create Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskCreationForm;
