import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, Eye } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Story } from '../../lib/types';
import { truncate } from '../../lib/utils';
import { useProjectStore } from '../../store/project-store';

interface StoryCardProps {
  story: Story;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  const { createProject } = useProjectStore();
  const navigate = Link.useNavigate();
  
  const handleUseTemplate = () => {
    createProject({
      title: `${story.title} (Copy)`,
      description: story.synopsis,
      targetAudience: 'General',
      storyStyle: story.category.toLowerCase(),
      format: story.format,
      duration: '1-2 minutes',
    });
    
    // Navigate to the projects page
    navigate('/dashboard');
  };
  
  return (
    <Card hoverable className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{story.title}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{story.category}</span>
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            {story.format}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{truncate(story.synopsis, 150)}</p>
        <div className="mt-4 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Scenes:</span>
            <span>{story.scenes.length}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Link to={`/preview/${story.id}`}>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Eye size={16} />}
          >
            Preview
          </Button>
        </Link>
        <Button
          size="sm"
          leftIcon={<Copy size={16} />}
          onClick={handleUseTemplate}
        >
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
};