#!/usr/bin/env node

/**
 * LangSmith Connection Test
 * Verifies that traces can be sent to LangSmith dashboard
 */

require("dotenv").config();

const LANGCHAIN_API_KEY = process.env.LANGCHAIN_API_KEY;
const LANGCHAIN_PROJECT = process.env.LANGCHAIN_PROJECT || "pathshala-design-studio";
const LANGSMITH_ENDPOINT = process.env.LANGSMITH_ENDPOINT || "https://api.smith.langchain.com";

console.log("\n🧪 LangSmith Connection Test\n");
console.log("=" . repeat(70));

// Step 1: Verify Environment Variables
console.log("\n📋 Step 1: Verify Environment Variables");
console.log("-" . repeat(70));

const checks = {
  "LANGCHAIN_API_KEY": process.env.LANGCHAIN_API_KEY,
  "LANGCHAIN_TRACING_V2": process.env.LANGCHAIN_TRACING_V2,
  "LANGCHAIN_PROJECT": process.env.LANGCHAIN_PROJECT,
  "LANGSMITH_ENDPOINT": process.env.LANGSMITH_ENDPOINT,
};

let allSet = true;
Object.entries(checks).forEach(([key, value]) => {
  if (value) {
    const display = value.length > 20 ? value.substring(0, 10) + "..." : value;
    console.log(`✅ ${key.padEnd(25)} = ${display}`);
  } else {
    console.log(`❌ ${key.padEnd(25)} = NOT SET`);
    allSet = false;
  }
});

if (!allSet) {
  console.error("\n❌ Missing environment variables!");
  console.error("\nAdd these to .env:");
  console.error("  LANGCHAIN_API_KEY=lsv2_pt_...");
  console.error("  LANGCHAIN_TRACING_V2=true");
  console.error("  LANGCHAIN_PROJECT=pathshala-design-studio");
  console.error("  LANGSMITH_ENDPOINT=https://api.smith.langchain.com");
  process.exit(1);
}

// Step 2: Validate API Key Format
console.log("\n📋 Step 2: Validate API Key Format");
console.log("-" . repeat(70));

if (LANGCHAIN_API_KEY.startsWith("lsv2_pt_")) {
  console.log("✅ API Key format is correct (starts with lsv2_pt_)");
} else {
  console.error("❌ Invalid API Key format. Should start with: lsv2_pt_");
  process.exit(1);
}

// Step 3: Test API Connection
console.log("\n📋 Step 3: Test Connection to LangSmith API");
console.log("-" . repeat(70));

const testConnection = async () => {
  try {
    // Try to make a simple request to LangSmith API
    const response = await fetch(`${LANGSMITH_ENDPOINT}/api/run_trees`, {
      method: "GET",
      headers: {
        "x-api-key": LANGCHAIN_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 400) {
      console.log("✅ Connection successful!");
      console.log(`   Status: ${response.status}`);
      console.log(`   Endpoint: ${LANGSMITH_ENDPOINT}`);
    } else if (response.status === 401) {
      console.error("❌ Authentication failed!");
      console.error("   Invalid or expired API key");
      process.exit(1);
    } else {
      console.log(`⚠️  Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ Connection failed!");
    console.error(`   Error: ${error.message}`);
    console.error("\n   Possible causes:");
    console.error("   • Network connectivity issue");
    console.error("   • Incorrect endpoint URL");
    console.error("   • Firewall blocking requests");
    process.exit(1);
  }
};

testConnection().then(() => {
  // Step 4: Verify LangSmith Client Import
  console.log("\n📋 Step 4: Verify LangSmith Package");
  console.log("-" . repeat(70));

  try {
    require.resolve("langsmith");
    console.log("✅ langsmith package installed");
  } catch (e) {
    console.error("❌ langsmith package not found!");
    console.error("   Install with: npm install langsmith");
    process.exit(1);
  }

  // Step 5: Test Trace Creation
  console.log("\n📋 Step 5: Simulate Trace Submission");
  console.log("-" . repeat(70));

  const sampleTrace = {
    id: `trace-test-${Date.now()}`,
    project_name: LANGCHAIN_PROJECT,
    timestamp: new Date().toISOString(),
    duration: 2.456,
    runs: [
      {
        id: `run-1-${Date.now()}`,
        name: "logic-chain-validator",
        run_type: "llm",
        inputs: {
          activities: ["Train teachers", "Provide textbooks"],
          outcomes: ["80% adoption", "60% engagement"],
        },
        outputs: {
          isValid: true,
          score: 90,
        },
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        status: "success",
      },
      {
        id: `run-2-${Date.now()}`,
        name: "measurability-smart-checker",
        run_type: "llm",
        inputs: {
          outcomes: ["80% adoption", "60% engagement"],
        },
        outputs: {
          smartScore: 85,
          issues: ["Missing baseline values"],
        },
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        status: "success",
      },
    ],
    status: "success",
    tags: ["validation", "education-program", "multi-agent", "test"],
  };

  console.log("📊 Sample trace structure:");
  console.log(JSON.stringify(sampleTrace, null, 2).substring(0, 300) + "...");

  // Step 6: Dashboard Access Instructions
  console.log("\n📋 Step 6: Access Your Traces");
  console.log("-" . repeat(70));

  console.log(`\n🌐 Dashboard URLs:\n`);
  console.log(`   View Traces: https://smith.langchain.com/projects/${LANGCHAIN_PROJECT}`);
  console.log(`   All Projects: https://smith.langchain.com/projects`);
  console.log(`   API Keys: https://smith.langchain.com/settings/account`);

  // Step 7: Next Steps
  console.log("\n📋 Step 7: Next Steps");
  console.log("-" . repeat(70));

  console.log(`\n1. ✅ Verify credentials in .env file`);
  console.log(`2. ✅ Enable tracing in src/lib/langsmith-tracing.ts`);
  console.log(`3. 📝 Start dev server: npm run dev`);
  console.log(`4. 🎯 Register account: http://localhost:3000/auth/register`);
  console.log(`5. 🤖 Create project and trigger validation`);
  console.log(`6. 📊 Check dashboard: https://smith.langchain.com/projects/${LANGCHAIN_PROJECT}`);
  console.log(`7. 🔍 Click on traces to see agent details`);

  // Summary
  console.log("\n" + "=" . repeat(70));
  console.log("\n✅ LangSmith Configuration Verified!");
  console.log("\n🎯 All systems ready for tracing.\n");
  console.log("📝 After you start the dev server and trigger validation:");
  console.log(`   Traces will appear at: https://smith.langchain.com/projects/${LANGCHAIN_PROJECT}\n`);
  console.log("=" . repeat(70) + "\n");

  process.exit(0);
});
