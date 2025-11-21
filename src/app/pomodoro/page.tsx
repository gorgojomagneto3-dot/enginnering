'use client';

import Sidebar from '@/components/Sidebar';
import PomodoroTimer from '@/components/PomodoroTimer';

export default function PomodoroPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <PomodoroTimer />
      </main>
    </div>
  );
}
