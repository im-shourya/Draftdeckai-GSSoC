"use client";

/**
 * TemplateSwitcher — Post-creation multi-template switcher (#430)
 *
 * Shows a horizontal scrollable strip of resume template cards below the
 * preview. Clicking any card updates the live preview instantly without
 * touching the resume content state.
 *
 * Used in:
 *  - components/resume/resume-generator.tsx  (desktop quick/guided flows)
 *  - components/resume/mobile-resume-builder.tsx  (mobile preview step)
 */

import React, { useState } from "react";
import { RESUME_TEMPLATES } from "@/lib/resume-template-data";
import { cn } from "@/lib/utils";
import { Layers, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

// Only surface resume (not presentation) templates
const RESUME_ONLY = RESUME_TEMPLATES.filter((t) => t.type === "resume");

interface TemplateSwitcherProps {
  /** Currently selected template id */
  selectedTemplate: string;
  /** Called when the user picks a different template */
  onSelectTemplate: (id: string) => void;
  /** Compact single-row strip for mobile; full grid otherwise */
  compact?: boolean;
  /** Extra class names on the root wrapper */
  className?: string;
}

export function TemplateSwitcher({
  selectedTemplate,
  onSelectTemplate,
  compact = false,
  className,
}: TemplateSwitcherProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // How many templates to show before "show more"
  const INITIAL_VISIBLE = compact ? RESUME_ONLY.length : 4;
  const visibleTemplates =
    isExpanded || compact ? RESUME_ONLY : RESUME_ONLY.slice(0, INITIAL_VISIBLE);

  return (
    <div
      className={cn(
        "glass-effect border border-yellow-400/20 rounded-xl p-4",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-yellow-500" />
          <h3 className="text-sm font-semibold">Switch Template</h3>
          <span className="text-xs text-muted-foreground">
            — content stays the same
          </span>
        </div>
        {/* Active template badge */}
        <span className="text-xs bg-yellow-400/20 text-yellow-700 dark:text-yellow-300 font-medium px-2 py-0.5 rounded-full border border-yellow-400/30">
          {RESUME_ONLY.find((t) => t.id === selectedTemplate)?.title ??
            "Default"}
        </span>
      </div>

      {/* Template strip / grid */}
      {compact ? (
        /* --- Mobile: horizontal scroll strip --- */
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
          {visibleTemplates.map((tmpl) => (
            <MobileTemplateCard
              key={tmpl.id}
              template={tmpl}
              isSelected={selectedTemplate === tmpl.id}
              onSelect={() => onSelectTemplate(tmpl.id)}
            />
          ))}
        </div>
      ) : (
        /* --- Desktop: 2-per-row grid with expand --- */
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {visibleTemplates.map((tmpl) => (
              <DesktopTemplateCard
                key={tmpl.id}
                template={tmpl}
                isSelected={selectedTemplate === tmpl.id}
                onSelect={() => onSelectTemplate(tmpl.id)}
              />
            ))}
          </div>

          {RESUME_ONLY.length > INITIAL_VISIBLE && (
            <button
              type="button"
              onClick={() => setIsExpanded((v) => !v)}
              className="mt-3 w-full text-xs text-muted-foreground hover:text-yellow-500 transition-colors flex items-center justify-center gap-1"
            >
              {isExpanded ? (
                <>
                  <ChevronLeft className="h-3 w-3 rotate-90" />
                  Show fewer templates
                </>
              ) : (
                <>
                  <ChevronRight className="h-3 w-3 rotate-90" />
                  Show all {RESUME_ONLY.length} templates
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                        */
/* ------------------------------------------------------------------ */

function DesktopTemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: (typeof RESUME_ONLY)[number];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      title={template.title}
      className={cn(
        "relative group flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all duration-200 text-left hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400",
        isSelected
          ? "border-yellow-400 bg-yellow-400/10 shadow-md shadow-yellow-400/20"
          : "border-gray-200 dark:border-gray-700 hover:border-yellow-400/50"
      )}
    >
      {/* Color palette dots */}
      <div className="flex gap-0.5 mb-1">
        {template.colorScheme.slice(0, 3).map((color, i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full ring-1 ring-black/10"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Template name */}
      <p className="text-[10px] font-semibold text-center leading-tight line-clamp-2 w-full">
        {template.title}
      </p>

      {/* Category badge */}
      <span className="text-[9px] text-muted-foreground">{template.category}</span>

      {/* Selected tick */}
      {isSelected && (
        <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 rounded-full p-0.5">
          <Check className="h-2.5 w-2.5 text-white" />
        </span>
      )}

      {/* Pro badge */}
      {template.isPro && (
        <span className="absolute top-1 left-1 text-[8px] bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold px-1 rounded">
          PRO
        </span>
      )}
    </button>
  );
}

function MobileTemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: (typeof RESUME_ONLY)[number];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex-shrink-0 snap-start flex flex-col items-center gap-1 p-2.5 rounded-lg border-2 transition-all duration-200 w-[88px] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400",
        isSelected
          ? "border-yellow-400 bg-yellow-400/10 shadow-md shadow-yellow-400/20"
          : "border-gray-200 dark:border-gray-700"
      )}
    >
      {/* Color dots */}
      <div className="flex gap-0.5">
        {template.colorScheme.slice(0, 3).map((color, i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <p className="text-[9px] font-semibold text-center leading-tight line-clamp-2 w-full">
        {template.title}
      </p>

      {isSelected && (
        <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 rounded-full p-0.5">
          <Check className="h-2.5 w-2.5 text-white" />
        </span>
      )}

      {template.isPro && (
        <span className="absolute top-1 left-1 text-[8px] bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold px-1 rounded">
          PRO
        </span>
      )}
    </button>
  );
}
