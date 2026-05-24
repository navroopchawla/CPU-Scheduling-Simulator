/**
 * Rates scheduling algorithms — score, grade, good/bad verdict, comparison chart
 */
(function () {
  "use strict";

  var GRADES = [
    { min: 85, label: "Excellent", class: "grade-excellent", icon: "★" },
    { min: 70, label: "Good", class: "grade-good", icon: "✓" },
    { min: 50, label: "Average", class: "grade-average", icon: "○" },
    { min: 30, label: "Below Average", class: "grade-below", icon: "△" },
    { min: 0, label: "Poor", class: "grade-poor", icon: "✗" }
  ];

  var METRIC_HELP = {
    avgWait: "Lower average waiting time means processes wait less in the ready queue.",
    avgTat: "Lower turnaround time means jobs finish sooner after arriving.",
    utilization: "Higher CPU utilization means less idle time on the CPU.",
    totalTime: "Shorter total timeline means all work completes faster."
  };

  function getGrade(score) {
    for (var i = 0; i < GRADES.length; i++) {
      if (score >= GRADES[i].min) return GRADES[i];
    }
    return GRADES[GRADES.length - 1];
  }

  /** Normalize: best value → 100, worst → 0 (lower is better) */
  function normLower(values, value) {
    var best = Math.min.apply(null, values);
    var worst = Math.max.apply(null, values);
    if (worst === best) return 100;
    return Math.round(((worst - value) / (worst - best)) * 100);
  }

  /** Higher is better */
  function normHigher(values, value) {
    var best = Math.max.apply(null, values);
    var worst = Math.min.apply(null, values);
    if (worst === best) return 100;
    return Math.round(((value - worst) / (best - worst)) * 100);
  }

  /** Absolute score when only one algorithm (no peers to compare) */
  function absoluteMetricScore(value, goodAt, badAt) {
    if (value <= goodAt) return 100;
    if (value >= badAt) return 0;
    return Math.round(100 - ((value - goodAt) / (badAt - goodAt)) * 100);
  }

  function scoreOneAbsolute(r) {
    var waitS = absoluteMetricScore(r.avgWait, 0, 12);
    var tatS = absoluteMetricScore(r.avgTat || 0, 0, 20);
    var utilS = Math.min(100, Math.round(r.utilization));
    var timeS = absoluteMetricScore(r.totalTime, r.processCount || 1, (r.processCount || 3) * 8);
    var score = Math.round(waitS * 0.4 + tatS * 0.35 + utilS * 0.15 + timeS * 0.1);
    var grade = getGrade(score);
    return Object.assign({}, r, {
      score: score,
      gradeLabel: grade.label,
      gradeClass: grade.class,
      gradeIcon: grade.icon,
      breakdown: { wait: waitS, tat: tatS, util: utilS, time: timeS },
      isRelative: false
    });
  }

  function computeScores(results) {
    if (!results || !results.length) return [];

    if (results.length === 1) {
      return [scoreOneAbsolute(results[0])];
    }

    var waits = results.map(function (r) { return r.avgWait; });
    var tats = results.map(function (r) { return r.avgTat || 0; });
    var utils = results.map(function (r) { return r.utilization; });
    var times = results.map(function (r) { return r.totalTime; });

    return results.map(function (r) {
      var waitS = normLower(waits, r.avgWait);
      var tatS = normLower(tats, r.avgTat || 0);
      var utilS = normHigher(utils, r.utilization);
      var timeS = normLower(times, r.totalTime);

      var score = Math.round(
        waitS * 0.4 + tatS * 0.35 + utilS * 0.15 + timeS * 0.1
      );

      var grade = getGrade(score);
      return Object.assign({}, r, {
        score: score,
        gradeLabel: grade.label,
        gradeClass: grade.class,
        gradeIcon: grade.icon,
        breakdown: { wait: waitS, tat: tatS, util: utilS, time: timeS },
        isRelative: true
      });
    });
  }

  function findBestWorst(rated) {
    var best = rated[0];
    var worst = rated[0];
    rated.forEach(function (r) {
      if (r.score > best.score) best = r;
      if (r.score < worst.score) worst = r;
    });
    return { best: best, worst: worst };
  }

  function explainVerdict(r, ranked, isBest, isWorst) {
    var lines = [];
    if (isBest) {
      lines.push("Best choice for this workload — lowest combined waiting & turnaround impact.");
    }
    if (isWorst) {
      lines.push("Weakest for this input — consider another algorithm if fairness or speed matters.");
    }
    if (r.breakdown.wait >= 80) {
      lines.push("Strong on waiting time (processes don't wait long).");
    } else if (r.breakdown.wait <= 40) {
      lines.push("Weak on waiting time — long ready-queue delays.");
    }
    if (r.breakdown.tat >= 80) {
      lines.push("Good turnaround — jobs complete relatively fast.");
    } else if (r.breakdown.tat <= 40) {
      lines.push("High turnaround — jobs take long from arrival to finish.");
    }
    if (r.algorithm === "FCFS" && r.score < 60) {
      lines.push("FCFS often suffers convoy effect when a long job arrives first.");
    }
    if (r.algorithm === "Round Robin" && r.score < 55) {
      lines.push("Try a smaller/larger time quantum — RR is sensitive to quantum size.");
    }
    if (r.algorithm === "SJF" || r.algorithm === "SRJF") {
      if (r.score >= 70) {
        lines.push("Short-job bias helps when burst times vary.");
      }
    }
    if (lines.length === 0) {
      lines.push("Balanced performance on this workload — neither best nor worst.");
    }
    return lines;
  }

  function renderSingleRating(snapshot) {
    var panel = document.getElementById("algoRatingPanel");
    if (!panel || !snapshot) return;

    var rated = computeScores([snapshot])[0];
    if (!rated) return;

    panel.classList.add("visible");
    panel.innerHTML =
      '<div class="rating-header">' +
        '<h4>How good is <span class="algo-name">' + rated.algorithm + '</span> for this input?</h4>' +
        '<div class="rating-badge ' + rated.gradeClass + '">' +
          '<span class="rating-score">' + rated.score + '</span>' +
          '<span class="rating-grade">' + rated.gradeIcon + ' ' + rated.gradeLabel + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="rating-bars">' +
        metricBar("Waiting time", rated.breakdown.wait) +
        metricBar("Turnaround", rated.breakdown.tat) +
        metricBar("CPU utilization", rated.breakdown.util) +
        metricBar("Completion speed", rated.breakdown.time) +
      '</div>' +
      '<p class="rating-hint">' +
        (rated.isRelative === false
          ? "Score uses general OS thresholds. Click <strong>Rate All Algorithms</strong> for fair good/bad comparison on this input."
          : "Scores are relative to other algorithms on the same workload.") +
      '</p>';
  }

  function metricBar(label, pct) {
    var color = pct >= 70 ? "#0b9a8d" : pct >= 50 ? "#ffa600" : "#ff6361";
    return (
      '<div class="metric-bar-row">' +
        '<label>' + label + ' <span>' + pct + '/100</span></label>' +
        '<div class="metric-bar-bg"><div class="metric-bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
      '</div>'
    );
  }

  var compareChart = null;

  function renderCompareChart(rated) {
    var canvas = document.getElementById("compareScoreChart");
    if (!canvas || typeof Chart === "undefined") return;

    var labels = rated.map(function (r) { return r.algorithm; });
    var scores = rated.map(function (r) { return r.score; });
    var colors = rated.map(function (r) {
      if (r.gradeClass === "grade-excellent" || r.gradeClass === "grade-good") return "rgba(11, 154, 141, 0.85)";
      if (r.gradeClass === "grade-average") return "rgba(255, 166, 0, 0.85)";
      return "rgba(255, 99, 97, 0.85)";
    });

    if (compareChart) compareChart.destroy();

    compareChart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Performance score (0–100)",
          data: scores,
          backgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        scales: {
          x: { min: 0, max: 100, title: { display: true, text: "Higher = better for this workload" } }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              afterLabel: function (ctx) {
                var r = rated[ctx.dataIndex];
                return r.gradeLabel + " · Wait: " + r.avgWait + " · TAT: " + (r.avgTat || "—");
              }
            }
          }
        }
      }
    });
  }

  function renderCompare(results) {
    var panel = document.getElementById("comparePanel");
    var tbody = document.getElementById("compareTableBody");
    var summary = document.getElementById("compareVerdictSummary");
    if (!panel || !tbody || !results.length) return;

    var rated = computeScores(results);
    rated.sort(function (a, b) { return b.score - a.score; });
    var bw = findBestWorst(rated);

    if (summary) {
      summary.innerHTML =
        '<div class="verdict-box verdict-best">' +
          '<strong>Best:</strong> ' + bw.best.algorithm +
          ' <span class="tag ' + bw.best.gradeClass + '">' + bw.best.score + '/100 · ' + bw.best.gradeLabel + '</span>' +
          ' — lowest penalty on waiting & turnaround for this input.' +
        '</div>' +
        '<div class="verdict-box verdict-worst">' +
          '<strong>Weakest:</strong> ' + bw.worst.algorithm +
          ' <span class="tag ' + bw.worst.gradeClass + '">' + bw.worst.score + '/100 · ' + bw.worst.gradeLabel + '</span>' +
          ' — avoid if you need fast or fair response on this workload.' +
        '</div>';
    }

    tbody.innerHTML = "";
    rated.forEach(function (r, idx) {
      var tr = document.createElement("tr");
      var isBest = r.algorithm === bw.best.algorithm;
      var isWorst = r.algorithm === bw.worst.algorithm;
      if (isBest) tr.className = "best-row";
      if (isWorst) tr.className = "worst-row";

      var rank = idx + 1;
      var verdictTag = isBest
        ? '<span class="verdict-tag good">Best</span>'
        : isWorst
          ? '<span class="verdict-tag bad">Weakest</span>'
          : '<span class="verdict-tag neutral">' + r.gradeLabel + '</span>';

      tr.innerHTML =
        "<td>" + rank + ". " + r.algorithm + "</td>" +
        "<td>" + r.avgWait + "</td>" +
        "<td>" + (r.avgTat != null ? r.avgTat : "—") + "</td>" +
        "<td>" + r.utilization + "%</td>" +
        "<td>" + r.totalTime + "</td>" +
        "<td><strong>" + r.score + "</strong></td>" +
        "<td>" + verdictTag + "</td>";
      tbody.appendChild(tr);
    });

    var cards = document.getElementById("compareAlgoCards");
    if (cards) {
      cards.innerHTML = "";
      rated.forEach(function (r) {
        var isBest = r.algorithm === bw.best.algorithm;
        var isWorst = r.algorithm === bw.worst.algorithm;
        var card = document.createElement("div");
        card.className = "algo-score-card " + r.gradeClass + (isBest ? " card-best" : "") + (isWorst ? " card-worst" : "");
        var tips = explainVerdict(r, rated, isBest, isWorst);
        card.innerHTML =
          '<h5>' + r.algorithm + (isBest ? ' <span class="crown">👑</span>' : '') + '</h5>' +
          '<div class="card-score">' + r.score + '<small>/100</small></div>' +
          '<div class="card-grade">' + r.gradeLabel + '</div>' +
          '<ul class="card-tips">' + tips.map(function (t) { return "<li>" + t + "</li>"; }).join("") + '</ul>';
        cards.appendChild(card);
      });
    }

    renderCompareChart(rated);
    panel.classList.add("visible");

    var ratingPanel = document.getElementById("algoRatingPanel");
    if (ratingPanel && window.lastSimulationSnapshot) {
      renderSingleRating(window.lastSimulationSnapshot);
    }
  }

  window.AlgorithmRating = {
    computeScores: computeScores,
    renderSingle: renderSingleRating,
    renderCompare: renderCompare,
    getGrade: getGrade
  };

  window.SchedulerDynamic = window.SchedulerDynamic || {};
  var prevOnUpdate = window.SchedulerDynamic.onSimulationUpdate;
  window.SchedulerDynamic.onSimulationUpdate = function (snapshot) {
    if (typeof prevOnUpdate === "function") {
      prevOnUpdate(snapshot);
    }
    renderSingleRating(snapshot);
  };

  if (window.lastSimulationSnapshot) {
    renderSingleRating(window.lastSimulationSnapshot);
  }
})();
