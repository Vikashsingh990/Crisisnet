import { useState, useEffect, useRef } from "react";

const INCIDENTS = [
  { id: 1, type: "Flood", location: "Sector 7, Riverbank", lat: 28.61, lng: 77.21, severity: "critical", reported: "2 min ago", victims: 134, status: "active", description: "Rising water levels, 3 buildings submerged." },
  { id: 2, type: "Earthquake", location: "Old City District", lat: 28.63, lng: 77.24, severity: "high", reported: "18 min ago", victims: 67, status: "responding", description: "Magnitude 5.4, structural collapses reported." },
  { id: 3, type: "Fire", location: "Industrial Zone B", lat: 28.59, lng: 77.19, severity: "medium", reported: "45 min ago", victims: 12, status: "contained", description: "Chemical fire, toxic fumes spreading." },
  { id: 4, type: "Cyclone", location: "Coastal Ward 11", lat: 28.65, lng: 77.27, severity: "critical", reported: "1 hr ago", victims: 280, status: "active", description: "Category 3 cyclone making landfall." },
  { id: 5, type: "Landslide", location: "Hill Station, NH-44", lat: 28.57, lng: 77.16, severity: "high", reported: "3 hrs ago", victims: 45, status: "responding", description: "Road blocked, 6 vehicles trapped." },
];

const VOLUNTEERS = [
  { id: 1, name: "Arjun Sharma", role: "Medical", status: "deployed", location: "Sector 7", skills: ["First Aid", "Triage"], contact: "+91 98765 43210" },
  { id: 2, name: "Priya Nair", role: "Logistics", status: "available", location: "Base Camp", skills: ["Supply Chain", "Driving"], contact: "+91 87654 32109" },
  { id: 3, name: "Ravi Kumar", role: "Search & Rescue", status: "deployed", location: "Old City", skills: ["Rope Rescue", "SCUBA"], contact: "+91 76543 21098" },
  { id: 4, name: "Sunita Devi", role: "Communication", status: "available", location: "Control Room", skills: ["HAM Radio", "IT"], contact: "+91 65432 10987" },
  { id: 5, name: "Mohammed Ali", role: "Medical", status: "resting", location: "Field Hospital", skills: ["Surgery", "ICU"], contact: "+91 54321 09876" },
  { id: 6, name: "Kavya Reddy", role: "Food & Shelter", status: "deployed", location: "Coastal Ward", skills: ["Cooking", "Camp Setup"], contact: "+91 43210 98765" },
];

const INVENTORY = [
  { id: 1, item: "Water Packets (1L)", qty: 4200, unit: "pcs", allocated: 1800, category: "Water", critical: true },
  { id: 2, item: "Emergency Food Kits", qty: 850, unit: "kits", allocated: 620, category: "Food", critical: true },
  { id: 3, item: "Medical Aid Kits", qty: 120, unit: "kits", allocated: 95, category: "Medical", critical: true },
  { id: 4, item: "Rescue Boats", qty: 14, unit: "units", allocated: 11, category: "Equipment", critical: false },
  { id: 5, item: "Tents (6-person)", qty: 230, unit: "pcs", allocated: 180, category: "Shelter", critical: false },
  { id: 6, item: "Blankets", qty: 1600, unit: "pcs", allocated: 900, category: "Shelter", critical: false },
  { id: 7, item: "Oxygen Cylinders", qty: 45, unit: "units", allocated: 38, category: "Medical", critical: true },
  { id: 8, item: "Generators", qty: 18, unit: "units", allocated: 14, category: "Equipment", critical: false },
];

