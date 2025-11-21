'use client';

import { useState, useEffect } from 'react';
import { Task, Subject } from '@/types';
import { Plus, Calendar, AlertCircle, CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useSession } from 'next-auth/react';

export default function TaskManager() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as Task['priority'],
    subjectId: '',
  });

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, subjectsRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/subjects')
      ]);

      if (tasksRes.ok && subjectsRes.ok) {
        const tasksData = await tasksRes.json();
        const subjectsData = await subjectsRes.json();

        const mappedTasks = tasksData.tasks.map((t: any) => ({
          ...t,
          id: t._id,
          dueDate: t.dueDate ? new Date(t.dueDate) : new Date(),
          createdAt: new Date(t.createdAt),
          subject: t.subjectId // Map subjectId to subject for compatibility
        }));

        const mappedSubjects = subjectsData.subjects.map((s: any) => ({
          ...s,
          id: s._id
        }));

        setTasks(mappedTasks);
        setSubjects(mappedSubjects);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.dueDate) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          dueDate: new Date(newTask.dueDate).toISOString(),
          priority: newTask.priority,
          subjectId: newTask.subjectId || undefined,
          status: 'pending'
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const createdTask = {
          ...data.task,
          id: data.task._id,
          dueDate: new Date(data.task.dueDate),
          createdAt: new Date(data.task.createdAt),
          subject: data.task.subjectId
        };
        
        setTasks([...tasks, createdTask]);
        setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', subjectId: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTaskStatus = async (id: string, status: Task['status']) => {
    // Optimistic update
    const originalTasks = [...tasks];
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, status } : task
    );
    setTasks(updatedTasks);

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        setTasks(originalTasks); // Revert on error
      }
    } catch (error) {
      setTasks(originalTasks); // Revert on error
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    // Optimistic update
    const originalTasks = [...tasks];
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        setTasks(originalTasks); // Revert on error
      }
    } catch (error) {
      setTasks(originalTasks); // Revert on error
      console.error('Error deleting task:', error);
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getSubjectName = (subjectId?: string) => {
    if (!subjectId) return null;
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.name : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

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
            
            <select
              value={newTask.subjectId}
              onChange={(e) => setNewTask({ ...newTask, subjectId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Seleccionar Materia (Opcional)</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>

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
                    {getSubjectName(task.subject) && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {getSubjectName(task.subject)}
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
