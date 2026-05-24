"""
CPU Scheduler — static site + real-time system monitor API.
Run: python server.py  →  http://localhost:8080
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

from flask import Flask, jsonify, send_from_directory

ROOT = Path(__file__).resolve().parent

app = Flask(__name__, static_folder=str(ROOT), static_url_path="")

try:
    import psutil

    PSUTIL_AVAILABLE = True
except ImportError:
    PSUTIL_AVAILABLE = False


def _safe_cpu_percent(interval: float = 0.1) -> float:
    if not PSUTIL_AVAILABLE:
        return 0.0
    return psutil.cpu_percent(interval=interval)


@app.route("/api/system/health")
def health():
    return jsonify({
        "ok": True,
        "psutil": PSUTIL_AVAILABLE,
        "platform": sys.platform,
    })


@app.route("/api/system/stats")
def system_stats():
    if not PSUTIL_AVAILABLE:
        return jsonify({
            "error": "psutil not installed",
            "hint": "Run: pip install -r requirements.txt",
            "cpu_percent": 0,
            "cpu_per_core": [],
            "cpu_count": os.cpu_count() or 1,
            "memory_percent": 0,
            "memory_used_gb": 0,
            "memory_total_gb": 0,
        }), 503

    per_core = psutil.cpu_percent(interval=0.1, percpu=True)
    vm = psutil.virtual_memory()

    load_avg = None
    if hasattr(os, "getloadavg"):
        try:
            load_avg = list(os.getloadavg())
        except OSError:
            load_avg = None

    return jsonify({
        "cpu_percent": round(sum(per_core) / len(per_core) if per_core else _safe_cpu_percent(), 1),
        "cpu_per_core": [round(x, 1) for x in per_core],
        "cpu_count": psutil.cpu_count(logical=True) or 1,
        "cpu_count_physical": psutil.cpu_count(logical=False),
        "memory_percent": round(vm.percent, 1),
        "memory_used_gb": round(vm.used / (1024 ** 3), 2),
        "memory_total_gb": round(vm.total / (1024 ** 3), 2),
        "memory_available_gb": round(vm.available / (1024 ** 3), 2),
        "load_avg": load_avg,
    })


@app.route("/api/system/processes")
def top_processes():
    if not PSUTIL_AVAILABLE:
        return jsonify({"processes": []}), 503

    procs = []
    for p in psutil.process_iter(["pid", "name", "cpu_percent", "memory_percent", "status"]):
        try:
            info = p.info
            cpu = info.get("cpu_percent") or 0
            if cpu is None:
                cpu = 0
            procs.append({
                "pid": info.get("pid"),
                "name": info.get("name") or "unknown",
                "cpu_percent": round(float(cpu), 1),
                "memory_percent": round(float(info.get("memory_percent") or 0), 1),
                "status": info.get("status") or "unknown",
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue

    procs.sort(key=lambda x: x["cpu_percent"], reverse=True)
    return jsonify({"processes": procs[:12]})


@app.route("/")
def index():
    return send_from_directory(ROOT, "index.html")


@app.route("/<path:path>")
def static_files(path):
    full = ROOT / path
    if full.is_file():
        return send_from_directory(ROOT, path)
    html = ROOT / (path + ".html")
    if html.is_file():
        return send_from_directory(ROOT, path + ".html")
    return send_from_directory(ROOT, "index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    print(f"\n  CPU Scheduler server")
    print(f"  Open: http://localhost:{port}/index.html")
    print(f"  Monitor: http://localhost:{port}/backend/system-monitor.html")
    if not PSUTIL_AVAILABLE:
        print("  WARNING: Install psutil for real CPU data: pip install -r requirements.txt\n")
    else:
        print("  Real-time system monitor API enabled (/api/system/*)\n")
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
