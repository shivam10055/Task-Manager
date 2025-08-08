// TaskModal.tsx
import React, { useState, useEffect } from 'react';
import type { Priority, Task } from '../types/type';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: Task) => void;
  initialData?: Task | null;
}

const TaskModal: React.FC<Props> = ({ isOpen, onClose, onCreate, initialData }) => {
  const [form, setForm] = useState({
    title: '',
    desc: '',
    priority: 'low' as Priority,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        desc: initialData.desc,
        priority: initialData.priority,
      });
    } else {
      setForm({ title: '', desc: '', priority: 'low' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (form.title.trim()) {
      const task: Task = {
        id: initialData ? initialData.id : Date.now(),
        title: form.title,
        desc: form.desc,
        priority: form.priority,
        status: 'todo',
      };
      onCreate(task);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black   flex justify-center items-center">
      <div className="bg-white rounded p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">{initialData ? 'Edit Task' : 'Create Task'}</h2>
        <input
          className="w-full border rounded p-2"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
        />
        <textarea
          className="w-full border rounded p-2"
          name="desc"
          value={form.desc}
          onChange={handleChange}
          placeholder="Description"
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-sm px-3 py-1 border rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-1 rounded">
            {initialData ? 'Update' : 'Add'} Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
