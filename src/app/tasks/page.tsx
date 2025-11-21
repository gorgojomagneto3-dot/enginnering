'use client';

import Sidebar from '@/components/Sidebar';
import TaskManager from '@/components/TaskManager';

export default function TasksPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <TaskManager />
      </main>
    </div>
  );
}
