'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  BookUser,
  Calendar,
  Phone,
  Settings,
  FileClock,
} from 'lucide-react';
import Profile from './Profile';
import { User } from '@supabase/supabase-js';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/accounts', label: 'Accounts', icon: BookUser },
  { href: '/contacts', label: 'Contacts', icon: BookUser },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/calls', label: 'Calls', icon: Phone },
  { href: '/leads-pool', label: 'Leads Pool', icon: Users, adminOnly: true },
  { href: '/team', label: 'Team', icon: Users, adminOnly: true },
  { href: '/audit-log', label: 'Audit Log', icon: FileClock, adminOnly: true },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ user }: { user: User & { role?: string } }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const userRole = user?.role;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!user) {
    return null;
  }

  return (
    <aside
      className={`transition-all duration-300 ease-in-out bg-white text-gray-800 p-4 flex flex-col border-r h-full ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed && (
          <div className="flex items-center">
            <Image
              src="/yara-crm-logo.png"
              alt="Yara CRM Logo"
              width={112}
              height={34}
            />
          </div>
        )}
        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-200">
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => {
            if (item.adminOnly && userRole !== 'admin') {
              return null;
            }
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center py-2 px-4 my-1 rounded transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-4">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <SidebarFooter user={user} />
    </aside>
  );
}

function SidebarFooter({ user }: { user: User }) {
  return (
    <div className="mt-auto">
      <div className="border-t border-gray-200 my-4" />
      <div className="flex justify-center">
        <Profile user={user} />
      </div>
    </div>
  );
}
