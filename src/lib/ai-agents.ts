/**
 * Multi-Agent AI System for Program Design Validation
 * Uses Groq (fast inference) with multi-agent workflow
 * 
 * Agents:
 * 1. Logic Validator - Checks Activity → Output → Outcome → Impact chain
 * 2. Measurability Checker - Validates SMART criteria for outcomes
 * 3. Context Advisor - Provides sector-specific suggestions
 * 4. Quality Scorer - Overall design quality assessment
 * 
 * ✨ Enhanced with LangSmith tracing for multiagent observability
 */

import Groq from "groq-sdk";
import {
  createBatchTrace,
  logValidationResult,
  TRACING_CONFIG,
} from "./langsmith-tracing";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

// Available models: llama-3.3-70b-versatile (best balance), mixtral-8x7b-32768, gemma-7b-it
const MODEL = "llama-3.3-70b-versatile";

// ============================================================================
// AGENT 1: Logic Chain Validator
// ============================================================================

export interface LogicChainResult {
  isValid: boolean;
  score: number; // 0-100
  issues: Array<{
    severity: "critical" | "high" | "medium" | "low";
    component: string;
    message: string;
    suggestion: string;
  }>;
  strengths: string[];
}

export async function validateLogicChain(
  activities: string[],
  outputs: string[],
  outcomes: string[],
  impact: string
): Promise<LogicChainResult> {
  const prompt = `You are an expert in education program design and Logical Framework Approach (LFA).

Analyze this program's logic chain for coherence and validity:

**Activities:**
${activities.map((a, i) => `${i + 1}. ${a}`).join("\n")}

**Outputs:**
${outputs.map((o, i) => `${i + 1}. ${o}`).join("\n")}

**Outcomes:**
${outcomes.map((o, i) => `${i + 1}. ${o}`).join("\n")}

**Impact:**
${impact}

Validation Criteria:
1. Do activities logically lead to the stated outputs?
2. Do outputs credibly lead to the stated outcomes?
3. Do outcomes plausibly contribute to the impact?
4. Are there missing links or logical leaps?
5. Are assumptions clearly implied or stated?

Respond in JSON format:
{
  "isValid": boolean,
  "score": number (0-100),
  "issues": [
    {
      "severity": "critical" | "high" | "medium" | "low",
      "component": "activity-output" | "output-outcome" | "outcome-impact",
      "message": "description of the issue",
      "suggestion": "how to fix it"
    }
  ],
  "strengths": ["what works well"]
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert education program design consultant specializing in LFA and Theory of Change validation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODEL,
      temperature: 0.3, // Lower for more consistent validation
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return result as LogicChainResult;
  } catch (error) {
    console.error("Logic validation error:", error);
    return {
      isValid: false,
      score: 0,
      issues: [
        {
          severity: "critical",
          component: "activity-output",
          message: "AI validation failed. Please review manually.",
          suggestion: "Check API configuration or try again.",
        },
      ],
      strengths: [],
    };
  }
}

// ============================================================================
// AGENT 2: Measurability Checker (SMART Validation)
// ============================================================================

export interface SMARTResult {
  score: number; // 0-100
  dimensions: {
    specific: { score: number; feedback: string };
    measurable: { score: number; feedback: string };
    achievable: { score: number; feedback: string };
    relevant: { score: number; feedback: string };
    timeBound: { score: number; feedback: string };
  };
  improvedVersion: string;
  confidence: number; // 0-100
}

export async function validateSMART(
  statement: string,
  context: {
    theme: string; // FLN, Career Readiness, School Leadership
    geography: string;
    timeline: string;
  }
): Promise<SMARTResult> {
  const prompt = `You are an M&E expert specializing in education programs in India.

Evaluate this outcome statement against SMART criteria:

**Statement:** ${statement}

**Context:**
- Theme: ${context.theme}
- Geography: ${context.geography}
- Timeline: ${context.timeline}

SMART Criteria:
- **Specific:** Clear, unambiguous, well-defined
- **Measurable:** Quantifiable or observable with clear metrics
- **Achievable:** Realistic given Indian education context
- **Relevant:** Aligned with student outcomes and system realities
- **Time-bound:** Has clear timeframe or deadline

Respond in JSON format:
{
  "score": number (0-100, average across dimensions),
  "dimensions": {
    "specific": { "score": 0-100, "feedback": "explanation" },
    "measurable": { "score": 0-100, "feedback": "explanation" },
    "achievable": { "score": 0-100, "feedback": "explanation" },
    "relevant": { "score": 0-100, "feedback": "explanation" },
    "timeBound": { "score": 0-100, "feedback": "explanation" }
  },
  "improvedVersion": "SMART-compliant version of the statement",
  "confidence": number (0-100, your confidence in this assessment)
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an M&E expert with deep knowledge of Indian education programs, NIPUN Bharat, and TaRL approaches.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODEL,
      temperature: 0.4,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return result as SMARTResult;
  } catch (error) {
    console.error("SMART validation error:", error);
    return {
      score: 0,
      dimensions: {
        specific: { score: 0, feedback: "Validation failed" },
        measurable: { score: 0, feedback: "Validation failed" },
        achievable: { score: 0, feedback: "Validation failed" },
        relevant: { score: 0, feedback: "Validation failed" },
        timeBound: { score: 0, feedback: "Validation failed" },
      },
      improvedVersion: statement,
      confidence: 0,
    };
  }
}

