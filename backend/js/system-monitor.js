/**
 * Real-time system CPU / memory monitor (requires server.py + psutil)
 */
(function () {
  "use strict";

  var POLL_MS = 1500;
  var HISTORY_MAX = 40;
  var cpuHistory = [];
  var memHistory = [];
  var chartInstance = null;
  var pollTimer = null;

  function apiBase() {
    if (window.location.protocol === "file:") {
      return "http://localhost:8080";
    }
    return "";
  }

  function setStatus(level, text) {
    var el = document.getElementById("monitorStatus");
    if (!el) return;
    el.textContent = text;
    el.className = "status-badge " + (level || "");
  }

  function showOffline(msg) {
    var box = document.getElementById("monitorOffline");
    if (box) {
      box.textContent = msg;
      box.classList.add("visible");
    }
    setStatus("error", "Offline");
    var widget = document.getElementById("cpuMiniWidget");
    if (widget) widget.classList.add("offline");
  }

  function hideOffline() {
    var box = document.getElementById("monitorOffline");
    if (box) box.classList.remove("visible");
    setStatus("", "Live");
    var widget = document.getElementById("cpuMiniWidget");
    if (widget) widget.classList.remove("offline");
  }

  function updateGauge(percent) {
    var ring = document.getElementById("cpuGaugeRing");
    var val = document.getElementById("cpuGaugeValue");
    if (!ring || !val) return;

    var r = 54;
    var c = 2 * Math.PI * r;
    var offset = c - (percent / 100) * c;
    ring.style.strokeDasharray = c;
    ring.style.strokeDashoffset = offset;

    val.innerHTML = percent.toFixed(1) + "%<span>CPU</span>";

    var color = percent < 50 ? "#0b9a8d" : percent < 80 ? "#ffa600" : "#ff6361";
    ring.setAttribute("stroke", color);
  }

  function updateCoreBars(cores) {
    var container = document.getElementById("coreBars");
    if (!container) return;
    container.innerHTML = "";
    cores.forEach(function (pct, i) {
      var row = document.createElement("div");
      row.className = "core-row";
      row.innerHTML =
        "<label>Core " + (i + 1) + "</label>" +
        '<div class="core-bar-bg"><div class="core-bar-fill" style="width:' + pct + '%"></div></div>' +
        "<span>" + pct + "%</span>";
      container.appendChild(row);
    });
  }

  function updateMemory(mem) {
    var fill = document.getElementById("memBarFill");
    var pctEl = document.getElementById("memPercent");
    var detail = document.getElementById("memDetail");
    if (fill) fill.style.width = mem.memory_percent + "%";
    if (pctEl) pctEl.textContent = mem.memory_percent + "% used";
    if (detail) {
      detail.textContent =
        mem.memory_used_gb + " GB / " + mem.memory_total_gb + " GB (" +
        mem.memory_available_gb + " GB free)";
    }
  }

  function updateMiniWidget(stats) {
    var cpu = document.getElementById("widgetCpu");
    var mem = document.getElementById("widgetMem");
    var cores = document.getElementById("widgetCores");
    if (cpu) cpu.textContent = stats.cpu_percent + "%";
    if (mem) mem.textContent = stats.memory_percent + "%";
    if (cores) cores.textContent = stats.cpu_count;
  }

  function pushHistory(cpu, mem) {
    var label = new Date().toLocaleTimeString();
    cpuHistory.push({ t: label, v: cpu });
    memHistory.push({ t: label, v: mem });
    if (cpuHistory.length > HISTORY_MAX) {
      cpuHistory.shift();
      memHistory.shift();
    }
  }

  function initChart() {
    var canvas = document.getElementById("cpuHistoryChart");
    if (!canvas || typeof Chart === "undefined") return;

    chartInstance = new Chart(canvas, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "CPU %",
            data: [],
            borderColor: "rgba(255, 26, 104, 1)",
            backgroundColor: "rgba(255, 26, 104, 0.1)",
            fill: true,
            tension: 0.3
          },
          {
            label: "Memory %",
            data: [],
            borderColor: "#0b9a8d",
            backgroundColor: "rgba(11, 154, 141, 0.1)",
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        animation: { duration: 300 },
        scales: {
          y: { min: 0, max: 100, title: { display: true, text: "%" } }
        },
        plugins: { legend: { position: "top" } }
      }
    });
  }

  function updateChart() {
    if (!chartInstance) return;
    chartInstance.data.labels = cpuHistory.map(function (x) { return x.t; });
    chartInstance.data.datasets[0].data = cpuHistory.map(function (x) { return x.v; });
    chartInstance.data.datasets[1].data = memHistory.map(function (x) { return x.v; });
    chartInstance.update("none");
  }

  function renderProcesses(list) {
    var tbody = document.getElementById("processTableBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    if (!list.length) {
      tbody.innerHTML = "<tr><td colspan='5'>No process data</td></tr>";
      return;
    }
    list.forEach(function (p) {
      var tr = document.createElement("tr");
      if (p.cpu_percent >= 15) tr.className = "high-cpu";
      tr.innerHTML =
        "<td>" + p.pid + "</td>" +
        "<td>" + escapeHtml(p.name) + "</td>" +
        "<td>" + p.cpu_percent + "%</td>" +
        "<td>" + p.memory_percent + "%</td>" +
        "<td>" + p.status + "</td>";
      tbody.appendChild(tr);
    });
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function getManagementTip(cpu, mem) {
    var el = document.getElementById("dynamicTip");
    if (!el) return;
    if (cpu >= 85) {
      el.textContent =
        "CPU is very high. Close unused apps, check top processes below, or reduce startup programs. " +
        "In the Simulator, compare Round Robin vs SJF to see how ordering jobs changes wait time.";
    } else if (mem >= 85) {
      el.textContent =
        "Memory is nearly full. Free RAM by closing browsers/tabs and heavy apps. " +
        "High memory pressure causes swapping, which feels like CPU slowdown.";
    } else if (cpu >= 50) {
      el.textContent =
        "Moderate CPU load. The OS scheduler is balancing your running programs — similar to Priority or RR in the Simulator.";
    } else {
      el.textContent =
        "System is relatively idle. Good time to run batch tasks. FCFS-style ordering matters less when the CPU is not saturated.";
    }
  }

  function poll() {
    var base = apiBase();

    fetch(base + "/api/system/stats")
      .then(function (r) {
        if (!r.ok) throw new Error("API unavailable");
        return r.json();
      })
      .then(function (stats) {
        hideOffline();
        updateGauge(stats.cpu_percent);
        updateCoreBars(stats.cpu_per_core || []);
        updateMemory(stats);
        updateMiniWidget(stats);
        pushHistory(stats.cpu_percent, stats.memory_percent);
        updateChart();
        getManagementTip(stats.cpu_percent, stats.memory_percent);

        var meta = document.getElementById("systemMeta");
        if (meta) {
          meta.textContent =
            stats.cpu_count + " logical CPUs" +
            (stats.cpu_count_physical ? " (" + stats.cpu_count_physical + " physical)" : "") +
            (stats.load_avg ? " · Load: " + stats.load_avg.map(function (x) { return x.toFixed(2); }).join(", ") : "");
        }
      })
      .catch(function () {
        showOffline(
          "Real-time monitor needs the Python server. Run: pip install -r requirements.txt then python server.py — open http://localhost:8080 (not file://)."
        );
      });

    fetch(base + "/api/system/processes")
      .then(function (r) { return r.ok ? r.json() : { processes: [] }; })
      .then(function (data) { renderProcesses(data.processes || []); })
      .catch(function () {});
  }

  function start() {
    initChart();
    poll();
    pollTimer = setInterval(poll, POLL_MS);
  }

  function stop() {
    if (pollTimer) clearInterval(pollTimer);
  }

  window.SystemMonitor = { start: start, stop: stop, poll: poll };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  window.addEventListener("beforeunload", stop);
})();
