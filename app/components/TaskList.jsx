'use client';

import { useState,useEffect } from 'react';

export default function TaskList({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const fetchedTasks = await response.json();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();

    // Set up an interval to fetch tasks every 5 seconds
    const intervalId = setInterval(fetchTasks, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [tasks]); 

  const toggleComplete = async (id) => {
    try {
      const taskToUpdate = tasks.find(task => task._id === id);
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          completed: !taskToUpdate.completed,
          title: taskToUpdate.title,
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const updatedTask = await response.json();
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const renameTask = async (id) => {
    const newTitle = prompt('Enter new task title:');
    if (!newTitle) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title: newTitle,
          completed: tasks.find(task => task._id === id).completed,
        }),
      });

      if (!response.ok) throw new Error('Failed to rename task');

      const updatedTask = await response.json();
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
    } catch (error) {
      console.error('Error renaming task:', error);
    }
  };

  const deleteTask = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete task');

      setTasks(tasks.filter(task => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <ul>
      {tasks.map(task => (
        <li key={task._id} className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleComplete(task._id)}
            className="checkbox mr-2"
          />
          <span className={`flex-grow ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </span>
          <button onClick={() => renameTask(task._id)} className="btn btn-sm btn-info mr-2">
            Rename
          </button>
          <button onClick={() => deleteTask(task._id)} className="btn btn-sm btn-error">
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}