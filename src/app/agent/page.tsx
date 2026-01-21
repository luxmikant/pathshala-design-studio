"use client";

import { useState } from "react";
import { Button, Card, CardHeader, CardTitle, CardContent, Input } from "@/components/ui";

export default function AgentChat() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "agent"; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendQuery = async () => {
    if (!query.trim()) return;

    const userMessage = query;
    setQuery("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Agent request failed");
      }

      setMessages((prev) => [
        ...prev,
        { role: "agent", content: data.response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQueries = [
    "Show me all my projects",
    "How many projects are in the database?",
    "Give me recommendations for an FLN program",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              🤖 Program Design Assistant
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Ask me anything about your projects, run validations, or get
              recommendations
            </p>
          </CardHeader>

          <CardContent>
            {/* Quick queries */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQueries.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(q)}
                    className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 rounded-md transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-lg mb-2">👋 Hi! I'm your AI assistant</p>
                  <p className="text-sm">
                    I can help you with projects, validations, and
                    recommendations.
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <p className="text-sm text-gray-600">Thinking...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    sendQuery();
                  }
                }}
                placeholder="Ask me anything..."
                disabled={isLoading}
              />
              <Button onClick={sendQuery} disabled={isLoading || !query.trim()}>
                Send
              </Button>
            </div>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-xs text-blue-900">
                💡 <strong>Tip:</strong> All queries are traced in LangSmith at{" "}
                <a
                  href="https://smith.langchain.com/projects"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  smith.langchain.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Available Tools */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Available Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>get_project:</strong> Get project details by ID
              </li>
              <li>
                <strong>list_projects:</strong> List all your projects
              </li>
              <li>
                <strong>validate_program_design:</strong> Run full AI
                validation
              </li>
              <li>
                <strong>get_recommendations:</strong> Get best practices for
                themes
              </li>
              <li>
                <strong>query_database:</strong> Get database statistics
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
