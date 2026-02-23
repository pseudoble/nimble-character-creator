"use client";

import type { StepTwoData, StepValidationResult } from "./types";
import { MAX_MOTIVATION_LENGTH } from "./constants";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ancestries from "@/lib/core-data/data/ancestries.json";
import backgrounds from "@/lib/core-data/data/backgrounds.json";

interface StepTwoFormProps {
  data: StepTwoData;
  ancestryIds: string[];
  backgroundIds: string[];
  validation: StepValidationResult;
  onChange: (updates: Partial<StepTwoData>) => void;
}

function formatId(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function StepTwoForm({ data, ancestryIds, backgroundIds, validation, onChange }: StepTwoFormProps) {
  const selectedAncestry = data.ancestryId ? ancestries.find((a) => a.id === data.ancestryId) : undefined;
  const selectedBackground = data.backgroundId ? backgrounds.find((b) => b.id === data.backgroundId) : undefined;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="ancestry-select">Ancestry</Label>
        <Select
          id="ancestry-select"
          value={data.ancestryId}
          onChange={(e) => onChange({ ancestryId: e.target.value })}
          aria-invalid={!!validation.errors.ancestryId}
          aria-describedby={validation.errors.ancestryId ? "ancestry-error" : undefined}
        >
          <option value="">Select an ancestry...</option>
          {ancestryIds.map((id) => (
            <option key={id} value={id}>
              {formatId(id)}
            </option>
          ))}
        </Select>
        {selectedAncestry && (
          <div className="rounded border border-white/10 px-3 py-2 text-xs text-white/60">
            <p>
              <span className="text-white/40">Size:</span> {selectedAncestry.size}{" "}
              <span className="ml-2 text-white/40">Trait:</span> {selectedAncestry.traitName}
            </p>
            <p className="mt-1">{selectedAncestry.traitDescription}</p>
          </div>
        )}
        {validation.errors.ancestryId && (
          <p id="ancestry-error" role="alert" className="text-xs text-neon-amber">
            {validation.errors.ancestryId}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="background-select">Background</Label>
        <Select
          id="background-select"
          value={data.backgroundId}
          onChange={(e) => onChange({ backgroundId: e.target.value })}
          aria-invalid={!!validation.errors.backgroundId}
          aria-describedby={validation.errors.backgroundId ? "background-error" : undefined}
        >
          <option value="">Select a background...</option>
          {backgroundIds.map((id) => (
            <option key={id} value={id}>
              {formatId(id)}
            </option>
          ))}
        </Select>
        {selectedBackground && (
          <div className="rounded border border-white/10 px-3 py-2 text-xs text-white/60">
            <p>{selectedBackground.description}</p>
            {selectedBackground.requirement && (
              <p className="mt-1">
                <span className="text-white/40">Requires:</span> {selectedBackground.requirement}
              </p>
            )}
          </div>
        )}
        {validation.errors.backgroundId && (
          <p id="background-error" role="alert" className="text-xs text-neon-amber">
            {validation.errors.backgroundId}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivation">Motivation</Label>
        <Input
          id="motivation"
          type="text"
          value={data.motivation}
          maxLength={MAX_MOTIVATION_LENGTH}
          placeholder="Why did you choose this path? (optional)"
          onChange={(e) => onChange({ motivation: e.target.value })}
          aria-invalid={!!validation.errors.motivation}
          aria-describedby={validation.errors.motivation ? "motivation-error" : undefined}
        />
        {validation.errors.motivation && (
          <p id="motivation-error" role="alert" className="text-xs text-neon-amber">
            {validation.errors.motivation}
          </p>
        )}
      </div>
    </div>
  );
}
