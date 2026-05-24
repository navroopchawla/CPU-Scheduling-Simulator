# Project Report Template — CPU Scheduling Simulator

> Copy each section into your college report format. Replace text in `[brackets]` with your details.

---

## 1. Title Page

- **Project Title:** Interactive CPU Scheduling Algorithm Simulator  
- **Student Name(s):** [Your Name]  
- **Roll Number(s):** [Roll No]  
- **Department:** [e.g. Computer Engineering]  
- **College:** [College Name]  
- **Guide:** [Guide Name, Designation]  
- **Academic Year:** [2025–26]

---

## 2. Certificate

[Use your department’s standard certificate page.]

---

## 3. Acknowledgement

We thank our project guide [Name] for guidance, and the faculty of [Department] for supporting this work.

---

## 4. Abstract (150–250 words)

CPU scheduling is a fundamental function of an operating system that decides which process in the ready queue receives the processor. Understanding scheduling through equations alone is difficult for students; visual simulation bridges theory and practice.

This project implements a **web-based CPU scheduling simulator** supporting FCFS, SJF, SRTF, Round Robin, and Priority scheduling. Users enter arrival time, burst time, and optional priority and time quantum. The system displays a **Gantt chart**, per-process completion/turnaround/waiting times, **average metrics**, **CPU utilization**, and graphical charts.

The application is built with HTML, CSS, and JavaScript and runs without a server. Sample workloads and CSV export support laboratory demonstrations and result documentation. The tool is intended for OS coursework, final-year projects, and self-study.

**Keywords:** CPU scheduling, Gantt chart, FCFS, SJF, Round Robin, operating systems, simulation.

---

## 5. Introduction

### 5.1 Background

Modern systems are multiprogrammed: multiple processes compete for a single CPU. The scheduler must maximize utilization, throughput, and fairness while minimizing waiting and turnaround time.

### 5.2 Problem statement

Students often memorize scheduling rules but struggle to predict Gantt chart outcomes and compare algorithms on the same workload. A dedicated simulator is needed for interactive learning and fair evaluation.

### 5.3 Objectives

1. Implement major CPU scheduling algorithms in software.  
2. Visualize execution order using a Gantt chart.  
3. Compute waiting time, turnaround time, and CPU utilization.  
4. Provide documentation and sample inputs for academic use.  
5. Export results for reports and viva demonstrations.

### 5.4 Scope

- Single CPU, discrete time units  
- Up to 10 processes  
- No I/O burst modeling (CPU-bound processes only)

### 5.5 Limitations

- Multilevel queue not implemented  
- No persistent database / user accounts  
- Priority scheduling follows project-specific preemptive rules as coded

---

## 6. Literature Survey

Summarize 4–6 sources (textbooks + 2 online articles). Compare FCFS, SJF, SRTF, RR, and Priority on:

- Preemptive vs non-preemptive  
- Starvation  
- Average waiting time behavior  
- Suitability (batch vs interactive systems)

---

## 7. System Analysis

### 7.1 Existing system

Manual calculation on paper; static PPT slides; fragmented online applets.

### 7.2 Proposed system

Unified web lab: input table → algorithm selection → Gantt + metrics + charts + explanation.

### 7.3 Functional requirements

| ID | Requirement |
|----|-------------|
| FR1 | Add/remove processes (1–10) |
| FR2 | Select scheduling algorithm |
| FR3 | Display Gantt chart in real time |
| FR4 | Show output table and averages |
| FR5 | Load sample workloads |
| FR6 | Export results to CSV |

### 7.4 Non-functional requirements

- Usable on Chrome/Edge  
- Response time &lt; 1 s for ≤10 processes  
- No installation (static hosting)

---

## 8. System Design

### 8.1 Architecture

```text
[Browser]
   ├── index.html (landing)
   ├── docs.html (theory)
   ├── about.html (project info)
   └── backend/ganttcharts.html
           └── cpu-scheduler.js (algorithms + UI)
```

### 8.2 Data structures

- Process object: name, arrival, burst, priority, remaining burst, finish time, done flag  
- Timeline array for Gantt segments  
- Output object for metrics aggregation

### 8.3 Algorithm flow (generic)

1. Read inputs  
2. At each time unit, pick next process per algorithm rules  
3. Update burst/remaining time and Gantt bar  
4. On completion, record finish time  
5. Compute TAT, waiting time, utilization

Include **flowcharts** for FCFS and Round Robin (draw in report).

---

## 9. Implementation

Describe:

- HTML tables for input/output  
- jQuery event handlers for live Gantt updates  
- Chart.js for pie charts  
- Key functions: `findSmallestBurstIndex`, Round Robin queue logic, etc.

**Screenshots to include:**

1. Home page  
2. Simulator with Gantt chart  
3. Output table + utilization  
4. Sample workload loaded  
5. Exported CSV opened in Excel

---

## 10. Testing

| Test case | Input summary | Algorithm | Expected behavior |
|-----------|---------------|-----------|-------------------|
| T1 | 3 processes, same arrival | FCFS | Order P1→P2→P3 |
| T2 | Different bursts | SJF | Shortest burst first |
| T3 | RR quantum=2 | Round Robin | Cyclic execution |
| T4 | Priorities 1,2,3 | Priority | Lowest number first |

Document actual vs expected for each. Use built-in **Sample workloads** in the simulator.

---

## 11. Results & Discussion

Run **one fixed workload** (e.g. Sample: Mixed arrival) under:

- FCFS  
- SJF  
- Round Robin (q=2)

Create a comparison table:

| Algorithm | Avg waiting | Avg TAT | CPU util % |
|-----------|-------------|---------|------------|
| FCFS | | | |
| SJF | | | |
| RR | | | |

Discuss which minimized waiting time for your test case and why (convoy effect, starvation, quantum size).

---

## 12. Conclusion

The simulator successfully demonstrates CPU scheduling behavior and metrics. It improves understanding compared to manual-only study. Future work may add multilevel queues and automated multi-algorithm comparison.

---

## 13. References

1. Silberschatz et al., *Operating System Concepts*  
2. Stallings, *Operating Systems*  
3. Project source / documentation URLs  
4. [Add your guide’s recommended papers]

---

## 14. Appendices

- Appendix A: Source code listing (key files)  
- Appendix B: User manual (steps from README)  
- Appendix C: Viva questions (see `VIVA_QUESTIONS.md`)
