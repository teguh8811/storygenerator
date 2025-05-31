import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Edit, ArrowLeft, FileDown, Printer } from 'lucide-react';
import { Button } from '../components/ui/button';
import { formatDate } from '../lib/utils';
import { useProjectStore } from '../store/project-store';

export const ProjectViewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, setCurrentProject } = useProjectStore();
  const [project, setProject] = React.useState(projects.find(p => p.id === projectId));
  
  React.useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
      setProject(projects.find(p => p.id === projectId));
    }
  }, [projectId, setCurrentProject, projects]);
  
  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
        <p className="text-gray-500 mb-6">
          The project you're looking for doesn't exist or has been deleted.
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  const handleExport = () => {
    // In a real app, this would generate a proper export
    const exportData = JSON.stringify(project, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/dashboard')}
        >
          Back to Projects
        </Button>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            leftIcon={<Printer size={16} />}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="outline"
            leftIcon={<FileDown size={16} />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Link to={`/edit/${project.id}`}>
            <Button
              leftIcon={<Edit size={16} />}
            >
              Edit
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
        <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
          <span>Created: {formatDate(project.createdAt)}</span>
          <span>•</span>
          <span>Format: {project.format}</span>
          <span>•</span>
          <span>Duration: {project.duration}</span>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
          <p className="text-gray-700">{project.description}</p>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-900">Target Audience</h3>
            <p className="text-gray-700 mt-1">{project.targetAudience}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-900">Style</h3>
            <p className="text-gray-700 mt-1">{project.storyStyle}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-900">Scenes</h3>
            <p className="text-gray-700 mt-1">{project.scenes.length}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Script & Prompts</h2>
        
        {project.scenes.map((scene, index) => (
          <div key={scene.id} className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Scene {index + 1}
            </h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Script</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 whitespace-pre-wrap">{scene.script || "No script content"}</p>
                </div>
              </div>
              
              {scene.visualDescription && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Visual Description</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700 whitespace-pre-wrap">{scene.visualDescription}</p>
                  </div>
                </div>
              )}
              
              {scene.imagePrompt && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Image Prompt</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700 whitespace-pre-wrap">{scene.imagePrompt}</p>
                  </div>
                </div>
              )}
              
              {scene.videoPrompt && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Video Motion Prompt</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700 whitespace-pre-wrap">{scene.videoPrompt}</p>
                  </div>
                </div>
              )}
              
              {scene.voiceOver && scene.voiceOver.text && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Voice Over</h4>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {scene.voiceOver.gender}
                      </span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {scene.voiceOver.emotion}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {scene.voiceOver.style}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{scene.voiceOver.text}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};