// ============================================================================
// AGENT 3: Context Advisor (Sector-Specific Suggestions)
// ============================================================================

export interface ContextSuggestion {
  suggestions: Array<{
    category: "indicator" | "stakeholder" | "activity" | "practice-change";
    title: string;
    description: string;
    rationale: string;
    examples: string[];
  }>;
  relevantPatterns: string[];
  warnings: string[];
}

export async function getContextualSuggestions(
  theme: string,
  problemStatement: string,
  geography: string,
  stakeholders: string[]
): Promise<ContextSuggestion> {
  const prompt = `You are a program design expert for education NGOs in India.

Provide contextual suggestions for this program:

**Theme:** ${theme}
**Problem:** ${problemStatement}
**Geography:** ${geography}
**Stakeholders:** ${stakeholders.join(", ")}

Based on successful programs in similar contexts (FLN, TaRL, NIPUN Bharat, etc.), suggest:
1. Relevant indicators to track
2. Key stakeholders that might be missing
3. Effective activities from proven approaches
4. Expected practice changes for each stakeholder

Respond in JSON format:
{
  "suggestions": [
    {
      "category": "indicator" | "stakeholder" | "activity" | "practice-change",
      "title": "brief title",
      "description": "detailed description",
      "rationale": "why this is relevant",
      "examples": ["specific examples from real programs"]
    }
  ],
  "relevantPatterns": ["proven approaches that fit this context"],
  "warnings": ["common pitfalls to avoid"]
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an expert on education programs in India, with deep knowledge of FLN, NIPUN Bharat, TaRL, ASER, and successful NGO interventions.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODEL,
      temperature: 0.7, // Higher for more creative suggestions
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return result as ContextSuggestion;
  } catch (error) {
    console.error("Context advisor error:", error);
    return {
      suggestions: [],
      relevantPatterns: [],
      warnings: ["AI suggestions unavailable. Please proceed manually."],
    };
  }
}

// ============================================================================
// AGENT 4: Quality Scorer (Overall Design Assessment)
// ============================================================================

export interface QualityAssessment {
  overallScore: number; // 0-100
  readiness: "draft" | "needs-work" | "review-ready" | "funder-ready";
  dimensionScores: {
    problemClarity: number;
    logicCoherence: number;
    stakeholderCoverage: number;
    measurementQuality: number;
    feasibility: number;
  };
  topStrengths: string[];
  criticalGaps: string[];
  nextSteps: string[];
  estimatedReviewTime: string;
}

export async function assessOverallQuality(projectData: {
  problem: string;
  outcomes: string[];
  stakeholders: any[];
  indicators: any[];
  activities: string[];
  geography: string;
  timeline: string;
}): Promise<QualityAssessment> {
  const prompt = `You are a senior program design reviewer for an education funder.

Assess this program design's quality and readiness:

**Problem Statement:** ${projectData.problem}

**Outcomes:** ${projectData.outcomes.join("; ")}

**Stakeholders:** ${projectData.stakeholders.length} mapped

**Indicators:** ${projectData.indicators.length} defined

**Activities:** ${projectData.activities.join("; ")}

**Geography:** ${projectData.geography}
**Timeline:** ${projectData.timeline}

Rate on these dimensions (0-100):
1. **Problem Clarity:** Is the problem well-defined and evidence-based?
2. **Logic Coherence:** Does the intervention logic make sense?
3. **Stakeholder Coverage:** Are all relevant actors included?
4. **Measurement Quality:** Are indicators SMART and aligned?
5. **Feasibility:** Is this realistic given timeline and geography?

Respond in JSON format:
{
  "overallScore": number (0-100),
  "readiness": "draft" | "needs-work" | "review-ready" | "funder-ready",
  "dimensionScores": {
    "problemClarity": 0-100,
    "logicCoherence": 0-100,
    "stakeholderCoverage": 0-100,
    "measurementQuality": 0-100,
    "feasibility": 0-100
  },
  "topStrengths": ["what's working well"],
  "criticalGaps": ["what must be fixed before submission"],
  "nextSteps": ["prioritized actions to improve"],
  "estimatedReviewTime": "time estimate for refinement"
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a senior program officer at a major education foundation, reviewing grant proposals with expertise in LFA and ToC.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return result as QualityAssessment;
  } catch (error) {
    console.error("Quality assessment error:", error);
    return {
      overallScore: 0,
      readiness: "draft",
      dimensionScores: {
        problemClarity: 0,
        logicCoherence: 0,
        stakeholderCoverage: 0,
        measurementQuality: 0,
        feasibility: 0,
      },
      topStrengths: [],
      criticalGaps: ["Assessment failed. Please review manually."],
      nextSteps: ["Retry validation or proceed with manual review."],
      estimatedReviewTime: "Unknown",
    };
  }
}

