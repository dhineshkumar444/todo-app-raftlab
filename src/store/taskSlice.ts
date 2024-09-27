// src/store/taskSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import  Fields from '../model/TaskFields';

interface TaskState {
    tasks: Fields[];
}

const initialState: TaskState = {
    tasks: [],
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Fields>) => {
            state.tasks.push(action.payload);
        },
        updateTask: (state, action: PayloadAction<Fields>) => {
            const index = state.tasks.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
       
    },
});

export const { addTask, updateTask, deleteTask } = taskSlice.actions;

export default taskSlice.reducer;
