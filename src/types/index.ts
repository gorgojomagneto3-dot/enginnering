export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  subject: string;
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  progress: number;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  completed: boolean;
  subjectId: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface PomodoroSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  type: 'work' | 'break';
  completed: boolean;
}

export interface PomodoroStats {
  totalSessions: number;
  totalMinutes: number;
  todaySessions: number;
  weekSessions: number;
}
