export interface StepOneData {
  classId: string;
  name: string;
  description: string;
}

export interface StepTwoData {
  ancestryId: string;
  backgroundId: string;
  motivation: string;
}

export interface StepThreeStats {
  str: string;
  dex: string;
  int: string;
  wil: string;
}

export interface StepThreeData {
  statArrayId: string;
  stats: StepThreeStats;
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
  stepTwo: StepTwoData;
  stepThree: StepThreeData;
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
