/**
 * LangChain Agent API Endpoint
 * 
 * Provides natural language interface to:
 * - Query projects from database
 * - Run AI validations
 * - Get recommendations
 * - Database insights
 * 
 * All operations traced in LangSmith
 */

import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/langchain-agent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized - please sign in" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { query, context } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query is required and must be a string" },
        { status: 400 }
      );
    }

    // Add user context
    const enrichedContext = {
      ...context,
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name,
    };

    console.log(`[Agent] Processing query: "${query}"`);
    console.log(`[Agent] User: ${session.user.email}`);

    // Run the agent
    const result = await runAgent(query, enrichedContext);

    // Extract the final message from the agent
    const messages = result.messages || [];
    const lastMessage = messages[messages.length - 1];
    const response = lastMessage?.content || "No response from agent";

    console.log(`[Agent] Response generated (${messages.length} messages)`);

    return NextResponse.json({
      success: true,
      response,
      messageCount: messages.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Agent] Error:", error);
    
    return NextResponse.json(
      {
        error: "Agent execution failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    status: "Agent API is running",
    availableTools: [
      "get_project - Get project details by ID",
      "list_projects - List user's projects",
      "validate_program_design - Run multiagent AI validation",
      "get_recommendations - Get theme-specific recommendations",
      "query_database - Get database statistics",
    ],
    exampleQueries: [
      "Show me all my projects",
      "Get details for project [project-id]",
      "Validate project [project-id]",
      "Give me recommendations for an FLN program",
      "How many projects are in the database?",
    ],
    langsmithEnabled: !!process.env.LANGCHAIN_API_KEY,
    user: {
      email: session.user.email,
      name: session.user.name,
    },
  });
}
