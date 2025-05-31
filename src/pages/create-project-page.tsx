import React from 'react';
import { CreateProjectForm } from '../components/project/create-project-form';

export const CreateProjectPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
        <p className="mt-1 text-gray-500">
          Set up your content project details to get started
        </p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <CreateProjectForm />
      </div>
    </div>
  );
};