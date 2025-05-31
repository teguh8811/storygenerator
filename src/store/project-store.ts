import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Project, Scene, VoiceOver } from '../lib/types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'scenes'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string) => void;
  addScene: (projectId: string) => void;
  updateScene: (projectId: string, sceneId: string, updates: Partial<Scene>) => void;
  deleteScene: (projectId: string, sceneId: string) => void;
  reorderScenes: (projectId: string, sceneIds: string[]) => void;
}

const createInitialVoiceOver = (): VoiceOver => ({
  gender: 'neutral',
  emotion: 'neutral',
  style: 'narrator',
  text: '',
});

const createEmptyScene = (order: number): Scene => ({
  id: crypto.randomUUID(),
  order,
  script: '',
  visualDescription: '',
  imagePrompt: '',
  videoPrompt: '',
  voiceOver: createInitialVoiceOver(),
});

// Custom storage with date handling
const customStorage = {
  getItem: (name: string): string | null => {
    const str = localStorage.getItem(name);
    if (!str) return str;
    
    return JSON.stringify(JSON.parse(str, (key, value) => {
      // Convert date strings back to Date objects
      if (key === 'createdAt' || key === 'updatedAt') {
        return new Date(value);
      }
      return value;
    }));
  },
  setItem: (name: string, value: string) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      
      createProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          scenes: [createEmptyScene(0)],
        };
        
        set((state) => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
        }));
      },
      
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map(project => 
            project.id === id 
              ? { ...project, ...updates, updatedAt: new Date() } 
              : project
          ),
          currentProject: state.currentProject?.id === id 
            ? { ...state.currentProject, ...updates, updatedAt: new Date() } 
            : state.currentProject,
        }));
      },
      
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter(project => project.id !== id),
          currentProject: state.currentProject?.id === id 
            ? null 
            : state.currentProject,
        }));
      },
      
      setCurrentProject: (id) => {
        const project = get().projects.find(p => p.id === id) || null;
        set({ currentProject: project });
      },
      
      addScene: (projectId) => {
        set((state) => {
          const projectIndex = state.projects.findIndex(p => p.id === projectId);
          if (projectIndex === -1) return state;
          
          const project = state.projects[projectIndex];
          const newSceneOrder = project.scenes.length;
          const newScene = createEmptyScene(newSceneOrder);
          
          const updatedProject = {
            ...project,
            scenes: [...project.scenes, newScene],
            updatedAt: new Date(),
          };
          
          const updatedProjects = [...state.projects];
          updatedProjects[projectIndex] = updatedProject;
          
          return {
            projects: updatedProjects,
            currentProject: state.currentProject?.id === projectId 
              ? updatedProject 
              : state.currentProject,
          };
        });
      },
      
      updateScene: (projectId, sceneId, updates) => {
        set((state) => {
          const projectIndex = state.projects.findIndex(p => p.id === projectId);
          if (projectIndex === -1) return state;
          
          const project = state.projects[projectIndex];
          const updatedScenes = project.scenes.map(scene => 
            scene.id === sceneId ? { ...scene, ...updates } : scene
          );
          
          const updatedProject = {
            ...project,
            scenes: updatedScenes,
            updatedAt: new Date(),
          };
          
          const updatedProjects = [...state.projects];
          updatedProjects[projectIndex] = updatedProject;
          
          return {
            projects: updatedProjects,
            currentProject: state.currentProject?.id === projectId 
              ? updatedProject 
              : state.currentProject,
          };
        });
      },
      
      deleteScene: (projectId, sceneId) => {
        set((state) => {
          const projectIndex = state.projects.findIndex(p => p.id === projectId);
          if (projectIndex === -1) return state;
          
          const project = state.projects[projectIndex];
          if (project.scenes.length <= 1) return state; // Prevent deleting the last scene
          
          const updatedScenes = project.scenes
            .filter(scene => scene.id !== sceneId)
            .map((scene, index) => ({ ...scene, order: index }));
          
          const updatedProject = {
            ...project,
            scenes: updatedScenes,
            updatedAt: new Date(),
          };
          
          const updatedProjects = [...state.projects];
          updatedProjects[projectIndex] = updatedProject;
          
          return {
            projects: updatedProjects,
            currentProject: state.currentProject?.id === projectId 
              ? updatedProject 
              : state.currentProject,
          };
        });
      },
      
      reorderScenes: (projectId, sceneIds) => {
        set((state) => {
          const projectIndex = state.projects.findIndex(p => p.id === projectId);
          if (projectIndex === -1) return state;
          
          const project = state.projects[projectIndex];
          const sceneMap = new Map(project.scenes.map(scene => [scene.id, scene]));
          
          const updatedScenes = sceneIds.map((id, index) => {
            const scene = sceneMap.get(id);
            if (!scene) return null;
            return { ...scene, order: index };
          }).filter((scene): scene is Scene => scene !== null);
          
          const updatedProject = {
            ...project,
            scenes: updatedScenes,
            updatedAt: new Date(),
          };
          
          const updatedProjects = [...state.projects];
          updatedProjects[projectIndex] = updatedProject;
          
          return {
            projects: updatedProjects,
            currentProject: state.currentProject?.id === projectId 
              ? updatedProject 
              : state.currentProject,
          };
        });
      },
    }),
    {
      name: 'project-storage',
      storage: customStorage,
    }
  )
);