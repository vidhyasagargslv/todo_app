import dbConnect from './dbconnect';
import Task from './models/Task';

/**
 * Retrieves tasks from the database.
 * @returns {Promise<Array<Object>>} An array of tasks.
 */
export async function getTasks() {
  await dbConnect();
  const tasks = await Task.find().sort({ createdAt: -1 });
  return tasks.map(task => ({
    id: task._id.toString(),
    title: task.title,
    completed: task.completed,
    description:task.description,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
    
  }));
}