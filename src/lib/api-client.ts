import { Task, Subject, Note, PomodoroSession } from '@/types';

const API_ROOT = '/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_ROOT}${endpoint}`, options);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Something went wrong');
  }
  return res.json();
}

// Tasks
export const getTasks = async (): Promise<Task[]> => {
  const data = await fetchAPI<{ tasks: any[] }>('/tasks');
  return data.tasks.map(mapTask);
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const data = await fetchAPI<{ task: any }>('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return mapTask(data.task);
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const data = await fetchAPI<{ task: any }>(`/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return mapTask(data.task);
};

export const deleteTask = async (id: string): Promise<void> => {
  await fetchAPI(`/tasks/${id}`, { method: 'DELETE' });
};

// Subjects
export const getSubjects = async (): Promise<Subject[]> => {
  const data = await fetchAPI<{ subjects: any[] }>('/subjects');
  return data.subjects.map(mapSubject);
};

export const createSubject = async (subject: Partial<Subject>): Promise<Subject> => {
  const data = await fetchAPI<{ subject: any }>('/subjects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subject),
  });
  return mapSubject(data.subject);
};

export const deleteSubject = async (id: string): Promise<void> => {
  await fetchAPI(`/subjects/${id}`, { method: 'DELETE' });
};

// Notes
export const getNotes = async (): Promise<Note[]> => {
  const data = await fetchAPI<{ notes: any[] }>('/notes');
  return data.notes.map(mapNote);
};

export const createNote = async (note: Partial<Note>): Promise<Note> => {
  const data = await fetchAPI<{ note: any }>('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  });
  return mapNote(data.note);
};

export const updateNote = async (id: string, updates: Partial<Note>): Promise<Note> => {
  const data = await fetchAPI<{ note: any }>(`/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return mapNote(data.note);
};

export const deleteNote = async (id: string): Promise<void> => {
  await fetchAPI(`/notes/${id}`, { method: 'DELETE' });
};

// Pomodoro
export const getPomodoroSessions = async (): Promise<PomodoroSession[]> => {
  const data = await fetchAPI<{ sessions: any[] }>('/pomodoro');
  return data.sessions.map(mapSession);
};

export const createPomodoroSession = async (session: Partial<PomodoroSession>): Promise<PomodoroSession> => {
  const data = await fetchAPI<{ session: any }>('/pomodoro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(session),
  });
  return mapSession(data.session);
};

// Topics
export const getTopics = async (subjectId: string): Promise<any[]> => {
  const data = await fetchAPI<{ topics: any[] }>(`/topics?subjectId=${subjectId}`);
  return data.topics.map(mapTopic);
};

export const createTopic = async (topic: any): Promise<any> => {
  const data = await fetchAPI<{ topic: any }>('/topics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(topic),
  });
  return mapTopic(data.topic);
};

export const updateTopic = async (id: string, updates: any): Promise<any> => {
  const data = await fetchAPI<{ topic: any }>(`/topics/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  return mapTopic(data.topic);
};

export const deleteTopic = async (id: string): Promise<void> => {
  await fetchAPI(`/topics/${id}`, { method: 'DELETE' });
};

// Mappers
function mapTask(apiTask: any): Task {
  return {
    ...apiTask,
    id: apiTask._id,
    dueDate: new Date(apiTask.dueDate),
    createdAt: new Date(apiTask.createdAt),
  };
}

function mapSubject(apiSubject: any): Subject {
  return {
    ...apiSubject,
    id: apiSubject._id,
  };
}

function mapNote(apiNote: any): Note {
  return {
    ...apiNote,
    id: apiNote._id,
    createdAt: new Date(apiNote.createdAt),
    updatedAt: new Date(apiNote.updatedAt),
  };
}

function mapSession(apiSession: any): PomodoroSession {
  return {
    ...apiSession,
    id: apiSession._id,
    startTime: new Date(apiSession.startTime),
    endTime: apiSession.endTime ? new Date(apiSession.endTime) : undefined,
  };
}

function mapTopic(apiTopic: any): any {
  return {
    ...apiTopic,
    id: apiTopic._id,
    completed: apiTopic.isCompleted, // Map isCompleted to completed
  };
}
