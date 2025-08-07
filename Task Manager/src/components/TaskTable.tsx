// TaskTable.tsx
import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import type { Status, Column, Task } from '../types/type';
import CreateTaskButton from './CreateTaskButton';
import TaskModal from './TaskModal';
import { Trash2, Pencil } from 'lucide-react';

const columnNames: Record<Status, string> = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

const initialColumns: Record<Status, Column> = {
  todo: {
    name: columnNames.todo,
    items: [],
  },
  inprogress: {
    name: columnNames.inprogress,
    items: [],
  },
  done: {
    name: columnNames.done,
    items: [],
  },
};

const TaskTable: React.FC = () => {
  const [columns, setColumns] = useState<Record<Status, Column>>(initialColumns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId as Status];
    const destColumn = columns[destination.droppableId as Status];

    if (source.droppableId !== destination.droppableId) {
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const copiedItems = [...sourceColumn.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: copiedItems,
        },
      });
    }
  };

  const handleCreateTask = (task: Task) => {
    if (editingTask) {
      setColumns(prev => {
        const updated = { ...prev };
        const oldStatus = editingTask.status;
        updated[oldStatus].items = updated[oldStatus].items.filter(t => t.id !== editingTask.id);
        updated.todo.items = [task, ...updated.todo.items];
        return updated;
      });
      setEditingTask(null);
    } else {
      setColumns(prev => ({
        ...prev,
        todo: {
          ...prev.todo,
          items: [task, ...prev.todo.items],
        },
      }));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (task: Task) => {
    setColumns(prev => {
      const updated = { ...prev };
      const status = task.status;
      updated[status].items = updated[status].items.filter(t => t.id !== task.id);
      return updated;
    });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-full gap-6 justify-around mt-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <div key={columnId} className="flex flex-col w-1/3 bg-gray-800 p-4 rounded">
            <h2 className="text-white text-xl font-bold mb-2">{column.name}</h2>
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`p-2 rounded transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-gray-700' : 'bg-gray-900'}`}
                >
                  {column.items.map((task, index) => (
                    <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 mb-2 bg-gray-600 text-white rounded shadow ${snapshot.isDragging ? 'opacity-80' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{task.title}</h3>
                              <p className="text-sm text-gray-300 break-words whitespace-normal">{task.desc}</p>
                              <p className="text-xs mt-1">
                                Priority: <span className="uppercase">{task.priority}</span>
                              </p>
                            </div>
                            <div className="flex gap-2 ml-2">
                              <Pencil
                                className="w-4 h-4 cursor-pointer text-blue-400"
                                onClick={() => handleEdit(task)}
                              />
                              <Trash2
                                className="w-4 h-4 cursor-pointer text-red-400"
                                onClick={() => handleDelete(task)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>

      <CreateTaskButton onClick={() => setIsModalOpen(true)} />
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onCreate={handleCreateTask}
        initialData={editingTask}
      />
    </DragDropContext>
  );
};

export default TaskTable;
