import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Badge } from "@/types";
import { BADGES, POINTS_CONFIG } from "@/config/journey";

interface GamificationState {
  // Points & Badges
  totalPoints: number;
  earnedBadges: Badge[];
  streakDays: number;
  lastActivityDate: string | null;
  
  // Actions
  addPoints: (points: number) => void;
  awardBadge: (badgeId: string) => void;
  updateStreak: () => void;
  hasBadge: (badgeId: string) => boolean;
  
  // Reset
  reset: () => void;
}

const initialState = {
  totalPoints: 0,
  earnedBadges: [],
  streakDays: 0,
  lastActivityDate: null,
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addPoints: (points) => {
        set((state) => ({
          totalPoints: state.totalPoints + points,
        }));
      },

      awardBadge: (badgeId) => {
        const badge = BADGES[badgeId.toUpperCase()];
        if (!badge) return;

        const { earnedBadges } = get();
        const alreadyHas = earnedBadges.some((b) => b.id === badge.id);

        if (!alreadyHas) {
          const newBadge = { ...badge, earnedAt: new Date() };
          set((state) => ({
            earnedBadges: [...state.earnedBadges, newBadge],
            totalPoints: state.totalPoints + POINTS_CONFIG.badgeEarned,
          }));
        }
      },

      updateStreak: () => {
        const { lastActivityDate } = get();
        const today = new Date().toDateString();

        if (lastActivityDate === today) {
          // Already updated today
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastActivityDate === yesterday.toDateString()) {
          // Consecutive day - increment streak
          set((state) => ({
            streakDays: state.streakDays + 1,
            lastActivityDate: today,
          }));

          // Check for streak bonuses
          const { streakDays } = get();
          const bonusPoints =
            POINTS_CONFIG.streakBonus[
              streakDays as keyof typeof POINTS_CONFIG.streakBonus
            ];
          if (bonusPoints) {
            get().addPoints(bonusPoints);
          }
        } else {
          // Streak broken - reset
          set({
            streakDays: 1,
            lastActivityDate: today,
          });
        }
      },

      hasBadge: (badgeId) => {
        const { earnedBadges } = get();
        return earnedBadges.some((b) => b.id === badgeId);
      },

      reset: () => set(initialState),
    }),
    {
      name: "pathshala-gamification-store",
    }
  )
);
