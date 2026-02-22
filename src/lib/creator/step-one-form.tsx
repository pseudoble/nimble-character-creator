"use client";

import type { StepOneData, StepValidationResult } from "./types";
import { MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH } from "./constants";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface StepOneFormProps {
  data: StepOneData;
  classIds: string[];
  validation: StepValidationResult;
  onChange: (updates: Partial<StepOneData>) => void;
}

function formatClassName(id: string): string {
  if (id === "cheat") return "The Cheat";
  return id.charAt(0).toUpperCase() + id.slice(1);
}

export function StepOneForm({ data, classIds, validation, onChange }: StepOneFormProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="class-select">Class</Label>
        <Select
          id="class-select"
          value={data.classId}
          onChange={(e) => onChange({ classId: e.target.value })}
          aria-invalid={!!validation.errors.classId}
          aria-describedby={validation.errors.classId ? "class-error" : undefined}
        >
          <option value="">Select a class...</option>
          {classIds.map((id) => (
            <option key={id} value={id}>
              {formatClassName(id)}
            </option>
          ))}
        </Select>
        {validation.errors.classId && (
          <p id="class-error" role="alert" className="text-xs text-neon-amber">
            {validation.errors.classId}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="char-name">Character Name</Label>
        <Input
          id="char-name"
          type="text"
          value={data.name}
          maxLength={MAX_NAME_LENGTH}
          onChange={(e) => onChange({ name: e.target.value })}
          aria-invalid={!!validation.errors.name}
          aria-describedby={validation.errors.name ? "name-error" : undefined}
        />
        {validation.errors.name && (
          <p id="name-error" role="alert" className="text-xs text-neon-amber">
            {validation.errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="char-description">Description</Label>
        <Textarea
          id="char-description"
          value={data.description}
          maxLength={MAX_DESCRIPTION_LENGTH}
          onChange={(e) => onChange({ description: e.target.value })}
          aria-invalid={!!validation.errors.description}
          aria-describedby={validation.errors.description ? "desc-error" : undefined}
        />
        {validation.errors.description && (
          <p id="desc-error" role="alert" className="text-xs text-neon-amber">
            {validation.errors.description}
          </p>
        )}
      </div>
    </div>
  );
}
