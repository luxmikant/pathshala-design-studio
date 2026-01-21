"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { JOURNEY_LEVELS } from "@/config/journey";
import { JourneyMap, QuestForm } from "@/components/journey";
import {
  Button,
  Card,
  CardContent,
  Progress,
  Badge,
} from "@/components/ui";

interface ProjectProgress {
  currentLevel: number;
  currentQuest: number;
  completedQuests: string[];
  totalPoints: number;
  streakDays: number;
  questData: Record<string, any>;
}

interface Project {
  id: string;
  title: string;
  theme: string;
  status: string;
  completionPercentage: number;
  components: any[];
}

export default function ProjectJourneyPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const projectId = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [progress, setProgress] = useState<ProjectProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuest, setActiveQuest] = useState<{
    levelId: number;
    questId: string;
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user && projectId) {
      fetchProjectData();
    }
  }, [session, projectId]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, progressRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/projects/${projectId}/progress`),
      ]);

      const projectData = await projectRes.json();
      const progressData = await progressRes.json();

      if (projectData.success) {
        setProject(projectData.data);
      }
      if (progressData.success) {
        setProgress(progressData.data);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestSelect = (levelId: number, questId: string) => {
    setActiveQuest({ levelId, questId });
  };

  const handleSaveQuest = async (questData: Record<string, any>) => {
    if (!activeQuest || !progress) return;

    try {
      // Save the quest data
      await fetch(`/api/projects/${projectId}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questData: {
            ...progress.questData,
            [activeQuest.questId]: questData,
          },
        }),
      });

      // Update local state
      setProgress({
        ...progress,
        questData: {
          ...progress.questData,
          [activeQuest.questId]: questData,
        },
      });
    } catch (error) {
      console.error("Error saving quest:", error);
    }
  };

  const handleCompleteQuest = async () => {
    if (!activeQuest || !progress) return;

    try {
      const currentLevel = JOURNEY_LEVELS.find(
        (l) => l.level === activeQuest.levelId
      );
      const currentQuestIndex = currentLevel?.quests.findIndex(
        (q) => q.id === activeQuest.questId
      );

      let newLevel = progress.currentLevel;
      let newQuest = progress.currentQuest;
      const newCompletedQuests = [...progress.completedQuests, activeQuest.questId];

      // Calculate points
      const quest = currentLevel?.quests[currentQuestIndex || 0];
      const newPoints = progress.totalPoints + (quest?.points || quest?.pointsReward || 0);

      // Move to next quest or level
      if (currentLevel && currentQuestIndex !== undefined) {
        if (currentQuestIndex + 1 < currentLevel.quests.length) {
          // More quests in current level
          newQuest = currentQuestIndex + 2;
        } else if (activeQuest.levelId < 5) {
          // Move to next level
          newLevel = activeQuest.levelId + 1;
          newQuest = 1;
        }
      }

      // Update progress in backend
      await fetch(`/api/projects/${projectId}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentLevel: newLevel,
          currentQuest: newQuest,
          completedQuests: newCompletedQuests,
          totalPoints: newPoints,
        }),
      });

      // Update local state
      setProgress({
        ...progress,
        currentLevel: newLevel,
        currentQuest: newQuest,
        completedQuests: newCompletedQuests,
        totalPoints: newPoints,
      });

      // Return to map view
      setActiveQuest(null);
    } catch (error) {
      console.error("Error completing quest:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🎮</div>
          <p className="text-muted-foreground">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (!project || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuest = activeQuest
    ? JOURNEY_LEVELS.find((l) => l.level === activeQuest.levelId)?.quests.find(
        (q) => q.id === activeQuest.questId
      )
    : null;

  const totalQuests = JOURNEY_LEVELS.reduce(
    (acc, level) => acc + level.quests.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  activeQuest ? setActiveQuest(null) : router.push("/dashboard")
                }
              >
                ←
              </Button>
              <div>
                <h1 className="font-bold">{project.title}</h1>
                <p className="text-xs text-muted-foreground">
                  Level {progress.currentLevel} • Quest {progress.currentQuest}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Points */}
              <div className="flex items-center gap-1">
                <span className="text-amber-500">⭐</span>
                <span className="font-bold">{progress.totalPoints}</span>
              </div>

              {/* Streak */}
              {progress.streakDays > 0 && (
                <div className="flex items-center gap-1">
                  <span>🔥</span>
                  <span className="font-bold">{progress.streakDays}</span>
                </div>
              )}

              {/* Badges */}
              <Badge variant="secondary">
                {progress.completedQuests.length}/{totalQuests} Quests
              </Badge>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2">
            <Progress
              value={(progress.completedQuests.length / totalQuests) * 100}
              size="sm"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeQuest && currentQuest ? (
          // Quest Form View
          <div className="max-w-3xl mx-auto">
            <QuestForm
              quest={currentQuest}
              projectId={projectId}
              initialData={progress.questData[activeQuest.questId] || {}}
              onSave={handleSaveQuest}
              onComplete={handleCompleteQuest}
              onBack={() => setActiveQuest(null)}
            />
          </div>
        ) : (
          // Journey Map View
          <div className="max-w-4xl mx-auto">
            {/* Current Quest Banner */}
            <Card className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-100 mb-1">Current Quest</p>
                    <h2 className="text-xl font-bold">
                      {JOURNEY_LEVELS[progress.currentLevel - 1]?.quests[
                        progress.currentQuest - 1
                      ]?.title || "All Quests Complete!"}
                    </h2>
                    <p className="text-sm text-blue-100 mt-1">
                      {JOURNEY_LEVELS[progress.currentLevel - 1]?.quests[
                        progress.currentQuest - 1
                      ]?.description}
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      const level = JOURNEY_LEVELS[progress.currentLevel - 1];
                      const quest = level?.quests[progress.currentQuest - 1];
                      if (quest) {
                        handleQuestSelect(level.level, quest.id);
                      }
                    }}
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    Continue Quest →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Journey Map */}
            <JourneyMap
              currentLevel={progress.currentLevel}
              currentQuest={progress.currentQuest}
              completedQuests={progress.completedQuests}
              onQuestSelect={handleQuestSelect}
            />
          </div>
        )}
      </main>
    </div>
  );
}
