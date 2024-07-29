import dbConnect from './dbconnect';
import Task from './models/Task';

export async function getTasks(search = '') {
    await dbConnect();
  
    const query = search
      ? { title: { $regex: search, $options: 'i' } }
      : {};
  
    const tasks = await Task.find(query).sort({ createdAt: -1 });
  
    return JSON.parse(JSON.stringify(tasks));
  }