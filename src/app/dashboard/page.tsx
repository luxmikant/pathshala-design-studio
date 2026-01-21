"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Progress,
  Badge,
} from "@/components/ui";

interface Project {
  id: string;
  title: string;
  theme: string;
  status: string;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
  progress?: {
    currentLevel: number;
    currentQuest: number;
    streakDays: number;
  };
}

const THEME_LABELS: Record<string, string> = {
  FLN: "Foundational Literacy & Numeracy",
  CAREER_READINESS: "Career Readiness",
  SCHOOL_LEADERSHIP: "School Leadership",
  CUSTOM: "Custom",
};

const STATUS_COLORS: Record<string, "default" | "warning" | "success" | "secondary"> = {
  DRAFT: "secondary",
  IN_PROGRESS: "warning",
  REVIEW: "default",
  COMPLETE: "success",
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">🏫</div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏫</span>
            <div>
              <h1 className="font-bold text-lg">Pathshala Design Studio</h1>
              <p className="text-xs text-muted-foreground">
                {session?.user?.organizationName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session?.user?.role}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push("/api/auth/signout")}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {session?.user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className="text-muted-foreground">
            Continue designing your education programs or start a new LFA journey.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => router.push("/projects/new")}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="text-4xl">🚀</div>
              <div>
                <h3 className="font-semibold">Start New Project</h3>
                <p className="text-sm text-muted-foreground">
                  Begin your LFA design journey
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="text-4xl">📚</div>
              <div>
                <h3 className="font-semibold">Pattern Library</h3>
                <p className="text-sm text-muted-foreground">
                  Explore templates & examples
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="text-4xl">🎓</div>
              <div>
                <h3 className="font-semibold">Learning Center</h3>
                <p className="text-sm text-muted-foreground">
                  LFA tutorials & guides
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Your Projects</h3>
          <Button onClick={() => router.push("/projects/new")}>
            + New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your first LFA design journey to create impactful education programs.
              </p>
              <Button onClick={() => router.push("/projects/new")}>
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/projects/${project.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge variant={STATUS_COLORS[project.status]}>
                      {project.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <CardDescription>{THEME_LABELS[project.theme]}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{project.completionPercentage}%</span>
                      </div>
                      <Progress value={project.completionPercentage} size="sm" />
                    </div>

                    {project.progress && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          Level {project.progress.currentLevel}/5
                        </span>
                        {project.progress.streakDays > 0 && (
                          <span>🔥 {project.progress.streakDays} day streak</span>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Updated{" "}
                      {new Date(project.updatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
