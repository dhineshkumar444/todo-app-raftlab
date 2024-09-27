// src/Components/TaskManager.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addTask, updateTask, deleteTask } from '../store/taskSlice';
import  Fields  from '../model/TaskFields';
import TaskList from './TaskList';
import { AiOutlineSearch } from 'react-icons/ai'; // Search icon

const TaskManager: React.FC = () => {
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const dispatch = useDispatch();

    const [task, setTask] = useState<Partial<Fields>>({});
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredTasks, setFilteredTasks] = useState<Fields[]>(tasks);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // State to manage sort order

    const titleInputRef = useRef<HTMLInputElement | null>(null); // Ref for the title input

    // Handle input changes in the form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTask(prev => ({ ...prev, [name]: value }));
    };

    // Create a new task
    const createTask = () => {
        if (task.title && task.description && task.dueDate && task.priority && task.status) {
            dispatch(addTask({ ...task, id: Date.now().toString() } as Fields));
            setTask({});
        } else {
            alert('Please fill in all fields.');
        }
    };

    // Update an existing task
    const handleUpdateTask = (id: string) => {
        if (task.title && task.description && task.dueDate && task.priority && task.status) {
            dispatch(updateTask({ ...task, id } as Fields));
            setTask({});
        } else {
            alert('Please fill in all fields.');
        }
    };

    // Delete a task
    const handleDeleteTask = (id: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            dispatch(deleteTask(id));
        }
    };

    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // Handle sorting of tasks
    const handleSortTasks = () => {
        const sortedTasks = [...filteredTasks].sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
            const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;

            // First sort by priority
            const priorityComparison = sortOrder === 'asc' ? priorityA - priorityB : priorityB - priorityA;
            if (priorityComparison !== 0) {
                return priorityComparison;
            }

            // If priorities are the same, sort by due date
            return sortOrder === 'asc'
                ? new Date(a.dueDate as string).getTime() - new Date(b.dueDate as string).getTime()
                : new Date(b.dueDate as string).getTime() - new Date(a.dueDate as string).getTime();
        });

        setFilteredTasks(sortedTasks);
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc')); // Toggle sort order
    };

    // Update filteredTasks when tasks or searchTerm change
    useEffect(() => {
        const filtered = tasks.filter(task =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredTasks(filtered);
    }, [searchTerm, tasks]);

    // Handle editing a task
    const handleEdit = (taskToEdit: Fields) => {
        setTask(taskToEdit);
        // Focus on the title input when editing a task
        if (titleInputRef.current) {
            titleInputRef.current.focus();
        }
    };

    // Toggle the status of a task between 'completed' and 'in progress'
    const handleToggleStatus = (taskToToggle: Fields) => {
        const updatedTask: Fields = {
            ...taskToToggle,
            status: taskToToggle.status === 'completed' ? 'in progress' : 'completed',
        };
        dispatch(updateTask(updatedTask));
    };

    return (
        <div className="task-manager bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen p-8 flex justify-center">
            <div className="w-full max-w-3xl">
                <h1 className="text-4xl font-bold text-center mb-6 text-white">Task Manager</h1>

                {/* Add / Edit Task Form */}
                <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-700">Add / Edit Task</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title Input */}
                        <div>
                            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Task Title"
                                value={task.title || ''}
                                onChange={handleInputChange}
                                ref={titleInputRef} // Attach the ref here
                                className="w-full max-w-md border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        {/* Due Date Input */}
                        <div>
                            <label htmlFor="dueDate" className="block text-gray-700 font-medium mb-2">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                id="dueDate"
                                value={task.dueDate || ''}
                                onChange={handleInputChange}
                                className="w-full max-w-md border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                    </div>
                    {/* Description Input */}
                    <div className='w-full'>
                        <label htmlFor="description" className="block text-gray-700 font-medium pt-2">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            placeholder="Task Description"
                            value={task.description || ''}
                            onChange={handleInputChange}
                            className="w-full max-w-lg border max-md:max-w-md border-gray-300 rounded-md p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Priority Select */}
                        <div>
                            <label htmlFor="priority" className="block text-gray-700 font-medium mb-2">Priority</label>
                            <select
                                name="priority"
                                id="priority"
                                value={task.priority || ''}
                                onChange={handleInputChange}
                                className="w-full max-w-md border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="">Select Priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        {/* Status Select */}
                        <div>
                            <label htmlFor="status" className="block text-gray-700 font-medium mb-2">Status</label>
                            <select
                                name="status"
                                id="status"
                                value={task.status || ''}
                                onChange={handleInputChange}
                                className="w-full max-w-md border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                <option value="">Select Status</option>
                                <option value="in progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    {/* Add / Update Task Button */}
                    <button
                        onClick={task.id ? () => handleUpdateTask(task.id as string) : createTask}
                        className="mt-4 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                        {task.id ? 'Update Task' : 'Add Task'}
                    </button>
                </div>

                {/* Search and Sort Section */}
                {tasks.length > 0 && (
                    <div className="mb-8">
                        <div className="mb-4 flex justify-between items-center flex-col sm:flex-row">
                            {/* Search Input */}
                            <div className="flex items-center bg-white px-5 py-2 rounded-lg mb-4 sm:mb-0 sm:w-1/2">
                                <AiOutlineSearch className="text-gray-600 mr-2 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search Task by Title"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="w-full rounded-md p-2 focus:outline-none "
                                />
                            </div>

                            {/* Sort Button */}
                            <div>
                                <button
                                    onClick={handleSortTasks}
                                    className="flex items-center bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                >
                                    Sort by Due Date and Priority
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Task List */}
                <ul>
                    {filteredTasks.length > 0  ? (
                        filteredTasks.map(t => (
                            <TaskList
                                key={t.id}
                                task={t}
                                onEdit={() => handleEdit(t)}
                                onDelete={() => handleDeleteTask(t.id as string)}
                                onToggleStatus={() => handleToggleStatus(t)}
                            />
                        ))
                    ) : (tasks.length>0&&
                        <p className="text-center text-gray-700">No Tasks found</p>
                    )}
                </ul>
            </div>
            </div>
        );
    };

    export default TaskManager;
