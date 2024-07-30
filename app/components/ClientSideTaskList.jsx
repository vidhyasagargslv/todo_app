// components/ClientSideTaskList.js
'use client';

import { useState } from 'react';
import SearchBar from "./SearchBar";
import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";
import TaskDetailSlider from "./TaskDetailSlider";

export default function ClientSideTaskList({ initialTasks }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTaskAdded = (newTask) => {
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
  };

  const handleCloseSlider = () => {
    setSelectedTask(null);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  return (
    <div className="flex flex-col items-center gap-5">
    <AddTaskForm onTaskAdded={handleTaskAdded} />
    <SearchBar 
      initialSearch={searchTerm} 
      onSearchChange={setSearchTerm}
    />
    <TaskList 
      tasks={filteredTasks} 
      setTasks={setTasks} 
      onTaskSelect={handleTaskSelect}
    />
    <TaskDetailSlider 
      selectedTask={selectedTask} 
      onClose={handleCloseSlider}
      onTaskUpdate={handleTaskUpdate}
    />
  </div>
  );
}