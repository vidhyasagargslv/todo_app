import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import Task from '@/lib/models/Task';

/**
 * Handles GET requests to fetch tasks from the database.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object.
 *
 * @throws Will throw an error if there's a problem with the database connection or fetching tasks.
 *
 * @example
 * GET /api/tasks?search=example
 *
 * Response:
 * [
 *   {
 *     "id": "61a1b0c2d3e4f5g6h7i8j9k0",
 *     "title": "Example Task",
 *     "completed": false,
 *     "description": "This is an example task.",
 *     "createdAt": "2022-01-01T00:00:00.000Z",
 *     "updatedAt": "2022-01-01T00:00:00.000Z"
 *   },
 *   ...
 * ]
 */

// Get enpoint to get the result of the tasks
export async function GET(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const query = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};
    const tasks = await Task.find(query).sort({ createdAt: -1 });


    // Serialized the tasks
    const serializedTasks = tasks.map(task => ({
      id: task._id.toString(),
  title: task.title,
  completed: task.completed,
  description: task.description, // Make sure this is included
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString()
    }));

    return NextResponse.json(serializedTasks);
  } catch (error) {
    console.error('Error in GET /api/tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST endpoint to save the task into database
export async function POST(request) {
  await dbConnect();

  try {
    const { title } = await request.json();
    const task = new Task({ title });
    await task.save();
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add task' }, { status: 500 });
  }
}

// Rename endpoint for title, description, completion
  export async function PUT(request) {
  const { id, title, completed, description } = await request.json();
  await dbConnect();

  try {
    const task = await Task.findByIdAndUpdate(id, { title, completed, description }, { new: true });
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({
      id: task._id.toString(),
      title: task.title,
      completed: task.completed,
      description: task.description,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString()
    });
  } catch (error) {
    console.error('Failed to update task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

//DELETE endpoint to delete the task from database
export async function DELETE(request) {
  const { id } = await request.json();
  await dbConnect();

  try {
    await Task.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}

