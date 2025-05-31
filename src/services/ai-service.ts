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
    const prompt = `
      Create a complete, cohesive story for a ${format} titled "${title}".
      
      Project Details:
      - Description: ${description}
      - Target Audience: ${targetAudience}
      - Style: ${storyStyle}
      - Duration: ${duration}
      
      Please provide:
      1. A compelling synopsis (2-3 sentences)
      2. A detailed scene-by-scene breakdown where each scene connects logically to form a complete narrative arc. For each scene include:
         - Scene description and its role in the overall story
         - Detailed script/narration with specific dialogue or voiceover text
         - Visual description including setting, actions, and key visual elements
         - Suggested emotional tone and pacing
      
      Ensure the story has:
      - Clear beginning, middle, and end
      - Logical progression between scenes
      - Consistent tone and style
      - Appropriate pacing for the format and duration
      
      Format the output exactly as follows:
      
      SYNOPSIS:
      [synopsis text]
      
      SCENES:
      
      ---SCENE 1---
      DESCRIPTION: [scene description and its purpose in the story]
      SCRIPT: [detailed script/narration text]
      VISUAL: [comprehensive visual description]
      TONE: [emotional tone and pacing notes]
      ---END SCENE---
      
      [repeat for each scene, maintaining story continuity]
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
      
      // If no scenes were parsed, create at least one
      if (scenes.length === 0) {
        scenes.push({
          id: nanoid(),
          order: 0,
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