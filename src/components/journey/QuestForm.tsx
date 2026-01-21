"use client";

import React, { useState } from "react";
import { Quest } from "@/types";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  Input,
  Textarea,
} from "@/components/ui";
import { Label } from "@/components/ui/label";

interface QuestFormProps {
  quest: Quest;
  projectId: string;
  initialData?: Record<string, any>;
  onSave: (data: Record<string, any>) => Promise<void>;
  onComplete: () => void;
  onBack: () => void;
}

export function QuestForm({
  quest,
  projectId,
  initialData = {},
  onSave,
  onComplete,
  onBack,
}: QuestFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await onSave(formData);
      onComplete();
    } finally {
      setIsCompleting(false);
    }
  };

  // Render different form fields based on quest ID
  const renderQuestFields = () => {
    switch (quest.id) {
      case "vision":
        return (
          <VisionQuest formData={formData} setFormData={setFormData} />
        );
      case "geography":
        return (
          <GeographyQuest formData={formData} setFormData={setFormData} />
        );
      case "context":
        return (
          <ContextQuest formData={formData} setFormData={setFormData} />
        );
      case "stakeholder-map":
        return (
          <StakeholderMapQuest formData={formData} setFormData={setFormData} />
        );
      case "power-analysis":
        return (
          <PowerAnalysisQuest formData={formData} setFormData={setFormData} />
        );
      case "engagement":
        return (
          <EngagementQuest formData={formData} setFormData={setFormData} />
        );
      case "goal":
        return (
          <GoalQuest formData={formData} setFormData={setFormData} />
        );
      case "outcomes":
        return (
          <OutcomesQuest formData={formData} setFormData={setFormData} />
        );
      case "outputs":
        return (
          <OutputsQuest formData={formData} setFormData={setFormData} />
        );
      case "activities":
        return (
          <ActivitiesQuest formData={formData} setFormData={setFormData} />
        );
      case "indicators":
        return (
          <IndicatorsQuest formData={formData} setFormData={setFormData} />
        );
      case "mov":
        return (
          <MOVQuest formData={formData} setFormData={setFormData} />
        );
      case "risks":
        return (
          <RisksQuest formData={formData} setFormData={setFormData} />
        );
      case "review":
        return (
          <ReviewQuest formData={formData} setFormData={setFormData} />
        );
      case "export":
        return (
          <ExportQuest formData={formData} setFormData={setFormData} />
        );
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            Quest form coming soon...
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{quest.icon}</span>
          <div>
            <CardTitle>{quest.title}</CardTitle>
            <CardDescription>{quest.description}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <span className="text-amber-600">⭐ {quest.points} points</span>
          <span className="text-muted-foreground">~{quest.estimatedMinutes} min</span>
        </div>
      </CardHeader>

      <CardContent>{renderQuestFields()}</CardContent>

      <CardFooter className="justify-between border-t pt-4">
        <Button variant="outline" onClick={onBack}>
          ← Back to Map
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} loading={isSaving}>
            💾 Save Progress
          </Button>
          <Button onClick={handleComplete} loading={isCompleting}>
            ✓ Complete Quest
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

// Quest-specific form components

function VisionQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg text-sm">
        <strong>🎯 Quest Goal:</strong> Define the vision and purpose of your education program.
        What change do you want to see in the world?
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="programVision" required>
          Program Vision Statement
        </Label>
        <Textarea
          id="programVision"
          placeholder="e.g., Every child in grade 3 can read with comprehension and perform basic arithmetic"
          rows={3}
          value={formData.programVision || ""}
          onChange={(e) => setFormData({ ...formData, programVision: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          What is the long-term change you want to see?
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="programPurpose" required>
          Why does this matter?
        </Label>
        <Textarea
          id="programPurpose"
          placeholder="e.g., Foundational literacy is critical for all future learning..."
          rows={3}
          value={formData.programPurpose || ""}
          onChange={(e) => setFormData({ ...formData, programPurpose: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetBeneficiaries">Target Beneficiaries</Label>
        <Input
          id="targetBeneficiaries"
          placeholder="e.g., Grade 1-3 students in government schools"
          value={formData.targetBeneficiaries || ""}
          onChange={(e) => setFormData({ ...formData, targetBeneficiaries: e.target.value })}
        />
      </div>
    </div>
  );
}

function GeographyQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-green-50 rounded-lg text-sm">
        <strong>🗺️ Quest Goal:</strong> Define where your program will operate.
        Understanding geography helps in planning logistics and stakeholder engagement.
      </div>

      <div className="space-y-2">
        <Label htmlFor="states" required>States</Label>
        <Input
          id="states"
          placeholder="e.g., Madhya Pradesh, Rajasthan"
          value={formData.states || ""}
          onChange={(e) => setFormData({ ...formData, states: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="districts">Districts (if applicable)</Label>
        <Input
          id="districts"
          placeholder="e.g., Bhopal, Indore, Gwalior"
          value={formData.districts || ""}
          onChange={(e) => setFormData({ ...formData, districts: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="blocks">Blocks (if applicable)</Label>
        <Input
          id="blocks"
          placeholder="e.g., Specific blocks or leave empty for district-wide"
          value={formData.blocks || ""}
          onChange={(e) => setFormData({ ...formData, blocks: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="geographyNotes">Additional Geographic Context</Label>
        <Textarea
          id="geographyNotes"
          placeholder="Any specific notes about the geography, accessibility, etc."
          rows={2}
          value={formData.geographyNotes || ""}
          onChange={(e) => setFormData({ ...formData, geographyNotes: e.target.value })}
        />
      </div>
    </div>
  );
}

function ContextQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-purple-50 rounded-lg text-sm">
        <strong>📊 Quest Goal:</strong> Understand the educational landscape where your program will operate.
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentState" required>Current State of Education</Label>
        <Textarea
          id="currentState"
          placeholder="Describe the current state of education in your target area..."
          rows={3}
          value={formData.currentState || ""}
          onChange={(e) => setFormData({ ...formData, currentState: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="challenges">Key Challenges</Label>
        <Textarea
          id="challenges"
          placeholder="What are the main challenges students/teachers face?"
          rows={3}
          value={formData.challenges || ""}
          onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="existingPrograms">Existing Programs/Interventions</Label>
        <Textarea
          id="existingPrograms"
          placeholder="What programs already exist? What's working/not working?"
          rows={2}
          value={formData.existingPrograms || ""}
          onChange={(e) => setFormData({ ...formData, existingPrograms: e.target.value })}
        />
      </div>
    </div>
  );
}

function StakeholderMapQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  const [stakeholders, setStakeholders] = useState<any[]>(formData.stakeholders || []);

  const addStakeholder = () => {
    const newStakeholder = { name: "", type: "", level: "", role: "" };
    const updated = [...stakeholders, newStakeholder];
    setStakeholders(updated);
    setFormData({ ...formData, stakeholders: updated });
  };

  const updateStakeholder = (index: number, field: string, value: string) => {
    const updated = stakeholders.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setStakeholders(updated);
    setFormData({ ...formData, stakeholders: updated });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 rounded-lg text-sm">
        <strong>👥 Quest Goal:</strong> Identify all stakeholders who will be involved in or affected by your program.
      </div>

      {stakeholders.map((s, index) => (
        <Card key={index} className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stakeholder Name</Label>
              <Input
                placeholder="e.g., Teachers, Parents, DEO"
                value={s.name}
                onChange={(e) => updateStakeholder(index, "name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Input
                placeholder="Government, Community, NGO, etc."
                value={s.type}
                onChange={(e) => updateStakeholder(index, "type", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Level</Label>
              <Input
                placeholder="State, District, Block, School"
                value={s.level}
                onChange={(e) => updateStakeholder(index, "level", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role in Program</Label>
              <Input
                placeholder="Decision maker, Implementer, Beneficiary"
                value={s.role}
                onChange={(e) => updateStakeholder(index, "role", e.target.value)}
              />
            </div>
          </div>
        </Card>
      ))}

      <Button variant="outline" onClick={addStakeholder}>
        + Add Stakeholder
      </Button>
    </div>
  );
}

function PowerAnalysisQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-orange-50 rounded-lg text-sm">
        <strong>⚡ Quest Goal:</strong> Analyze the influence and interest of each stakeholder to prioritize engagement.
      </div>

      <div className="space-y-2">
        <Label>High Power, High Interest (Key Players)</Label>
        <Textarea
          placeholder="Stakeholders to actively engage with..."
          rows={2}
          value={formData.keyPlayers || ""}
          onChange={(e) => setFormData({ ...formData, keyPlayers: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>High Power, Low Interest (Keep Satisfied)</Label>
        <Textarea
          placeholder="Stakeholders to keep informed..."
          rows={2}
          value={formData.keepSatisfied || ""}
          onChange={(e) => setFormData({ ...formData, keepSatisfied: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Low Power, High Interest (Keep Informed)</Label>
        <Textarea
          placeholder="Stakeholders with high interest but limited influence..."
          rows={2}
          value={formData.keepInformed || ""}
          onChange={(e) => setFormData({ ...formData, keepInformed: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Low Power, Low Interest (Monitor)</Label>
        <Textarea
          placeholder="Stakeholders to monitor with minimal effort..."
          rows={2}
          value={formData.monitor || ""}
          onChange={(e) => setFormData({ ...formData, monitor: e.target.value })}
        />
      </div>
    </div>
  );
}

function EngagementQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-teal-50 rounded-lg text-sm">
        <strong>🤝 Quest Goal:</strong> Plan how you will engage with each stakeholder group.
      </div>

      <div className="space-y-2">
        <Label required>Engagement Strategy</Label>
        <Textarea
          placeholder="Describe your overall approach to stakeholder engagement..."
          rows={3}
          value={formData.engagementStrategy || ""}
          onChange={(e) => setFormData({ ...formData, engagementStrategy: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Communication Plan</Label>
        <Textarea
          placeholder="How will you communicate with different stakeholders?"
          rows={3}
          value={formData.communicationPlan || ""}
          onChange={(e) => setFormData({ ...formData, communicationPlan: e.target.value })}
        />
      </div>
    </div>
  );
}

function GoalQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-indigo-50 rounded-lg text-sm">
        <strong>🎯 Quest Goal:</strong> Define the overall goal that your program will contribute to.
        This is the long-term impact beyond your direct control.
      </div>

      <div className="space-y-2">
        <Label htmlFor="overallGoal" required>Overall Goal</Label>
        <Textarea
          id="overallGoal"
          placeholder="e.g., Improved learning outcomes for children in government schools"
          rows={3}
          value={formData.overallGoal || ""}
          onChange={(e) => setFormData({ ...formData, overallGoal: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          What is the broader change your program contributes to?
        </p>
      </div>
    </div>
  );
}

function OutcomesQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  const [outcomes, setOutcomes] = useState<string[]>(formData.outcomes || [""]);

  const addOutcome = () => {
    const updated = [...outcomes, ""];
    setOutcomes(updated);
    setFormData({ ...formData, outcomes: updated });
  };

  const updateOutcome = (index: number, value: string) => {
    const updated = outcomes.map((o, i) => (i === index ? value : o));
    setOutcomes(updated);
    setFormData({ ...formData, outcomes: updated });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-cyan-50 rounded-lg text-sm">
        <strong>📈 Quest Goal:</strong> Define the outcomes your program will achieve.
        These are the changes that will occur as a result of your outputs.
      </div>

      {outcomes.map((outcome, index) => (
        <div key={index} className="space-y-2">
          <Label>Outcome {index + 1}</Label>
          <Textarea
            placeholder="e.g., Teachers demonstrate improved pedagogical practices"
            rows={2}
            value={outcome}
            onChange={(e) => updateOutcome(index, e.target.value)}
          />
        </div>
      ))}

      <Button variant="outline" onClick={addOutcome}>
        + Add Outcome
      </Button>
    </div>
  );
}

function OutputsQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  const [outputs, setOutputs] = useState<string[]>(formData.outputs || [""]);

  const addOutput = () => {
    const updated = [...outputs, ""];
    setOutputs(updated);
    setFormData({ ...formData, outputs: updated });
  };

  const updateOutput = (index: number, value: string) => {
    const updated = outputs.map((o, i) => (i === index ? value : o));
    setOutputs(updated);
    setFormData({ ...formData, outputs: updated });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-lime-50 rounded-lg text-sm">
        <strong>📦 Quest Goal:</strong> Define the outputs (deliverables) your program will produce.
        These are the direct results of your activities.
      </div>

      {outputs.map((output, index) => (
        <div key={index} className="space-y-2">
          <Label>Output {index + 1}</Label>
          <Textarea
            placeholder="e.g., 500 teachers trained in FLN pedagogy"
            rows={2}
            value={output}
            onChange={(e) => updateOutput(index, e.target.value)}
          />
        </div>
      ))}

      <Button variant="outline" onClick={addOutput}>
        + Add Output
      </Button>
    </div>
  );
}

function ActivitiesQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  const [activities, setActivities] = useState<string[]>(formData.activities || [""]);

  const addActivity = () => {
    const updated = [...activities, ""];
    setActivities(updated);
    setFormData({ ...formData, activities: updated });
  };

  const updateActivity = (index: number, value: string) => {
    const updated = activities.map((a, i) => (i === index ? value : a));
    setActivities(updated);
    setFormData({ ...formData, activities: updated });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-rose-50 rounded-lg text-sm">
        <strong>⚙️ Quest Goal:</strong> Define the activities you will implement.
        These are the actions that will produce your outputs.
      </div>

      {activities.map((activity, index) => (
        <div key={index} className="space-y-2">
          <Label>Activity {index + 1}</Label>
          <Textarea
            placeholder="e.g., Conduct 5-day teacher training workshops"
            rows={2}
            value={activity}
            onChange={(e) => updateActivity(index, e.target.value)}
          />
        </div>
      ))}

      <Button variant="outline" onClick={addActivity}>
        + Add Activity
      </Button>
    </div>
  );
}

function IndicatorsQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-amber-50 rounded-lg text-sm">
        <strong>📊 Quest Goal:</strong> Define indicators to measure success at each level.
      </div>

      <div className="space-y-2">
        <Label>Goal Indicators</Label>
        <Textarea
          placeholder="How will you measure progress toward the goal?"
          rows={2}
          value={formData.goalIndicators || ""}
          onChange={(e) => setFormData({ ...formData, goalIndicators: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Outcome Indicators</Label>
        <Textarea
          placeholder="How will you measure outcome achievement?"
          rows={2}
          value={formData.outcomeIndicators || ""}
          onChange={(e) => setFormData({ ...formData, outcomeIndicators: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Output Indicators</Label>
        <Textarea
          placeholder="How will you measure output delivery?"
          rows={2}
          value={formData.outputIndicators || ""}
          onChange={(e) => setFormData({ ...formData, outputIndicators: e.target.value })}
        />
      </div>
    </div>
  );
}

function MOVQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-violet-50 rounded-lg text-sm">
        <strong>📋 Quest Goal:</strong> Define Means of Verification - how you will collect data for each indicator.
      </div>

      <div className="space-y-2">
        <Label>Data Sources</Label>
        <Textarea
          placeholder="What data sources will you use? (surveys, assessments, reports)"
          rows={3}
          value={formData.dataSources || ""}
          onChange={(e) => setFormData({ ...formData, dataSources: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Data Collection Methods</Label>
        <Textarea
          placeholder="How will you collect this data?"
          rows={3}
          value={formData.collectionMethods || ""}
          onChange={(e) => setFormData({ ...formData, collectionMethods: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Frequency of Collection</Label>
        <Input
          placeholder="e.g., Monthly, Quarterly, Annually"
          value={formData.collectionFrequency || ""}
          onChange={(e) => setFormData({ ...formData, collectionFrequency: e.target.value })}
        />
      </div>
    </div>
  );
}

function RisksQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-red-50 rounded-lg text-sm">
        <strong>⚠️ Quest Goal:</strong> Identify assumptions and risks that could affect your program.
      </div>

      <div className="space-y-2">
        <Label>Key Assumptions</Label>
        <Textarea
          placeholder="What must be true for your program to succeed?"
          rows={3}
          value={formData.assumptions || ""}
          onChange={(e) => setFormData({ ...formData, assumptions: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Potential Risks</Label>
        <Textarea
          placeholder="What could go wrong? What external factors might affect success?"
          rows={3}
          value={formData.risks || ""}
          onChange={(e) => setFormData({ ...formData, risks: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Mitigation Strategies</Label>
        <Textarea
          placeholder="How will you address these risks?"
          rows={3}
          value={formData.mitigation || ""}
          onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })}
        />
      </div>
    </div>
  );
}

function ReviewQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-emerald-50 rounded-lg text-sm">
        <strong>✅ Quest Goal:</strong> Review your complete LFA and make any final adjustments.
      </div>

      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          This is where you'll see a summary of your entire LFA for review.
          Take time to ensure all elements are aligned and logically connected.
        </p>
      </div>

      <div className="space-y-2">
        <Label>Review Notes</Label>
        <Textarea
          placeholder="Any notes or changes needed..."
          rows={3}
          value={formData.reviewNotes || ""}
          onChange={(e) => setFormData({ ...formData, reviewNotes: e.target.value })}
        />
      </div>
    </div>
  );
}

function ExportQuest({ formData, setFormData }: { formData: Record<string, any>; setFormData: (data: Record<string, any>) => void }) {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-sky-50 rounded-lg text-sm">
        <strong>📄 Quest Goal:</strong> Export your LFA in various formats for sharing and presentation.
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-24 flex-col">
          <span className="text-2xl mb-2">📄</span>
          Export as PDF
        </Button>
        <Button variant="outline" className="h-24 flex-col">
          <span className="text-2xl mb-2">📊</span>
          Export as Excel
        </Button>
        <Button variant="outline" className="h-24 flex-col">
          <span className="text-2xl mb-2">📑</span>
          Export as Word
        </Button>
        <Button variant="outline" className="h-24 flex-col">
          <span className="text-2xl mb-2">🔗</span>
          Share Link
        </Button>
      </div>
    </div>
  );
}

export default QuestForm;
