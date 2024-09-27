// src/Components/TaskList.tsx
import React from 'react';
import  Fields  from '../model/TaskFields';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa'; // Icons for status indicators

interface TaskListProps {
    task: Fields;
    onEdit: () => void;
    onDelete: () => void;
    onToggleStatus: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ task, onEdit, onDelete, onToggleStatus }) => {
    // Function to render status indicator
    const renderStatusIndicator = (status: Fields['status']) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="flex items-center text-green-600 font-semibold">
                        <FaCheckCircle className="mr-1" />
                        Completed
                    </span>
                );
            case 'in progress':
                return (
                    <span className="flex items-center text-blue-600 font-semibold">
                        
                        In Progress
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <li className={`bg-white shadow-md rounded-lg p-6 mb-4 flex flex-col md:flex-row md:justify-between md:items-center }`}>
            <div>
                <h2 className={`text-xl font-bold mb-2 ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-blue-600'}`}>
                    {task.title}
                </h2>
                <p className={`text-gray-700 mb-2 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                    {task.description}
                </p>
                <p className="text-gray-600">
                    Due Date: <span className="font-semibold">{task.dueDate}</span>
                </p>
                <p className="text-gray-600">
                    Priority: <span className="font-semibold capitalize">{task.priority}</span>
                </p>
                <p className="text-gray-600 flex items-center">
                    Status: {renderStatusIndicator(task.status)}
                </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
                <button
                    onClick={onEdit}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                    Edit
                </button>
                <button
                    onClick={onToggleStatus}
                    className={`text-sm px-3 py-1 rounded-md focus:outline-none focus:ring-2 ${
                        task.status === 'completed'
                            ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                            : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                    }`}
                >
                    {task.status === 'completed' ? 'Mark In Progress' : 'Mark Completed'}
                </button>
                <button
                    onClick={onDelete}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Delete
                </button>
            </div>
        </li>
    );
};

export default TaskList;
