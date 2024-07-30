'use client';

import { useState, useEffect, useRef } from 'react';
import './TaskDetailSlider.css';

export default function TaskDetailSlider({ selectedTask, onClose, onTaskUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(selectedTask?.description || '');
  const [isLoading, setIsLoading] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sliderRef.current && !sliderRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sliderRef, onClose]);

  useEffect(() => {
    
    setDescription(selectedTask?.description || '');
  }, [selectedTask]);



  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedTask.id,
          title: selectedTask.title,
          completed: selectedTask.completed,
          description: description,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }
  
      const updatedTask = await response.json();
      
      onTaskUpdate(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      
    } finally {
      setIsLoading(false);
    }
  };

  

  if (!selectedTask) return null;

  return (
    <div ref={sliderRef} className={`fixed inset-y-0 overflow-auto right-0 w-1/4 bg-base-200 p-4 shadow-lg max-md:inset-x-0 max-md:bottom-0 max-md:w-full max-md:h-1/2 transition-transform transform max-md:translate-y-full ${isOpen ? 'max-md:open:translate-y-0' : ''}`}>
      <button onClick={onClose} className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
      <h2 className="text-2xl font-bold mt-10 text-center capitalize border-b-2 border-primary mb-4">{selectedTask.title}</h2>
      <p><strong>Status:</strong> {selectedTask.completed ? 'Completed' : 'Pending'}</p>
      <p><strong>Created:</strong> <br />{new Date(selectedTask.createdAt).toLocaleString()}</p>
      <p><strong>Last Updated:</strong><br /> {new Date(selectedTask.updatedAt).toLocaleString()}</p>
      <div className="mt-4">
        <strong>Description:</strong>
        {isEditing ? (
          <div>
            <textarea
              className="textarea textarea-bordered w-full mt-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button 
              onClick={handleSave} 
              className={`btn btn-sm btn-primary mt-2 ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        ) : (
          <div>
            <p className="mt-2">{description || 'No description available.'}</p>
            <button onClick={() => setIsEditing(true)} className="btn btn-sm btn-secondary mt-2">Edit</button>
          </div>
        )}
      </div>
    </div>
  );
}