import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  runMultiAgentValidation,
  validateLogicChain,
  validateSMART,
  getContextualSuggestions,
  assessOverallQuality,
} from "@/lib/ai-agents";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60; // Allow up to 60 seconds for AI processing

/**
 * POST /api/ai/validate
 * Run multi-agent AI validation on a project
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, validationType } = body;

    // Fetch project data
    const project = await prisma.lfaProject.findUnique({
      where: { id: projectId },
      include: {
        components: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check ownership
    if (project.createdById !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Extract data from components
    const components = project.components as Array<{ componentType: string; content: unknown }>;
    const problemComponent = components.find((c) => c.componentType === "problem");
    const outcomesComponents = components.filter((c) =>
      c.componentType.includes("outcome")
    );
    const activitiesComponents = components.filter((c) =>
      c.componentType.includes("activity")
    );
    const stakeholdersComponents = components.filter((c) =>
      c.componentType.includes("stakeholder")
    );
    const indicatorsComponents = components.filter((c) =>
      c.componentType.includes("indicator")
    );

    const toText = (value: unknown): string => (typeof value === "string" ? value : "");

    const activities = activitiesComponents.map((c) =>
      toText((c.content as { description?: string })?.description || c.content)
    );
    const outputs = activitiesComponents.map((c) =>
      toText((c.content as { output?: string })?.output || "")
    );
    const outcomes = outcomesComponents.map((c) =>
      toText((c.content as { description?: string })?.description || c.content)
    );
    const stakeholders = stakeholdersComponents.map((c) => c.content);
    const indicators = indicatorsComponents.map((c) => c.content);
    const stakeholderNames = stakeholdersComponents.map((c) => {
      const content = c.content as { type?: string; name?: string; stakeholderType?: string } | null;
      return content?.type || content?.name || content?.stakeholderType || "Unknown";
    });

    const projectData = {
      id: project.id,
      problem: (problemComponent?.content as { description?: string } | null)?.description || "",
      activities,
      outputs,
      outcomes,
      impact: (project as any).impact || "Improved student learning outcomes",
      stakeholders,
      indicators,
      theme: project.theme,
      geography: JSON.stringify((project.geography as any) || {}),
      timeline: "12 months", // TODO: Extract from project
    };

    // Run validation based on type
    let result;

    switch (validationType) {
      case "full":
        result = await runMultiAgentValidation(projectData);
        break;

      case "logic":
        result = await validateLogicChain(
          projectData.activities,
          projectData.outputs,
          projectData.outcomes,
          projectData.impact
        );
        break;

      case "smart":
        result = await Promise.all(
          projectData.outcomes.map((outcome) =>
            validateSMART(outcome, {
              theme: projectData.theme,
              geography: projectData.geography,
              timeline: projectData.timeline,
            })
          )
        );
        break;

      case "suggestions":
        result = await getContextualSuggestions(
          projectData.theme,
          projectData.problem,
          projectData.geography,
          stakeholderNames
        );
        break;

      case "quality":
        result = await assessOverallQuality(projectData);
        break;

      default:
        return NextResponse.json({ error: "Invalid validation type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      validationType,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI validation error:", error);
    return NextResponse.json(
      {
        error: "AI validation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
