'use client';

import { useState } from 'react';
import { Trash2, FolderPen } from 'lucide-react';

export default function TaskList({ tasks, setTasks, onTaskSelect }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [isUpdating, setIsUpdating] = useState({});

  // Helper function to get the correct id
  const getTaskId = (task) => task.id || task._id;

  // Function to toggle task completion
  const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, i)));
      }
    }
  };
  
  const toggleComplete = async (task) => {
    const id = getTaskId(task);
    if (isUpdating[id]) return;
  
    setIsUpdating(prev => ({ ...prev, [id]: true }));
    const newCompletedState = !task.completed;
  
    try {
      const updatedTask = await retryWithBackoff(async () => {
        const response = await fetch('/api/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: id,
            completed: newCompletedState,
            title: task.title,
            description: task.description
          }),
        });
  
        if (!response.ok) throw new Error(await response.text());
        return response.json();
      });
  
      console.log(`Server responded with task update: ${id}, completed=${updatedTask.completed}`);
  
      setTasks(prevTasks =>
        prevTasks.map(t => getTaskId(t) === id ? { ...updatedTask, id: getTaskId(updatedTask) } : t)
      );
    } catch (error) {
      console.error('Error toggling task completion:', error);
      // Revert the optimistic update
      setTasks(prevTasks =>
        prevTasks.map(t => getTaskId(t) === id ? { ...t, completed: task.completed } : t)
      );
    } finally {
      setIsUpdating(prev => ({ ...prev, [id]: false }));
    }
  };

  // Function to rename a task
  const renameTask = async () => {
    if (!selectedTask) return;
    const id = getTaskId(selectedTask);

    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          title: newTitle,
          completed: selectedTask.completed,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update task: ${errorText}`);
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) => prevTasks.map((task) => (getTaskId(task) === id ? { ...task, title: updatedTask.title } : task)));
      document.getElementById('rename_modal').close();
    } catch (error) {
      console.error('Error renaming task:', error);
    }
  };

  // Function to delete a task
  const deleteTask = async () => {
    if (!selectedTask) return;
    const id = getTaskId(selectedTask);

    try {
      const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete task: ${errorText}`);
      }

      setTasks((prevTasks) => prevTasks.filter((task) => getTaskId(task) !== id));
      document.getElementById('delete_modal').close();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className='flex gap-3 flex-col'>
      {tasks.map((task) => (
        <div key={getTaskId(task)} className="task-item flex items-center flex-row gap-3 mb-2 max-md:gap-1.5">
          <div>
            <input
              type="checkbox"
              checked={task.completed || false}
              onChange={() => toggleComplete(task)}
              disabled={isUpdating[getTaskId(task)]}
              className="checkbox mr-2 max-md:checkbox-xs"
            />
          </div>
          <div className='w-44 text-left px-6 btn btn-sm btn-outline max-md:w-32'
          onClick={() => onTaskSelect(task)}>
            <span className={`flex-grow text-base capitalize truncate ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </span>
          </div>
          <div>
            <button onClick={() => { setSelectedTask(task); setNewTitle(task.title); document.getElementById('rename_modal').showModal(); }} className="btn btn-sm btn-circle btn-neutral mr-2">
              <FolderPen size={16} />
            </button>
            <button onClick={() => { setSelectedTask(task); document.getElementById('delete_modal').showModal(); }} className="btn btn-sm btn-error">
              <Trash2 size={16}/>
            </button>
          </div>
        </div>
      ))}

      {/* Rename Task Modal */}
      <dialog id="rename_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Rename Task</h3>
          <input
            type="text"
            className="input input-bordered w-full my-4"
            placeholder="New task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div className="modal-action">
            <button className="btn" onClick={renameTask}>Confirm</button>
            <button className="btn" onClick={() => document.getElementById('rename_modal').close()}>Cancel</button>
          </div>
        </div>
      </dialog>

      {/* Delete Task Modal */}
      <dialog id="delete_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p className="py-4">Are you sure you want to delete this task?</p>
          <div className="modal-action">
            <button className="btn" onClick={deleteTask}>Confirm</button>
            <button className="btn" onClick={() => document.getElementById('delete_modal').close()}>Cancel</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
