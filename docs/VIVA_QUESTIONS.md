# Viva / Oral Exam — CPU Scheduling Simulator

Study these with your project running on screen so you can demonstrate answers live.

---

## Basics

**Q1. What is CPU scheduling?**  
Deciding which process in the ready queue gets the CPU when the CPU is free or when a running process blocks or finishes.

**Q2. What is the difference between preemptive and non-preemptive scheduling?**  
Non-preemptive: a process runs until it finishes or blocks. Preemptive: the OS can interrupt a running process and assign the CPU to another (e.g. SRTF, Round Robin).

**Q3. Define burst time, arrival time, turnaround time, waiting time.**  
- Burst time: CPU time needed  
- Arrival time: when process enters ready queue  
- Turnaround time: completion − arrival  
- Waiting time: turnaround − burst (for this simulator’s CPU-only model)

**Q4. What is a Gantt chart in this project?**  
A timeline showing which process occupies the CPU at each time unit, including idle gaps if any.

---

## Algorithms (match your simulator)

**Q5. Explain FCFS. Advantages and disadvantages?**  
Processes run in arrival order. Simple and fair in order, but convoy effect — short jobs wait behind long ones; poor average waiting time.

**Q6. Explain SJF. Why is average waiting time often optimal?**  
Always picks the shortest burst among arrived jobs. Minimizes average waiting for a given set if burst times are known — but starvation possible for long jobs.

**Q7. What is SRTF? How does it differ from SJF?**  
Preemptive version: at each unit, run the process with smallest *remaining* time. Can switch when a shorter job arrives.

**Q8. Explain Round Robin. What is time quantum?**  
Each process gets CPU for at most `q` time units, then goes to back of queue. Quantum too small → high context-switch overhead; too large → behaves like FCFS.

**Q9. Explain priority scheduling in your project.**  
Lower priority **number** = higher priority. Among arrived processes, highest priority (lowest number) runs first.

**Q10. Which algorithms in your project are preemptive?**  
SRTF and Round Robin (and preemptive behavior as implemented in priority/SRJF logic in code — verify on demo).

---

## Your implementation

**Q11. Which technologies did you use and why?**  
HTML/CSS/JavaScript — lightweight, no server, easy to host and demo in browser.

**Q12. How do you calculate CPU utilization?**  
Based on busy vs total timeline length in the Gantt simulation (see explanation panel after run).

**Q13. What is context switch time in your simulator?**  
Extra time added when switching between processes; increases total timeline and affects utilization.

**Q14. Maximum how many processes can you simulate?**  
10 (as per input table rows).

**Q15. How does Export CSV help?**  
Saves per-process and summary metrics for report tables and external graphs.

---

## Analysis questions (expect these)

**Q16. Run the same 3 processes under FCFS and SJF — which has lower average waiting time?**  
Prepare one example (use Sample: Mixed arrival). SJF often wins when short job arrives early; FCFS may be worse if a long job is first.

**Q17. What is starvation? Which algorithms suffer?**  
Low-priority or long processes may never run under SJF or priority scheduling; aging is a common fix.

**Q18. Why is Round Robin popular in time-sharing systems?**  
Fair allocation, good response time, no indefinite wait for interactive users.

**Q19. What are the objectives of CPU scheduling?**  
Max CPU utilization, max throughput, min turnaround/waiting/response time, fairness.

**Q20. What would you add in future work?**  
Multilevel queue, compare-all-algorithms view, preemptive priority, backend for saving sessions (see README future scope).

---

## Demo checklist (before viva)

- [ ] Open simulator, load a sample workload  
- [ ] Show Gantt chart updating when inputs change  
- [ ] Run FCFS and explain output table  
- [ ] Switch to Round Robin, set quantum, run again  
- [ ] Show charts and CPU utilization  
- [ ] Export CSV and open it  
- [ ] Open `docs.html` for theory question backup
