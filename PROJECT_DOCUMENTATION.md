# CPU Scheduling Simulator — Complete Project Documentation

> **One document for everything:** what the project is, how it works, every file, every feature, and how to use it for your final-year submission.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement & Objectives](#2-problem-statement--objectives)
3. [Technology Stack](#3-technology-stack)
4. [How to Install & Run](#4-how-to-install--run)
5. [Project Structure (Every File Explained)](#5-project-structure-every-file-explained)
6. [Application Pages](#6-application-pages)
7. [CPU Scheduling Simulator (Core Module)](#7-cpu-scheduling-simulator-core-module)
8. [Scheduling Algorithms (Theory + Implementation)](#8-scheduling-algorithms-theory--implementation)
9. [Performance Metrics](#9-performance-metrics)
10. [Dynamic UI Features](#10-dynamic-ui-features)
11. [Algorithm Rating — Good vs Bad](#11-algorithm-rating--good-vs-bad)
12. [Real-Time System Monitor](#12-real-time-system-monitor)
13. [Backend API (`server.py`)](#13-backend-api-serverpy)
14. [Sample Workloads (Presets)](#14-sample-workloads-presets)
15. [Export & Report Tools](#15-export--report-tools)
16. [Academic Resources](#16-academic-resources)
17. [Demo & Viva Guide](#17-demo--viva-guide)
18. [Troubleshooting](#18-troubleshooting)
19. [Future Scope](#19-future-scope)
20. [References & Credits](#20-references--credits)

---

## 1. Project Overview

### What is this project?

An **Operating Systems virtual laboratory** for **CPU scheduling**. Students and examiners can:

- Enter process data (arrival time, burst time, priority)
- Choose a scheduling algorithm
- See a **Gantt chart** of CPU execution
- View **waiting time**, **turnaround time**, and **CPU utilization**
- **Compare** all algorithms and see which is **good or bad** for the same workload
- Monitor **real CPU/RAM usage** on the host PC (with Python server)
- Export results for reports

### Who is it for?

- Final-year computer science / IT students  
- OS lab courses  
- Self-study for placement / GATE-style OS questions  

### Original vs enhanced version

| Aspect | Original project | This enhanced version |
|--------|------------------|------------------------|
| Simulator | FCFS, SJF, SRTF, RR, Priority | Same + live preview, presets |
| Documentation | Basic README | Full docs, report template, viva Q&A |
| Comparison | Manual only | **Rate All Algorithms** with scores |
| Real CPU | No | **System monitor** via Flask + psutil |
| Academic | Limited | About page, CSV export, rating grades |

---

## 2. Problem Statement & Objectives

### Problem

CPU scheduling is taught using diagrams and manual Gantt charts. Students often:

- Memorize rules without seeing outcomes change when inputs change  
- Cannot quickly compare FCFS vs SJF vs Round Robin on the **same** processes  
- Do not connect textbook algorithms to **real** OS behavior on their laptop  

### Objectives

| # | Objective | How the project achieves it |
|---|-----------|------------------------------|
| 1 | Implement standard scheduling algorithms | `cpu-scheduler.js` |
| 2 | Visualize execution order | Gantt chart (progress bar) |
| 3 | Compute OS metrics | Wait, TAT, utilization |
| 4 | Compare algorithm quality | `algorithm-rating.js` (0–100 score) |
| 5 | Link to real systems | `system-monitor.html` + API |
| 6 | Support academic submission | Report template, viva doc, export |

---

## 3. Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **HTML5** | Pages: home, docs, simulator, monitor, about |
| **CSS3** | Layout, animations, responsive nav |
| **JavaScript** | Scheduling logic, charts, live updates |
| **jQuery** | DOM events, Bootstrap integration |
| **Bootstrap** | Tables, dropdowns, grid on simulator |
| **Chart.js** | Pie charts (wait/TAT), comparison bar chart |
| **MathJax** | Formulas in explanation panel |
| **AOS** | Scroll animations on home/docs |
| **Font Awesome** | Icons in navigation |

### Backend (optional but recommended)

| Technology | Purpose |
|------------|---------|
| **Python 3** | Run local server |
| **Flask** | Serve static files + REST API |
| **psutil** | Read real CPU, RAM, process list from OS |

### Why a Python server?

Browsers **cannot** read your PC’s CPU usage for security reasons. `server.py` runs on your machine and sends safe JSON data to the web page.

---

## 4. How to Install & Run

### Prerequisites

- **Python 3.8+** (for full features)  
- Modern browser: **Chrome**, **Edge**, or **Firefox**  
- Windows / Linux / macOS  

### Step 1 — Open project folder

```powershell
cd c:\Users\shail\Downloads\CPUScheduler-main\CPUScheduler-main
```

### Step 2 — Install dependencies

```powershell
pip install -r requirements.txt
```

This installs:

- `flask` — web server  
- `psutil` — system CPU/RAM stats  

### Step 3 — Start server

```powershell
python server.py
```

You should see:

```text
CPU Scheduler server
Open: http://localhost:8080/index.html
Monitor: http://localhost:8080/backend/system-monitor.html
Real-time system monitor API enabled (/api/system/*)
```

### Step 4 — Open in browser

| Page | URL |
|------|-----|
| Home | http://localhost:8080/index.html |
| Theory | http://localhost:8080/docs.html |
| **Simulator** | http://localhost:8080/backend/ganttcharts.html |
| **Real-time monitor** | http://localhost:8080/backend/system-monitor.html |
| About project | http://localhost:8080/about.html |

### Alternative — static only (no real CPU monitor)

```powershell
python -m http.server 8080
```

Simulator and rating still work; **Monitor** page will show an offline warning.

### Do not use `file://`

Opening `index.html` directly from disk may break API calls and some paths. Always use `http://localhost:8080/...`.

---

## 5. Project Structure (Every File Explained)

```text
CPUScheduler-main/
│
├── index.html                 # Landing / home page
├── docs.html                  # CPU scheduling theory (long-form)
├── about.html                 # Your college, team, guide (edit this)
├── style.css                  # Global styles (nav, hero, footer)
├── docs.css                   # Styles for documentation page
├── about.css                  # Styles for about page
│
├── server.py                  # Flask server + system monitor API
├── requirements.txt           # Python: flask, psutil
├── README.md                  # Short quick-start
├── PROJECT_DOCUMENTATION.md   # This file — full documentation
├── .gitignore                 # Ignores OS junk files
│
├── docs/
│   ├── PROJECT_REPORT_TEMPLATE.md   # Copy into Word/PDF report
│   └── VIVA_QUESTIONS.md            # Oral exam Q&A
│
├── eduford_img/               # Images & SVG assets for home page
├── images/                    # Blog card images (CPU Scheduling_*.PNG)
│
└── backend/
    ├── ganttcharts.html       # Main simulator page
    ├── system-monitor.html    # Real-time CPU/RAM monitor
    │
    ├── css/
    │   ├── bootstrap-simplex.css   # Bootstrap theme
    │   ├── cpu-scheduler.css       # Gantt bar colors (P1–P10, idle)
    │   ├── explanation.css         # Step-by-step explanation panel
    │   ├── dynamic-ui.css          # Toasts, pills, compare panel
    │   ├── algorithm-rating.css    # Good/bad scores, grade colors
    │   └── system-monitor.css      # Monitor gauges, process table
    │
    └── js/
        ├── cpu-scheduler.js        # CORE: all scheduling algorithms
        ├── dynamic-ui.js           # Live status, pills, compare button
        ├── algorithm-rating.js     # 0–100 scores, good/bad verdicts
        ├── system-monitor.js       # Polls /api/system/* every 1.5s
        ├── bootstrap.min.js        # Bootstrap JS
        ├── bootstrap-slider.js     # Sliders (if used)
        └── MathJaxSetup.js           # Math rendering config
```

### Root files

| File | Explanation |
|------|-------------|
| `index.html` | Hero section, features for final-year submission, links to simulator and monitor. Rotating taglines in hero. |
| `docs.html` | Educational content: what is CPU scheduling, preemptive vs non-preemptive, each algorithm with pros/cons, comparison table. |
| `about.html` | Placeholders for student name, roll no, college, guide — **edit before submission**. |
| `style.css` | Shared navigation, header background, course cards, footer, mobile menu. |
| `server.py` | Serves all HTML/CSS/JS and exposes `/api/system/stats`, `/api/system/processes`. |

### Backend / simulator files

| File | Explanation |
|------|-------------|
| `ganttcharts.html` | Full UI: input table, algorithm dropdown & pills, Gantt, output table, charts, compare panel, rating panel. |
| `cpu-scheduler.js` | Implements FCFS, SJF, SRJF, Round Robin, Priority; builds Gantt; computes metrics; presets; export CSV; compare all. |
| `dynamic-ui.js` | Toast messages, algorithm pill clicks, animate Gantt toggle, compare button handler, live status bar. |
| `algorithm-rating.js` | Scores algorithms 0–100, grades (Excellent→Poor), comparison chart, best/worst cards. |
| `system-monitor.html` | Live CPU gauge, per-core bars, RAM, history chart, top processes, management tips. |
| `system-monitor.js` | Fetches API, updates UI, dynamic tips when CPU/RAM high. |

---

## 6. Application Pages

### 6.1 Home (`index.html`)

- Introduction to the virtual lab  
- Buttons: **Open Simulator**, **Live CPU Monitor**, **Read Docs**  
- Section: built for report, viva, demo, real-time monitor  
- Blog cards (external OS links)  

### 6.2 Documentation (`docs.html`)

- CPU scheduling definitions  
- Objectives of scheduling  
- Terminology: burst, arrival, turnaround, waiting  
- Preemptive vs non-preemptive  
- **Comparison table** for report writing  
- Detailed sections: FCFS, SRTF, Priority, Round Robin, SJF, multilevel queue  
- **Go to Simulator** buttons on each section  

### 6.3 About (`about.html`)

- Project overview and objectives  
- **Editable table** for academic details  
- Module list and tech stack  
- Link to simulator  

### 6.4 Simulator (`backend/ganttcharts.html`)

Main application — see [Section 7](#7-cpu-scheduling-simulator-core-module).

### 6.5 System Monitor (`backend/system-monitor.html`)

Real hardware stats — see [Section 12](#12-real-time-system-monitor).

---

## 7. CPU Scheduling Simulator (Core Module)

### User workflow

```text
1. Enter processes (P1–P10): Arrival time, Burst time, [Priority]
2. Select algorithm (dropdown or pills)
3. Optional: Context switch time, Time quantum (Round Robin)
4. Gantt chart updates LIVE as you type
5. Click "Run Simulation" → output table + pie charts + metrics
6. Optional: "Rate All Algorithms" → good/bad comparison
7. Optional: Export CSV
```

### Input fields

| Field | Meaning | Valid range |
|-------|---------|-------------|
| **Process** | P1, P2, … | Auto-labeled |
| **Arrival time** | When process enters ready queue | ≥ 0 |
| **Burst time** | CPU time needed | > 0 |
| **Priority** | Lower number = higher priority (Priority algo only) | Integer |
| **Number of processes** | +/- buttons, max 10 | 1–10 |
| **Context switch time** | Extra time when switching processes | ≥ 0 |
| **Time quantum** | Round Robin only | > 0 |

### UI controls

| Control | Action |
|---------|--------|
| **Algorithm pills** | Instant switch FCFS / SJF / SRTF / RR / Priority |
| **Sample workload buttons** | Load preset process sets |
| **Animate Gantt chart** | Segments grow one-by-one |
| **▶ Playback** | Playhead moves across timeline |
| **Rate All Algorithms** | Run all 5 policies, score them |
| **Run Simulation** | Full output table + Chart.js graphs |
| **Reset** | Reload page |
| **Export CSV** | Download results file |
| **Show Explanation** | Step-by-step math walkthrough |

### Gantt chart

- Horizontal bar = timeline  
- Colors per process (P1 green, P2 orange, …)  
- **Idle** = gray, **Context switch** = black  
- Ruler below = time units  
- Tooltips: process name, start, duration, end  

### Output table (after Run)

| Column | Formula / source |
|--------|------------------|
| Process | P1, P2, … |
| Arrival time | User input |
| Burst time | Initial burst |
| Completion time | `finishTime` from simulation |
| Turnaround time | Completion − Arrival |
| Waiting time | Turnaround − Burst |

### Charts (after Run)

- **Pie chart** — waiting time per process  
- **Pie chart** — turnaround time per process  
- **Metric cards** — Algorithm name, CPU utilization %, avg wait, avg TAT  

---

## 8. Scheduling Algorithms (Theory + Implementation)

### 8.1 FCFS — First Come First Served

| Property | Value |
|----------|--------|
| Type | Non-preemptive |
| Rule | Run processes in order of arrival |
| Code | `FCFS()` in `cpu-scheduler.js` |

**Advantages:** Simple, fair in arrival order.  
**Disadvantages:** Convoy effect; high average wait if long job arrives first.

---

### 8.2 SJF — Shortest Job First (non-preemptive)

| Property | Value |
|----------|--------|
| Type | Non-preemptive |
| Rule | Among arrived processes, pick smallest **total** burst |
| Code | `SJF()` + `findSmallestBurstIndex()` |

**Advantages:** Minimizes average waiting time (when bursts known).  
**Disadvantages:** Starvation for long jobs; needs burst time prediction.

---

### 8.3 SRTF — Shortest Remaining Time First (labeled SRJF in UI)

| Property | Value |
|----------|--------|
| Type | Preemptive |
| Rule | Always run process with smallest **remaining** burst; can interrupt |
| Code | `SRJF()` + `findNextJump()` |

**Advantages:** Better response for short jobs.  
**Disadvantages:** Frequent context switches; more overhead.

---

### 8.4 Round Robin

| Property | Value |
|----------|--------|
| Type | Preemptive |
| Rule | Each process gets CPU for **time quantum** `q`, then goes to back of queue |
| Code | `roundRobin()` |
| Extra input | Time quantum (default 2) |

**Advantages:** Fair; good for time-sharing; no starvation.  
**Disadvantages:** Quantum tuning; higher average wait if `q` is large.

---

### 8.5 Priority Scheduling

| Property | Value |
|----------|--------|
| Type | Non-preemptive (in this simulator) |
| Rule | Lowest **priority number** runs first among arrived processes |
| Code | `priority()` + `findSmallestPriorityIndex()` |
| Extra input | Priority column per process |

**Advantages:** Important jobs first.  
**Disadvantages:** Starvation of low priority; priority assignment is hard.

---

## 9. Performance Metrics

### Formulas

```text
Turnaround Time (TAT)  = Completion Time − Arrival Time
Waiting Time (WT)      = Turnaround Time − Burst Time
CPU Utilization (%)    = (Busy CPU time / Total timeline) × 100
Throughput             = Number of processes / Total time
```

### Where they are calculated

- **Live preview:** `progressBar.displayBar()` in `cpu-scheduler.js`  
- **After Run button:** Copies `processArray` into `mainOutput` for tables/charts  

### Stored in snapshot

`window.lastSimulationSnapshot` contains:

```javascript
{
  algorithm, avgWait, avgTat, maxWait, utilization,
  totalTime, processCount, throughput, segments, segmentLengths
}
```

Used by rating, compare, and live status bar.

---

## 10. Dynamic UI Features

File: `backend/js/dynamic-ui.js` + `backend/css/dynamic-ui.css`

| Feature | Description |
|---------|-------------|
| **Live status bar** | Shows algorithm, process count, timeline length, avg wait while editing |
| **Algorithm pills** | One-click algorithm change + Gantt refresh |
| **Animated Gantt** | Staggered width animation on segments |
| **Gantt playback** | Red playhead moves across timeline |
| **Toast notifications** | Short messages (preset loaded, compare done) |
| **Animated counters** | Metrics count up after Run |
| **Mini CPU widget** | Real CPU/RAM % on simulator (needs `server.py`) |

---

## 11. Algorithm Rating — Good vs Bad

File: `backend/js/algorithm-rating.js` + `backend/css/algorithm-rating.css`

### Purpose

Answers: *“For **this exact input**, which algorithm is good and which is bad?”*

### Single algorithm panel

Shown below Gantt after any simulation:

- **Score 0–100**  
- **Grade:** Excellent / Good / Average / Below Average / Poor  
- **Breakdown bars:** Waiting, Turnaround, Utilization, Completion speed  

When only one algorithm is active, scoring uses **absolute thresholds** (general OS scales).

### Compare all (Rate All Algorithms)

Runs FCFS, SJF, SRJF, Round Robin, Priority on the **same** input.

| Output | Meaning |
|--------|---------|
| **Best banner** | Highest composite score |
| **Weakest banner** | Lowest score |
| **Horizontal bar chart** | Visual score comparison |
| **Ranked table** | Rank, metrics, score, Best/Weakest tag |
| **Cards** | Per-algorithm tips (convoy, quantum, starvation) |

### Score formula (relative comparison)

| Metric | Weight | Direction |
|--------|--------|-----------|
| Average waiting time | 40% | Lower is better |
| Average turnaround time | 35% | Lower is better |
| CPU utilization | 15% | Higher is better |
| Total timeline | 10% | Lower is better |

Each metric is normalized 0–100 among the five results, then weighted.

### Grade scale

| Score | Grade |
|-------|--------|
| 85–100 | Excellent |
| 70–84 | Good |
| 50–69 | Average |
| 30–49 | Below Average |
| 0–29 | Poor |

### Example viva sentence

> “For mixed arrival workload, SJF scored 78/100 (Good) while FCFS scored 42/100 (Below Average) due to higher average waiting time from convoy effect.”

---

## 12. Real-Time System Monitor

### Purpose

Connect **textbook scheduling** to **your real PC**:

- See actual CPU % and RAM %  
- See per-core usage  
- See top processes (what the OS is scheduling now)  
- Read how to **manage** high CPU (close apps, Task Manager, etc.)  

### Requirements

- `python server.py` running  
- `psutil` installed  

### Page sections

| Section | Data source |
|---------|-------------|
| CPU gauge | `/api/system/stats` → `cpu_percent` |
| Per-core bars | `cpu_per_core[]` |
| Memory bar | `memory_percent`, `memory_used_gb`, `memory_total_gb` |
| History chart | Last 40 samples, polled every 1.5 s |
| Process table | `/api/system/processes` → top 12 by CPU |
| Management cards | Static educational content |
| Dynamic tip | Changes when CPU/RAM high |

### Simulator widget

On `ganttcharts.html`, small bar shows **Real CPU**, **Real RAM**, **Core count** with link to full monitor.

### Link to scheduling theory

The OS kernel uses policies similar to your simulator (ready queue, preemption, priority). The monitor explains that; the simulator lets you **experiment** on paper workloads.

---

## 13. Backend API (`server.py`)

### Endpoints

| Method | URL | Returns |
|--------|-----|---------|
| GET | `/api/system/health` | `{ ok, psutil, platform }` |
| GET | `/api/system/stats` | CPU %, per-core %, memory, load average |
| GET | `/api/system/processes` | Top processes by CPU usage |
| GET | `/*` | Static HTML, CSS, JS, images |

### Example — stats response

```json
{
  "cpu_percent": 24.5,
  "cpu_per_core": [12.0, 30.0, 18.0, 22.0],
  "cpu_count": 8,
  "memory_percent": 61.2,
  "memory_used_gb": 9.8,
  "memory_total_gb": 16.0,
  "memory_available_gb": 6.2
}
```

### Port

Default: **8080**. Change with environment variable:

```powershell
$env:PORT=5000; python server.py
```

---

## 14. Sample Workloads (Presets)

Defined in `cpu-scheduler.js` as `CPU_PRESETS`:

| Button | ID | Processes | Purpose |
|--------|-----|-----------|---------|
| FCFS classic | `fcfsClassic` | 3 | Different bursts, same arrival |
| Mixed arrival | `mixedArrival` | 4 | Staggered arrivals |
| SJF comparison | `sjfCompare` | 4 | Short job arrives later |
| Round Robin | `roundRobinDemo` | 4 | Auto-selects RR, quantum 2 |
| Priority demo | `priorityDemo` | 4 | Auto-selects Priority |

Use these in demos and screenshots for your report.

---

## 15. Export & Report Tools

### CSV export

**Button:** Export results (CSV)  
**Requires:** Run Simulation first  

**File contains:**

- Algorithm name  
- Average waiting, turnaround, utilization  
- Time quantum (if RR)  
- Per-process row: arrival, burst, completion, TAT, waiting  

**Filename:** `cpu-scheduling-{algorithm}-{date}.csv`

### Report template

`docs/PROJECT_REPORT_TEMPLATE.md` — chapters:

Abstract, Introduction, Literature, Design, Implementation, Testing, Results, Conclusion, References

### Viva questions

`docs/VIVA_QUESTIONS.md` — 20+ questions with answers

---

## 16. Academic Resources

| Resource | Path | Use |
|----------|------|-----|
| Full documentation | `PROJECT_DOCUMENTATION.md` | This file |
| Quick start | `README.md` | GitHub / examiner quick view |
| Report template | `docs/PROJECT_REPORT_TEMPLATE.md` | Word/PDF report |
| Viva prep | `docs/VIVA_QUESTIONS.md` | Oral exam |
| About page | `about.html` | Title page info |

### Before submission checklist

- [ ] Fill `about.html` with your details  
- [ ] Run **Rate All Algorithms** and screenshot results  
- [ ] Run **System Monitor** and screenshot CPU chart  
- [ ] Export CSV and paste table into report  
- [ ] Read viva questions with simulator open  

---

## 17. Demo & Viva Guide

### 5-minute demo script

1. **Home** — explain problem (learning scheduling visually)  
2. **Docs** — 30 sec on FCFS vs SJF vs RR  
3. **Simulator** — load **Mixed arrival** preset  
4. Show **live Gantt** changing when switching **SJF** vs **FCFS**  
5. Click **Rate All Algorithms** — point to **Best** and **Weakest**  
6. **Run Simulation** — show output table and pie charts  
7. **Monitor** — show real CPU and top processes  
8. **About** — your name, college, guide  

### Questions you should answer

- What is preemptive vs non-preemptive?  
- How is waiting time calculated?  
- Why is SJF optimal for average wait but can starve jobs?  
- What is time quantum in Round Robin?  
- How does your rating score work (weights)?  
- Why do you need Python for real CPU data?  

---

## 18. Troubleshooting

| Problem | Solution |
|---------|----------|
| Monitor shows offline | Use `python server.py`, not `file://` or plain `http.server` |
| `pip install` fails | Run `python -m pip install -r requirements.txt` |
| Port 8080 in use | Close other server or set `$env:PORT=8081` |
| Gantt empty | Check burst time > 0, arrival ≥ 0 |
| Compare button does nothing | Wait for page load; ensure `cpu-scheduler.js` loaded |
| Export disabled | Click **Run Simulation** first |
| Rating always 100 | Click **Rate All Algorithms** for relative scores |
| Images missing on home | Ensure `images/` folder exists with PNG files |

---

## 19. Future Scope

Ideas for report **Future Work** section:

- Multilevel feedback queue scheduling  
- Preemptive priority scheduling  
- I/O-bound processes (CPU–I/O burst cycle)  
- Save/load simulation history (database)  
- Side-by-side Gantt for two algorithms  
- Mobile-responsive simulator redesign  
- Docker one-command deploy  

---

## 20. References & Credits

### Textbooks

- Silberschatz, Galvin, Gagne — *Operating System Concepts*  
- William Stallings — *Operating Systems*  

### Online

- GeeksforGeeks — CPU Scheduling  
- TutorialsPoint — OS scheduling  

### Original project

Based on [CPUScheduler](https://github.com/ravipatel1309/CPUScheduler) / [live demo](https://ravipatel1309.github.io/CPUScheduler/).

### Enhancements in this version

- Final-year documentation pack  
- Sample workloads and CSV export  
- Dynamic UI (pills, animation, compare)  
- Algorithm rating (good/bad scores)  
- Real-time system monitor (Flask + psutil)  
- `PROJECT_DOCUMENTATION.md` (this document)  

---

## Quick Command Reference

```powershell
# Install
pip install -r requirements.txt

# Run full project
python server.py

# URLs
# http://localhost:8080/index.html
# http://localhost:8080/backend/ganttcharts.html
# http://localhost:8080/backend/system-monitor.html
```

---

*End of documentation. For questions during viva, keep this file and the simulator open side by side.*
