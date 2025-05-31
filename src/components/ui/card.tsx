import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, ...props }, ref) => {
    return (
      <div
        className={cn(
          'rounded-lg border border-gray-200 bg-white shadow-sm',
          hoverable && 'transition-shadow hover:shadow-md',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        ref={ref}
        {...props}
      />
    );
  }
);
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        className={cn('text-xl font-semibold', className)}
        ref={ref}
        {...props}
      />
    );
  }
);
CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        className={cn('text-sm text-gray-500', className)}
        ref={ref}
        {...props}
      />
    );
  }
);
CardDescription.displayName = 'CardDescription';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('p-6 pt-0', className)}
        ref={ref}
        {...props}
      />
    );
  }
);
CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('flex items-center p-6 pt-0', className)}
        ref={ref}
        {...props}
      />
    );
  }
);
CardFooter.displayName = 'CardFooter';