# FLUX
### ELECTRIC_FLOW_TERMINAL

> *"Maximum Saturation. Zero Friction. High-Velocity Execution."*

Flux is a high-octane, Neo-Brutalist productivity engine built for the age of overstimulation. It discards monochrome minimalism in favor of **Electric Gradients**, **Tactile Surfaces**, and **Liquid Decay** logic. Flux doesn't just track time; it visualizes your focus as physical volume that burns away in real-time.

Built with a bold, Gen-Z aesthetic, Flux utilizes high-impact typography and **Watermark Geometry** to help navigate cognitive load and turn deep work into a high-fidelity experience.

---

## CORE PHILOSOPHY

**Liquid Decay** — Tasks are reservoirs of time. If you chip away at a 60m project for 25m, Flux recalibrates instantly, leaving 35m in your vault. 

**The Precision Countdown** — Real-time visual feedback. A high-contrast countdown keeps you anchored in the present, while a draining progress bar visualizes the "decay" of your objective.

**Private Key Access** — Stateless, friction-free identity. Your Private Key is the only thing standing between you and your encrypted task vault. No emails, no passwords, just the string.

---

## TECH STACK

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express |
| **Database** | MongoDB (Mongoose) |
| **Aesthetic** | Neo-Brutalism, Electric Gradients, Glassmorphism |

---

## MODULES

### `01` FOCUS — The Interface

Select your current time-block. Flux dynamically segments your reality into two layers:

- **The Window** — Tasks that fit perfectly into your selected slot. Tactical, immediate execution.
- **The Horizon** — Massive projects visualized with abstract watermarks. Chipping away at these is the path to long-term progress.

### `02` COMPILE — The Queue

A command-center for high-velocity entry. 

- **Chippable Toggle** — Mark an objective as a long-form project that survives multiple sessions.
- **Priority Matrix** — Color-coded urgency from **Electric Lime** (High) to **Acid Peach** (Medium).

### `03` FLOW — The Session

The terminal enters Focus Mode. The UI strips back to show only the task title and a massive, ticking countdown.

- **Start Flow** — Initializes the countdown based on remaining liquid volume.
- **Power Off** — Calculates exact elapsed time down to the second and updates the database via Liquid Decay.

---

## API SPEC

| Method | Endpoint | Auth Header | Description |
|---|---|---|---|
| `GET` | `/api/tasks` | `x-flux-key` | Sync private collection |
| `POST` | `/api/tasks` | `x-flux-key` | Inject new objective |
| `PATCH` | `/api/tasks/:id` | `x-flux-key` | Recalibrate volume (Decimal Decay) |
| `DELETE` | `/api/tasks/:id` | `x-flux-key` | Discard objective |

---

## VISUAL GUIDELINES

| Token | Value | Identity |
|---|---|---|
| **Surface** | `#0A0A0C` | Deep Space — the base layer |
| **High Priority** | `Linear: #E2FF31 → #ADDB00` | Electric Lime — action required |
| **Mid Priority** | `Linear: #D8B4FE → #A874FA` | Cyber Purple — steady progress |
| **Low Priority** | `Linear: #FFC29F → #FF8B3D` | Acid Peach — secondary depth |
| **Accent** | `Linear: #8DE4FF → #25BAFA` | Sky Cyan — metadata and info |

---

## SYSTEM STATUS

- [x] **Private Key Namespacing** — Stateless database initialization.
- [x] **Liquid Decay** — Decimal-perfect volume recalculation on session end.
- [x] **Geometric Watermarks** — Distinct abstract shapes for Focus, Window, and Horizon.
- [x] **Mobile-Fluid Layout** — Fully responsive, scroll-locked terminal design.
- [ ] **Offline Burst Mode** — Local-first execution with delayed sync.

---

*Flux v3.5 // © 2026 // SYSTEM_ACTIVE*
