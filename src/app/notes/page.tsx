'use client';

import Sidebar from '@/components/Sidebar';
import NotesEditor from '@/components/NotesEditor';

export default function NotesPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <NotesEditor />
      </main>
    </div>
  );
}
