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
          contents: [{ parts: [{ text: prompt }] }]
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
    
    const prompt = `
      Create a complete, professional ${format} script titled "${title}" with ${minScenes}-${maxScenes} distinct scenes.
      
      Project Details:
      - Description: ${description}
      - Target Audience: ${targetAudience}
      - Style: ${storyStyle}
      - Duration: ${duration}
      
      Requirements:
      1. Generate exactly ${minScenes}-${maxScenes} scenes to properly pace the content
      2. Each scene should be 10-20 seconds in length
      3. Ensure smooth transitions between scenes
      4. Include varied shot types (wide, medium, close-up) across scenes
      5. Balance dialogue/narration with visual elements
      
      Content Guidelines:
      - Opening Scene: Hook the audience with a strong visual or statement
      - Middle Scenes: Develop the core message/story with supporting points
      - Closing Scene: Clear call-to-action or memorable conclusion
      
      Please provide:
      1. A compelling synopsis (2-3 sentences)
      2. ${minScenes}-${maxScenes} detailed scenes, each including:
         - Scene description and purpose
         - Specific script/narration text
         - Detailed visual description
         - Emotional tone and pacing notes
      
      Format Requirements:
      
      SYNOPSIS:
      [2-3 sentence synopsis]
      
      SCENES:
      
      ---SCENE 1---
      DESCRIPTION: [scene purpose and narrative context]
      SCRIPT: [exact narration/dialogue text]
      VISUAL: [detailed visual description]
      TONE: [emotional tone and pacing]
      ---END SCENE---
      
      [Repeat for each scene, maintaining story flow]
      
      Additional Notes:
      - For ${format}, optimize scene length and pacing
      - Target ${targetAudience} with appropriate language and visuals
      - Maintain ${storyStyle} style throughout
      - Total duration should fit within ${duration}
    `;
    
    try {
      const { content } = await aiService.generateContent({ prompt, apiKey });
      
      // Parse the AI response
      const synopsis = content.match(/SYNOPSIS:\n(.*?)(?=\n\nSCENES:)/s)?.[1].trim() || '';
      
      const sceneMatches = content.matchAll(/---SCENE \d+---\nDESCRIPTION: (.*?)\nSCRIPT: (.*?)\nVISUAL: (.*?)\nTONE: (.*?)\n---END SCENE---/gs);
      
      const scenes: Scene[] = Array.from(sceneMatches).map((match, index) => {
        const [_, description, script, visual, tone] = match;
        
        // Create a rich visual description combining the visual and tone information
        const visualDescription = `${visual.trim()}\n\nTone: ${tone.trim()}`;
        
        // Initialize the scene with the generated content
        return {
          id: nanoid(),
          order: index,
          script: script.trim(),
          visualDescription: visualDescription,
          imagePrompt: '',
          videoPrompt: '',
          voiceOver: {
            ...createInitialVoiceOver(),
            text: script.trim(), // Initialize voice over with the script
          },
        };
      });
      
      // Ensure we have at least the minimum number of scenes
      while (scenes.length < minScenes) {
        scenes.push({
          id: nanoid(),
          order: scenes.length,
          script: '',
          visualDescription: '',
          imagePrompt: '',
          videoPrompt: '',
          voiceOver: createInitialVoiceOver(),
        });
      }
      
      return {
        synopsis,
        scenes,
      };
    } catch (error) {
      console.error('Error generating script:', error);
      throw new Error('Failed to generate script');
    }
  },
  
  generateVisualPrompts: async ({
    scene,
    visualDescription,
    apiKey
  }: GeneratePromptsRequest) => {
    const prompt = `
      Based on this scene:
      "${scene}"
      
      And this visual description:
      "${visualDescription}"
      
      Generate two detailed prompts:
      1. A comprehensive image generation prompt for AI tools like Midjourney or DALL-E, including:
         - Scene composition
         - Lighting and atmosphere
         - Key visual elements
         - Style and artistic direction
         
      2. A detailed video motion prompt describing:
         - Camera movements and angles
         - Transitions and effects
         - Timing and pacing
         - Any special visual treatments
      
      Format the output as:
      
      IMAGE PROMPT:
      [detailed image prompt]
      
      VIDEO PROMPT:
      [detailed video motion prompt]
    `;
    
    try {
      const { content } = await aiService.generateContent({ prompt, apiKey });
      
      const imagePrompt = content.match(/IMAGE PROMPT:\n(.*?)(?=\n\nVIDEO PROMPT:)/s)?.[1].trim() || '';
      const videoPrompt = content.match(/VIDEO PROMPT:\n(.*?)$/s)?.[1].trim() || '';
      
      return { imagePrompt, videoPrompt };
    } catch (error) {
      console.error('Error generating visual prompts:', error);
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
      
      Provide detailed voice-over recommendations that will best convey the message and engage the audience. Include:
      
      1. Voice characteristics
      2. Performance direction
      3. Optimized script for vocal delivery
      
      Format your response exactly as:
      
      GENDER: [male/female/neutral]
      EMOTION: [detailed emotional tone]
      STYLE: [specific voice style]
      DIRECTION: [performance notes and guidance]
      MODIFIED SCRIPT: [script optimized for voice-over delivery]
    `;
    
    try {
      const { content } = await aiService.generateContent({ prompt, apiKey });
      
      const gender = (content.match(/GENDER: (.*?)(?=\n)/)?.[1].trim() || 'neutral') as 'male' | 'female' | 'neutral';
      const emotion = content.match(/EMOTION: (.*?)(?=\n)/)?.[1].trim() || 'neutral';
      const style = content.match(/STYLE: (.*?)(?=\n)/)?.[1].trim() || 'narrator';
      const text = content.match(/MODIFIED SCRIPT: (.*?)$/s)?.[1].trim() || script;
      
      return { gender, emotion, style, text };
    } catch (error) {
      console.error('Error generating voice-over recommendations:', error);
      throw new Error('Failed to generate voice-over recommendations');
    }
  }
};