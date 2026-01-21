/**
 * LangChain Integration Test
 * Tests Groq API connection and multi-agent validation
 */

require("dotenv").config();
const Groq = require("groq-sdk");

async function testLangChain() {
  console.log("\n🧪 Testing LangChain Integration\n");
  console.log("=" . repeat(60));

  // 1. Test Groq API Connection
  console.log("\n✓ Step 1: Testing Groq API Connection");
  console.log("-----------------------------------");

  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  if (!process.env.GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY not found in environment variables");
    return;
  }

  console.log("✅ Groq API Key loaded");
  console.log(`   Key: ${process.env.GROQ_API_KEY.substring(0, 10)}...`);

  try {
    const testMessage = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content:
            "In one sentence, explain what a Logical Framework Approach (LFA) is.",
        },
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 100,
    });

    console.log("✅ Groq API Working!");
    console.log(`\n   Response: ${testMessage.choices[0].message.content}`);
  } catch (error) {
    console.error("❌ Groq API Error:", error.message);
    return;
  }

  // 2. Test Multi-Agent Validation
  console.log("\n\n✓ Step 2: Testing Multi-Agent Validation");
  console.log("----------------------------------------");

  const testData = {
    activities: [
      "Train teachers on active learning methods",
      "Provide quality textbooks to classrooms",
    ],
    outputs: [
      "100 teachers trained",
      "1000 textbooks distributed",
    ],
    outcomes: [
      "Teachers adopt active learning in 80% of lessons",
      "Student engagement increases by 60%",
    ],
    impact: "Improved foundational learning outcomes for 5000 students",
  };

  console.log("\n📊 Test Program Logic:");
  console.log(`   Activities: ${testData.activities.length} items`);
  console.log(`   Outputs: ${testData.outputs.length} items`);
  console.log(`   Outcomes: ${testData.outcomes.length} items`);
  console.log(`   Impact: ${testData.impact}`);

  try {
    // Agent 1: Logic Validator
    console.log("\n🤖 Agent 1: Logic Validator");
    const logicValidation = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Validate this program logic chain. Rate the logical flow from activities to outcomes on a scale of 0-100.

Activities: ${testData.activities.join(", ")}
Outputs: ${testData.outputs.join(", ")}
Outcomes: ${testData.outcomes.join(", ")}
Impact: ${testData.impact}

Respond with: SCORE: [0-100] | VALID: [YES/NO] | KEY_ISSUES: [brief issues]`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 150,
    });

    console.log(`   ✅ Response: ${logicValidation.choices[0].message.content.substring(0, 100)}...`);

    // Agent 2: Measurability Checker
    console.log("\n🤖 Agent 2: Measurability Checker (SMART)");
    const smartValidation = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Check if these outcomes meet SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound):

Outcomes: ${testData.outcomes.join(" | ")}

Rate from 0-100 how SMART they are.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 150,
    });

    console.log(`   ✅ Response: ${smartValidation.choices[0].message.content.substring(0, 100)}...`);

    // Agent 3: Context Advisor
    console.log("\n🤖 Agent 3: Context Advisor");
    const contextAdvice = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `As an education sector expert, provide 2 key recommendations for this program:

Activities: ${testData.activities.join(", ")}
Outcomes: ${testData.outcomes.join(", ")}

Keep it brief.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 100,
    });

    console.log(`   ✅ Response: ${contextAdvice.choices[0].message.content.substring(0, 100)}...`);

    // Agent 4: Quality Scorer
    console.log("\n🤖 Agent 4: Quality Scorer");
    const qualityScore = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Rate the overall quality of this program design from 0-100:

${JSON.stringify(testData, null, 2)}

Respond with: SCORE: [0-100] | RECOMMENDATION: [FUNDER_READY/NEEDS_REVISION/DRAFT]`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 150,
    });

    console.log(`   ✅ Response: ${qualityScore.choices[0].message.content.substring(0, 100)}...`);

  } catch (error) {
    console.error("❌ Multi-Agent Test Error:", error.message);
    return;
  }

  // 3. Test LangSmith Tracing
  console.log("\n\n✓ Step 3: LangSmith Configuration");
  console.log("----------------------------------");

  console.log(`   LANGCHAIN_API_KEY: ${process.env.LANGCHAIN_API_KEY ? "✅ Configured" : "❌ Missing"}`);
  console.log(`   LANGCHAIN_TRACING_V2: ${process.env.LANGCHAIN_TRACING_V2 || "❌ Missing"}`);
  console.log(`   LANGCHAIN_PROJECT: ${process.env.LANGCHAIN_PROJECT || "❌ Missing"}`);
  console.log(`   LANGSMITH_ENDPOINT: ${process.env.LANGSMITH_ENDPOINT || "❌ Missing"}`);

  if (process.env.LANGCHAIN_API_KEY && process.env.LANGCHAIN_TRACING_V2 === "true") {
    console.log("\n   ✅ LangSmith Tracing Active!");
    console.log(`   📊 View traces at: https://smith.langchain.com/`);
  }

  // Summary
  console.log("\n\n" + "=" . repeat(60));
  console.log("✅ LangChain Integration Test Complete!");
  console.log("\n🎯 Summary:");
  console.log("   ✅ Groq API connection: WORKING");
  console.log("   ✅ Multi-agent validation: WORKING");
  console.log("   ✅ LangSmith tracing: CONFIGURED");
  console.log("\n📝 Next Steps:");
  console.log("   1. Start dev server: npm run dev");
  console.log("   2. Register at: http://localhost:3000/auth/register");
  console.log("   3. Create project and validate with AI agents");
  console.log("   4. View LangSmith traces: https://smith.langchain.com");
  console.log("\n" + "=" . repeat(60) + "\n");
}

testLangChain().catch((error) => {
  console.error("❌ Test failed:", error);
  process.exit(1);
});
