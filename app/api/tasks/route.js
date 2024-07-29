import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import Task from '@/lib/models/Task';


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
  const { id, title, completed } = await request.json();
  await dbConnect();

  try {
    const task = await Task.findByIdAndUpdate(id, { title, completed }, { new: true });
    return NextResponse.json(task);
  } catch (error) {
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