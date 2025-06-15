export interface WorkshopData {
  version: string;
  createdAt: string;
  lastUpdated: string;
  userProfile?: UserProfile;
  day1: Day1Data;
  day2?: Day2Data;
  day3?: Day3Data;
}

export interface UserProfile {
  email?: string;
  name?: string;
}

export interface Day1Data {
  activity1?: ProblemOriginStoryData;
  activity2?: ProblemValidationData;
}

export interface Day2Data {
  activity1?: any; // To be defined later
  activity2?: any; // To be defined later
}

export interface Day3Data {
  activity1?: any; // To be defined later
}

export interface ActivityData {
  startedAt?: string;
  completedAt?: string;
  lastModified: string;
  stepData: Record<string, any>;
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

// Day 1, Activity 1: Problem Origin Story
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

// Day 1, Activity 2: Problem Validation (Market Landing Zone Analysis)
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