/**
 * Dynamic UI layer — live status, algorithm pills, compare-all, toasts, animated metrics
 */
(function () {
  "use strict";

  window.SchedulerDynamic = {
    animateGantt: true,
    onSimulationUpdate: null
  };

  var ALGORITHMS = ["FCFS", "SJF", "SRJF", "Round Robin", "Priority"];

  function showToast(message) {
    var container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    var el = document.createElement("div");
    el.className = "toast-msg";
    el.textContent = message;
    container.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 2600);
  }

  function animateCounter(element, endValue, suffix, decimals) {
    if (!element) return;
    suffix = suffix || "";
    decimals = decimals !== undefined ? decimals : 2;
    var start = 0;
    var end = parseFloat(endValue) || 0;
    var duration = 600;
    var startTime = null;

    element.classList.add("counting");

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = start + (end - start) * eased;
      element.textContent =
        (decimals === 0 ? Math.round(current) : current.toFixed(decimals)) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.classList.remove("counting");
      }
    }
    requestAnimationFrame(step);
  }

  function updateLiveStatus(snapshot) {
    var algoEl = document.getElementById("liveAlgorithm");
    var procEl = document.getElementById("liveProcessCount");
    var timeEl = document.getElementById("liveTotalTime");
    var waitEl = document.getElementById("liveAvgWait");

    if (algoEl) algoEl.textContent = snapshot.algorithm || "—";
    if (procEl) procEl.textContent = snapshot.processCount || "—";
    if (timeEl) timeEl.textContent = snapshot.totalTime != null ? snapshot.totalTime : "—";
    if (waitEl) waitEl.textContent =
      snapshot.avgWait != null ? snapshot.avgWait : "—";

    syncAlgorithmPills(snapshot.algorithm);
  }

  function syncAlgorithmPills(activeAlg) {
    document.querySelectorAll(".alg-pill").forEach(function (pill) {
      pill.classList.toggle("active", pill.getAttribute("data-alg") === activeAlg);
    });
  }

  function renderCompareTable(results) {
    if (!results || !results.length) return;
    if (window.AlgorithmRating && window.AlgorithmRating.renderCompare) {
      window.AlgorithmRating.renderCompare(results);
      var best = window.AlgorithmRating.computeScores(results)
        .sort(function (a, b) { return b.score - a.score; })[0];
      showToast("Best: " + best.algorithm + " (" + best.score + "/100) · Weakest marked in red");
    }
  }

  function runGanttPlayback() {
    var playhead = document.getElementById("ganttPlayhead");
    var progress = document.querySelector(".progress");
    if (!playhead || !progress || !window.lastSimulationSnapshot) {
      showToast("Run a simulation first");
      return;
    }

    var total = window.lastSimulationSnapshot.totalTime || 1;
    playhead.classList.add("visible");
    playhead.style.left = "0%";

    var step = 0;
    var maxSteps = 40;
    var interval = setInterval(function () {
      step++;
      var pct = Math.min((step / maxSteps) * 100, 100);
      playhead.style.left = pct + "%";
      if (step >= maxSteps) {
        clearInterval(interval);
        setTimeout(function () {
          playhead.classList.remove("visible");
        }, 400);
      }
    }, total * 15 + 50);
  }

  function initAlgorithmPills() {
    document.querySelectorAll(".alg-pill").forEach(function (pill) {
      pill.addEventListener("click", function () {
        var alg = pill.getAttribute("data-alg");
        if (typeof window.setSchedulingAlgorithm === "function") {
          window.setSchedulingAlgorithm(alg);
          showToast("Switched to " + alg);
        }
      });
    });
  }

  function initCompareButton() {
    var btn = document.getElementById("compareAllBtn");
    if (!btn) return;

    btn.addEventListener("click", function () {
      if (typeof window.compareAllAlgorithms !== "function") return;
      btn.disabled = true;
      btn.textContent = "Comparing…";
      showToast("Running all 5 algorithms on current input…");

      setTimeout(function () {
        var results = window.compareAllAlgorithms();
        renderCompareTable(results);
        btn.disabled = false;
        btn.textContent = "Compare All Algorithms";
      }, 80);
    });
  }

  function initAnimateToggle() {
    var toggle = document.getElementById("animateGanttToggle");
    if (!toggle) return;
    toggle.checked = true;
    toggle.addEventListener("change", function () {
      window.SchedulerDynamic.animateGantt = toggle.checked;
      showToast(toggle.checked ? "Gantt animation ON" : "Gantt animation OFF");
      if (typeof window.setSchedulingAlgorithm === "function" && window.lastSimulationSnapshot) {
        window.setSchedulingAlgorithm(window.lastSimulationSnapshot.algorithm);
      }
    });
  }

  function initPlaybackButton() {
    var btn = document.getElementById("playGanttBtn");
    if (btn) {
      btn.addEventListener("click", runGanttPlayback);
    }
  }

  function wrapPresetButtons() {
    var original = window.loadCpuPreset;
    if (!original) return;
    window.loadCpuPreset = function (id) {
      original(id);
      showToast("Loaded sample: " + id);
    };
  }

  function animateOutputTableRows() {
    var table = document.getElementById("outputTable");
    if (!table) return;
    var rows = table.querySelectorAll("tr:not(:first-child)");
    rows.forEach(function (row, i) {
      row.classList.remove("output-row-animate");
      row.style.animationDelay = i * 0.08 + "s";
      void row.offsetWidth;
      row.classList.add("output-row-animate");
    });
  }

  function enhanceRunButton() {
    $(document).on("click", ".runButton#runBtn", function () {
      setTimeout(function () {
        var snap = window.lastSimulationSnapshot;
        if (!snap) return;

        animateCounter(document.getElementById("utilization"), snap.utilization, "%", 2);
        animateCounter(document.getElementById("avgwt"), snap.avgWait, "", 4);
        if (window.mainOutput && document.getElementById("avgtat")) {
          animateCounter(
            document.getElementById("avgtat"),
            window.mainOutput.avgtat,
            "",
            2
          );
        }
        animateOutputTableRows();
        if (window.AlgorithmRating && window.AlgorithmRating.renderSingle) {
          window.AlgorithmRating.renderSingle(snap);
        }
        if (window.AlgorithmRating && snap.score == null) {
          var rated = window.AlgorithmRating.computeScores([snap])[0];
          if (rated) {
            showToast(snap.algorithm + ": " + rated.gradeLabel + " (" + rated.score + "/100)");
          }
        } else {
          showToast("Simulation complete — " + snap.algorithm);
        }
      }, 400);
    });
  }

  window.SchedulerDynamic.onSimulationUpdate = function (snapshot) {
    updateLiveStatus(snapshot);
  };

  $(document).ready(function () {
    initAlgorithmPills();
    initCompareButton();
    initAnimateToggle();
    initPlaybackButton();
    wrapPresetButtons();
    enhanceRunButton();

    if (typeof window.setSchedulingAlgorithm === "function") {
      updateLiveStatus({
        algorithm: "FCFS",
        processCount: 3,
        totalTime: "—",
        avgWait: "—"
      });
    }

    showToast("Simulator ready — change inputs to see live Gantt updates");
  });
})();
