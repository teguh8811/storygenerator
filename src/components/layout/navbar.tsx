import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Plus, Book, Settings, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-blue-600 font-bold text-xl">StoryGen</span>
            </Link>
          </div>
          
          {isAuthenticated && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <Link to="/dashboard">
                <Button 
                  variant={isActive('/dashboard') ? 'primary' : 'ghost'}
                  className={isActive('/dashboard') ? '' : 'text-gray-700'}
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/create">
                <Button 
                  variant={isActive('/create') ? 'primary' : 'ghost'}
                  className={isActive('/create') ? '' : 'text-gray-700'}
                  leftIcon={<Plus size={18} />}
                >
                  Create New
                </Button>
              </Link>
              <Link to="/library">
                <Button 
                  variant={isActive('/library') ? 'primary' : 'ghost'}
                  className={isActive('/library') ? '' : 'text-gray-700'}
                  leftIcon={<Book size={18} />}
                >
                  Library
                </Button>
              </Link>
              <Link to="/settings">
                <Button 
                  variant="ghost"
                  className="text-gray-700"
                  leftIcon={<Settings size={18} />}
                >
                  Settings
                </Button>
              </Link>
              <Button 
                variant="ghost"
                className="text-gray-700"
                leftIcon={<LogOut size={18} />}
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          )}
          
          {!isAuthenticated && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <Link to="/login">
                <Button 
                  variant={isActive('/login') ? 'primary' : 'outline'}
                >
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
          
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/dashboard') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/create" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/create') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={closeMenu}
                >
                  Create New
                </Link>
                <Link 
                  to="/library" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/library') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={closeMenu}
                >
                  Library
                </Link>
                <Link 
                  to="/settings" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/settings') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={closeMenu}
                >
                  Settings
                </Link>
                <button 
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/login') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={closeMenu}
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/register') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};