const ALERTS = [
  { id: 1, time: "10:42 AM", msg: "Critical: Flash flood alert issued for Sector 7 & 8", type: "critical" },
  { id: 2, time: "10:28 AM", msg: "Team Alpha deployed to Old City District", type: "info" },
  { id: 3, time: "10:15 AM", msg: "Oxygen cylinders running low — 7 units remaining", type: "warning" },
  { id: 4, time: "09:58 AM", msg: "Cyclone trajectory updated — wind speed 145 km/h", type: "critical" },
  { id: 5, time: "09:40 AM", msg: "Relief camp at Stadium capacity reached (2,000/2,000)", type: "warning" },
  { id: 6, time: "09:22 AM", msg: "Rescue team successfully extracted 12 survivors", type: "success" },
];

const AI_PRIORITIES = [
  { id: 4, score: 97, reason: "Largest victim count + active storm + coastal vulnerability", action: "Deploy 3 rescue boats + medical team immediately" },
  { id: 1, score: 91, reason: "Structural risk + 134 trapped + no drainage relief", action: "Evacuate lower sectors, deploy pumping teams" },
  { id: 2, score: 78, reason: "Aftershock risk high, trapped survivors likely", action: "Send search & rescue with thermal imaging" },
  { id: 5, score: 64, reason: "Access blocked, risk of further slides", action: "Helicopter evacuation + road clearance crew" },
  { id: 3, score: 42, reason: "Fire contained, toxic risk managed", action: "Maintain hazmat monitoring, no escalation" },
];

const SEVERITY_COLOR = { critical: "#ff3b30", high: "#ff9500", medium: "#ffd60a", low: "#34c759" };
const SEVERITY_BG = { critical: "rgba(255,59,48,0.12)", high: "rgba(255,149,0,0.12)", medium: "rgba(255,214,10,0.1)", low: "rgba(52,199,89,0.1)" };
const STATUS_COLOR = { active: "#ff3b30", responding: "#ff9500", contained: "#34c759", available: "#34c759", deployed: "#ff9500", resting: "#636366" };
const ALERT_COLOR = { critical: "#ff3b30", warning: "#ff9500", info: "#0a84ff", success: "#34c759" };

const Icon = ({ name, size = 16 }) => {
  const icons = {
    alert: "M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z",
    map: "M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z",
    users: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    box: "M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-9 9H7v-2h4v2zm6-4H7v-2h10v2zM4 3h16v2H4z",
    ai: "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-5h2v2h-2zm0-8h2v6h-2z",
    bell: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
    dash: "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    plus: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
    x: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ display: "inline-block", flexShrink: 0 }}>
      <path d={icons[name] || icons.alert} />
    </svg>
  );
};

const AnimatedNum = ({ value }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 40);
    const t = setInterval(() => {
      start = Math.min(start + step, value);
      setDisplay(start);
      if (start >= value) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [value]);
  return <span>{display.toLocaleString()}</span>;
};

const MiniMap = ({ incidents }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0a0f1a";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(0,180,255,0.07)";
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.strokeStyle = "rgba(0,180,255,0.15)"; ctx.lineWidth = 2;
    [[0, H / 2, W, H / 2], [W / 2, 0, W / 2, H], [W * 0.2, 0, W * 0.8, H], [0, H * 0.3, W, H * 0.7]].forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    });
    incidents.forEach((inc) => {
      const px = ((inc.lng - 77.14) / 0.16) * W;
      const py = ((28.67 - inc.lat) / 0.12) * H;
      const color = SEVERITY_COLOR[inc.severity];
      const grad = ctx.createRadialGradient(px, py, 2, px, py, 22);
      grad.addColorStop(0, color + "55");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#e8eaf0";
      ctx.font = "bold 9px monospace";
      ctx.fillText(inc.type, px + 9, py - 5);
    });
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "9px monospace";
    ctx.fillText("LIVE INCIDENT MAP", 8, 14);
  }, [incidents]);
  return <canvas ref={canvasRef} width={480} height={280} style={{ width: "100%", height: "100%", borderRadius: 8, display: "block" }} />;
};

