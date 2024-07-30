'use client';

import { useState } from 'react';

export default function AddTaskForm({ onTaskAdded }) {
  const [newTask, setNewTask] = useState('');

  const addTask = async (title) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      try {
        const addedTask = await addTask(newTask);
        console.log('Task added successfully:', addedTask);
        setNewTask('');
        onTaskAdded(addedTask); // Notify parent component about the new task
      } catch (error) {
        console.error('Failed to add task:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center flex-row mb-4 gap-5 max-md:flex-col">
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        className="Add_input min-w-[25%] py-2.5 p-2 rounded-lg text-center align-middle text-lg font-medium capitalize caret-blue-600"
        placeholder="New task"
        required
      />
      <button type="submit" className="btn btn-primary w-fit">Add this</button>
    </form>
  );
}
