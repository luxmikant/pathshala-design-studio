"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
} from "@/components/ui";
import { Label } from "@/components/ui/label";

const THEMES = [
  {
    id: "FLN",
    name: "Foundational Literacy & Numeracy",
    icon: "📖",
    description: "Programs focused on early grade reading and math skills",
  },
  {
    id: "CAREER_READINESS",
    name: "Career Readiness",
    icon: "💼",
    description: "Programs for employability and vocational skills",
  },
  {
    id: "SCHOOL_LEADERSHIP",
    name: "School Leadership",
    icon: "👔",
    description: "Programs for school leaders and administrators",
  },
  {
    id: "CUSTOM",
    name: "Custom Theme",
    icon: "✨",
    description: "Create your own program design",
  },
];

const PATHS = [
  {
    id: "guided",
    name: "Guided Journey",
    icon: "🎮",
    description: "Step-by-step gamified experience with full support",
  },
  {
    id: "quick",
    name: "Quick Start",
    icon: "📝",
    description: "Jump into templates directly for experienced designers",
  },
  {
    id: "learn",
    name: "Learn First",
    icon: "📚",
    description: "Understand LFA basics before designing",
  },
];

export default function NewProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    theme: "",
    path: "guided",
    state: "",
  });

  const handleCreateProject = async () => {
    if (!formData.title || !formData.theme) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          theme: formData.theme,
          geography: formData.state ? { state: formData.state, districts: [], blocks: [] } : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/projects/${data.data.id}/journey`);
      }
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏫</span>
            <h1 className="font-bold text-lg">Pathshala Design Studio</h1>
          </div>
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            ← Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Progress indicator */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded ${
                  step >= s ? "bg-primary" : "bg-gray-200"
                }`}
              />
            ))}
          </div>

          {/* Step 1: Choose Theme */}
          {step === 1 && (
            <Card>
              <CardHeader className="text-center">
                <div className="text-5xl mb-4">🎯</div>
                <CardTitle className="text-2xl">Choose Your Theme</CardTitle>
                <CardDescription>
                  What type of education program are you designing?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {THEMES.map((theme) => (
                    <Card
                      key={theme.id}
                      className={`cursor-pointer transition-all ${
                        formData.theme === theme.id
                          ? "border-primary border-2 bg-primary/5"
                          : "hover:border-gray-300"
                      }`}
                      onClick={() => setFormData({ ...formData, theme: theme.id })}
                    >
                      <CardContent className="p-4">
                        <div className="text-3xl mb-2">{theme.icon}</div>
                        <h3 className="font-semibold mb-1">{theme.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {theme.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.theme}
                >
                  Continue →
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Choose Path */}
          {step === 2 && (
            <Card>
              <CardHeader className="text-center">
                <div className="text-5xl mb-4">🛤️</div>
                <CardTitle className="text-2xl">Choose Your Path</CardTitle>
                <CardDescription>
                  How would you like to design your LFA?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PATHS.map((path) => (
                    <Card
                      key={path.id}
                      className={`cursor-pointer transition-all ${
                        formData.path === path.id
                          ? "border-primary border-2 bg-primary/5"
                          : "hover:border-gray-300"
                      }`}
                      onClick={() => setFormData({ ...formData, path: path.id })}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="text-4xl">{path.icon}</div>
                        <div>
                          <h3 className="font-semibold">{path.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {path.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Continue →
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Project Details */}
          {step === 3 && (
            <Card>
              <CardHeader className="text-center">
                <div className="text-5xl mb-4">📋</div>
                <CardTitle className="text-2xl">Name Your Project</CardTitle>
                <CardDescription>
                  Give your LFA project a memorable name
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" required>
                    Project Name
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., FLN Program - Madhya Pradesh"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Primary State (Optional)</Label>
                  <Input
                    id="state"
                    placeholder="e.g., Madhya Pradesh"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    You can add more geographic details during the journey
                  </p>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Project Summary</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">Theme:</span>{" "}
                      {THEMES.find((t) => t.id === formData.theme)?.name}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Path:</span>{" "}
                      {PATHS.find((p) => p.id === formData.path)?.name}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Organization:</span>{" "}
                      {session?.user?.organizationName}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  ← Back
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={!formData.title}
                  loading={isLoading}
                >
                  🚀 Start Your Journey
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
