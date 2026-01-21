"use client";

import React, { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { Loader2, AlertCircle, CheckCircle, AlertTriangle, Info, Sparkles } from "lucide-react";

interface AIValidationPanelProps {
  projectId: string;
}

export function AIValidationPanel({ projectId }: AIValidationPanelProps) {
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runValidation = async (type: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          validationType: type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Validation failed");
      }

      const data = await response.json();
      setValidationResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "high":
        return "warning";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      {/* Validation Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button
              onClick={() => runValidation("full")}
              disabled={loading}
              variant="default"
              className="w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Full Validation"}
            </Button>
            <Button
              onClick={() => runValidation("logic")}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Logic Chain
            </Button>
            <Button
              onClick={() => runValidation("smart")}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              SMART Check
            </Button>
            <Button
              onClick={() => runValidation("quality")}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Quality Score
            </Button>
            <Button
              onClick={() => runValidation("suggestions")}
              disabled={loading}
              variant="secondary"
              className="w-full"
            >
              Get Suggestions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <p className="font-semibold text-destructive">Validation Error</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {validationResult && (
        <div className="space-y-4">
          {/* Full Validation Results */}
          {validationResult.validationType === "full" && (
            <>
              {/* Overall Recommendation */}
              <Card className="border-primary bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-semibold text-lg">
                        {validationResult.result.overallRecommendation}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quality Assessment */}
              {validationResult.result.qualityAssessment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Quality Assessment</span>
                      <Badge variant={getQualityBadgeVariant(validationResult.result.qualityAssessment.overallScore)}>
                        {validationResult.result.qualityAssessment.overallScore}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Dimension Scores */}
                    <div className="space-y-2">
                      {Object.entries(
                        validationResult.result.qualityAssessment.dimensionScores as Record<string, number>
                      ).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold w-12 text-right">
                                {value}%
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {/* Top Strengths */}
                    {validationResult.result.qualityAssessment.topStrengths?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          Top Strengths
                        </h4>
                        <ul className="space-y-1">
                          {validationResult.result.qualityAssessment.topStrengths.map(
                            (strength: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-success">✓</span>
                                {strength}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Critical Gaps */}
                    {validationResult.result.qualityAssessment.criticalGaps?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning" />
                          Critical Gaps
                        </h4>
                        <ul className="space-y-1">
                          {validationResult.result.qualityAssessment.criticalGaps.map(
                            (gap: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-warning">⚠</span>
                                {gap}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Next Steps */}
                    {validationResult.result.qualityAssessment.nextSteps?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Next Steps</h4>
                        <ol className="space-y-1 list-decimal list-inside">
                          {validationResult.result.qualityAssessment.nextSteps.map(
                            (step: string, idx: number) => (
                              <li key={idx} className="text-sm text-muted-foreground">
                                {step}
                              </li>
                            )
                          )}
                        </ol>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Logic Chain Issues */}
              {validationResult.result.logicChain?.issues?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Logic Chain Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {validationResult.result.logicChain.issues.map((issue: any, idx: number) => (
                        <div
                          key={idx}
                          className="border rounded-lg p-3 space-y-2"
                        >
                          <div className="flex items-start justify-between">
                            <Badge variant={getSeverityColor(issue.severity)}>
                              {issue.severity}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{issue.component}</span>
                          </div>
                          <p className="text-sm font-semibold">{issue.message}</p>
                          <p className="text-sm text-muted-foreground">💡 {issue.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contextual Suggestions */}
              {validationResult.result.contextualAdvice?.suggestions?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {validationResult.result.contextualAdvice.suggestions.map(
                        (suggestion: any, idx: number) => (
                          <div key={idx} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{suggestion.category}</Badge>
                              <span className="font-semibold text-sm">{suggestion.title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                            {suggestion.examples?.length > 0 && (
                              <div className="text-xs text-muted-foreground">
                                <span className="font-semibold">Examples: </span>
                                {suggestion.examples.join(", ")}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Simple Validation Results */}
          {validationResult.validationType !== "full" && (
            <Card>
              <CardHeader>
                <CardTitle>Validation Results</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-96">
                  {JSON.stringify(validationResult.result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function getQualityBadgeVariant(score: number): "success" | "warning" | "destructive" | "secondary" {
  if (score >= 85) return "success";
  if (score >= 70) return "warning";
  if (score >= 50) return "secondary";
  return "destructive";
}
