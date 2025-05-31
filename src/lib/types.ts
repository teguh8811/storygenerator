export interface User {
  id: string;
  name: string;
  email: string;
  apiKey?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  targetAudience: string;
  storyStyle: string;
  format: string;
  duration: string;
  createdAt: Date;
  updatedAt: Date;
  scenes: Scene[];
}

export interface Scene {
  id: string;
  order: number;
  script: string;
  visualDescription: string;
  imagePrompt: string;
  videoPrompt: string;
  voiceOver: VoiceOver;
}

export interface VoiceOver {
  gender: 'male' | 'female' | 'neutral';
  emotion: string;
  style: string;
  text: string;
}

export interface Story {
  id: string;
  title: string;
  synopsis: string;
  category: string;
  format: string;
  scenes: Scene[];
}

export type StoryStyle = 'comedy' | 'drama' | 'horror' | 'educational';
export type ContentFormat = 'reels' | 'short-video' | 'fiction' | 'product-promo';