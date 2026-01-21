import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  theme: z.enum(["FLN", "CAREER_READINESS", "SCHOOL_LEADERSHIP", "CUSTOM"]),
  geography: z
    .object({
      state: z.string(),
      districts: z.array(z.string()),
      blocks: z.array(z.string()).optional(),
    })
    .optional(),
});

// GET /api/projects - List all projects for the user's organization
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const status = searchParams.get("status");
    const theme = searchParams.get("theme");

    const where: any = {
      organizationId: session.user.organizationId,
    };

    if (status) {
      where.status = status;
    }

    if (theme) {
      where.theme = theme;
    }

    const [projects, total] = await Promise.all([
      prisma.lfaProject.findMany({
        where,
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
          progress: true,
          _count: {
            select: {
              components: true,
              stakeholders: true,
              indicators: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.lfaProject.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: projects,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.user.organizationId) {
      return NextResponse.json(
        { error: "User must belong to an organization" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    const project = await prisma.$transaction(async (tx) => {
      // Create the project
      const newProject = await tx.lfaProject.create({
        data: {
          title: validatedData.title,
          theme: validatedData.theme,
          geography: validatedData.geography,
          status: "DRAFT",
          organizationId: session.user.organizationId!,
          createdById: session.user.id,
        },
      });

      // Initialize project progress
      await tx.projectProgress.create({
        data: {
          projectId: newProject.id,
          currentLevel: 1,
          currentQuest: 1,
          completedQuests: [],
          levelProgress: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        },
      });

      // Create initial empty components for each section
      const componentTypes = [
        "PROBLEM_DEFINITION",
        "IMPACT_VISION",
        "THEORY_OF_CHANGE",
        "STAKEHOLDER_FRAMEWORK",
        "IMPLEMENTATION_DESIGN",
        "MONITORING_EVALUATION",
      ] as const;

      await tx.lfaComponent.createMany({
        data: componentTypes.map((type) => ({
          projectId: newProject.id,
          componentType: type,
          content: {},
          isComplete: false,
        })),
      });

      return tx.lfaProject.findUnique({
        where: { id: newProject.id },
        include: {
          progress: true,
          components: true,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        data: project,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
