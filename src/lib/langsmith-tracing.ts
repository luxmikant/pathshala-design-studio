/**
 * LangSmith Tracing Configuration for Multi-Agent AI System
 * 
 * This file sets up tracing for the Groq-based AI agents using LangSmith.
 * Traces capture:
 * - Input/output of each agent
 * - Token usage and performance metrics
 * - Agent interactions and decision flow
 * - Error tracking and debugging
 * 
 * LangSmith Dashboard: https://smith.langchain.com
 */

import { Client } from "langsmith";

// Initialize LangSmith client (reads LANGCHAIN_API_KEY from env)
// Temporarily disabled due to API compatibility issues
export const langsmithClient: Client | null = null;
/*
export const langsmithClient = process.env.LANGCHAIN_API_KEY
  ? new Client({
      apiUrl: "https://api.smith.langchain.com",
      apiKey: process.env.LANGCHAIN_API_KEY,
    })
  : null;
*/

// Trace configuration constants
export const TRACING_CONFIG = {
  // Project name in LangSmith dashboard
  projectName: "pathshala-design-studio",

  // Agent names for filtering in dashboard
  agents: {
    LOGIC_VALIDATOR: "logic-chain-validator",
    MEASURABILITY_CHECKER: "measurability-smart-checker",
    CONTEXT_ADVISOR: "context-advisor",
    QUALITY_SCORER: "quality-scorer",
    ORCHESTRATOR: "validation-orchestrator",
  },

  // Trace tags for organization and filtering
  tags: {
    VALIDATION: "validation",
    EDUCATION: "education-program",
    LFA: "logical-framework",
    MULTIAGENT: "multi-agent",
    GROQ: "groq-inference",
  },
};

/**
 * Create a traced function wrapper for LangSmith
 * Captures all function calls with inputs/outputs and metadata
 *
 * @example
 * const tracedFunction = createTraceWrapper('agent-name', async (input) => {
 *   // your agent logic
 *   return result;
 * });
 * const result = await tracedFunction(inputData);
 */
export async function createTraceWrapper<T, R>(
  agentName: string,
  asyncFn: (input: T) => Promise<R>,
  tags: string[] = []
) {
  return async (input: T): Promise<R> => {
    if (!langsmithClient) {
      // LangSmith not configured, run without tracing
      return asyncFn(input);
    }

    const run = await langsmithClient.createRun({
      name: agentName,
      run_type: "chain",
      inputs: { input },
      project_name: TRACING_CONFIG.projectName,
      // tags: [TRACING_CONFIG.tags.MULTIAGENT, ...tags], // Temporarily disabled
      extra: {
        timestamp: new Date().toISOString(),
      },
    });

    if (!run) {
      // Fallback if run creation fails
      return asyncFn(input);
    }

    try {
      const output = await asyncFn(input);

      // Update run with successful output
      await langsmithClient.updateRun(run.id, {
        outputs: { output },
        end_time: Date.now(),
      });

      return output;
    } catch (error) {
      // Capture error in trace
      await langsmithClient.updateRun(run.id, {
        error: String(error),
        end_time: Date.now(),
      });
      throw error;
    }
  };
}

/**
 * Log agent decisions and reasoning to LangSmith
 * Useful for debugging and understanding agent behavior
 */
