'use client';

import { useState, useEffect, useRef } from 'react';
import { PomodoroSession, PomodoroStats } from '@/types';
import { getPomodoroSessions, savePomodoroSessions } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import { Play, Pause, RotateCcw, Coffee, Timer as TimerIcon } from 'lucide-react';

const WORK_DURATION = 25 * 60; // 25 minutos
const BREAK_DURATION = 5 * 60; // 5 minutos
const LONG_BREAK_DURATION = 15 * 60; // 15 minutos

export default function PomodoroTimer() {
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessionCount, setSessionCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setSessions(getPomodoroSessions());
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuAzu/glDkHHm7A7+OZURE');
    }
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleSessionComplete = () => {
    setIsRunning(false);
    if (audioRef.current) {
      audioRef.current.play();
    }

    const session: PomodoroSession = {
      id: generateId(),
      startTime: new Date(Date.now() - (mode === 'work' ? WORK_DURATION : BREAK_DURATION) * 1000),
      endTime: new Date(),
      duration: mode === 'work' ? WORK_DURATION : BREAK_DURATION,
      type: mode,
      completed: true,
    };

    const updatedSessions = [...sessions, session];
    setSessions(updatedSessions);
    savePomodoroSessions(updatedSessions);

    if (mode === 'work') {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      if (newCount % 4 === 0) {
        setMode('break');
        setTimeLeft(LONG_BREAK_DURATION);
      } else {
        setMode('break');
        setTimeLeft(BREAK_DURATION);
      }
    } else {
      setMode('work');
      setTimeLeft(WORK_DURATION);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(WORK_DURATION);
  };

  const skipToBreak = () => {
    setIsRunning(false);
    setMode('break');
    setTimeLeft(sessionCount % 4 === 3 ? LONG_BREAK_DURATION : BREAK_DURATION);
  };

  const skipToWork = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(WORK_DURATION);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStats = (): PomodoroStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const todaySessions = sessions.filter(s => 
      s.type === 'work' && s.completed && s.startTime >= today
    );

    const weekSessions = sessions.filter(s => 
      s.type === 'work' && s.completed && s.startTime >= weekAgo
    );

    const workSessions = sessions.filter(s => s.type === 'work' && s.completed);
    const totalMinutes = workSessions.reduce((acc, s) => acc + s.duration, 0) / 60;

    return {
      totalSessions: workSessions.length,
      totalMinutes: Math.round(totalMinutes),
      todaySessions: todaySessions.length,
      weekSessions: weekSessions.length,
    };
  };

  const stats = getStats();
  const progress = mode === 'work' 
    ? ((WORK_DURATION - timeLeft) / WORK_DURATION) * 100
    : ((BREAK_DURATION - timeLeft) / BREAK_DURATION) * 100;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Pomodoro Timer</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Timer principal */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-xl p-8 text-white">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
              {mode === 'work' ? (
                <>
                  <TimerIcon className="w-5 h-5" />
                  <span className="font-semibold">Sesión de Trabajo</span>
                </>
              ) : (
                <>
                  <Coffee className="w-5 h-5" />
                  <span className="font-semibold">Descanso</span>
                </>
              )}
            </div>
            
            <div className="relative inline-block">
              <svg className="transform -rotate-90 w-64 h-64">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-white/20"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                  className="text-white transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl font-bold">{formatTime(timeLeft)}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={toggleTimer}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Iniciar
                </>
              )}
            </button>
            <button
              onClick={resetTimer}
              className="bg-white/20 px-6 py-4 rounded-lg font-semibold hover:bg-white/30 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            {mode === 'work' ? (
              <button
                onClick={skipToBreak}
                className="text-sm text-white/80 hover:text-white underline"
              >
                Saltar al descanso
              </button>
            ) : (
              <button
                onClick={skipToWork}
                className="text-sm text-white/80 hover:text-white underline"
              >
                Volver al trabajo
              </button>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/80 text-sm mb-2">Sesiones completadas hoy</p>
            <div className="flex justify-center gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full ${
                    i < (sessionCount % 4) ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-600">Hoy</span>
                <span className="text-2xl font-bold text-blue-600">{stats.todaySessions}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-600">Esta semana</span>
                <span className="text-2xl font-bold text-green-600">{stats.weekSessions}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-600">Total sesiones</span>
                <span className="text-2xl font-bold text-purple-600">{stats.totalSessions}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm text-gray-600">Total minutos</span>
                <span className="text-2xl font-bold text-orange-600">{stats.totalMinutes}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Técnica Pomodoro</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>🍅 Trabaja 25 minutos</li>
              <li>☕ Descansa 5 minutos</li>
              <li>🔄 Repite 4 veces</li>
              <li>🎉 Descanso largo 15 min</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
