import React from 'react';
import { cn } from '../../lib/utils';

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || '');
    
    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);
    
    const handleValueChange = React.useCallback((newValue: string) => {
      setSelectedValue(newValue);
      onValueChange?.(newValue);
    }, [onValueChange]);
    
    return (
      <TabsContext.Provider value={{ value: selectedValue, onValueChange: handleValueChange }}>
        <div className={cn('', className)} ref={ref} {...props} />
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1', className)}
        ref={ref}
        {...props}
      />
    );
  }
);
TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    
    if (!context) {
      throw new Error('TabsTrigger must be used within a Tabs component');
    }
    
    const { value: selectedValue, onValueChange } = context;
    const isSelected = selectedValue === value;
    
    return (
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isSelected
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-700 hover:text-gray-900',
          className
        )}
        ref={ref}
        onClick={() => onValueChange(value)}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(TabsContext);
    
    if (!context) {
      throw new Error('TabsContent must be used within a Tabs component');
    }
    
    const { value: selectedValue } = context;
    const isSelected = selectedValue === value;
    
    if (!isSelected) return null;
    
    return (
      <div
        className={cn('mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2', className)}
        ref={ref}
        {...props}
      />
    );
  }
);
TabsContent.displayName = 'TabsContent';