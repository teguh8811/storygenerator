import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { StoryCard } from '../components/project/story-card';
import { useLibraryStore } from '../store/library-store';

export const LibraryPage: React.FC = () => {
  const { stories, isLoading, fetchStories } = useLibraryStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [formatFilter, setFormatFilter] = React.useState('all');
  
  React.useEffect(() => {
    fetchStories();
  }, [fetchStories]);
  
  const filteredStories = React.useMemo(() => {
    return stories.filter((story) => {
      const matchesSearch = !searchTerm || 
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        story.synopsis.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = categoryFilter === 'all' || story.category.toLowerCase() === categoryFilter;
      const matchesFormat = formatFilter === 'all' || story.format === formatFilter;
      
      return matchesSearch && matchesCategory && matchesFormat;
    });
  }, [stories, searchTerm, categoryFilter, formatFilter]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Story Library</h1>
        <p className="mt-1 text-gray-500">
          Browse and use pre-built story templates
        </p>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search templates..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'marketing', label: 'Marketing' },
              { value: 'lifestyle', label: 'Lifestyle' },
              { value: 'education', label: 'Education' },
              { value: 'entertainment', label: 'Entertainment' },
            ]}
          />
          
          <Select
            label="Format"
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Formats' },
              { value: 'reels', label: 'Instagram Reels' },
              { value: 'short-video', label: 'Short Video' },
              { value: 'fiction', label: 'Fiction Story' },
              { value: 'product-promo', label: 'Product Promotion' },
            ]}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};