// ============================================================================
// ORCHESTRATOR: Multi-Agent Workflow
// ============================================================================

export interface ComprehensiveValidation {
  timestamp: string;
  logicChain: LogicChainResult;
  smartValidation: SMARTResult[];
  contextualAdvice: ContextSuggestion;
  qualityAssessment: QualityAssessment;
  overallRecommendation: string;
}

export async function runMultiAgentValidation(projectData: {
  id: string;
  problem: string;
  activities: string[];
  outputs: string[];
  outcomes: string[];
  impact: string;
  stakeholders: any[];
  indicators: any[];
  theme: string;
  geography: string;
  timeline: string;
}): Promise<ComprehensiveValidation> {
  console.log(`[Multi-Agent] Starting validation for project ${projectData.id}`);

  try {
    // Run all agents with LangSmith tracing
    const agents = [
      {
        name: TRACING_CONFIG.agents.LOGIC_VALIDATOR,
        fn: () =>
          validateLogicChain(
            projectData.activities,
            projectData.outputs,
            projectData.outcomes,
            projectData.impact
          ),
      },
      {
        name: TRACING_CONFIG.agents.MEASURABILITY_CHECKER,
        fn: () =>
          Promise.all(
            projectData.outcomes.map((outcome) =>
              validateSMART(outcome, {
                theme: projectData.theme,
                geography: projectData.geography,
                timeline: projectData.timeline,
              })
            )
          ),
      },
      {
        name: TRACING_CONFIG.agents.CONTEXT_ADVISOR,
        fn: () =>
          getContextualSuggestions(
            projectData.theme,
            projectData.problem,
            projectData.geography,
            projectData.stakeholders.map((s) => s.type || s.name)
          ),
      },
      {
        name: TRACING_CONFIG.agents.QUALITY_SCORER,
        fn: () => assessOverallQuality(projectData),
      },
    ];

    // Run all agents independently (not using batch trace due to type compatibility)
    const [logicChain, smartValidation, contextualAdvice, qualityAssessment] = await Promise.all([
      validateLogicChain(
        projectData.activities,
        projectData.outputs,
        projectData.outcomes,
        projectData.impact
      ),
      Promise.all(
        projectData.outcomes.map((outcome) =>
          validateSMART(outcome, {
            theme: projectData.theme,
            geography: projectData.geography,
            timeline: projectData.timeline,
          })
        )
      ),
      getContextualSuggestions(
        projectData.theme,
        projectData.problem,
        projectData.geography,
        projectData.stakeholders.map((s) => s.type || s.name)
      ),
      assessOverallQuality(projectData),
    ]);

    // Generate overall recommendation
    const avgSMARTScore =
      smartValidation.reduce((sum: number, r: SMARTResult) => sum + r.score, 0) / smartValidation.length || 0;

    let recommendation = "";
    if (qualityAssessment.overallScore >= 85) {
      recommendation = "✅ **Funder-Ready:** This design is strong and ready for submission.";
    } else if (qualityAssessment.overallScore >= 70) {
      recommendation =
        "⚠️ **Review-Ready:** Good foundation, but address critical gaps before submitting.";
    } else if (qualityAssessment.overallScore >= 50) {
      recommendation =
        "🔧 **Needs Work:** Core elements are present but require significant refinement.";
    } else {
      recommendation = "📝 **Draft Stage:** Continue working through the journey to strengthen the design.";
    }

    const result: ComprehensiveValidation = {
      timestamp: new Date().toISOString(),
      logicChain,
      smartValidation,
      contextualAdvice,
      qualityAssessment,
      overallRecommendation: recommendation,
    };

    // Log result to LangSmith
    await logValidationResult(
      TRACING_CONFIG.agents.ORCHESTRATOR,
      {
        isValid: logicChain.isValid && qualityAssessment.overallScore >= 50,
        score: qualityAssessment.overallScore,
        issues: logicChain.issues,
        strengths: logicChain.strengths,
      },
      {
        projectId: projectData.id,
        smartScore: avgSMARTScore,
      }
    );

    return result;
  } catch (error) {
    console.error("[Multi-Agent] Validation error:", error);
    throw error;
  }
}
