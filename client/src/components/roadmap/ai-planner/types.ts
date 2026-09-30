export interface CareerRoleOption {
  id: string;
  name: string;
  category: string;
  popular?: boolean;
}

export interface AIPlannerAnswers {
  careerGoal: {
    id: string;
    name: string;
  };
  experienceLevel: string; // 'Starting out' | 'Some experience' | 'Comfortable' | 'Experienced'
  knownSkills: string[];
  experienceTypes: string[];
  experienceDescription: string;
  objectives: string[]; // max 2
  targetCompanies: string;
  weeklyHours: string;
  pace: string; // 'Fast-paced' | 'Balanced' | 'Flexible'
  focusAreas: string[]; // max 3
  followUpAnswers: Record<string, string>;
}

export interface FollowUpQuestion {
  id: string;
  questionText: string;
  supportingText?: string;
  type: 'SINGLE_SELECT' | 'SEARCHABLE_SELECT';
  options: string[];
  conditionKey: string;
}
