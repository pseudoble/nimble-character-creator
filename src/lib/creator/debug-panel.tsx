"use client";

import type { CreatorDraft } from "./types";

function highlightJson(json: string): string {
  return json.replace(
    /("(?:\\.|[^"\\])*")\s*:/g,
    '<span class="text-neon-cyan">$1</span>:'
  ).replace(
    /:\s*("(?:\\.|[^"\\])*")/g,
    ': <span class="text-neon-magenta">$1</span>'
  ).replace(
    /:\s*(\d+(?:\.\d+)?)/g,
    ': <span class="text-neon-yellow">$1</span>'
  ).replace(
    /:\s*(true|false)/g,
    ': <span class="text-neon-green">$1</span>'
  ).replace(
    /:\s*(null)/g,
    ': <span class="text-text-low">$1</span>'
  );
}

export function DebugPanel({ draft }: { draft: CreatorDraft }) {
  const json = JSON.stringify(draft, null, 2);
  const highlighted = highlightJson(json);

  return (
    <div className="mt-6 rounded border border-surface-3 bg-surface-2 p-4 overflow-x-auto">
      <div className="mb-2 text-xs font-mono uppercase tracking-wider text-text-low">
        Debug: CreatorDraft
      </div>
      <pre
        className="text-xs font-mono text-text-med whitespace-pre"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}
