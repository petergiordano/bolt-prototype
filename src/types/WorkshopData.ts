export interface WorkshopData {
  version: string;
  createdAt: string;
  lastUpdated: string;
  userProfile?: UserProfile;
  workshop1: Workshop1Data;
  workshop2?: Workshop2Data;
  workshop3?: Workshop3Data;
}

export interface UserProfile {
  email?: string;
  name?: string;
}

export interface Workshop1Data {
  activity1?: ProblemOriginStoryData;
  activity2?: ProblemValidationData;
}

export interface Workshop2Data {
  activity1?: Record<string, unknown>; // To be defined later
  activity2?: Record<string, unknown>; // To be defined later
}

export interface Workshop3Data {
  activity1?: Record<string, unknown>; // To be defined later
}

export interface ActivityData {
  startedAt?: string;
  completedAt?: string;
  lastModified: string;
  stepData: Record<string, unknown>;
  metadata?: {
    timeSpent?: number;
    revisitCount?: number;
    validationErrors?: string[];
  };
}

export interface TextResponseStep {
  response: string;
  wordCount: number;
  isValid: boolean;
  lastModified: string;
}

export interface MultipleChoiceStep {
  selectedOption: string;
  otherText?: string;
  isValid: boolean;
  lastModified: string;
}

export interface RankingStep {
  rankedItems: Array<{
    id: string;
    rank: number;
    item: string;
  }>;
  isValid: boolean;
  lastModified: string;
}

export interface MarkerData {
  id: string;
  type: 'competitor' | 'underserved' | 'strategic';
  x: number;
  y: number;
  label: string;
}

// Workshop 1, Activity 1: Problem Origin Story
export interface ProblemOriginStoryData extends ActivityData {
  stepData: {
    individualReflection: {
      momentOfRealization: TextResponseStep;
      whoExperienced: TextResponseStep;
      whyMatters: TextResponseStep;
    };
    partnerSharing: {
      whatSurprised: TextResponseStep;
      howRealProblem: TextResponseStep;
    };
    summary: {
      keyInsights: string[];
      nextSteps: string[];
    };
  };
}

// Workshop 1, Activity 2: Problem Validation (Market Landing Zone Analysis)
export interface ProblemValidationData extends ActivityData {
  stepData: {
    mapMarketLandscape: {
      competitorMarkers: MarkerData[];
      underservedMarkers: MarkerData[];
    };
    identifyEntryPoint: {
      strategicMarker: MarkerData | null;
      strategicJustification: TextResponseStep;
    };
    justifyChoice: {
      landingZoneChoice: MultipleChoiceStep;
      evidenceSupport: TextResponseStep;
    };
    summary: {
      marketAnalysis: string;
      strategicRecommendations: string[];
    };
  };
}

// Additional activity interfaces will be added as they are properly migrated from reference HTML