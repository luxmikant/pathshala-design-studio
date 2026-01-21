import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const updateProjectSchema = z.object({
  title: z.string().min(3).optional(),
  theme: z.enum(["FLN", "CAREER_READINESS", "SCHOOL_LEADERSHIP", "CUSTOM"]).optional(),
  status: z.enum(["DRAFT", "IN_PROGRESS", "REVIEW", "COMPLETE"]).optional(),
  geography: z
    .object({
      state: z.string(),
      districts: z.array(z.string()),
      blocks: z.array(z.string()).optional(),
    })
    .optional(),
});

// GET /api/projects/[id] - Get a single project
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
      include: {
        organization: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        components: {
          orderBy: { componentType: "asc" },
        },
        stakeholders: true,
        indicators: true,
        progress: true,
        comments: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check access
    if (project.organizationId !== session.user.organizationId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProjectSchema.parse(body);

    // Check project exists and user has access
    const existingProject = await prisma.lfaProject.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (existingProject.organizationId !== session.user.organizationId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const updatedProject = await prisma.lfaProject.update({
      where: { id },
      data: validatedData,
      include: {
        progress: true,
        components: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check project exists and user has access
    const existingProject = await prisma.lfaProject.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (existingProject.organizationId !== session.user.organizationId) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Only admins can delete projects
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can delete projects" },
        { status: 403 }
      );
    }

    await prisma.lfaProject.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
