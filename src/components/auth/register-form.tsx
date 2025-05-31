import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAuthStore } from '../../store/auth-store';

interface RegisterFormProps {
  onSuccess?: () => void;
}

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await registerUser(data.name, data.email, data.password);
      onSuccess?.() || navigate('/dashboard');
    } catch (error) {
      setError('Registration failed. Please try again.');
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
        label="Full Name"
        leftIcon={<User size={18} />}
        error={errors.name?.message}
        {...register('name', { 
          required: 'Name is required',
          minLength: {
            value: 2,
            message: 'Name must be at least 2 characters',
          }
        })}
      />
      
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
      
      <Input
        label="Confirm Password"
        type="password"
        leftIcon={<Lock size={18} />}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', { 
          required: 'Please confirm your password',
          validate: value => value === password || 'Passwords do not match',
        })}
      />
      
      <div className="pt-2">
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </div>
    </form>
  );
};