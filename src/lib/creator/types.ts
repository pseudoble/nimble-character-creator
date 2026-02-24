export interface StepOneData {
  classId: string;
  name: string;
  description: string;
}

export interface AncestryBackgroundData {
  ancestryId: string;
  backgroundId: string;
  motivation: string;
}

export interface StatValues {
  str: string;
  dex: string;
  int: string;
  wil: string;
}

export interface StatsSkillsData {
  statArrayId: string;
  stats: StatValues;
  skillAllocations: Record<string, number>;
}

export interface StepFourData {
  equipmentChoice: "gear" | "gold" | "";
  selectedLanguages: string[];
}

export interface CreatorDraft {
  version: number;
  updatedAt: string;
  stepOne: StepOneData;
  ancestryBackground: AncestryBackgroundData;
  statsSkills: StatsSkillsData;
  stepFour: StepFourData;
}

export interface StepDescriptor {
  id: string;
  label: string;
  validate: (draft: CreatorDraft) => StepValidationResult;
}

export interface StepValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
