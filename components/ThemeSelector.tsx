"use client";

import React from "react";
import { THEMES, CalendarTheme } from "@/lib/calendar";
import clsx from "clsx";

interface ThemeSelectorProps {
  activeThemeId: string;
  onSelect: (theme: CalendarTheme) => void;
}

export default function ThemeSelector({
  activeThemeId,
  onSelect,
}: ThemeSelectorProps) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[10px] uppercase tracking-wider text-ink-400 font-medium hidden sm:block">
        Theme
      </span>
      <div className="flex items-center gap-1.5">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelect(theme)}
            title={theme.name}
            className={clsx(
              "theme-dot transition-all",
              activeThemeId === theme.id && "active"
            )}
            style={{
              backgroundColor: theme.accent,
              transform:
                activeThemeId === theme.id ? "scale(1.25)" : undefined,
              boxShadow:
                activeThemeId === theme.id
                  ? `0 0 0 2px white, 0 0 0 3.5px ${theme.accent}`
                  : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}
