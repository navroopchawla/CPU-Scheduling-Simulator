# CPU Scheduling Simulator — Final Year Project

An interactive **Operating Systems virtual lab** that simulates classic CPU scheduling algorithms with Gantt-chart visualization, performance metrics, and step-by-step explanations.

📖 **[Complete documentation → PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** — explains every file, feature, algorithm, API, and how to use the project for your submission.

**Live demo (original):** [CPU Scheduler](https://ravipatel1309.github.io/CPUScheduler/)

---

## Why this project fits a final-year submission

| Aspect | What you get |
|--------|----------------|
| **Domain** | Core OS topic — process scheduling |
| **Implementation** | Working simulator (not slides-only) |
| **Evaluation** | Waiting time, turnaround time, CPU utilization |
| **Documentation** | Theory pages + report template + viva Q&A |
| **Demo-ready** | Built-in sample workloads and CSV export |

---

## Features

- **Algorithms:** FCFS, SJF (non-preemptive), SRTF (preemptive), Round Robin, Priority
- **Inputs:** Arrival time, burst time, priority, time quantum, context-switch time
- **Outputs:** Gantt chart, per-process table, average waiting/TAT, CPU utilization
- **Visualization:** Pie charts for waiting time and turnaround time
- **Real-time system monitor:** Live CPU %, per-core usage, RAM, top processes, and management guide (requires `server.py` + `psutil`)
- **Learning aids:** Algorithm explanation walkthrough after each run
- **Academic extras:** Sample test cases, export results to CSV, report & viva guides

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript |
| UI | Bootstrap, jQuery |
| Charts | Chart.js |
| Math rendering | MathJax |
| Hosting | Static (GitHub Pages, Netlify, or local) |

No backend server required — runs entirely in the browser.

---

## Quick start

### Run locally (recommended — includes real-time CPU monitor)

```powershell
cd CPUScheduler-main
pip install -r requirements.txt
python server.py
```

Then open:

| Page | URL |
|------|-----|
| Home | http://localhost:8080/index.html |
| Simulator | http://localhost:8080/backend/ganttcharts.html |
| **Real-time monitor** | http://localhost:8080/backend/system-monitor.html |

> Use `python server.py` (not `python -m http.server`) so live CPU/RAM data works via the API.

### Static-only (no real CPU data)

```powershell
python -m http.server 8080
```

### Or open directly

1. Clone or download this repository.
2. Open `index.html` in a modern browser (Chrome / Edge / Firefox).
3. Go to **Simulator** → enter process data → choose algorithm → **Run**.
4. Use **Sample workload** buttons for demo scenarios during presentation.
5. Click **Export CSV** to save results for your report or viva folder.

```text
CPUScheduler-main/
├── index.html              # Landing page
├── docs.html               # Theory & algorithm notes
├── about.html              # Project / team info (edit for your college)
├── docs/
│   ├── PROJECT_REPORT_TEMPLATE.md
│   └── VIVA_QUESTIONS.md
├── backend/
│   ├── ganttcharts.html    # Simulator UI
│   ├── js/cpu-scheduler.js
│   └── css/
└── README.md
```

---

## Algorithms implemented

| Algorithm | Type | Selection criterion |
|-----------|------|---------------------|
| FCFS | Non-preemptive | Arrival order |
| SJF | Non-preemptive | Shortest burst among arrived jobs |
| SRTF (SRJF) | Preemptive | Shortest remaining time |
| Round Robin | Preemptive | Time quantum, cyclic queue |
| Priority | Non-preemptive* | Lowest priority number first |

\* Preemption behavior follows the existing simulator logic.

### Performance metrics

- **Turnaround time** = Completion time − Arrival time  
- **Waiting time** = Turnaround time − Burst time  
- **CPU utilization** = (Busy time / Total timeline) × 100%

---

## Customization for your submission

1. Edit **`about.html`** — add your name, roll number, college, guide, and team.
2. Copy sections from **`docs/PROJECT_REPORT_TEMPLATE.md`** into your Word/PDF report.
3. Review **`docs/VIVA_QUESTIONS.md`** before the oral exam.
4. Take screenshots of Gantt charts + charts for **Chapter: Implementation & Results**.
5. Run the same sample workload under FCFS vs SJF vs RR and compare metrics in your analysis chapter.

---

## Future scope (for report “Conclusion & Future Work”)

- Multilevel queue scheduling
- Side-by-side algorithm comparison on one screen
- Preemptive priority scheduling
- Login / saved history (requires backend)
- Mobile-first UI refactor

---

## References

- Silberschatz, Galvin, Gagne — *Operating System Concepts*
- William Stallings — *Operating Systems*
- GeeksforGeeks / TutorialsPoint — CPU Scheduling articles

---

## License

Educational use. Original simulator concept from the [CPUScheduler](https://github.com/ravipatel1309/CPUScheduler) project. Customize and attribute as required by your institution.

---

## Acknowledgement

Based on the open-source CPU Scheduling Simulator. Enhanced for final-year academic presentation with documentation, presets, and export tools.