const Bar = ({ val, max, color }) => (
  <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 4, height: 6, overflow: "hidden", flex: 1 }}>
    <div style={{ width: `${(val / max) * 100}%`, height: "100%", background: color, borderRadius: 4, transition: "width 1s ease" }} />
  </div>
);

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [reportModal, setReportModal] = useState(false);
  const [newReport, setNewReport] = useState({ type: "Flood", location: "", severity: "high", description: "" });
  const [incidents, setIncidents] = useState(INCIDENTS);
  const [filterSev, setFilterSev] = useState("all");
  const [pulse, setPulse] = useState(false);
  const [aiTyping, setAiTyping] = useState(true);
  const [volFilter, setVolFilter] = useState("all");
  const [alertCount, setAlertCount] = useState(3);

  useEffect(() => { const i = setInterval(() => setPulse(p => !p), 1200); return () => clearInterval(i); }, []);
  useEffect(() => { const t = setTimeout(() => setAiTyping(false), 2400); return () => clearTimeout(t); }, []);

  const totalVictims = incidents.reduce((s, i) => s + i.victims, 0);
  const criticalCount = incidents.filter(i => i.severity === "critical").length;
  const availVols = VOLUNTEERS.filter(v => v.status === "available").length;
  const inventoryCritical = INVENTORY.filter(i => i.critical && (i.qty - i.allocated) < 30).length;
  const filteredIncidents = filterSev === "all" ? incidents : incidents.filter(i => i.severity === filterSev);
  const filteredVols = volFilter === "all" ? VOLUNTEERS : VOLUNTEERS.filter(v => v.status === volFilter);

  const submitReport = () => {
    if (!newReport.location) return;
    const newInc = { id: incidents.length + 1, ...newReport, lat: 28.6 + Math.random() * 0.08, lng: 77.16 + Math.random() * 0.12, reported: "Just now", victims: Math.floor(Math.random() * 80) + 5, status: "active" };
    setIncidents(p => [newInc, ...p]);
    setAlertCount(c => c + 1);
    setReportModal(false);
    setNewReport({ type: "Flood", location: "", severity: "high", description: "" });
  };

  const S = styles;

  return (
    <div style={S.root}>
      <div style={S.noise} />
      <header style={S.header}>
        <div style={S.headerLeft}>
          <div style={{ ...S.statusDot, background: pulse ? "#ff3b30" : "#c0392b" }} />
          <span style={S.logoText}>CRISIS<span style={{ color: "#ff3b30" }}>NET</span></span>
          <span style={S.logoSub}>Disaster Response & Relief</span>
        </div>
        <nav style={S.nav}>
          {[
            { key: "dashboard", icon: "dash", label: "Dashboard" },
            { key: "map", icon: "map", label: "Live Map" },
            { key: "incidents", icon: "alert", label: "Incidents" },
            { key: "volunteers", icon: "users", label: "Volunteers" },
            { key: "inventory", icon: "box", label: "Inventory" },
            { key: "ai", icon: "ai", label: "AI Priority" },
          ].map(({ key, icon, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{ ...S.navBtn, ...(tab === key ? S.navBtnActive : {}) }}>
              <Icon name={icon} size={14} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div style={S.headerRight}>
          <button style={S.alertBtn} onClick={() => setTab("dashboard")}>
            <Icon name="bell" size={16} />
            {alertCount > 0 && <span style={S.badge}>{alertCount}</span>}
          </button>
          <button style={S.reportBtn} onClick={() => setReportModal(true)}>
            <Icon name="plus" size={14} /> Report Incident
          </button>
        </div>
      </header>

      <div style={S.ticker}>
        <span style={S.tickerLabel}>LIVE</span>
        <div style={S.tickerScroll}>
          {ALERTS.map((a) => (
            <span key={a.id} style={{ color: ALERT_COLOR[a.type], marginRight: 48 }}>
              [{a.time}] {a.msg}
            </span>
          ))}
        </div>
      </div>

      <main style={S.main}>
        {tab === "dashboard" && (
          <div style={S.fadeIn}>
            <div style={S.sectionTitle}>Operations Overview</div>
            <div style={S.statsRow}>
              {[
                { label: "Total Affected", value: totalVictims, icon: "users", color: "#ff3b30", sub: `${criticalCount} critical zones` },
                { label: "Active Incidents", value: incidents.filter(i => i.status === "active").length, icon: "alert", color: "#ff9500", sub: "Requires immediate response" },
                { label: "Volunteers Ready", value: availVols, icon: "users", color: "#34c759", sub: `${VOLUNTEERS.length} total registered` },
                { label: "Supply Alerts", value: inventoryCritical, icon: "box", color: "#ffd60a", sub: "Critical items low" },
              ].map(({ label, value, icon, color, sub }) => (
                <div key={label} style={S.statCard}>
                  <div style={{ ...S.statIcon, background: color + "22", color }}><Icon name={icon} size={20} /></div>
                  <div>
                    <div style={{ ...S.statValue, color }}><AnimatedNum value={value} /></div>
                    <div style={S.statLabel}>{label}</div>
                    <div style={S.statSub}>{sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={S.twoCol}>
              <div style={S.card}>
                <div style={S.cardHeader}><Icon name="map" size={14} /> Live Incident Map</div>
                <div style={{ height: 280 }}><MiniMap incidents={incidents} /></div>
                <div style={S.mapLegend}>
                  {Object.entries(SEVERITY_COLOR).map(([k, v]) => (
                    <span key={k} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#8b9ab0" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: v, display: "inline-block" }} />{k}
                    </span>
                  ))}
                </div>
              </div>
              <div style={S.card}>
                <div style={S.cardHeader}><Icon name="bell" size={14} /> Live Alerts Feed</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ALERTS.map((a) => (
                    <div key={a.id} style={{ ...S.alertRow, borderLeft: `3px solid ${ALERT_COLOR[a.type]}` }}>
                      <span style={{ color: ALERT_COLOR[a.type], fontSize: 10, fontWeight: 700, fontFamily: "monospace" }}>{a.time}</span>
                      <span style={{ color: "#c8d0dc", fontSize: 12 }}>{a.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={S.card}>
              <div style={S.cardHeader}><Icon name="alert" size={14} /> Recent Incidents</div>
              <table style={S.table}>
                <thead><tr style={S.thead}>{["Type", "Location", "Victims", "Severity", "Status", "Reported"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {incidents.slice(0, 5).map(inc => (
                    <tr key={inc.id} style={S.tr}>
                      <td style={S.td}>{inc.type}</td>
                      <td style={S.td}>{inc.location}</td>
                      <td style={{ ...S.td, color: "#ff6b6b", fontWeight: 700 }}>{inc.victims}</td>
                      <td style={S.td}><span style={{ ...S.chip, background: SEVERITY_BG[inc.severity], color: SEVERITY_COLOR[inc.severity] }}>{inc.severity}</span></td>
                      <td style={S.td}><span style={{ ...S.chip, background: STATUS_COLOR[inc.status] + "22", color: STATUS_COLOR[inc.status] }}>{inc.status}</span></td>
                      <td style={{ ...S.td, color: "#636e7e", fontFamily: "monospace" }}>{inc.reported}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "map" && (
          <div style={S.fadeIn}>
            <div style={S.sectionTitle}>Live Incident Map</div>
            <div style={S.card}>
              <div style={S.cardHeader}><Icon name="map" size={14} /> Real-Time Geographic Visualization</div>
              <div style={{ height: 460 }}><MiniMap incidents={incidents} /></div>
              <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
                {incidents.map(inc => (
                  <div key={inc.id} style={{ ...S.incidentBadge, borderColor: SEVERITY_COLOR[inc.severity] + "55" }}>
                    <span style={{ color: SEVERITY_COLOR[inc.severity], fontWeight: 700 }}>●</span>
                    <span style={{ color: "#c8d0dc", fontSize: 12 }}>{inc.type} — {inc.location}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={S.twoCol}>
              {incidents.map(inc => (
                <div key={inc.id} style={{ ...S.card, borderLeft: `3px solid ${SEVERITY_COLOR[inc.severity]}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#e8eaf0", marginBottom: 4 }}>{inc.type}</div>
                      <div style={{ fontSize: 12, color: "#8b9ab0", marginBottom: 8 }}>{inc.location}</div>
                    </div>
                    <span style={{ ...S.chip, background: SEVERITY_BG[inc.severity], color: SEVERITY_COLOR[inc.severity] }}>{inc.severity}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#c0c8d4", marginBottom: 8 }}>{inc.description}</div>
                  <div style={{ display: "flex", gap: 16 }}>
                    <span style={{ fontSize: 11, color: "#8b9ab0" }}>👥 {inc.victims} affected</span>
                    <span style={{ fontSize: 11, color: STATUS_COLOR[inc.status] }}>● {inc.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "incidents" && (
          <div style={S.fadeIn}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={S.sectionTitle}>Incident Management</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["all", "critical", "high", "medium"].map(s => (
                  <button key={s} onClick={() => setFilterSev(s)} style={{ ...S.filterBtn, ...(filterSev === s ? { background: "#ff3b30", color: "#fff", borderColor: "#ff3b30" } : {}) }}>{s}</button>
                ))}
                <button style={S.reportBtn} onClick={() => setReportModal(true)}><Icon name="plus" size={14} /> New</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredIncidents.map(inc => (
                <div key={inc.id} style={{ ...S.card, borderLeft: `4px solid ${SEVERITY_COLOR[inc.severity]}`, display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 16, alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#e8eaf0" }}>{inc.type}</div>
                    <div style={{ fontSize: 12, color: "#8b9ab0", marginTop: 3 }}>{inc.location}</div>
                    <div style={{ fontSize: 11, color: "#636e7e", marginTop: 3, fontFamily: "monospace" }}>ID #{inc.id} · {inc.reported}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#c0c8d4" }}>{inc.description}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ ...S.chip, background: SEVERITY_BG[inc.severity], color: SEVERITY_COLOR[inc.severity] }}>{inc.severity}</span>
                    <span style={{ ...S.chip, background: STATUS_COLOR[inc.status] + "22", color: STATUS_COLOR[inc.status] }}>{inc.status}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#ff6b6b" }}>{inc.victims}</div>
                    <div style={{ fontSize: 10, color: "#636e7e" }}>AFFECTED</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "volunteers" && (
          <div style={S.fadeIn}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={S.sectionTitle}>Volunteer Management</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["all", "available", "deployed", "resting"].map(s => (
                  <button key={s} onClick={() => setVolFilter(s)} style={{ ...S.filterBtn, ...(volFilter === s ? { background: "#0a84ff", color: "#fff", borderColor: "#0a84ff" } : {}) }}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {filteredVols.map(v => (
                <div key={v.id} style={{ ...S.card, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, right: 0, width: 3, height: "100%", background: STATUS_COLOR[v.status] }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e8eaf0" }}>{v.name}</div>
                      <div style={{ fontSize: 12, color: "#0a84ff", marginTop: 2 }}>{v.role}</div>
                    </div>
                    <span style={{ ...S.chip, background: STATUS_COLOR[v.status] + "22", color: STATUS_COLOR[v.status], fontSize: 10 }}>{v.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#636e7e", marginBottom: 8 }}>📍 {v.location}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    {v.skills.map(sk => <span key={sk} style={{ ...S.chip, background: "rgba(10,132,255,0.1)", color: "#60a5fa", fontSize: 10 }}>{sk}</span>)}
                  </div>
                  <div style={{ fontSize: 11, color: "#4b5563", fontFamily: "monospace" }}>{v.contact}</div>
                </div>
              ))}
            </div>
            <div style={{ ...S.card, marginTop: 20 }}>
              <div style={S.cardHeader}><Icon name="users" size={14} /> Volunteer Distribution</div>
              <div style={{ display: "flex", gap: 24 }}>
                {["available", "deployed", "resting"].map(status => {
                  const count = VOLUNTEERS.filter(v => v.status === status).length;
                  return (
                    <div key={status} style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#8b9ab0", textTransform: "capitalize" }}>{status}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: STATUS_COLOR[status] }}>{count}</span>
                      </div>
                      <Bar val={count} max={VOLUNTEERS.length} color={STATUS_COLOR[status]} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "inventory" && (
          <div style={S.fadeIn}>
            <div style={S.sectionTitle}>Relief Inventory Tracker</div>
            <div style={S.statsRow}>
              {["Water", "Food", "Medical", "Equipment", "Shelter"].map(cat => {
                const items = INVENTORY.filter(i => i.category === cat);
                const total = items.reduce((s, i) => s + i.qty, 0);
                const used = items.reduce((s, i) => s + i.allocated, 0);
                return (
                  <div key={cat} style={S.statCard}>
                    <div>
                      <div style={{ fontSize: 12, color: "#8b9ab0", marginBottom: 4 }}>{cat}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#e8eaf0", marginBottom: 8 }}>{total - used}</div>
                      <Bar val={used} max={total} color={used / total > 0.85 ? "#ff3b30" : "#0a84ff"} />
                      <div style={{ fontSize: 10, color: "#636e7e", marginTop: 4 }}>{Math.round((used / total) * 100)}% allocated</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={S.card}>
              <div style={S.cardHeader}><Icon name="box" size={14} /> Detailed Inventory</div>
              <table style={S.table}>
                <thead><tr style={S.thead}>{["Item", "Category", "Total", "Allocated", "Available", "Status"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {INVENTORY.map(item => {
                    const avail = item.qty - item.allocated;
                    const pct = item.allocated / item.qty;
                    const statusColor = pct > 0.9 ? "#ff3b30" : pct > 0.7 ? "#ff9500" : "#34c759";
                    return (
                      <tr key={item.id} style={S.tr}>
                        <td style={S.td}>{item.critical && <span style={{ color: "#ff3b30", fontSize: 10, marginRight: 5 }}>⚠</span>}{item.item}</td>
                        <td style={S.td}><span style={{ ...S.chip, background: "rgba(10,132,255,0.1)", color: "#60a5fa" }}>{item.category}</span></td>
                        <td style={S.td}>{item.qty.toLocaleString()} {item.unit}</td>
                        <td style={S.td}>{item.allocated.toLocaleString()}</td>
                        <td style={{ ...S.td, fontWeight: 700, color: statusColor }}>{avail.toLocaleString()}</td>
                        <td style={S.td}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Bar val={item.allocated} max={item.qty} color={statusColor} />
                            <span style={{ fontSize: 10, color: statusColor, minWidth: 32 }}>{Math.round(pct * 100)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "ai" && (
          <div style={S.fadeIn}>
            <div style={S.sectionTitle}>AI-Based Priority Ranking</div>
            <div style={{ ...S.card, borderColor: "#5e2ca5", marginBottom: 20, background: "rgba(94,44,165,0.08)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ ...S.statIcon, background: "#5e2ca5", color: "#c084fc", flexShrink: 0 }}><Icon name="ai" size={20} /></div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#c084fc", marginBottom: 6 }}>CRISISNET-AI · Triage Engine v2.4</div>
                  {aiTyping ? (
                    <div style={{ color: "#8b9ab0", fontSize: 12 }}>Analyzing {incidents.length} incidents across 6 parameters…▌</div>
                  ) : (
                    <div style={{ color: "#a0b0c0", fontSize: 12 }}>Analysis complete. {incidents.length} incidents ranked by composite risk score.</div>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {AI_PRIORITIES.map((p, idx) => {
                const inc = incidents.find(i => i.id === p.id);
                if (!inc) return null;
                const scoreColor = p.score >= 90 ? "#ff3b30" : p.score >= 70 ? "#ff9500" : p.score >= 50 ? "#ffd60a" : "#34c759";
                return (
                  <div key={p.id} style={{ ...S.card, borderLeft: `4px solid ${scoreColor}`, display: "grid", gridTemplateColumns: "60px 1fr 1fr auto", gap: 20, alignItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 28, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{p.score}</div>
                      <div style={{ fontSize: 9, color: "#636e7e", textTransform: "uppercase" }}>Risk Score</div>
                      <div style={{ fontSize: 9, color: "#636e7e" }}>#{idx + 1} Priority</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e8eaf0" }}>{inc.type} — {inc.location}</div>
                      <div style={{ fontSize: 11, color: "#8b9ab0", marginTop: 4 }}>{p.reason}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#5e6d7e", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>Recommended Action</div>
                      <div style={{ fontSize: 12, color: "#c084fc" }}>{p.action}</div>
                    </div>
                    <div>
                      <span style={{ ...S.chip, background: SEVERITY_BG[inc.severity], color: SEVERITY_COLOR[inc.severity] }}>{inc.severity}</span>
                      <div style={{ marginTop: 6, fontSize: 11, color: "#ff6b6b", fontWeight: 700 }}>{inc.victims} victims</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {reportModal && (
        <div style={S.modalOverlay} onClick={() => setReportModal(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e8eaf0" }}>Report New Incident</div>
              <button onClick={() => setReportModal(false)} style={{ ...S.filterBtn, padding: "4px 8px" }}><Icon name="x" size={14} /></button>
            </div>
            {[
              { label: "Disaster Type", key: "type", type: "select", options: ["Flood", "Earthquake", "Fire", "Cyclone", "Landslide", "Tsunami"] },
              { label: "Location", key: "location", type: "text", placeholder: "Enter affected area..." },
              { label: "Severity", key: "severity", type: "select", options: ["critical", "high", "medium", "low"] },
              { label: "Description", key: "description", type: "textarea", placeholder: "Brief description..." },
            ].map(({ label, key, type, options, placeholder }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "#8b9ab0", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
                {type === "select" ? (
                  <select value={newReport[key]} onChange={e => setNewReport(p => ({ ...p, [key]: e.target.value }))} style={S.input}>
                    {options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : type === "textarea" ? (
                  <textarea value={newReport[key]} onChange={e => setNewReport(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} style={{ ...S.input, height: 80, resize: "none" }} />
                ) : (
                  <input type="text" value={newReport[key]} onChange={e => setNewReport(p => ({ ...p, [key]: e.target.value }))} placeholder={placeholder} style={S.input} />
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setReportModal(false)} style={S.filterBtn}>Cancel</button>
              <button onClick={submitReport} style={S.reportBtn}><Icon name="check" size={14} /> Submit Report</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Barlow:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060b14; }
        ::-webkit-scrollbar { width: 4px; background: #0d1626; }
        ::-webkit-scrollbar-thumb { background: #1e2d40; border-radius: 2px; }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes ticker { from{transform:translateX(100%)} to{transform:translateX(-100%)} }
      `}</style>
    </div>
  );
}

const styles = {
  root: { minHeight: "100vh", background: "#060b14", fontFamily: "'Barlow', sans-serif", color: "#e8eaf0", position: "relative", overflow: "hidden" },
  noise: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.4 },
  header: { position: "sticky", top: 0, zIndex: 100, background: "rgba(6,11,20,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,59,48,0.2)", display: "flex", alignItems: "center", gap: 24, padding: "0 24px", height: 56 },
  headerLeft: { display: "flex", alignItems: "center", gap: 10, minWidth: 180 },
  statusDot: { width: 8, height: 8, borderRadius: "50%", transition: "background 0.4s" },
  logoText: { fontSize: 18, fontWeight: 900, letterSpacing: "2px", fontFamily: "'Space Mono', monospace", color: "#e8eaf0" },
  logoSub: { fontSize: 10, color: "#4b5563", letterSpacing: "0.5px" },
  nav: { display: "flex", gap: 2, flex: 1 },
  navBtn: { display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, background: "transparent", border: "none", color: "#636e7e", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "'Barlow', sans-serif", transition: "all 0.15s" },
  navBtnActive: { background: "rgba(255,59,48,0.12)", color: "#ff3b30" },
  headerRight: { display: "flex", alignItems: "center", gap: 12 },
  alertBtn: { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 10px", color: "#e8eaf0", cursor: "pointer", position: "relative" },
  badge: { position: "absolute", top: -4, right: -4, background: "#ff3b30", color: "#fff", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 },
  reportBtn: { display: "flex", alignItems: "center", gap: 6, background: "#ff3b30", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  ticker: { background: "rgba(255,59,48,0.06)", borderBottom: "1px solid rgba(255,59,48,0.1)", display: "flex", alignItems: "center", overflow: "hidden", height: 30 },
  tickerLabel: { background: "#ff3b30", color: "#fff", fontSize: 10, fontWeight: 900, padding: "0 10px", height: "100%", display: "flex", alignItems: "center", letterSpacing: "2px", flexShrink: 0, fontFamily: "'Space Mono', monospace" },
  tickerScroll: { display: "flex", overflow: "hidden", flex: 1, animation: "ticker 40s linear infinite", whiteSpace: "nowrap", fontSize: 11, fontFamily: "'Space Mono', monospace", padding: "0 20px", alignItems: "center" },
  main: { padding: "24px", maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 1 },
  fadeIn: { animation: "fadeInUp 0.3s ease both" },
  sectionTitle: { fontSize: 20, fontWeight: 800, color: "#e8eaf0", marginBottom: 20, letterSpacing: "0.5px" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 20 },
  statCard: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px", display: "flex", gap: 14, alignItems: "flex-start", backdropFilter: "blur(4px)" },
  statIcon: { width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statValue: { fontSize: 26, fontWeight: 900, lineHeight: 1, fontFamily: "'Space Mono', monospace" },
  statLabel: { fontSize: 11, color: "#8b9ab0", marginTop: 3, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" },
  statSub: { fontSize: 10, color: "#4b5563", marginTop: 2 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  card: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "16px", backdropFilter: "blur(4px)", marginBottom: 0 },
  cardHeader: { display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, color: "#8b9ab0", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.8px" },
  mapLegend: { display: "flex", gap: 16, marginTop: 10, flexWrap: "wrap" },
  alertRow: { padding: "8px 10px", background: "rgba(255,255,255,0.02)", borderRadius: "0 6px 6px 0", display: "flex", flexDirection: "column", gap: 3 },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { borderBottom: "1px solid rgba(255,255,255,0.07)" },
  th: { padding: "6px 10px", textAlign: "left", fontSize: 10, color: "#4b5563", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" },
  tr: { borderBottom: "1px solid rgba(255,255,255,0.04)" },
  td: { padding: "10px", fontSize: 12, color: "#c8d0dc" },
  chip: { display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "capitalize" },
  incidentBadge: { display: "flex", alignItems: "center", gap: 6, border: "1px solid", borderRadius: 6, padding: "5px 10px" },
  filterBtn: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 12px", color: "#8b9ab0", cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "'Barlow', sans-serif", textTransform: "capitalize" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#0d1626", border: "1px solid rgba(255,59,48,0.3)", borderRadius: 16, padding: 24, width: 480, maxWidth: "95vw", boxShadow: "0 25px 60px rgba(0,0,0,0.7)" },
  input: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 12px", color: "#e8eaf0", fontSize: 13, fontFamily: "'Barlow', sans-serif", outline: "none" },
};
