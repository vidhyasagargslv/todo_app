import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this task.'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
}, {
  timestamps: true,
});

export default mongoose.models.Task || mongoose.model('Task', TaskSchema);