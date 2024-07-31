// components/ClientSideTaskList.js
'use client';

import { useState } from 'react';
import SearchBar from "./SearchBar";
import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";
import TaskDetailSlider from "./TaskDetailSlider";

/**
 * Renders a client-side task list component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Array} props.initialTasks - The initial list of tasks.
 * @returns {JSX.Element} The rendered component.
 */
export default function ClientSideTaskList({ initialTasks }) {
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handles the addition of a new task.
   *
   * @param {Object} newTask - The new task to be added.
   */
  const handleTaskAdded = (newTask) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  /**
   * Handles the selection of a task.
   *
   * @param {Object} task - The selected task.
   */
  const handleTaskSelect = (task) => {
    setSelectedTask(task);
  };

  /**
   * Closes the task detail slider.
   */
  const handleCloseSlider = () => {
    setSelectedTask(null);
  };

  /**
   * Handles the update of a task.
   *
   * @param {Object} updatedTask - The updated task.
   */
  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* AddTaskForm component */}
      <AddTaskForm onTaskAdded={handleTaskAdded} />

      {/* SearchBar component */}
      <SearchBar 
        initialSearch={searchTerm} 
        onSearchChange={setSearchTerm}
      />

      {/* TaskList component */}
      <TaskList 
        tasks={filteredTasks} 
        setTasks={setTasks} 
        onTaskSelect={handleTaskSelect}
      />

      {/* TaskDetailSlider component */}
      <TaskDetailSlider 
        selectedTask={selectedTask} 
        onClose={handleCloseSlider}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
}