export async function logAgentReasoning(
  agentName: string,
  reasoning: string,
  metadata?: Record<string, any>
) {
  if (!langsmithClient) return;

  await langsmithClient.createRun({
    name: `${agentName}-reasoning`,
    run_type: "tool",
    inputs: { reasoning },
    project_name: TRACING_CONFIG.projectName,
    // tags: [TRACING_CONFIG.tags.MULTIAGENT], // Temporarily disabled
    extra: {
      ...metadata,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log validation scores and results
 * Captures the outcome of validation operations
 */
export async function logValidationResult(
  agentName: string,
  result: {
    isValid: boolean;
    score: number;
    issues?: Array<any>;
    strengths?: string[];
  },
  metadata?: Record<string, any>
) {
  if (!langsmithClient) return;

  await langsmithClient.createRun({
    name: `${agentName}-result`,
    run_type: "tool",
    inputs: metadata || {},
    outputs: result,
    project_name: TRACING_CONFIG.projectName,
    // tags: [TRACING_CONFIG.tags.VALIDATION], // Temporarily disabled
    extra: {
      ...metadata,
      timestamp: new Date().toISOString(),
      resultQuality: result.score,
    },
  });
}

/**
 * Create a batch trace for multiple agent calls
 * Useful for orchestrator pattern where multiple agents run in sequence
 */
export async function createBatchTrace<T>(
  orchestratorName: string,
  agentCalls: Array<{
    name: string;
    fn: () => Promise<T>;
  }>
): Promise<T[]> {
  if (!langsmithClient) {
    // Run without tracing
    return Promise.all(agentCalls.map((call) => call.fn()));
  }

  const batchRun = await langsmithClient.createRun({
    name: orchestratorName,
    run_type: "chain",
    project_name: TRACING_CONFIG.projectName,
    // tags: [TRACING_CONFIG.tags.MULTIAGENT], // Temporarily disabled
    inputs: {
      agents: agentCalls.map((c) => c.name),
    },
  });

  if (!batchRun) {
    // Fallback if batch run creation fails
    return Promise.all(agentCalls.map((call) => call.fn()));
  }

  try {
    const results = await Promise.all(
      agentCalls.map(async (call) => {
        const agentRun = await langsmithClient!.createRun({
          name: call.name,
          run_type: "chain",
          inputs: {},
          project_name: TRACING_CONFIG.projectName,
          parent_run_id: batchRun.id,
        });

        if (!agentRun) {
          return call.fn();
        }

        try {
          const result = await call.fn();
          await langsmithClient!.updateRun(agentRun.id, {
            outputs: { result },
            end_time: Date.now(),
          });
          return result;
        } catch (error) {
          await langsmithClient!.updateRun(agentRun.id, {
            error: String(error),
            end_time: Date.now(),
          });
          throw error;
        }
      })
    );

    await langsmithClient.updateRun(batchRun.id, {
      outputs: { results },
      end_time: Date.now(),
    });

    return results;
  } catch (error) {
    await langsmithClient.updateRun(batchRun.id, {
      error: String(error),
      end_time: Date.now(),
    });
    throw error;
  }
}

/**
 * Environment Setup Guide for LangSmith
 *
 * 1. Create LangSmith account at https://smith.langchain.com
 * 2. Get your API key from settings
 * 3. Add to .env:
 *    LANGCHAIN_API_KEY=your_api_key_here
 *    LANGCHAIN_TRACING_V2=true (to automatically capture LangChain calls)
 *    LANGCHAIN_PROJECT=pathshala-design-studio
 *
 * 4. Then restart your dev server and visit https://smith.langchain.com/projects
 *    to see traces in real-time!
 *
 * Dashboard Features:
 * - Real-time execution traces
 * - Token usage metrics
 * - Performance monitoring
 * - Error debugging
 * - Agent interaction flows
 */

export const LANGSMITH_SETUP_INSTRUCTIONS = `
🔍 LangSmith Setup for Multiagent Tracing

STEP 1: Create LangSmith Account
  → Visit: https://smith.langchain.com
  → Sign up (free tier available)

STEP 2: Get API Key
  → Go to Settings → API keys
  → Copy your API key

STEP 3: Update .env file
  Add these lines:
  LANGCHAIN_API_KEY=your_api_key_here
  LANGCHAIN_TRACING_V2=true
  LANGCHAIN_PROJECT=pathshala-design-studio

STEP 4: Restart Dev Server
  npm run dev

STEP 5: View Traces
  → Open: https://smith.langchain.com/projects
  → Select "pathshala-design-studio" project
  → Run a validation to see traces

WHAT YOU'LL SEE:
  ✅ Each agent's input/output
  ✅ Token consumption
  ✅ Execution time
  ✅ Error tracking
  ✅ Agent collaboration flow
  ✅ Decision reasoning
`;
