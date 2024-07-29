'use client';

import { useState } from 'react';

export default function TaskDetailSlider() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // This function would be called from the TaskList component
  const openSlider = (task) => {
    setSelectedTask(task);
    setIsOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-1/4 bg-base-200 p-4 shadow-lg">
      <button onClick={() => setIsOpen(false)} className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
      <h2 className="text-xl font-bold mb-4">{selectedTask?.title}</h2>
      
    </div>
  );
}