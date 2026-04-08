"use client";

import React from "react";
import { formatDateRange, getDaysBetween } from "@/lib/calendar";

interface RangeInfoBarProps {
  rangeStart: Date | null;
  rangeEnd: Date | null;
  accentColor: string;
  onClear: () => void;
}

export default function RangeInfoBar({
  rangeStart,
  rangeEnd,
  accentColor,
  onClear,
}: RangeInfoBarProps) {
  if (!rangeStart) return null;

  const days = rangeEnd ? getDaysBetween(rangeStart, rangeEnd) : 1;
  const label = formatDateRange(rangeStart, rangeEnd);

  return (
    <div
      className="mx-4 mb-3 md:mx-6 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 transition-all"
      style={{
        backgroundColor: `${accentColor}10`,
        border: `1px solid ${accentColor}25`,
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: accentColor }}
        />
        <span className="text-xs text-ink-600 font-medium truncate">{label}</span>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        {days > 1 && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: `${accentColor}20`,
              color: accentColor,
            }}
          >
            {days} days
          </span>
        )}
        <button
          onClick={onClear}
          className="text-ink-400 hover:text-ink-600 transition-colors p-0.5"
          title="Clear selection"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
