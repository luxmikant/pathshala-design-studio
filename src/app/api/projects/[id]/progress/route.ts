import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const updateProgressSchema = z.object({
  currentLevel: z.number().min(1).max(5).optional(),
  currentQuest: z.number().min(1).optional(),
  completeQuest: z.string().optional(), // Quest ID to mark as complete
  pointsEarned: z.number().optional(),
});

// GET /api/projects/[id]/progress - Get project progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.lfaProject.findUnique({
      where: { id },
      select: { organizationId: true, progress: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.organizationId !== session.user.organizationId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: project.progress,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id]/progress - Update project progress
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: projectId } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProgressSchema.parse(body);

    // Check project access
    const project = await prisma.lfaProject.findUnique({
      where: { id: projectId },
      include: { progress: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.organizationId !== session.user.organizationId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const currentProgress = project.progress;

    if (!currentProgress) {
      return NextResponse.json(
        { error: "Progress not initialized" },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {
      lastActivityAt: new Date(),
    };

    if (validatedData.currentLevel !== undefined) {
      updateData.currentLevel = validatedData.currentLevel;
    }

    if (validatedData.currentQuest !== undefined) {
      updateData.currentQuest = validatedData.currentQuest;
    }

    if (validatedData.completeQuest) {
      const completedQuests = (currentProgress.completedQuests as string[]) || [];
      if (!completedQuests.includes(validatedData.completeQuest)) {
        updateData.completedQuests = [...completedQuests, validatedData.completeQuest];
      }
    }

    if (validatedData.pointsEarned) {
      updateData.totalPointsEarned = {
        increment: validatedData.pointsEarned,
      };

      // Also update user's gamification points
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          gamificationPoints: {
            increment: validatedData.pointsEarned,
          },
        },
      });
    }

    // Calculate streak
    const lastActivity = currentProgress.lastActivityAt;
    const today = new Date();
    const diffDays = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      updateData.streakDays = { increment: 1 };
    } else if (diffDays > 1) {
      updateData.streakDays = 1; // Reset streak
    }

    const updatedProgress = await prisma.projectProgress.update({
      where: { projectId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Progress updated successfully",
      data: updatedProgress,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}
