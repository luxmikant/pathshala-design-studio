"use client";

import React from "react";
import { JOURNEY_LEVELS, JourneyLevel, Quest } from "@/config/journey";
import { Card, CardContent, CardHeader, CardTitle, Progress, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Level } from "@/types";

interface JourneyMapProps {
  currentLevel: number;
  currentQuest: number;
  completedQuests: string[];
  onQuestSelect: (levelId: number, questId: string) => void;
}

export function JourneyMap({
  currentLevel,
  currentQuest,
  completedQuests,
  onQuestSelect,
}: JourneyMapProps) {
  const getQuestStatus = (levelId: number, questId: string) => {
    if (completedQuests.includes(questId)) return "completed";
    if (levelId === currentLevel) {
      const level = JOURNEY_LEVELS.find((l) => l.level === levelId);
      const questIndex = level?.quests.findIndex((q) => q.id === questId) || 0;
      if (questIndex < currentQuest - 1) return "completed";
      if (questIndex === currentQuest - 1) return "current";
    }
    if (levelId < currentLevel) return "completed";
    return "locked";
  };

  const calculateLevelProgress = (level: Level) => {
    const completedInLevel = level.quests.filter(
      (q) => getQuestStatus(level.level!, q.id) === "completed"
    ).length;
    return Math.round((completedInLevel / level.quests.length) * 100);
  };

  return (
    <div className="space-y-6">
      {JOURNEY_LEVELS.map((level) => {
        const isCurrentLevel = level.level === currentLevel;
        const isLocked = level.level! > currentLevel;
        const progress = calculateLevelProgress(level);

        return (
          <Card
            key={level.level}
            className={cn(
              "transition-all",
              isCurrentLevel && "border-primary border-2",
              isLocked && "opacity-60"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{level.icon}</span>
                  <div>
                    <CardTitle className="text-lg">
                      Level {level.level}: {level.title || level.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {level.subtitle || level.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {progress === 100 ? (
                    <Badge variant="success">✓ Complete</Badge>
                  ) : isLocked ? (
                    <Badge variant="secondary">🔒 Locked</Badge>
                  ) : (
                    <Badge variant="warning">{progress}%</Badge>
                  )}
                </div>
              </div>
              <Progress value={progress} className="mt-2" size="sm" />
            </CardHeader>

            {!isLocked && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {level.quests.map((quest) => {
                    const status = getQuestStatus(level.level!, quest.id);
                    return (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        status={status}
                        onClick={() => {
                          if (status !== "locked") {
                            onQuestSelect(level.level!, quest.id);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
}

interface QuestCardProps {
  quest: Quest;
  status: "completed" | "current" | "locked";
  onClick: () => void;
}

function QuestCard({ quest, status, onClick }: QuestCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-3 rounded-lg border transition-all cursor-pointer",
        status === "completed" && "bg-green-50 border-green-200",
        status === "current" && "bg-blue-50 border-blue-300 shadow-sm",
        status === "locked" && "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl">{quest.icon || "📋"}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{quest.title}</h4>
            {status === "completed" && <span className="text-green-600">✓</span>}
            {status === "current" && (
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {quest.description}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="text-amber-600">⭐ {quest.points || quest.pointsReward} pts</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">~{quest.estimatedMinutes || 15} min</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JourneyMap;
