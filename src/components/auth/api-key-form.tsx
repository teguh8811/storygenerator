import React from 'react';
import { useForm } from 'react-hook-form';
import { Key } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';

interface ApiKeyFormProps {
  onSuccess?: () => void;
}

interface ApiKeyFormValues {
  apiKey: string;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSuccess }) => {
  const { user, saveApiKey } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ApiKeyFormValues>({
    defaultValues: {
      apiKey: user?.apiKey || '',
    },
  });
  
  const onSubmit = async (data: ApiKeyFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you might want to verify the API key first
      saveApiKey(data.apiKey);
      onSuccess?.();
    } catch (error) {
      setError('Failed to save API key. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">API Key Configuration</h3>
        <p className="mt-1 text-sm text-gray-500">
          Enter your Gemini API key to enable AI content generation features.
          You can get an API key from the <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a>.
        </p>
      </div>
      
      <Input
        label="Gemini API Key"
        leftIcon={<Key size={18} />}
        error={errors.apiKey?.message}
        {...register('apiKey', { 
          required: 'API key is required',
          minLength: {
            value: 10,
            message: 'API key is too short',
          }
        })}
      />
      
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Save API Key
        </Button>
      </div>
    </form>
  );
};