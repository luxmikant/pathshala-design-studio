/**
 * LangChain Agent for Pathshala Design Studio
 * 
 * This agent can:
 * - Query Supabase database for projects
 * - Run multiagent AI validation
 * - Provide program design recommendations
 * - Track all operations in LangSmith
 */

import { ChatGroq } from "@langchain/groq";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import prisma from "./prisma";
import { runMultiAgentValidation } from "./ai-agents";

// Initialize Groq LLM for the agent
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
});

// ============================================================================
// TOOL 1: Get Project Details from Database
// ============================================================================

const getProjectTool = tool(
  async (input) => {
    try {
      const project = await prisma.lfaProject.findUnique({
        where: { id: input.projectId },
        include: {
          organization: true,
          components: true,
          stakeholders: true,
          indicators: true,
        },
      });

      if (!project) {
        return `Project with ID ${input.projectId} not found.`;
      }

      return JSON.stringify(
        {
          id: project.id,
          title: project.title,
          theme: project.theme,
          status: project.status,
          completionPercentage: project.completionPercentage,
          organization: project.organization.name,
          componentsCount: project.components.length,
          stakeholdersCount: project.stakeholders.length,
          indicatorsCount: project.indicators.length,
        },
        null,
        2
      );
    } catch (error) {
      return `Error fetching project: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: "get_project",
    description: "Get detailed information about a specific project from the database using its ID",
    schema: z.object({
      projectId: z.string().describe("The UUID of the project to retrieve"),
    }),
  }
);

// ============================================================================
// TOOL 2: List User's Projects
// ============================================================================

const listProjectsTool = tool(
  async (input) => {
    try {
      const projects = await prisma.lfaProject.findMany({
        where: { createdById: input.userId },
        take: input.limit || 10,
        orderBy: { updatedAt: "desc" },
        include: {
          organization: true,
        },
      });

      if (projects.length === 0) {
        return "No projects found for this user.";
      }

      return JSON.stringify(
        projects.map((p) => ({
          id: p.id,
          title: p.title,
          theme: p.theme,
          status: p.status,
          completionPercentage: p.completionPercentage,
          organization: p.organization.name,
          updatedAt: p.updatedAt,
        })),
        null,
        2
      );
    } catch (error) {
      return `Error listing projects: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: "list_projects",
    description: "List all projects for a specific user",
    schema: z.object({
      userId: z.string().describe("The UUID of the user whose projects to list"),
      limit: z.number().optional().describe("Maximum number of projects to return (default: 10)"),
    }),
  }
);

// ============================================================================
// TOOL 3: Run AI Validation
// ============================================================================

const validateProgramTool = tool(
  async (input) => {
    try {
      // Fetch project data
      const project = await prisma.lfaProject.findUnique({
        where: { id: input.projectId },
        include: {
          components: true,
          stakeholders: true,
          indicators: true,
        },
      });

      if (!project) {
        return `Project with ID ${input.projectId} not found.`;
      }

      // Extract components for validation
      const problemComponent = project.components.find(
        (c) => c.componentType === "PROBLEM_DEFINITION"
      );
      const impactComponent = project.components.find(
        (c) => c.componentType === "IMPACT_VISION"
      );
      const tocComponent = project.components.find(
        (c) => c.componentType === "THEORY_OF_CHANGE"
      );
      const implComponent = project.components.find(
        (c) => c.componentType === "IMPLEMENTATION_DESIGN"
      );

      // Build validation input
      const validationData = {
        id: project.id,
        problem: problemComponent?.content
          ? String((problemComponent.content as any).problem || "")
          : "",
        activities: implComponent?.content
          ? ((implComponent.content as any).activities as string[]) || []
          : [],
        outputs: tocComponent?.content
          ? ((tocComponent.content as any).outputs as string[]) || []
          : [],
        outcomes: tocComponent?.content
          ? ((tocComponent.content as any).outcomes as string[]) || []
          : [],
        impact: impactComponent?.content
          ? String((impactComponent.content as any).impactStatement || "")
          : "",
        stakeholders: project.stakeholders,
        indicators: project.indicators,
        theme: project.theme,
        geography: String(
          (project.geography as any)?.state || "Not specified"
        ),
        timeline: "12 months", // Default
      };

      // Run multiagent validation
      const validation = await runMultiAgentValidation(validationData);

      return JSON.stringify(
        {
          projectTitle: project.title,
          overallScore: validation.qualityAssessment.overallScore,
          recommendation: validation.overallRecommendation,
          logicChainScore: validation.logicChain.score,
          logicChainValid: validation.logicChain.isValid,
          topStrengths: validation.qualityAssessment.topStrengths.slice(0, 3),
          criticalGaps: validation.qualityAssessment.criticalGaps.slice(0, 3),
          smartValidationAvg:
            validation.smartValidation.reduce((sum, r) => sum + r.score, 0) /
              validation.smartValidation.length || 0,
          suggestions: validation.contextualAdvice.suggestions.slice(0, 3),
          timestamp: validation.timestamp,
        },
        null,
        2
      );
    } catch (error) {
      return `Error running validation: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: "validate_program_design",
    description:
      "Run the full multiagent AI validation on a program design. Returns comprehensive quality scores and recommendations.",
    schema: z.object({
      projectId: z.string().describe("The UUID of the project to validate"),
    }),
  }
);

// ============================================================================
// TOOL 4: Get Validation Recommendations
// ============================================================================

const getRecommendationsTool = tool(
  async (input) => {
    const recommendations: Record<string, string> = {
      FLN: `For Foundational Literacy & Numeracy programs:
        1. Focus on learning outcomes at student level
        2. Include teacher training and materials
        3. Define baseline and target proficiency levels
        4. Align with NIPUN Bharat guidelines
        5. Include continuous assessment mechanisms`,
      
      CAREER_READINESS: `For Career Readiness programs:
        1. Define employability outcomes
        2. Include industry partnerships
        3. Map skills to job roles
        4. Include placement tracking
        5. Define success metrics (employment rate, salary, etc)`,
      
      SCHOOL_LEADERSHIP: `For School Leadership programs:
        1. Define leadership competencies
        2. Include mentorship components
        3. Measure school improvement indicators
        4. Track cascading effect on teachers
        5. Include community engagement`,
      
      CUSTOM: `For custom programs:
        1. Clearly define the problem statement
        2. Map activities to outcomes logically
        3. Include SMART measurable indicators
        4. Define stakeholder roles clearly
        5. Set realistic timelines and targets`,
    };

    return (
      recommendations[input.theme as keyof typeof recommendations] ||
      recommendations.CUSTOM
    );
  },
  {
    name: "get_recommendations",
    description:
      "Get best practice recommendations for specific education program themes",
    schema: z.object({
      theme: z
        .enum(["FLN", "CAREER_READINESS", "SCHOOL_LEADERSHIP", "CUSTOM"])
        .describe("The theme of the education program"),
    }),
  }
);

// ============================================================================
// TOOL 5: Database Query Tool (General)
// ============================================================================

const queryDatabaseTool = tool(
  async (input) => {
    try {
      switch (input.query) {
        case "total_projects":
          const totalProjects = await prisma.lfaProject.count();
          return `Total projects in database: ${totalProjects}`;

        case "total_users":
          const totalUsers = await prisma.user.count();
          return `Total users: ${totalUsers}`;

        case "total_organizations":
          const totalOrgs = await prisma.organization.count();
          return `Total organizations: ${totalOrgs}`;

        case "project_themes":
          const themes = await prisma.lfaProject.groupBy({
            by: ["theme"],
            _count: true,
          });
          return JSON.stringify(themes, null, 2);

        case "project_statuses":
          const statuses = await prisma.lfaProject.groupBy({
            by: ["status"],
            _count: true,
          });
          return JSON.stringify(statuses, null, 2);

        default:
          return "Supported queries: total_projects, total_users, total_organizations, project_themes, project_statuses";
      }
    } catch (error) {
      return `Error querying database: ${error instanceof Error ? error.message : String(error)}`;
    }
  },
  {
    name: "query_database",
    description:
      "Query the database for aggregate statistics and insights. Supports: total_projects, total_users, total_organizations, project_themes, project_statuses",
    schema: z.object({
      query: z.string().describe("The type of query to execute"),
    }),
  }
);

// ============================================================================
// CREATE THE AGENT
// ============================================================================

const tools = [
  getProjectTool,
  listProjectsTool,
  validateProgramTool,
  getRecommendationsTool,
  queryDatabaseTool,
];

export const programDesignAgent = createReactAgent({
  llm,
  tools,
});

// ============================================================================
// HELPER: Run Agent with a Query
// ============================================================================

export async function runAgent(query: string, context?: Record<string, any>) {
  try {
    const response = await programDesignAgent.invoke({
      messages: [
        {
          role: "system",
          content: `You are an expert education program design assistant for Pathshala Design Studio. You help users:
          - Retrieve and analyze their program designs
          - Run AI validation on program logic
          - Provide recommendations based on best practices
          - Query database for insights
          
          You have access to:
          - Supabase database with projects, users, organizations
          - Multiagent AI validation system (Logic, SMART, Context, Quality agents)
          - LangSmith tracing for monitoring
          
          Always be helpful, specific, and actionable in your responses. When providing validation results, explain scores clearly and suggest concrete improvements.`,
        },
        {
          role: "user",
          content: context
            ? `${query}\n\nContext: ${JSON.stringify(context)}`
            : query,
        },
      ],
    });

    return response;
  } catch (error) {
    console.error("Agent execution error:", error);
    throw error;
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
Example 1: List user's projects
const result = await runAgent("Show me all my projects", { userId: "user-uuid" });

Example 2: Get project details
const result = await runAgent("Get details for project xyz-123");

Example 3: Run validation
const result = await runAgent("Validate my program design for project xyz-123");

Example 4: Get recommendations
const result = await runAgent("Give me recommendations for an FLN program");

Example 5: Database insights
const result = await runAgent("How many projects are in the database?");

Example 6: Complex query
const result = await runAgent(
  "List my projects, pick the most recent one, and validate it"
);
*/

export default programDesignAgent;
