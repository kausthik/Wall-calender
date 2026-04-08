"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Note,
  CalendarTheme,
  DayInfo,
  THEMES,
  MONTH_NAMES,
  buildCalendarGrid,
  addMonths,
  isSameDay,
  isAfter,
  toDateStr,
  loadNotes,
  saveNotes,
  loadSettings,
  saveSettings,
  getMonthThemeImage,
} from "@/lib/calendar";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import ThemeSelector from "./ThemeSelector";
import RangeInfoBar from "./RangeInfoBar";
import clsx from "clsx";

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function WallCalendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [theme, setTheme] = useState<CalendarTheme>(THEMES[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animDir, setAnimDir] = useState<"next" | "prev">("next");
  const [showNotes, setShowNotes] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [useMonthImage, setUseMonthImage] = useState(true);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = buildCalendarGrid(year, month);

  // Current image source
  const imageUrl = useMonthImage ? getMonthThemeImage(month) : theme.imageUrl;

  // Load persisted data
  useEffect(() => {
    setNotes(loadNotes());
    const settings = loadSettings();
    const found = THEMES.find((t) => t.id === settings.themeId);
    if (found) setTheme(found);
  }, []);

  // Persist notes
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  function navigate(dir: "prev" | "next") {
    if (isAnimating) return;
    setAnimDir(dir);
    setIsAnimating(true);
    setImageLoaded(false);
    setTimeout(() => {
      setCurrentDate((d) => addMonths(d, dir === "next" ? 1 : -1));
      setIsAnimating(false);
    }, 120);
  }

  function handleDayClick(day: DayInfo) {
    if (!isSelectingEnd || !rangeStart) {
      // Start new selection
      setRangeStart(day.date);
      setRangeEnd(null);
      setIsSelectingEnd(true);
    } else {
      // Complete selection
      const start = rangeStart;
      const end = day.date;
      if (isSameDay(start, end)) {
        setRangeEnd(null);
        setIsSelectingEnd(false);
      } else if (isAfter(end, start)) {
        setRangeEnd(end);
        setIsSelectingEnd(false);
      } else {
        // Clicked before start — swap
        setRangeStart(end);
        setRangeEnd(start);
        setIsSelectingEnd(false);
      }
    }
  }

  function handleDayHover(day: DayInfo | null) {
    if (isSelectingEnd && rangeStart) {
      setHoverDate(day?.date ?? null);
    }
  }

  function clearSelection() {
    setRangeStart(null);
    setRangeEnd(null);
    setIsSelectingEnd(false);
    setHoverDate(null);
  }

  function handleAddNote(note: Omit<Note, "id" | "createdAt">) {
    setNotes((prev) => [
      ...prev,
      { ...note, id: generateId(), createdAt: new Date().toISOString() },
    ]);
  }

  function handleDeleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function handleUpdateNote(id: string, text: string) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  }

  function handleThemeChange(t: CalendarTheme) {
    setTheme(t);
    setUseMonthImage(false);
    setImageLoaded(false);
    saveSettings({ themeId: t.id, view: "month" });
  }

  function toggleMonthImage() {
    setUseMonthImage((v) => !v);
    setImageLoaded(false);
  }

  // Build spiral holes
  const spiralHoles = Array.from({ length: 14 }, (_, i) => i);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-6 px-4 md:py-12">
      {/* Title area */}
      <div className="mb-8 text-center no-print">
        <h1 className="font-display text-3xl md:text-4xl text-ink-800 tracking-tight">
          Wall Calendar
        </h1>
        <p className="text-sm text-ink-400 mt-1 font-body">
          {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Controls */}
      <div className="mb-4 flex items-center gap-4 flex-wrap justify-center no-print">
        <ThemeSelector
          activeThemeId={useMonthImage ? "monthly" : theme.id}
          onSelect={handleThemeChange}
        />
        <button
          onClick={toggleMonthImage}
          className={clsx(
            "text-[10px] px-3 py-1 rounded-full border transition-all font-medium",
            useMonthImage
              ? "bg-ink-700 text-white border-ink-700"
              : "bg-white text-ink-500 border-ink-200 hover:border-ink-400"
          )}
        >
          Monthly Photos
        </button>
      </div>

      {/* Calendar layout – desktop: side by side, mobile: stacked */}
      <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-4 items-start justify-center">
        {/* ══════ CALENDAR CARD ══════ */}
        <div
          className="calendar-shell w-full lg:max-w-[520px] flex-shrink-0"
          style={{ "--accent": theme.accent } as React.CSSProperties}
        >
          {/* ── Spiral binding ── */}
          <div
            className="spiral-bar h-7 flex items-center justify-around px-6"
            style={{ backgroundColor: "#ccc8be" }}
          >
            {spiralHoles.map((i) => (
              <div key={i} className="spiral-hole" />
            ))}
          </div>

          {/* ── Hero image ── */}
          <div
            className="hero-image-section relative overflow-hidden"
            style={{ height: "clamp(180px, 30vw, 320px)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={imageUrl}
              src={imageUrl}
              alt="Monthly hero"
              className={clsx(
                "w-full h-full object-cover transition-all duration-700",
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              )}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Shimmer while loading */}
            {!imageLoaded && (
              <div
                className="absolute inset-0 animate-pulse"
                style={{ backgroundColor: "#e8e4dc" }}
              />
            )}

            {/* Gradient overlay */}
            <div className="hero-image-overlay" />

            {/* Month badge */}
            <div
              className="month-badge"
              style={{ backgroundColor: theme.accent }}
            >
              <div className="font-display text-xl font-bold leading-none text-white">
                {MONTH_NAMES[month]}
              </div>
              <div className="font-body text-xs text-white/80 mt-0.5 tracking-widest">
                {year}
              </div>
            </div>

            {/* Navigation arrows on image */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-3 pointer-events-none">
              <button
                onClick={() => navigate("prev")}
                className="pointer-events-auto w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <button
                onClick={() => navigate("next")}
                className="pointer-events-auto w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>

          {/* ── Divider ── */}
          <div
            className="h-px mx-0"
            style={{ backgroundColor: `${theme.accent}30` }}
          />

          {/* ── Range info bar ── */}
          <RangeInfoBar
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            accentColor={theme.accent}
            onClear={clearSelection}
          />

          {/* ── Calendar grid ── */}
          <div
            className={clsx(
              "transition-opacity duration-150",
              isAnimating ? "opacity-0" : "opacity-100 animate-page-flip"
            )}
          >
            {/* Hint text */}
            <div className="px-4 md:px-6 pt-3 pb-1">
              <p className="text-[10px] text-ink-400">
                {isSelectingEnd
                  ? "Click end date to complete selection"
                  : "Click a date to start selecting a range"}
              </p>
            </div>

            <CalendarGrid
              days={days}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              hoverDate={isSelectingEnd ? hoverDate : null}
              notes={notes}
              accentColor={theme.accent}
              onDayClick={handleDayClick}
              onDayHover={handleDayHover}
            />
          </div>

          {/* ── Footer ── */}
          <div
            className="px-4 md:px-6 py-3 border-t flex items-center justify-between"
            style={{ borderColor: "#e8e4dc" }}
          >
            <div className="flex items-center gap-4 text-[10px] text-ink-400">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: theme.accent }} />
                Selected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full inline-block bg-rose-400" />
                Note
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: theme.accent }} />
                Holiday
              </span>
            </div>

            <button
              onClick={() => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))}
              className="text-[10px] px-2.5 py-1 rounded-full border border-ink-200 text-ink-500 hover:border-ink-400 hover:text-ink-700 transition-all"
            >
              Today
            </button>
          </div>
        </div>

        {/* ══════ NOTES PANEL ══════ */}
        <div
          className={clsx(
            "w-full lg:w-72 xl:w-80 flex-shrink-0 calendar-shell overflow-hidden",
            "flex flex-col",
            showNotes ? "h-auto lg:h-[600px]" : "h-auto"
          )}
        >
          {/* Notes toggle on mobile */}
          <button
            className="flex items-center justify-between px-4 py-3 lg:cursor-default w-full"
            onClick={() => setShowNotes((v) => !v)}
          >
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-500">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span className="text-sm font-semibold text-ink-700 font-display">
                Notebook
              </span>
            </div>
            <svg
              width="14" height="14"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              className={clsx("text-ink-400 transition-transform lg:hidden", showNotes ? "rotate-180" : "")}
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          <div className={clsx("flex-1 min-h-0", showNotes ? "flex flex-col" : "hidden lg:flex lg:flex-col")}>
            <NotesPanel
              notes={notes}
              selectedDateRange={{ start: rangeStart, end: rangeEnd }}
              accentColor={theme.accent}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onUpdateNote={handleUpdateNote}
            />
          </div>
        </div>
      </div>

      {/* Mini stats bar */}
      <div
        className="mt-6 flex items-center gap-6 px-6 py-3 rounded-2xl no-print"
        style={{ backgroundColor: "rgba(255,255,255,0.6)", backdropFilter: "blur(12px)" }}
      >
        <div className="text-center">
          <div className="text-lg font-display font-bold text-ink-800">
            {MONTH_NAMES[month].slice(0, 3)}
          </div>
          <div className="text-[10px] text-ink-400 uppercase tracking-wider">Month</div>
        </div>
        <div className="w-px h-8 bg-ink-200" />
        <div className="text-center">
          <div className="text-lg font-display font-bold text-ink-800">
            {notes.length}
          </div>
          <div className="text-[10px] text-ink-400 uppercase tracking-wider">Notes</div>
        </div>
        <div className="w-px h-8 bg-ink-200" />
        <div className="text-center">
          <div
            className="text-lg font-display font-bold"
            style={{ color: theme.accent }}
          >
            {rangeStart && rangeEnd
              ? Math.round(
                  Math.abs(rangeEnd.getTime() - rangeStart.getTime()) / 86400000
                ) + 1
              : "—"}
          </div>
          <div className="text-[10px] text-ink-400 uppercase tracking-wider">
            Days sel.
          </div>
        </div>
        <div className="w-px h-8 bg-ink-200" />
        <div className="text-center">
          <div className="text-lg font-display font-bold text-ink-800">{year}</div>
          <div className="text-[10px] text-ink-400 uppercase tracking-wider">Year</div>
        </div>
      </div>
    </div>
  );
}
