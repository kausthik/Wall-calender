"use client";

import React from "react";
import { DayInfo, DAY_NAMES_SHORT, Note, HOLIDAYS } from "@/lib/calendar";
import { isSameDay, isBetween, parseDate } from "@/lib/calendar";
import clsx from "clsx";

interface CalendarGridProps {
  days: DayInfo[];
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoverDate: Date | null;
  notes: Note[];
  accentColor: string;
  onDayClick: (day: DayInfo) => void;
  onDayHover: (day: DayInfo | null) => void;
}

export default function CalendarGrid({
  days,
  rangeStart,
  rangeEnd,
  hoverDate,
  notes,
  accentColor,
  onDayClick,
  onDayHover,
}: CalendarGridProps) {
  const effectiveEnd = rangeEnd || hoverDate;

  function getDayStatus(day: DayInfo) {
    if (!day.isCurrentMonth) return { type: "outside" };
    if (!rangeStart) return { type: "normal" };

    const isStart = isSameDay(day.date, rangeStart);
    const isEnd = effectiveEnd && isSameDay(day.date, effectiveEnd);
    const inRange =
      effectiveEnd && isBetween(day.date, rangeStart, effectiveEnd);

    if (isStart && isEnd) return { type: "single" };
    if (isStart) return { type: "start", inRange: true };
    if (isEnd) return { type: "end", inRange: true };
    if (inRange) return { type: "range" };
    return { type: "normal" };
  }

  function hasNote(dateStr: string) {
    return notes.some((n) => n.date === dateStr);
  }

  return (
    <div className="px-4 pb-4 md:px-6 md:pb-6">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES_SHORT.map((d, i) => (
          <div
            key={d}
            className={clsx(
              "text-center text-[10px] font-semibold uppercase tracking-wider py-2",
              i >= 5 ? "text-rose-400" : "text-ink-400"
            )}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day, idx) => {
          const status = getDayStatus(day);
          const note = hasNote(day.dateStr);
          const holiday = day.holiday;

          const isStartOrEnd =
            status.type === "start" ||
            status.type === "end" ||
            status.type === "single";
          const isInRange = status.type === "range";
          const isStart = status.type === "start" || status.type === "single";
          const isEnd = status.type === "end" || status.type === "single";

          return (
            <div
              key={idx}
              className="relative flex items-center justify-center"
              style={{
                backgroundColor:
                  isInRange ? `${accentColor}12` : undefined,
                borderRadius: isInRange
                  ? isStart
                    ? "50% 0 0 50%"
                    : isEnd
                    ? "0 50% 50% 0"
                    : "0"
                  : undefined,
              }}
            >
              <button
                onClick={() => day.isCurrentMonth && onDayClick(day)}
                onMouseEnter={() => onDayHover(day)}
                onMouseLeave={() => onDayHover(null)}
                disabled={!day.isCurrentMonth}
                title={holiday || undefined}
                className={clsx(
                  "relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full",
                  "text-[12px] md:text-[13px] transition-all duration-150 select-none",
                  // Outside month
                  !day.isCurrentMonth && "opacity-0 pointer-events-none",
                  // Today
                  day.isToday &&
                    !isStartOrEnd &&
                    "font-bold ring-2 ring-inset",
                  // Weekend color
                  day.isCurrentMonth &&
                    !isStartOrEnd &&
                    day.isWeekend &&
                    "text-rose-500",
                  // Selected
                  isStartOrEnd && "text-white font-semibold scale-105 z-10",
                  // Normal hover
                  day.isCurrentMonth &&
                    !isStartOrEnd &&
                    "hover:bg-blue-50 hover:text-blue-700 cursor-pointer",
                  // Holiday
                  holiday && !isStartOrEnd && "font-medium"
                )}
                style={{
                  backgroundColor: isStartOrEnd ? accentColor : undefined,
                  color: isStartOrEnd ? "white" : undefined,
                  boxShadow: isStartOrEnd
                    ? `0 4px 14px ${accentColor}55`
                    : day.isToday && !isStartOrEnd
                    ? `0 0 0 2px ${accentColor}60`
                    : undefined,
                }}
              >
                <span className="relative z-10">{day.isCurrentMonth ? day.day : ""}</span>

                {/* Note indicator */}
                {note && day.isCurrentMonth && (
                  <span
                    className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-rose-400"
                    style={{ backgroundColor: "#ff375a" }}
                  />
                )}

                {/* Holiday indicator */}
                {holiday && day.isCurrentMonth && !isStartOrEnd && (
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full opacity-70"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
