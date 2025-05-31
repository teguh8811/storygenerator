import axios from 'axios';
import { nanoid } from 'nanoid';
import { Scene, VoiceOver } from '../lib/types';

interface GenerateContentRequest {
  prompt: string;
  apiKey: string;
}

interface GenerateContentResponse {
  content: string;
}

interface GenerateScriptRequest {
  title: string;
  description: string;
  targetAudience: string;
  storyStyle: string;
  format: string;
  duration: string;
  apiKey: string;
}

interface GenerateScriptResponse {
  synopsis: string;
  scenes: Scene[];
}

interface GeneratePromptsRequest {
  scene: string;
  visualDescription: string;
  apiKey: string;
}

interface GenerateVoiceOverRequest {
  script: string;
  targetAudience: string;
  storyStyle: string;
  apiKey: string;
}

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-2.0-flash';

const createInitialVoiceOver = (): VoiceOver => ({
  gender: 'neutral',
  emotion: 'neutral',
  style: 'narrator',
  text: '',
});

const getRecommendedSceneCount = (duration: string): { min: number; max: number } => {
  switch (duration) {
    case '30-60 seconds':
      return { min: 2, max: 4 };
    case '1-2 minutes':
      return { min: 3, max: 6 };
    case '2-5 minutes':
      return { min: 5, max: 10 };
    case '5-10 minutes':
      return { min: 8, max: 15 };
    case '10+ minutes':
      return { min: 12, max: 20 };
    default:
      return { min: 3, max: 6 };
  }
};

