import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ProjectCard } from '../components/project/project-card';
import { useProjectStore } from '../store/project-store';

export const DashboardPage: React.FC = () => {
  const { projects, deleteProject } = useProjectStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const filteredProjects = React.useMemo(() => {
    if (!searchTerm) return projects;
    
    const term = searchTerm.toLowerCase();
    return projects.filter(project => 
      project.title.toLowerCase().includes(term) || 
      project.description.toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);
  
  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(id);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="mt-1 text-gray-500">
            Manage and edit your content projects
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search projects..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Link to="/create">
            <Button leftIcon={<Plus size={18} />}>
              New Project
            </Button>
          </Link>
        </div>
      </div>
      
      {projects.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first project to get started with content creation.
          </p>
          <Link to="/create">
            <Button leftIcon={<Plus size={18} />}>
              Create New Project
            </Button>
          </Link>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No matching projects</h3>
          <p className="text-gray-500">
            No projects found matching "{searchTerm}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};