import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link to="/" className="text-gray-500 hover:text-gray-900">
              Home
            </Link>
            <Link to="/about" className="text-gray-500 hover:text-gray-900">
              About
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-900">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-900">
              Terms
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center text-gray-500 text-sm md:text-right">
              &copy; {new Date().getFullYear()} StoryGen. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};