export const aiService = {
  generateContent: async ({ prompt, apiKey }: GenerateContentRequest): Promise<GenerateContentResponse> => {
    try {
      const response = await axios.post(
        `${BASE_URL}/${MODEL}:generateContent?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }
      );
      
      return {
        content: response.data.candidates[0].content.parts[0].text
      };
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('Failed to generate content');
    }
  },
  
  generateScript: async ({
    title,
    description,
    targetAudience,
    storyStyle,
    format,
    duration,
    apiKey
  }: GenerateScriptRequest): Promise<GenerateScriptResponse> => {
    const { min: minScenes, max: maxScenes } = getRecommendedSceneCount(duration);
    const sceneDuration = Math.floor(parseInt(duration) * 60 / minScenes);
    
    const prompt = `
      Create a professional ${format} script titled "${title}" with EXACTLY ${minScenes} distinct scenes.
      This is CRITICAL - you must generate ${minScenes} scenes, no more, no less.
      
      Project Details:
      - Description: ${description}
      - Target Audience: ${targetAudience}
      - Style: ${storyStyle}
      - Duration: ${duration}
      - Each scene should be approximately ${sceneDuration} seconds
      
      Required Scene Structure:
      1. Opening Scene (Hook): Captivating introduction (${Math.floor(sceneDuration * 0.8)} seconds)
      2. Core Content Scenes: Detailed story development
      3. Closing Scene: Strong conclusion with call-to-action
      
      For EACH scene, provide DETAILED:
      1. Visual Description: Camera angles, movements, transitions
      2. Script/Narration: Exact dialogue or voiceover text
      3. Image Generation Prompts: For AI image generation
      4. Voice Direction: Tone, emotion, pacing
      
      Format EXACTLY as follows:
      
      SYNOPSIS:
      [2-3 sentence synopsis]
      
      SCENES:
      
      ---SCENE [number]---
      DESCRIPTION: [Scene purpose and narrative context]
      SCRIPT: [Exact narration/dialogue text]
      VISUAL: [Detailed shot description, camera work]
      IMAGE_PROMPT: [Detailed prompt for AI image generation]
      VOICE: [Voice style, emotion, and delivery notes]
      ---END SCENE---
      
      [Repeat for exactly ${minScenes} scenes]
      
      Remember:
      - Each scene must smoothly transition to the next
      - Vary shot types and compositions
      - Include specific visual and audio direction
      - Maintain consistent style and tone
      - Focus on ${targetAudience} audience
      - Match ${storyStyle} style throughout
    `;
    
    try {
      const { content } = await aiService.generateContent({ prompt, apiKey });
      
      const synopsis = content.match(/SYNOPSIS:\n(.*?)(?=\n\nSCENES:)/s)?.[1].trim() || '';
      
      const sceneMatches = content.matchAll(/---SCENE \d+---\n(.*?)\n---END SCENE---/gs);
      
      const scenes: Scene[] = Array.from(sceneMatches).map((match, index) => {
        const sceneContent = match[1];
        const description = sceneContent.match(/DESCRIPTION: (.*?)(?=\nSCRIPT:)/s)?.[1].trim() || '';
        const script = sceneContent.match(/SCRIPT: (.*?)(?=\nVISUAL:)/s)?.[1].trim() || '';
        const visual = sceneContent.match(/VISUAL: (.*?)(?=\nIMAGE_PROMPT:)/s)?.[1].trim() || '';
        const imagePrompt = sceneContent.match(/IMAGE_PROMPT: (.*?)(?=\nVOICE:)/s)?.[1].trim() || '';
        const voice = sceneContent.match(/VOICE: (.*?)$/s)?.[1].trim() || '';
        
        return {
          id: nanoid(),
          order: index,
          script: script,
          visualDescription: `${visual}\n\nScene Purpose: ${description}`,
          imagePrompt: imagePrompt,
          videoPrompt: `Camera Work: ${visual}\nTransitions: Smooth transition to next scene\nTiming: Approximately ${sceneDuration} seconds`,
          voiceOver: {
            ...createInitialVoiceOver(),
            text: script,
            emotion: voice.split(',')[0]?.trim() || 'neutral',
            style: voice.split(',')[1]?.trim() || 'narrator',
          },
        };
      });
      
      // Ensure we have exactly minScenes number of scenes
      while (scenes.length < minScenes) {
        const sceneNumber = scenes.length + 1;
        scenes.push({
          id: nanoid(),
          order: scenes.length,
          script: `[Scene ${sceneNumber} Content]`,
          visualDescription: `[Detailed visual description for scene ${sceneNumber}]`,
          imagePrompt: `[Professional image generation prompt for scene ${sceneNumber}]`,
          videoPrompt: `[Camera directions and transitions for scene ${sceneNumber}]`,
          voiceOver: createInitialVoiceOver(),
        });
      }
      
      return {
        synopsis,
        scenes: scenes.slice(0, minScenes), // Ensure we don't exceed minScenes
      };
    } catch (error) {
      console.error('Failed to generate script:', error);
      throw new Error('Failed to generate script');
    }
  },
  
  generateVisualPrompts: async ({
    scene,
    visualDescription,
    apiKey
  }: GeneratePromptsRequest) => {
    const prompt = `
      Based on this scene description:
      "${scene}"
      
      And this visual direction:
      "${visualDescription}"
      
      Generate two detailed, professional prompts:
      
      1. Image Generation Prompt:
         - Ultra-detailed scene composition
         - Specific lighting and atmosphere
         - Camera angle and perspective
         - Art style and visual treatment
         - Key elements and focal points
         - Color palette and mood
         
      2. Video Direction Prompt:
         - Detailed camera movements
         - Shot transitions and timing
         - Visual effects and treatments
         - Scene pacing and flow
         - Technical specifications
      
      Format EXACTLY as:
      
      IMAGE PROMPT:
      [Comprehensive image generation prompt]
      
      VIDEO PROMPT:
      [Detailed video direction prompt]
    `;
    
    try {
      const { content } = await aiService.generateContent({ prompt, apiKey });
      
      const imagePrompt = content.match(/IMAGE PROMPT:\n(.*?)(?=\n\nVIDEO PROMPT:)/s)?.[1].trim() || '';
      const videoPrompt = content.match(/VIDEO PROMPT:\n(.*?)$/s)?.[1].trim() || '';
      
      return { imagePrompt, videoPrompt };
    } catch (error) {
      console.error('Failed to generate visual prompts:', error);
      throw new Error('Failed to generate visual prompts');
    }
  },
  
  generateVoiceOverRecommendations: async ({
    script,
    targetAudience,
    storyStyle,
    apiKey
  }: GenerateVoiceOverRequest) => {
    const prompt = `
      For this script:
      "${script}"
      
      Target audience: ${targetAudience}
      Style: ${storyStyle}
      
      Provide detailed voice-over recommendations:
      
      1. Voice Characteristics:
         - Gender and age range
         - Vocal qualities
         - Accent and pronunciation
      
      2. Performance Direction:
         - Emotional tone and intensity
         - Pacing and rhythm
         - Key emphasis points
      
      3. Technical Requirements:
         - Recording quality
         - Processing effects
         - Music/SFX integration
      
      Format EXACTLY as:
      
      GENDER: [male/female/neutral]
      EMOTION: [detailed emotional direction]
      STYLE: [specific voice style]
      DIRECTION: [complete performance notes]
      MODIFIED SCRIPT: [optimized script with emphasis marks]
    `;
    
    try {
      const { content } = await aiService.generateContent({ prompt, apiKey });
      
      const gender = (content.match(/GENDER: (.*?)(?=\n)/)?.[1].trim() || 'neutral') as 'male' | 'female' | 'neutral';
      const emotion = content.match(/EMOTION: (.*?)(?=\n)/)?.[1].trim() || 'neutral';
      const style = content.match(/STYLE: (.*?)(?=\n)/)?.[1].trim() || 'narrator';
      const text = content.match(/MODIFIED SCRIPT: (.*?)$/s)?.[1].trim() || script;
      
      return { gender, emotion, style, text };
    } catch (error) {
      console.error('Failed to generate voice-over recommendations:', error);
      throw new Error('Failed to generate voice-over recommendations');
    }
  }
};