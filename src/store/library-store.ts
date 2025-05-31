import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Story } from '../lib/types';

interface LibraryState {
  stories: Story[];
  isLoading: boolean;
  error: string | null;
  fetchStories: () => Promise<void>;
  getStoryById: (id: string) => Story | undefined;
}

// Example pre-built stories
const sampleStories: Story[] = [
  {
    id: '1',
    title: 'Product Launch Announcement',
    synopsis: 'A dynamic product reveal for a new tech gadget, building excitement and showcasing key features.',
    category: 'Marketing',
    format: 'product-promo',
    scenes: [
      {
        id: '1-1',
        order: 0,
        script: 'Introducing the future of technology in your hands. The wait is over.',
        visualDescription: 'Dark background with glowing particles forming the product silhouette',
        imagePrompt: 'Futuristic dark background with blue glowing particles forming a sleek smartphone silhouette, dramatic lighting, photorealistic',
        videoPrompt: 'Camera slowly zooming in on glowing particle effect, particles converging to form product shape, dramatic reveal',
        voiceOver: {
          gender: 'male',
          emotion: 'confident',
          style: 'announcer',
          text: 'Introducing the future of technology in your hands. The wait is over.'
        }
      },
      {
        id: '1-2',
        order: 1,
        script: 'Engineered with precision. Designed for the extraordinary.',
        visualDescription: 'Close-up shots of product details with highlight effects',
        imagePrompt: 'Ultra close-up of premium smartphone details, machined aluminum edges, glass surface with subtle reflections, studio lighting, product photography',
        videoPrompt: 'Series of quick close-up shots transitioning between product details, each with a subtle highlight effect',
        voiceOver: {
          gender: 'female',
          emotion: 'professional',
          style: 'narrator',
          text: 'Engineered with precision. Designed for the extraordinary.'
        }
      },
    ]
  },
  {
    id: '2',
    title: 'Cozy Cafe Morning Routine',
    synopsis: 'A warm, inviting story about the morning ritual at a neighborhood cafe, from opening to serving the first customers.',
    category: 'Lifestyle',
    format: 'short-video',
    scenes: [
      {
        id: '2-1',
        order: 0,
        script: 'As the sun peeks over the horizon, the small cafe on Cherry Street begins to stir with life.',
        visualDescription: 'Early morning exterior shot of a charming cafe with warm lights turning on inside',
        imagePrompt: 'Charming neighborhood cafe exterior at dawn, warm golden light from windows, empty street, morning mist, cinematic, 35mm film look',
        videoPrompt: 'Slow establishing shot of cafe exterior as lights turn on inside, time-lapse of sky transitioning from dark blue to golden sunrise',
        voiceOver: {
          gender: 'female',
          emotion: 'warm',
          style: 'storyteller',
          text: 'As the sun peeks over the horizon, the small cafe on Cherry Street begins to stir with life.'
        }
      }
    ]
  }
];

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      stories: sampleStories,
      isLoading: false,
      error: null,
      
      fetchStories: async () => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, you would fetch from an API
          // For demo purposes, we'll use the sample stories with a small delay
          await new Promise(resolve => setTimeout(resolve, 800));
          set({ stories: sampleStories, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch stories', 
            isLoading: false 
          });
        }
      },
      
      getStoryById: (id) => {
        return get().stories.find(story => story.id === id);
      },
    }),
    {
      name: 'library-storage',
    }
  )
);