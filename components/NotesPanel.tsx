"use client";

import React, { useState, useRef, useEffect } from "react";
import { Note, NoteColor, NOTE_COLORS, formatDateRange } from "@/lib/calendar";
import clsx from "clsx";

interface NotesPanelProps {
  notes: Note[];
  selectedDateRange: { start: Date | null; end: Date | null };
  accentColor: string;
  onAddNote: (note: Omit<Note, "id" | "createdAt">) => void;
  onDeleteNote: (id: string) => void;
  onUpdateNote: (id: string, text: string) => void;
}

const COLOR_OPTIONS: NoteColor[] = ["blue", "rose", "amber", "teal", "violet"];

export default function NotesPanel({
  notes,
  selectedDateRange,
  accentColor,
  onAddNote,
  onDeleteNote,
  onUpdateNote,
}: NotesPanelProps) {
  const [newText, setNewText] = useState("");
  const [newColor, setNewColor] = useState<NoteColor>("blue");
  const [isAttached, setIsAttached] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasRange = selectedDateRange.start !== null;
  const rangeLabel = formatDateRange(
    selectedDateRange.start,
    selectedDateRange.end
  );

  // Filter notes
  const generalNotes = notes.filter((n) => !n.date);
  const dateNotes = notes.filter((n) => n.date);

  function handleAdd() {
    const text = newText.trim();
    if (!text) return;
    const date =
      isAttached && hasRange && selectedDateRange.start
        ? selectedDateRange.start.toISOString().slice(0, 10)
        : undefined;
    onAddNote({ text, color: newColor, date });
    setNewText("");
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleAdd();
    }
  }

  function startEdit(note: Note) {
    setEditingId(note.id);
    setEditText(note.text);
  }

  function commitEdit(id: string) {
    if (editText.trim()) {
      onUpdateNote(id, editText.trim());
    }
    setEditingId(null);
  }

  const allNotes = [...dateNotes, ...generalNotes];

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between border-b border-ink-100"
        style={{ borderColor: "#e8e4dc" }}
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink-400">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          <span className="text-sm font-semibold text-ink-700">Notes</span>
          {allNotes.length > 0 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-medium"
              style={{
                backgroundColor: `${accentColor}18`,
                color: accentColor,
              }}
            >
              {allNotes.length}
            </span>
          )}
        </div>
        {hasRange && (
          <span className="text-[10px] text-ink-400 truncate max-w-[140px]">
            {rangeLabel}
          </span>
        )}
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 min-h-0">
        {allNotes.length === 0 ? (
          <div className="py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-ink-50 flex items-center justify-center mx-auto mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-300">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </div>
            <p className="text-xs text-ink-400">No notes yet.</p>
            <p className="text-xs text-ink-300 mt-1">Add your first note below.</p>
          </div>
        ) : (
          allNotes.map((note) => {
            const c = NOTE_COLORS[note.color];
            const isEditing = editingId === note.id;
            return (
              <div
                key={note.id}
                className="group rounded-lg p-3 border transition-all animate-note-slide"
                style={{
                  backgroundColor: c.bg,
                  borderColor: c.border,
                }}
              >
                {/* Date tag */}
                {note.date && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: c.dot }}
                    />
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: c.text }}
                    >
                      {new Date(note.date + "T12:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {/* Text / editor */}
                {isEditing ? (
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => commitEdit(note.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) commitEdit(note.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    autoFocus
                    className="w-full text-xs bg-transparent border-none outline-none resize-none"
                    style={{ color: c.text }}
                    rows={3}
                  />
                ) : (
                  <p
                    className="text-xs leading-relaxed cursor-text"
                    style={{ color: c.text }}
                    onClick={() => startEdit(note)}
                  >
                    {note.text}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(note)}
                    className="p-1 rounded hover:bg-black/5 transition-colors"
                    title="Edit"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: c.text }}>
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1 rounded hover:bg-black/5 transition-colors"
                    title="Delete"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: c.text }}>
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add note form */}
      <div
        className="px-3 pt-2 pb-3 border-t"
        style={{ borderColor: "#e8e4dc" }}
      >
        {/* Attach toggle */}
        {hasRange && (
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setIsAttached(!isAttached)}
              className={clsx(
                "relative w-8 h-4 rounded-full transition-colors",
                isAttached ? "" : "bg-ink-200"
              )}
              style={{ backgroundColor: isAttached ? accentColor : undefined }}
            >
              <span
                className={clsx(
                  "absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform",
                  isAttached ? "translate-x-4" : "translate-x-0.5"
                )}
              />
            </button>
            <span className="text-[10px] text-ink-500">
              {isAttached ? "Attached to selected date" : "General note"}
            </span>
          </div>
        )}

        {/* Color picker */}
        <div className="flex gap-1.5 mb-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              onClick={() => setNewColor(c)}
              className={clsx(
                "w-5 h-5 rounded-full border-2 transition-transform",
                newColor === c ? "scale-125" : "scale-100 hover:scale-110"
              )}
              style={{
                backgroundColor: NOTE_COLORS[c].dot,
                borderColor:
                  newColor === c ? NOTE_COLORS[c].dot : "transparent",
                boxShadow: newColor === c ? `0 0 0 2px white, 0 0 0 3px ${NOTE_COLORS[c].dot}` : undefined,
              }}
              title={c}
            />
          ))}
        </div>

        <textarea
          ref={textareaRef}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a note… (⌘↵ to save)"
          rows={2}
          className="w-full text-xs border border-ink-200 rounded-lg px-3 py-2 resize-none outline-none transition-all placeholder-ink-300 bg-white"
          style={{
            borderColor: newText ? accentColor : undefined,
            boxShadow: newText ? `0 0 0 2px ${accentColor}20` : undefined,
          }}
        />

        <button
          onClick={handleAdd}
          disabled={!newText.trim()}
          className="mt-2 w-full py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            backgroundColor: accentColor,
            color: "white",
          }}
        >
          Add Note
        </button>
      </div>
    </div>
  );
}
