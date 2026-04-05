# FLUX
### PRECISION_FOCUS_UNIT

> *"Nothing decorative. Nothing gratuitous. Every pixel earns its place."*

Flux is a high-end, monochrome productivity terminal designed for deep work and intentional execution. It ignores the traditional "to-do list" anxiety of deadlines and ticking clocks, instead treating tasks as liquid volume that decays as you focus.

Built with a Swiss-design aesthetic, Flux uses high-contrast typography and a **Window vs. Horizon** logic to help navigate cognitive load and ADHD-driven choice paralysis.

---

## CORE PHILOSOPHY

**Liquid Tasks** — Tasks aren't binary. They are reservoirs of time. If you work on a 60m task for 20m and stop, the task remains in your collection with 40m left.

**The Ghost Timer** — No visible countdowns. Flux records your start time and calculates "decay" only when you finish, protecting your flow state from time-anxiety.

**Identity Anchoring** — No traditional signup. Your Private Key acts as a stateless vault. Entering a unique string initializes your private database instantly.

---

## TECH STACK

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, React Router |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Typography | Playfair Display (Serif) & DM Mono (Monospace) |

---

## MODULES

### `01` FOCUS — Intent

Select a time interval (`15` / `30` / `45` / `60` or Custom). Flux filters your collection into two layers:

- **Fits Your Window** — Objectives shorter than your interval, or marked as `Chip_OK`.
- **The Horizon** — Long-form projects. Use *"Work on this"* to chip away at their total duration across multiple sessions.

### `02` COMPILE — Collection

A minimal command-line style entry system for bulk-adding objectives.

- **`Chip_OK` Toggle** — Mark a task as a project that can be broken into sessions.
- **Priority Matrix** — Monochrome selectors for `Low` / `Medium` / `High` urgency.

### `03` FLOW — Execution

A distraction-free interface showing only the task title in elegant serif.

- **Start** — Records the entry timestamp and enters Deep Focus mode.
- **Finish** — Calculates elapsed time and updates the task's remaining volume via Liquid Decay.

---

## SETUP

**Prerequisites**
- Node.js `v16+`
- MongoDB (local instance or Atlas cluster)

### 1. Backend

```bash
cd server
npm install
touch .env
```

Add to your `.env`:

```
PORT=3000
DB=your_mongodb_uri
```

Start the server:

```bash
npm start
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

---

## API SPEC

| Method | Endpoint | Auth Header | Description |
|---|---|---|---|
| `GET` | `/api/tasks` | `x-flux-key` | Fetch private collection |
| `POST` | `/api/tasks` | `x-flux-key` | Inject new objective |
| `PATCH` | `/api/tasks/:id` | `x-flux-key` | Recalibrate volume (Liquid Decay) |
| `DELETE` | `/api/tasks/:id` | `x-flux-key` | Discard an objective |

---

## VISUAL GUIDELINES

| Token | Value | Usage |
|---|---|---|
| Background | `#0a0a0a` | Near Black — base surface |
| Primary | `#fafafa` | Off-White — text, borders, active states |
| Metadata | `#6b6a67` | Muted Gray — labels, secondary info |
| Structural | `1px solid #2e2d2b` | Dark Gray — dividers, card borders |

---

## ROADMAP

- [ ] Private Key authentication with per-key MongoDB namespacing
- [ ] Liquid Decay — automatic volume recalculation on session end
- [ ] Chip_OK task splitting across sessions
- [ ] Horizon view for long-form project tracking
- [ ] Offline mode with local-first sync

---

*Flux v2.0 // © 2026 // STABLE_READY*
