'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  StickyNote, 
  Timer, 
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Tareas', href: '/tasks', icon: CheckSquare },
  { name: 'Materias', href: '/subjects', icon: BookOpen },
  { name: 'Notas', href: '/notes', icon: StickyNote },
  { name: 'Pomodoro', href: '/pomodoro', icon: Timer },
  { name: 'Progreso', href: '/progress', icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  if (pathname?.startsWith('/auth')) return null;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50 glass',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      <div className="flex flex-col h-full p-4">
        {/* Header */}
        <div className={cn('mb-8', collapsed ? 'items-center' : 'items-start')}>
          <div className="flex items-center justify-between mb-6">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  StudyFlow
                </h1>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* User Info */}
          {session?.user && (
            <div className={cn('flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl', collapsed && 'justify-center')}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{session.user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
                  collapsed && 'justify-center'
                )}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="space-y-1 border-t border-gray-200 dark:border-gray-800 pt-4">
          <Link
            href="/settings"
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300',
              collapsed && 'justify-center'
            )}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && <span className="font-medium">Configuración</span>}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-red-600 dark:text-red-400',
              collapsed && 'justify-center'
            )}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
