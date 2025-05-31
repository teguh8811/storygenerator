import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { TextArea } from '../ui/text-area';
import { Select } from '../ui/select';
import { Button } from '../ui/button';
import { useProjectStore } from '../../store/project-store';
import { useAuthStore } from '../../store/auth-store';
import { aiService } from '../../services/ai-service';

interface CreateProjectFormValues {
  title: string;
  description: string;
  targetAudience: string;
  storyStyle: string;
  format: string;
  duration: string;
}

export const CreateProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createProject } = useProjectStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CreateProjectFormValues>({
    defaultValues: {
      title: '',
      description: '',
      targetAudience: 'general',
      storyStyle: 'educational',
      format: 'short-video',
      duration: '1-2 minutes',
    },
  });
  
  const storyStyleOptions = [
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' },
    { value: 'horror', label: 'Horror' },
    { value: 'educational', label: 'Educational' },
  ];
  
  const formatOptions = [
    { value: 'reels', label: 'Instagram Reels' },
    { value: 'short-video', label: 'Short Video' },
    { value: 'fiction', label: 'Fiction Story' },
    { value: 'product-promo', label: 'Product Promotion' },
  ];
  
  const durationOptions = [
    { value: '30-60 seconds', label: '30-60 seconds' },
    { value: '1-2 minutes', label: '1-2 minutes' },
    { value: '2-5 minutes', label: '2-5 minutes' },
    { value: '5-10 minutes', label: '5-10 minutes' },
    { value: '10+ minutes', label: '10+ minutes' },
  ];
  
  const targetAudienceOptions = [
    { value: 'general', label: 'General Audience' },
    { value: 'children', label: 'Children' },
    { value: 'teenagers', label: 'Teenagers' },
    { value: 'young-adults', label: 'Young Adults' },
    { value: 'professionals', label: 'Professionals' },
    { value: 'seniors', label: 'Seniors' },
  ];
  
  const onSubmit = async (data: CreateProjectFormValues) => {
    if (!user?.apiKey) {
      setError('Please set your Gemini API key in the settings first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate initial script and scenes using AI
      const { synopsis, scenes } = await aiService.generateScript({
        ...data,
        apiKey: user.apiKey,
      });
      
      // Create the project with AI-generated content
      createProject({
        ...data,
        description: data.description + '\n\nSynopsis: ' + synopsis,
        scenes,
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create project:', error);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <Input
        label="Project Title"
        error={errors.title?.message}
        {...register('title', { 
          required: 'Title is required',
          minLength: {
            value: 3,
            message: 'Title must be at least 3 characters',
          }
        })}
      />
      
      <TextArea
        label="Description"
        error={errors.description?.message}
        {...register('description', { 
          required: 'Description is required',
          minLength: {
            value: 10,
            message: 'Description must be at least 10 characters',
          }
        })}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Target Audience"
          options={targetAudienceOptions}
          error={errors.targetAudience?.message}
          {...register('targetAudience', { required: 'Target audience is required' })}
        />
        
        <Select
          label="Story Style"
          options={storyStyleOptions}
          error={errors.storyStyle?.message}
          {...register('storyStyle', { required: 'Story style is required' })}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Format"
          options={formatOptions}
          error={errors.format?.message}
          {...register('format', { required: 'Format is required' })}
        />
        
        <Select
          label="Duration"
          options={durationOptions}
          error={errors.duration?.message}
          {...register('duration', { required: 'Duration is required' })}
        />
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button
          type="button"
          variant="outline"
          className="mr-4"
          onClick={() => navigate('/dashboard')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          Generate Project
        </Button>
      </div>
    </form>
  );
};