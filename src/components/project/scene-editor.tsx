import React from 'react';
import { Save, Trash2, Wand2, Mic, Image } from 'lucide-react';
import { Input } from '../ui/input';
import { TextArea } from '../ui/text-area';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Scene, VoiceOver } from '../../lib/types';
import { useAuthStore } from '../../store/auth-store';
import { aiService } from '../../services/ai-service';
import { useProjectStore } from '../../store/project-store';

interface SceneEditorProps {
  projectId: string;
  scene: Scene;
  targetAudience: string;
  storyStyle: string;
}

export const SceneEditor: React.FC<SceneEditorProps> = ({
  projectId,
  scene,
  targetAudience,
  storyStyle,
}) => {
  const { user } = useAuthStore();
  const { updateScene, deleteScene } = useProjectStore();
  const [activeTab, setActiveTab] = React.useState('script');
  const [localScene, setLocalScene] = React.useState<Scene>(scene);
  const [isGenerating, setIsGenerating] = React.useState<string | null>(null);
  
  const handleChange = (field: keyof Scene, value: string) => {
    setLocalScene(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleVoiceOverChange = (field: keyof VoiceOver, value: string) => {
    setLocalScene(prev => ({
      ...prev,
      voiceOver: {
        ...prev.voiceOver,
        [field]: value,
      },
    }));
  };
  
  const handleSave = () => {
    updateScene(projectId, scene.id, localScene);
  };
  
  const handleDelete = () => {
    deleteScene(projectId, scene.id);
  };
  
  const generateVisualPrompts = async () => {
    if (!user?.apiKey) {
      alert('Please set your API key in the settings first.');
      return;
    }
    
    setIsGenerating('visual');
    
    try {
      const result = await aiService.generateVisualPrompts({
        scene: localScene.script,
        visualDescription: localScene.visualDescription,
        apiKey: user.apiKey,
      });
      
      // In a real app, you would parse the result properly
      // For this demo, we'll just show the result
      const newScene = {
        ...localScene,
        imagePrompt: `Generated image prompt for: "${localScene.script.substring(0, 20)}..."`,
        videoPrompt: `Generated video motion prompt for: "${localScene.script.substring(0, 20)}..."`,
      };
      
      setLocalScene(newScene);
      updateScene(projectId, scene.id, newScene);
    } catch (error) {
      console.error('Failed to generate visual prompts:', error);
    } finally {
      setIsGenerating(null);
    }
  };
  
  const generateVoiceOver = async () => {
    if (!user?.apiKey) {
      alert('Please set your API key in the settings first.');
      return;
    }
    
    setIsGenerating('voice');
    
    try {
      const result = await aiService.generateVoiceOverRecommendations({
        script: localScene.script,
        targetAudience,
        storyStyle,
        apiKey: user.apiKey,
      });
      
      // In a real app, you would parse the result properly
      // For this demo, we'll just show a simulated result
      const newVoiceOver: VoiceOver = {
        gender: 'male',
        emotion: 'confident',
        style: 'narrator',
        text: localScene.script,
      };
      
      setLocalScene(prev => ({
        ...prev,
        voiceOver: newVoiceOver,
      }));
      
      updateScene(projectId, scene.id, {
        ...localScene,
        voiceOver: newVoiceOver,
      });
    } catch (error) {
      console.error('Failed to generate voice over recommendations:', error);
    } finally {
      setIsGenerating(null);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Scene {scene.order + 1}</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Save size={16} />}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Trash2 size={16} />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="script" className="flex-1">Script</TabsTrigger>
          <TabsTrigger value="visual" className="flex-1">Visual Prompts</TabsTrigger>
          <TabsTrigger value="voice" className="flex-1">Voice Over</TabsTrigger>
        </TabsList>
        
        <TabsContent value="script">
          <TextArea
            label="Script/Narration"
            className="min-h-[120px]"
            value={localScene.script}
            onChange={(e) => handleChange('script', e.target.value)}
          />
          
          <TextArea
            label="Visual Description"
            className="min-h-[80px] mt-4"
            value={localScene.visualDescription}
            onChange={(e) => handleChange('visualDescription', e.target.value)}
          />
          
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              leftIcon={<Wand2 size={16} />}
              isLoading={isGenerating === 'visual'}
              onClick={generateVisualPrompts}
            >
              Generate Visual Prompts
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="visual">
          <TextArea
            label="Image Prompt"
            className="min-h-[120px]"
            placeholder="Enter a detailed prompt for image generation (e.g., Midjourney, DALL-E)"
            value={localScene.imagePrompt}
            onChange={(e) => handleChange('imagePrompt', e.target.value)}
          />
          
          <TextArea
            label="Video Motion Prompt"
            className="min-h-[120px] mt-4"
            placeholder="Describe camera movements, transitions, and effects for video generation"
            value={localScene.videoPrompt}
            onChange={(e) => handleChange('videoPrompt', e.target.value)}
          />
          
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              leftIcon={<Image size={16} />}
              isLoading={isGenerating === 'visual'}
              onClick={generateVisualPrompts}
            >
              Regenerate Prompts
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="voice">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voice Gender
              </label>
              <select
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                value={localScene.voiceOver.gender}
                onChange={(e) => handleVoiceOverChange('gender', e.target.value as 'male' | 'female' | 'neutral')}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Emotional Tone
              </label>
              <Input
                value={localScene.voiceOver.emotion}
                onChange={(e) => handleVoiceOverChange('emotion', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voice Style
              </label>
              <Input
                value={localScene.voiceOver.style}
                onChange={(e) => handleVoiceOverChange('style', e.target.value)}
              />
            </div>
          </div>
          
          <TextArea
            label="Voice Over Text"
            className="min-h-[120px]"
            value={localScene.voiceOver.text}
            onChange={(e) => handleVoiceOverChange('text', e.target.value)}
          />
          
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              leftIcon={<Mic size={16} />}
              isLoading={isGenerating === 'voice'}
              onClick={generateVoiceOver}
            >
              Recommend Voice Over
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};