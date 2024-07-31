
'use client';

import { useState } from 'react';

export default function AddTaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');

  // sumit function from frontend to add tasks to database
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error('Failed to add task');

      const newTask = await response.json();
      onTaskAdded(newTask); // Call the callback function with the new task
      setTitle('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center items-center gap-3 mb-4 max-md:mb-2 max-md:flex-col">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a new task"
        className="input input-bordered w-full max-w-xs mr-2"
      />
      <button type="submit" className="btn btn-primary max-md:btn-sm">Add Task</button>
    </form>
  );
}