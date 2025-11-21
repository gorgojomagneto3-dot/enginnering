import { Task, Subject, Note, PomodoroSession } from '@/types';

export const saveTasks = (tasks: Task[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('studyhub_tasks', JSON.stringify(tasks));
  }
};

export const getTasks = (): Task[] => {
  if (typeof window !== 'undefined') {
    const tasks = localStorage.getItem('studyhub_tasks');
    if (tasks) {
      return JSON.parse(tasks).map((task: any) => ({
        ...task,
        dueDate: new Date(task.dueDate),
        createdAt: new Date(task.createdAt),
      }));
    }
  }
  return [];
};

export const saveSubjects = (subjects: Subject[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('studyhub_subjects', JSON.stringify(subjects));
  }
};

export const getSubjects = (): Subject[] => {
  if (typeof window !== 'undefined') {
    const subjects = localStorage.getItem('studyhub_subjects');
    return subjects ? JSON.parse(subjects) : [];
  }
  return [];
};

export const saveNotes = (notes: Note[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('studyhub_notes', JSON.stringify(notes));
  }
};

export const getNotes = (): Note[] => {
  if (typeof window !== 'undefined') {
    const notes = localStorage.getItem('studyhub_notes');
    if (notes) {
      return JSON.parse(notes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
    }
  }
  return [];
};

export const savePomodoroSessions = (sessions: PomodoroSession[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('studyhub_pomodoro', JSON.stringify(sessions));
  }
};

export const getPomodoroSessions = (): PomodoroSession[] => {
  if (typeof window !== 'undefined') {
    const sessions = localStorage.getItem('studyhub_pomodoro');
    if (sessions) {
      return JSON.parse(sessions).map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined,
      }));
    }
  }
  return [];
};
