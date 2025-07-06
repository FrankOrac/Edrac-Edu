import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/students', label: 'Students' },
  { href: '/teachers', label: 'Teachers' },
  { href: '/parents', label: 'Parents' },
  { href: '/attendance', label: 'Attendance' },
  { href: '/exams', label: 'Exams' },
  { href: '/cbt-test', label: 'CBT Test' },
  { href: '/cbt-extra', label: 'CBT Extra' },
  { href: '/cbt-analytics', label: 'CBT Analytics' },
  { href: '/results', label: 'Results' },
  { href: '/assignments', label: 'Assignments' },
  { href: '/transcripts', label: 'Transcripts' },
  { href: '/notifications', label: 'Notifications' },
  { href: '/events', label: 'Events' },
  { href: '/transport', label: 'Transport' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/library', label: 'Library' },
  { href: '/forums', label: 'Forums' },
  { href: '/payments', label: 'Payments' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/gamification', label: 'Gamification' },
  { href: '/certificates', label: 'Certificates' },
  { href: '/alumni', label: 'Alumni' },
  { href: '/groups', label: 'Groups' },
  { href: '/plugins', label: 'Plugins' },
  { href: '/ai-chat', label: 'AI Chat' },
];

export default function Layout({ children, title }: { children: ReactNode; title?: string }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-900 text-white flex flex-col py-6 px-4">
        <div className="text-2xl font-bold mb-8 text-center">Edu AI Platform</div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link href={link.href} legacyBehavior>
                  <a className={`block px-4 py-2 rounded hover:bg-blue-700 transition-colors ${router.pathname === link.href ? 'bg-blue-700 font-semibold' : ''}`}>{link.label}</a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-8">
        {title && <h1 className="text-3xl font-bold mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
