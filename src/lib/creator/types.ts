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

export interface CreatorDraft {
  version: number;
  updatedAt: string;
  stepOne: StepOneData;
  stepTwo: StepTwoData;
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
