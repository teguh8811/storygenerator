import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Save, ArrowLeft, FileDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { TextArea } from '../components/ui/text-area';
import { Select } from '../components/ui/select';
import { SceneEditor } from '../components/project/scene-editor';
import { useProjectStore } from '../store/project-store';

export const EditProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { projects, currentProject, setCurrentProject, updateProject, addScene } = useProjectStore();
  
  React.useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    }
  }, [projectId, setCurrentProject]);
  
  if (!currentProject) {
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
  
  const handleUpdateField = (field: string, value: string) => {
    updateProject(currentProject.id, { [field]: value } as any);
  };
  
  const handleAddScene = () => {
    addScene(currentProject.id);
  };
  
  const handleExport = () => {
    // In a real app, this would generate a proper export
    const exportData = JSON.stringify(currentProject, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            leftIcon={<FileDown size={16} />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="primary"
            leftIcon={<Save size={16} />}
          >
            Save Project
          </Button>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Project Title"
            value={currentProject.title}
            onChange={(e) => handleUpdateField('title', e.target.value)}
          />
          
          <Select
            label="Format"
            value={currentProject.format}
            onChange={(e) => handleUpdateField('format', e.target.value)}
            options={[
              { value: 'reels', label: 'Instagram Reels' },
              { value: 'short-video', label: 'Short Video' },
              { value: 'fiction', label: 'Fiction Story' },
              { value: 'product-promo', label: 'Product Promotion' },
            ]}
          />
        </div>
        
        <div className="mt-4">
          <TextArea
            label="Description"
            value={currentProject.description}
            onChange={(e) => handleUpdateField('description', e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Select
            label="Target Audience"
            value={currentProject.targetAudience}
            onChange={(e) => handleUpdateField('targetAudience', e.target.value)}
            options={[
              { value: 'general', label: 'General Audience' },
              { value: 'children', label: 'Children' },
              { value: 'teenagers', label: 'Teenagers' },
              { value: 'young-adults', label: 'Young Adults' },
              { value: 'professionals', label: 'Professionals' },
              { value: 'seniors', label: 'Seniors' },
            ]}
          />
          
          <Select
            label="Story Style"
            value={currentProject.storyStyle}
            onChange={(e) => handleUpdateField('storyStyle', e.target.value)}
            options={[
              { value: 'comedy', label: 'Comedy' },
              { value: 'drama', label: 'Drama' },
              { value: 'horror', label: 'Horror' },
              { value: 'educational', label: 'Educational' },
            ]}
          />
          
          <Select
            label="Duration"
            value={currentProject.duration}
            onChange={(e) => handleUpdateField('duration', e.target.value)}
            options={[
              { value: '30-60 seconds', label: '30-60 seconds' },
              { value: '1-2 minutes', label: '1-2 minutes' },
              { value: '2-5 minutes', label: '2-5 minutes' },
              { value: '5-10 minutes', label: '5-10 minutes' },
              { value: '10+ minutes', label: '10+ minutes' },
            ]}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Scenes</h2>
          <Button
            leftIcon={<Plus size={16} />}
            onClick={handleAddScene}
          >
            Add Scene
          </Button>
        </div>
        <p className="mt-1 text-gray-500">
          Edit your content scene by scene
        </p>
      </div>
      
      <div className="space-y-6">
        {currentProject.scenes.map((scene) => (
          <SceneEditor
            key={scene.id}
            projectId={currentProject.id}
            scene={scene}
            targetAudience={currentProject.targetAudience}
            storyStyle={currentProject.storyStyle}
          />
        ))}
      </div>
    </div>
  );
};