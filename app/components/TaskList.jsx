'use client';

import { useState, useEffect } from 'react';
import { Trash2,FolderPen } from 'lucide-react';

export default function TaskList({ initialTasks,search }) {
  const [tasks, setTasks] = useState(initialTasks);

  

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/tasks?search=${encodeURIComponent(search)}`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const fetchedTasks = await response.json();
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [search]);

  // Function to toggle task completion
  const toggleComplete = async (id) => {
    try {
      const taskToUpdate = tasks.find((task) => task._id === id);
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
      setTasks((prevTasks) => prevTasks.map((task) => (task._id === id ? updatedTask : task)));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  // Function to rename a task
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
          completed: tasks.find((task) => task._id === id).completed,
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const updatedTask = await response.json();
      setTasks((prevTasks) => prevTasks.map((task) => (task._id === id ? updatedTask : task)));
    } catch (error) {
      console.error('Error renaming task:', error);
    }
  };

  // Function to delete a task
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

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className='flex gap-3 flex-col'>
      {tasks.map((task) => (
        <div key={task._id} className="task-item flex items-center flex-row gap-3 mb-2 max-md:gap-1.5">
          <div>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleComplete(task._id)}
            className="checkbox mr-2"
          />
          </div>
          <div className='w-44 text-left px-6 btn btn-sm btn-outline max-md:w-28'>
          <span className={`flex-grow text-base capitalize ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </span>
          </div>
          <div>
          <button onClick={() => renameTask(task._id)} className="btn btn-sm btn-circle btn-neutral mr-2">
          <FolderPen size={16} />
          </button>
          <button onClick={() => deleteTask(task._id)} className="btn btn-sm btn-error">
          <Trash2 size={16}/>
          </button>
          </div>
        </div>
      ))}
    </div>
  );
}
