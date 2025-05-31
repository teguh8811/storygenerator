import React from 'react';
import { ApiKeyForm } from '../components/auth/api-key-form';

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-500">
          Manage your account and API integrations
        </p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <ApiKeyForm />
      </div>
    </div>
  );
};