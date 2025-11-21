'use client';

import Sidebar from '@/components/Sidebar';
import SubjectTracker from '@/components/SubjectTracker';

export default function SubjectsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <SubjectTracker />
      </main>
    </div>
  );
}
