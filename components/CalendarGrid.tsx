"use client";

import React, { useState } from "react";
import { DayInfo, DAY_NAMES_SHORT, Note } from "@/lib/calendar";
import { isSameDay, isBetween } from "@/lib/calendar";
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
  days, rangeStart, rangeEnd, hoverDate, notes, accentColor, onDayClick, onDayHover,
}: CalendarGridProps) {
  const effectiveEnd = rangeEnd || hoverDate;
  const [ripplingIdx, setRipplingIdx] = useState<number | null>(null);

  function getDayStatus(day: DayInfo) {
    if (!day.isCurrentMonth) return { type: "outside" };
    if (!rangeStart) return { type: "normal" };
    const isStart = isSameDay(day.date, rangeStart);
    const isEnd   = effectiveEnd != null && isSameDay(day.date, effectiveEnd);
    const inRange = effectiveEnd != null && isBetween(day.date, rangeStart, effectiveEnd);
    if (isStart && isEnd) return { type: "single" };
    if (isStart) return { type: "start" };
    if (isEnd)   return { type: "end" };
    if (inRange) return { type: "range" };
    return { type: "normal" };
  }

  function hasNote(dateStr: string) {
    return notes.some((n) => n.date === dateStr);
  }

  function handleClick(day: DayInfo, idx: number) {
    if (!day.isCurrentMonth) return;
    setRipplingIdx(idx);
    setTimeout(() => setRipplingIdx(null), 420);
    onDayClick(day);
  }

  return (
    <div className="px-4 pb-4 md:px-6 md:pb-6">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES_SHORT.map((d, i) => (
          <div key={d} className={clsx("text-center text-[10px] font-semibold uppercase tracking-wider py-2", i >= 5 ? "text-rose-400" : "text-ink-400")}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day, idx) => {
          const status = getDayStatus(day);
          const note   = hasNote(day.dateStr);
          const holiday = day.holiday;

          const isStartOrEnd = status.type === "start" || status.type === "end" || status.type === "single";
          const isInRange    = status.type === "range";
          const isStart      = status.type === "start" || status.type === "single";
          const isEnd        = status.type === "end"   || status.type === "single";
          const hasRange     = rangeStart != null && effectiveEnd != null && !isSameDay(rangeStart, effectiveEnd);

          // Range connector stripe behind the circles
          const wrapperStyle: React.CSSProperties = {};
          if (isInRange) {
            wrapperStyle.backgroundColor = `${accentColor}13`;
          } else if (isStart && hasRange) {
            wrapperStyle.background = `linear-gradient(to right, transparent 50%, ${accentColor}13 50%)`;
          } else if (isEnd && hasRange) {
            wrapperStyle.background = `linear-gradient(to left, transparent 50%, ${accentColor}13 50%)`;
          }

          const btnStyle: React.CSSProperties = {};
          if (isStartOrEnd) {
            btnStyle.backgroundColor = accentColor;
            btnStyle.color           = "#fff";
            btnStyle.boxShadow       = `0 4px 16px ${accentColor}55`;
          } else if (day.isToday) {
            btnStyle.boxShadow = `0 0 0 2px ${accentColor}70`;
            btnStyle.color     = accentColor;
          }

          const rippleColor = isStartOrEnd ? "rgba(255,255,255,0.45)" : `${accentColor}35`;

          return (
            <div key={idx} className="relative flex items-center justify-center" style={wrapperStyle}>

              {/* Holiday warm glow tile */}
              {holiday && day.isCurrentMonth && !isStartOrEnd && (
                <span className="absolute inset-0.5 rounded-lg pointer-events-none"
                  style={{ background: "linear-gradient(135deg,rgba(255,55,90,0.08) 0%,rgba(255,160,60,0.06) 100%)" }} />
              )}

              <button
                onClick={() => handleClick(day, idx)}
                onMouseEnter={() => onDayHover(day)}
                onMouseLeave={() => onDayHover(null)}
                disabled={!day.isCurrentMonth}
                style={btnStyle}
                className={clsx(
                  "relative w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full select-none overflow-visible",
                  "text-[12px] md:text-[13px]",
                  !day.isCurrentMonth && "opacity-0 pointer-events-none",
                  isStartOrEnd && "font-semibold scale-105 z-10",
                  day.isToday && !isStartOrEnd && "font-bold",
                  day.isCurrentMonth && !isStartOrEnd && day.isWeekend && !holiday && "text-rose-500",
                  holiday && !isStartOrEnd && "text-rose-600",
                  day.isCurrentMonth && !isStartOrEnd && "day-btn-normal hover:bg-blue-50",
                )}
              >
                {/* Click ripple */}
                {ripplingIdx === idx && (
                  <span className="day-ripple absolute inset-0 rounded-full pointer-events-none"
                    style={{ backgroundColor: rippleColor }} />
                )}

                <span className="relative z-10">{day.isCurrentMonth ? day.day : ""}</span>

                {/* Note dot */}
                {note && day.isCurrentMonth && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full z-20"
                    style={{ backgroundColor: "#ff375a" }} />
                )}

                {/* Holiday dot */}
                {holiday && day.isCurrentMonth && !isStartOrEnd && (
                  <span className="absolute bottom-[2px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full z-20"
                    style={{ backgroundColor: "#e11d48", opacity: 0.8 }} />
                )}

                {/* Holiday tooltip */}
                {holiday && day.isCurrentMonth && (
                  <span className="holiday-tooltip">{holiday}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}