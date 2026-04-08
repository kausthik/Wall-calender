# 🗓️ Wall Calendar — Interactive React/Next.js Component

A polished, production-grade interactive wall calendar built with **Next.js 15** and **Tailwind CSS**, inspired by physical wall calendars.

![Wall Calendar Preview](https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop)

---

## ✨ Features

### Core Requirements ✅
- **Wall Calendar Aesthetic** — Physical wall calendar feel with spiral binding, hero imagery, and monthly grid
- **Day Range Selector** — Click to set start, click again to set end. Visual states for start, end, and in-between days
- **Integrated Notes Section** — Attach notes to selected date ranges or create general month notes
- **Fully Responsive** — Desktop (side-by-side) and mobile (stacked) layouts

### Creative Extras 🚀
- **6 Theme Options** — Alpine, Ocean, Forest, Desert, City, Sakura — each with a distinct accent color
- **Monthly Auto-Photos** — Automatic seasonal photography per month
- **Page Flip Animation** — Smooth animation when navigating months
- **Holiday Markers** — Built-in US + international holiday indicators
- **Note Colors** — 5 color options (Blue, Rose, Amber, Teal, Violet) with per-note coloring
- **Date Attachment** — Toggle to attach notes to selected date ranges
- **Persistent Storage** — Notes and settings saved to `localStorage`
- **Stats Bar** — Quick glance at month, note count, selected days, year
- **Hover Preview** — See range preview before confirming end date

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd wall-calendar

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 🏗️ Architecture

```
wall-calendar/
├── app/
│   ├── globals.css       # Global styles, CSS variables, animations
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Entry point → WallCalendar
├── components/
│   ├── WallCalendar.tsx  # Main orchestrator component (state, logic)
│   ├── CalendarGrid.tsx  # 7×6 day grid with range highlighting
│   ├── NotesPanel.tsx    # Notes CRUD with color picker
│   ├── ThemeSelector.tsx # Theme dot picker
│   └── RangeInfoBar.tsx  # Selected range display
├── lib/
│   └── calendar.ts       # Pure utilities: date math, types, storage
└── tailwind.config.ts    # Custom design tokens
```

### Key Design Decisions

- **State management**: All state lives in `WallCalendar.tsx` — no external store needed given scope
- **Range selection**: Two-click flow (click start → hover preview → click end)  
- **No backend**: All data in `localStorage` as per requirements
- **Animations**: CSS keyframes via Tailwind for page flip and note entry
- **Images**: Unsplash URLs per month — no image files to commit

---

## 🎨 Design Choices

- **Typography**: Playfair Display (display/headings) + DM Sans (body) — editorial feel
- **Color system**: `ink` neutral ramp + `azure` primary + `rose` accent
- **Calendar aesthetic**: Spiral holes, paper texture via box-shadow, month badge diagonal clip
- **Mobile-first responsive**: Stacks vertically on small screens, side-by-side on `lg+`

---

## 📦 Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS 3 |
| Language | TypeScript |
| Fonts | Google Fonts (Playfair Display, DM Sans) |
| Storage | localStorage |
| Images | Unsplash CDN |

---

## 🔭 Possible Enhancements

- [ ] Week view toggle
- [ ] iCal export of selected range
- [ ] Recurring event support
- [ ] Dark mode
- [ ] Drag-to-select range

---

Built with ❤️ as a frontend engineering challenge submission.
