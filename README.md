# 🚨 CrisisNet — Smart Disaster Response & Relief Coordination System

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

> A real-time disaster response and relief coordination platform powered by AI triage, interactive mapping, and live resource tracking.

---

## 🎯 Problem Statement

During natural disasters — floods, earthquakes, cyclones — relief operations suffer from:
- Poor coordination between multiple agencies
- Delayed response due to unclear incident priority
- Resource misallocation (supplies sent to wrong zones)
- No unified visibility of volunteers, inventory, and ongoing incidents

**CrisisNet** solves this with a single command-center interface for all relief stakeholders.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ Live Incident Map | Real-time map showing all active disasters with severity heatmaps |
| 📋 Incident Reporting | Field workers submit new incidents instantly |
| 🤖 AI Priority Engine | Scores each incident 0–100 using 6 weighted parameters |
| 👥 Volunteer Management | Track deployment status, skills, and field locations |
| 📦 Inventory Tracker | Monitor relief supplies with allocation percentages |
| 🔔 Live Alert Feed | Real-time ticker of critical updates and field dispatches |
| 📊 Operations Dashboard | KPI summary of all active operations |

---

## 🏗️ Project Structure

```
crisisnet/
├── frontend/
│   ├── index.html
│   └── src/
│       ├── App.jsx          # Main React application
│       ├── main.jsx
│       └── index.css
├── package.json
├── vite.config.js
├── DisasterReliefSystem.jsx # Original single-file component
└── README.md
```

---

## 🤖 AI Priority Scoring

The triage engine uses a weighted composite scoring system:

```python
FEATURE_WEIGHTS = {
    "victim_count":          0.30,
    "severity_level":        0.25,
    "response_time_hours":   0.20,
    "resource_proximity":    0.12,
    "weather_forecast":      0.08,
    "aftershock_surge_risk": 0.05,
}
```

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/Vikashsingh990/Crisisnet.git
cd Crisisnet

# Install dependencies (from project root)
npm install

# Start the dev server
npm run dev
```

Open **http://localhost:5173/** in your browser.

### Production build

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Canvas API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **ML Engine:** Python, scikit-learn, FastAPI
- **Alerts:** Twilio (SMS), Nodemailer (Email)

---

## 🗓️ Roadmap

- [x] Real-time incident dashboard
- [x] AI-based priority ranking
- [x] Volunteer & inventory management
- [x] Live alert system
- [ ] Mobile app (React Native)
- [ ] Offline PWA mode for low-connectivity zones
- [ ] Integration with NDRF disaster management APIs

---

## 👤 Author

**Vikash Singh**
[GitHub](https://github.com/Vikashsingh990)

---

*"When every second counts, coordination saves lives."*
