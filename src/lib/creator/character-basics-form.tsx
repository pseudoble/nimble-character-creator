"use client";

import type { CharacterBasicsData, StepValidationResult } from "./types";
import { MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH } from "./constants";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import classes from "@/lib/core-data/data/classes.json";

interface CharacterBasicsFormProps {
  data: CharacterBasicsData;
  classIds: string[];
  validation: StepValidationResult;
  onChange: (updates: Partial<CharacterBasicsData>) => void;
}

function formatClassName(id: string): string {
  if (id === "cheat") return "The Cheat";
  return id.charAt(0).toUpperCase() + id.slice(1);
}

export function CharacterBasicsForm({ data, classIds, validation, onChange }: CharacterBasicsFormProps) {
  const selectedClass = data.classId ? classes.find((c) => c.id === data.classId) : undefined;

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
        {selectedClass && (
          <div className="rounded border border-white/10 px-3 py-2 text-xs text-white/60">
            <p>{selectedClass.description}</p>
            <p className="mt-1">
              <span className="text-white/40">Key Stats:</span>{" "}
              {selectedClass.keyStats.map((s) => s.toUpperCase()).join(", ")}{" "}
              <span className="ml-2 text-white/40">Hit Die:</span> {selectedClass.hitDie}
            </p>
          </div>
        )}
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
