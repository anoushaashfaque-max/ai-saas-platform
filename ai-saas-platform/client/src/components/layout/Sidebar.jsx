import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Image,
  Brush,
  Scissors,
  FileCheck,
  Settings,
  CreditCard,
  History
} from 'lucide-react';

const Sidebar = () => {
  const { pathname } = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Article Writer', path: '/tools/article', icon: FileText },
    { label: 'Blog Generator', path: '/tools/blog', icon: FileText },
    { label: 'Image Generator', path: '/tools/image', icon: Image },
    { label: 'Background Removal', path: '/tools/background', icon: Brush },
    { label: 'Object Removal', path: '/tools/object', icon: Scissors },
    { label: 'Resume Reviewer', path: '/tools/resume', icon: FileCheck },
    { label: 'My Creations', path: '/creations', icon: History },
    { label: 'Billing', path: '/billing', icon: CreditCard },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r min-h-[calc(100vh-4rem)]">
      <div className="p-6 w-full">

        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <span className="font-bold text-lg">AI Tools</span>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {menuItems.map(({ label, path, icon: Icon }) => {
            const isActive = pathname === path;

            return (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-l-4 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon
                  size={20}
                  className={isActive ? 'text-blue-600' : 'text-gray-500'}
                />
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Tip Box */}
        <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
          <p className="text-sm font-medium text-blue-800">Pro Tip</p>
          <p className="text-xs text-blue-600 mt-1">
            Use clear keywords for better AI results
          </p>
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
