import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login(data.email, data.password);
      onSuccess?.() || navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
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
      
      <Input
        label="Email"
        type="email"
        leftIcon={<Mail size={18} />}
        error={errors.email?.message}
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          }
        })}
      />
      
      <Input
        label="Password"
        type="password"
        leftIcon={<Lock size={18} />}
        error={errors.password?.message}
        {...register('password', { 
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          }
        })}
      />
      
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Log In
        </Button>
      </div>
    </form>
  );
};