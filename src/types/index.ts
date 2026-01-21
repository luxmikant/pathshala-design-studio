// Pathshala Design Studio - Type Definitions

// ============================================
// USER & ORGANIZATION TYPES
// ============================================

export type OrgType = "NGO" | "CSO" | "GOVERNMENT" | "FUNDER" | "OTHER";
export type UserRole = "ADMIN" | "DESIGNER" | "VIEWER";

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  state?: string;
  district?: string;
  yearsOfExperience?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  organizationId?: string;
  organization?: Organization;
  gamificationPoints: number;
  badges: Badge[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// LFA PROJECT TYPES
// ============================================

export type ProjectTheme = "FLN" | "CAREER_READINESS" | "SCHOOL_LEADERSHIP" | "CUSTOM";
export type ProjectStatus = "DRAFT" | "IN_PROGRESS" | "REVIEW" | "COMPLETE";

export interface Geography {
  state: string;
  districts: string[];
  blocks: string[];
}

export interface LfaProject {
  id: string;
  title: string;
  theme: ProjectTheme;
  status: ProjectStatus;
  completionPercentage: number;
  geography?: Geography;
  organizationId: string;
  organization?: Organization;
  createdById: string;
  createdBy?: User;
  components: LfaComponent[];
  stakeholders: StakeholderMapping[];
  indicators: Indicator[];
  progress?: ProjectProgress;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// LFA COMPONENT TYPES
// ============================================

export type ComponentType =
  | "PROBLEM_DEFINITION"
  | "IMPACT_VISION"
  | "THEORY_OF_CHANGE"
  | "STAKEHOLDER_FRAMEWORK"
  | "IMPLEMENTATION_DESIGN"
  | "MONITORING_EVALUATION";

export interface LfaComponent {
  id: string;
  componentType: ComponentType;
  content: Record<string, unknown>;
  version: number;
  isComplete: boolean;
  aiSuggestions?: AISuggestion[];
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AISuggestion {
  id: string;
  type: "improvement" | "alternative" | "warning" | "example";
  message: string;
  confidence: number;
  applied: boolean;
}

// ============================================
// STAKEHOLDER TYPES
// ============================================

export type StakeholderType =
  | "STUDENT"
  | "TEACHER"
  | "HEAD_MASTER"
  | "SMC"
  | "PARENT"
  | "CRP"
  | "CRCC"
  | "BRP"
  | "BRCC"
  | "BEO"
  | "DEO"
  | "DIET"
  | "DM"
  | "OTHER";

export type StakeholderLevel = "SCHOOL" | "CLUSTER" | "BLOCK" | "DISTRICT" | "STATE";

export interface PracticeIndicator {
  leadIndicator: string;
  lagIndicator: string;
  measurementMethod: "observation" | "self-report" | "artifact" | "assessment";
  frequency: "weekly" | "monthly" | "quarterly" | "annually";
}

export interface SupportRequired {
  training: string[];
  resources: string[];
  mentoring: string;
}

export interface StakeholderMapping {
  id: string;
  stakeholderType: StakeholderType;
  level: StakeholderLevel;
  currentPractice?: string;
  desiredPractice?: string;
  practiceIndicators?: PracticeIndicator;
  supportRequired?: SupportRequired;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// INDICATOR TYPES
// ============================================

export type IndicatorType = "OUTCOME" | "OUTPUT" | "PROCESS";

export interface Indicator {
  id: string;
  name: string;
  definition?: string;
  indicatorType: IndicatorType;
  linkedOutcomeId?: string;
  measurementMethod?: string;
  frequency?: string;
  dataSource?: string;
  baselineValue?: string;
  targetValue?: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SMARTValidation {
  specific: { valid: boolean; feedback: string };
  measurable: { valid: boolean; feedback: string };
  achievable: { valid: boolean; feedback: string };
  relevant: { valid: boolean; feedback: string };
  timeBound: { valid: boolean; feedback: string };
  overallScore: number;
}

// ============================================
// GAMIFICATION TYPES
// ============================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: Date;
  criteria: {
    type: "completion" | "quality" | "speed" | "collaboration";
    threshold: number;
  };
}

export interface ProjectProgress {
  id: string;
  currentLevel: number;
  currentQuest: number;
  completedQuests: string[];
  levelProgress: Record<number, number>;
  lastActivityAt: Date;
  streakDays: number;
  totalPointsEarned: number;
  projectId: string;
}

// ============================================
// JOURNEY QUEST TYPES
// ============================================

export interface Quest {
  id: string;
  levelId: number;
  questNumber: number;
  title: string;
  description: string;
  instructions: string[];
  componentType: ComponentType;
  fields: FormField[];
  pointsReward: number;
  points?: number; // Alias for pointsReward
  isComplete: boolean;
  icon?: string;
  estimatedMinutes?: number;
}

export interface Level {
  id: number;
  level: number; // Alias for id
  name: string;
  title?: string; // Alias for name
  subtitle?: string; // Alias for description  
  description: string;
  icon: string;
  quests: Quest[];
  badge: Badge;
  isUnlocked: boolean;
  completionPercentage: number;
}

// Export type aliases for backwards compatibility
export type JourneyLevel = Level;
export type JourneyQuest = Quest;

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "multiselect" | "checkbox" | "radio" | "location";
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  aiAssist?: boolean;
}

// ============================================
// PATTERN LIBRARY TYPES
// ============================================

export type PatternType = "PROBLEM" | "OUTCOME" | "INDICATOR" | "PRACTICE_CHANGE" | "ACTIVITY";

export interface Pattern {
  id: string;
  theme: string;
  patternType: PatternType;
  title: string;
  content: Record<string, unknown>;
  tags: string[];
  usageCount: number;
  rating?: number;
  sourceOrganization?: string;
  isVerified: boolean;
  createdAt: Date;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
