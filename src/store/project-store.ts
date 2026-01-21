import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LfaProject, ProjectProgress, LfaComponent, Level, Quest } from "@/types";
import { JOURNEY_LEVELS } from "@/config/journey";

interface ProjectState {
  // Current project
  currentProject: LfaProject | null;
  progress: ProjectProgress | null;
  components: LfaComponent[];
  
  // Journey state
  levels: Level[];
  currentLevel: number;
  currentQuest: number;
  
  // UI state
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Actions
  setCurrentProject: (project: LfaProject | null) => void;
  setProgress: (progress: ProjectProgress | null) => void;
  setComponents: (components: LfaComponent[]) => void;
  updateComponent: (componentId: string, content: Record<string, unknown>) => void;
  
  // Journey actions
  setCurrentLevel: (level: number) => void;
  setCurrentQuest: (quest: number) => void;
  completeQuest: (questId: string) => void;
  unlockLevel: (levelId: number) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  
  // Reset
  reset: () => void;
}

const initialState = {
  currentProject: null,
  progress: null,
  components: [],
  levels: JOURNEY_LEVELS,
  currentLevel: 1,
  currentQuest: 1,
  isLoading: false,
  isSaving: false,
  error: null,
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentProject: (project) => set({ currentProject: project }),

      setProgress: (progress) => {
        if (progress) {
          set({
            progress,
            currentLevel: progress.currentLevel,
            currentQuest: progress.currentQuest,
          });
        } else {
          set({ progress: null });
        }
      },

      setComponents: (components) => set({ components }),

      updateComponent: (componentId, content) => {
        const { components } = get();
        const updatedComponents = components.map((c) =>
          c.id === componentId ? { ...c, content } : c
        );
        set({ components: updatedComponents });
      },

      setCurrentLevel: (level) => set({ currentLevel: level }),

      setCurrentQuest: (quest) => set({ currentQuest: quest }),

      completeQuest: (questId) => {
        const { levels, currentLevel, currentQuest, progress } = get();

        // Update levels with completed quest
        const updatedLevels = levels.map((level) => {
          if (level.id === currentLevel) {
            const updatedQuests = level.quests.map((quest) =>
              quest.id === questId ? { ...quest, isComplete: true } : quest
            );
            const completedCount = updatedQuests.filter((q) => q.isComplete).length;
            const completionPercentage = Math.round(
              (completedCount / updatedQuests.length) * 100
            );
            return {
              ...level,
              quests: updatedQuests,
              completionPercentage,
            };
          }
          return level;
        });

        // Determine next quest
        const currentLevelData = updatedLevels.find((l) => l.id === currentLevel);
        const currentQuestIndex = currentLevelData?.quests.findIndex(
          (q) => q.id === questId
        );

        let nextLevel = currentLevel;
        let nextQuest = currentQuest;

        if (
          currentQuestIndex !== undefined &&
          currentLevelData &&
          currentQuestIndex < currentLevelData.quests.length - 1
        ) {
          // Move to next quest in same level
          nextQuest = currentQuest + 1;
        } else if (currentLevel < 5) {
          // Move to next level
          nextLevel = currentLevel + 1;
          nextQuest = 1;
        }

        set({
          levels: updatedLevels,
          currentLevel: nextLevel,
          currentQuest: nextQuest,
        });
      },

      unlockLevel: (levelId) => {
        const { levels } = get();
        const updatedLevels = levels.map((level) =>
          level.id === levelId ? { ...level, isUnlocked: true } : level
        );
        set({ levels: updatedLevels });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setSaving: (saving) => set({ isSaving: saving }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: "pathshala-project-store",
      partialize: (state) => ({
        currentProject: state.currentProject,
        currentLevel: state.currentLevel,
        currentQuest: state.currentQuest,
      }),
    }
  )
);
