import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { formatDate, truncate } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Project } from '../../lib/types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDelete }) => {
  const sceneCount = project.scenes.length;
  
  return (
    <Card hoverable className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>Created {formatDate(project.createdAt)}</span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {project.format}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-2">{truncate(project.description, 120)}</p>
        <div className="mt-4 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Audience:</span>
            <span>{project.targetAudience}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Style:</span>
            <span>{project.storyStyle}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Duration:</span>
            <span>{project.duration}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Scenes:</span>
            <span>{sceneCount}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Trash2 size={16} />}
          onClick={() => onDelete(project.id)}
        >
          Delete
        </Button>
        <div className="flex space-x-2">
          <Link to={`/edit/${project.id}`}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit size={16} />}
            >
              Edit
            </Button>
          </Link>
          <Link to={`/project/${project.id}`}>
            <Button
              size="sm"
              leftIcon={<ExternalLink size={16} />}
            >
              Open
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};