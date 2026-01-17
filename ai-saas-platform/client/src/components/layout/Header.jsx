import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import {
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
  useUser
} from '@clerk/clerk-react';
import ProTimer from '../common/ProTimer';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/features' },
  { label: 'Contact', path: '/contact' },
  { label: 'Dashboard', path: '/dashboard', requiresAuth: true },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openSignIn } = useClerk();
  const { user } = useUser();

  const isPro =
    user?.publicMetadata?.isPro ||
    localStorage.getItem('user_isPro') === 'true';

  const subscriptionEndDate =
    user?.publicMetadata?.subscriptionEndDate ||
    localStorage.getItem('user_subscriptionEndDate');

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
              AI
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI SaaS Pro
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {navItems.map(item => (
              item.requiresAuth ? (
                <SignedIn key={item.path}>
                  <Link
                    to={item.path}
                    className="font-medium text-gray-600 hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                </SignedIn>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className="font-medium text-gray-600 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            <SignedIn>
              <ProTimer
                isPro={isPro}
                subscriptionEndDate={subscriptionEndDate}
              />

              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <button
                onClick={openSignIn}
                className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Get Started
              </button>
            </SignedOut>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            {navItems.map(item => (
              item.requiresAuth ? (
                <SignedIn key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="block text-gray-600 hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                </SignedIn>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-600 hover:text-blue-600"
                >
                  {item.label}
                </Link>
              )
            ))}

            <SignedIn>
              <div className="pt-4 border-t space-y-3">
                <ProTimer
                  isPro={isPro}
                  subscriptionEndDate={subscriptionEndDate}
                />
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <button
                onClick={() => {
                  openSignIn();
                  setMenuOpen(false);
                }}
                className="w-full py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Get Started
              </button>
            </SignedOut>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
