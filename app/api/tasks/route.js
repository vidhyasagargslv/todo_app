import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import Task from '@/lib/models/Task';


export async function GET(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const query = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};
    const tasks = await Task.find(query).sort({ createdAt: -1 });


    // Serialize the tasks
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

