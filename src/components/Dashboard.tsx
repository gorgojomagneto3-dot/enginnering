'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getTasks, getSubjects, getNotes, getPomodoroSessions } from '@/lib/storage';
import { Task, Subject, Note, PomodoroSession } from '@/types';
import { CheckCircle2, BookOpen, StickyNote, Timer, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);

  useEffect(() => {
    setTasks(getTasks());
    setSubjects(getSubjects());
    setNotes(getNotes());
    setSessions(getPomodoroSessions());
  }, []);

  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
  const todayTasks = pendingTasks.filter(t => isToday(t.dueDate));
  const overdueTasks = pendingTasks.filter(t => isPast(t.dueDate) && !isToday(t.dueDate));
  const upcomingTasks = pendingTasks.filter(t => isTomorrow(t.dueDate));
  
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  const todaySessions = sessions.filter(s => 
    s.type === 'work' && s.completed && isToday(s.startTime)
  );

  const averageProgress = subjects.length > 0
    ? Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length)
    : 0;

  const recentNotes = notes.slice(-3).reverse();

  const stats = [
    {
      name: 'Tareas Pendientes',
      value: pendingTasks.length,
      icon: CheckCircle2,
      color: 'bg-blue-500',
      link: '/tasks',
    },
    {
      name: 'Materias Activas',
      value: subjects.length,
      icon: BookOpen,
      color: 'bg-green-500',
      link: '/subjects',
    },
    {
      name: 'Notas Guardadas',
      value: notes.length,
      icon: StickyNote,
      color: 'bg-yellow-500',
      link: '/notes',
    },
    {
      name: 'Pomodoros Hoy',
      value: todaySessions.length,
      icon: Timer,
      color: 'bg-purple-500',
      link: '/pomodoro',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          ¡Bienvenido de vuelta! 👋
        </h1>
        <p className="text-gray-600">
          Aquí está tu resumen de hoy, {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} href={stat.link}>
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tareas de hoy y urgentes */}
        <div className="lg:col-span-2 space-y-6">
          {overdueTasks.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">Tareas Vencidas</h3>
              </div>
              <div className="space-y-2">
                {overdueTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="bg-white p-3 rounded border border-red-200">
                    <p className="font-medium text-gray-800">{task.title}</p>
                    <p className="text-sm text-gray-600">
                      Vencía: {format(task.dueDate, "d 'de' MMMM", { locale: es })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Tareas de Hoy
              </h3>
              <Link href="/tasks" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Ver todas
              </Link>
            </div>
            {todayTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No tienes tareas programadas para hoy ✨
              </p>
            ) : (
              <div className="space-y-3">
                {todayTasks.map(task => (
                  <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`mt-1 w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{task.title}</p>
                      {task.subject && (
                        <p className="text-sm text-gray-600">{task.subject}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status === 'in-progress' ? 'En progreso' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {upcomingTasks.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Próximas Tareas (Mañana)</h3>
              <div className="space-y-3">
                {upcomingTasks.slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{task.title}</p>
                      {task.subject && (
                        <p className="text-sm text-gray-600">{task.subject}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar con progreso y notas recientes */}
        <div className="space-y-6">
          {/* Progreso general */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-800">Tu Progreso</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Tareas completadas</span>
                  <span className="font-semibold">{completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progreso en materias</span>
                  <span className="font-semibold">{averageProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all"
                    style={{ width: `${averageProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Materias activas */}
          {subjects.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Materias</h3>
                <Link href="/subjects" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Ver todas
                </Link>
              </div>
              <div className="space-y-3">
                {subjects.slice(0, 4).map(subject => (
                  <div key={subject.id} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: subject.color }}
                    >
                      {subject.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{subject.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{subject.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notas recientes */}
          {recentNotes.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Notas Recientes</h3>
                <Link href="/notes" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Ver todas
                </Link>
              </div>
              <div className="space-y-3">
                {recentNotes.map(note => (
                  <div key={note.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium text-gray-800 text-sm mb-1 line-clamp-1">{note.title}</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{note.content}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {format(note.updatedAt, "d MMM", { locale: es })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
