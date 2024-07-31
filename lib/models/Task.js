import mongoose from 'mongoose';

/**
 * Represents the schema for a task in the application.
 *
 * @typedef {Object} TaskSchema
 * @property {string} title - The title of the task.
 * @property {boolean} completed - Indicates whether the task is completed or not.
 * @property {string} description - The description of the task.
 * @property {boolean} timestamps - Indicates whether to include timestamps for task creation and updates.
 */
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