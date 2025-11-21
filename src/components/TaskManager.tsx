'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { getTasks, saveTasks } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { Plus, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as Task['priority'],
    subject: '',
  });

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  const addTask = () => {
    if (!newTask.title || !newTask.dueDate) return;

    const task: Task = {
      id: generateId(),
      ...newTask,
      dueDate: new Date(newTask.dueDate),
      status: 'pending',
      createdAt: new Date(),
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', subject: '' });
    setShowForm(false);
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, status } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Mis Tareas</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Tarea
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Crear Nueva Tarea</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Título de la tarea"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <textarea
              placeholder="Descripción"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
            />
            <input
              type="text"
              placeholder="Materia"
              value={newTask.subject}
              onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="flex gap-4">
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addTask}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Crear Tarea
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No tienes tareas pendientes</p>
            <p className="text-sm">¡Crea tu primera tarea para comenzar!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(task.status)}
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(task.dueDate, "d 'de' MMMM, yyyy", { locale: es })}
                    </span>
                    {task.subject && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {task.subject}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="in-progress">En Progreso</option>
                    <option value="completed">Completada</option>
                  </select>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
