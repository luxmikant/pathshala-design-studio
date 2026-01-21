import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const updateComponentSchema = z.object({
  content: z.record(z.string(), z.unknown()),
  isComplete: z.boolean().optional(),
});

// GET /api/projects/[id]/components - Get all components for a project
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

    // Check project access
    const project = await prisma.lfaProject.findUnique({
      where: { id },
      select: { organizationId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.organizationId !== session.user.organizationId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const components = await prisma.lfaComponent.findMany({
      where: { projectId: id },
      orderBy: { componentType: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: components,
    });
  } catch (error) {
    console.error("Error fetching components:", error);
    return NextResponse.json(
      { error: "Failed to fetch components" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id]/components - Update a component
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
    const { componentId, ...updateData } = body;

    if (!componentId) {
      return NextResponse.json(
        { error: "Component ID is required" },
        { status: 400 }
      );
    }

    const validatedData = updateComponentSchema.parse(updateData);

    // Check project access
    const project = await prisma.lfaProject.findUnique({
      where: { id: projectId },
      select: { organizationId: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.organizationId !== session.user.organizationId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get existing component for version history
    const existingComponent = await prisma.lfaComponent.findUnique({
      where: { id: componentId },
    });

    if (!existingComponent || existingComponent.projectId !== projectId) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 }
      );
    }

    // Update component and create version history
    const [updatedComponent] = await prisma.$transaction([
      prisma.lfaComponent.update({
        where: { id: componentId },
        data: {
          content: validatedData.content as object,
          isComplete: validatedData.isComplete,
          version: { increment: 1 },
        },
      }),
      prisma.versionHistory.create({
        data: {
          projectId,
          componentId,
          changedById: session.user.id,
          previousContent: existingComponent.content as object,
          newContent: validatedData.content as object,
          changeSummary: "Component updated",
        },
      }),
    ]);

    // Recalculate project completion percentage
    const allComponents = await prisma.lfaComponent.findMany({
      where: { projectId },
      select: { isComplete: true },
    });

    const completedCount = allComponents.filter((c: { isComplete: boolean }) => c.isComplete).length;
    const completionPercentage = Math.round(
      (completedCount / allComponents.length) * 100
    );

    await prisma.lfaProject.update({
      where: { id: projectId },
      data: {
        completionPercentage,
        status: completionPercentage === 100 ? "COMPLETE" : "IN_PROGRESS",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Component updated successfully",
      data: updatedComponent,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating component:", error);
    return NextResponse.json(
      { error: "Failed to update component" },
      { status: 500 }
    );
  }
}
