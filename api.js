/**
 * §42c Wirtschaftlichkeitsrechner API Client + Demo-Daten
 */
var CERNION_CONFIG_KEY = 'cernion.api.config';

// --- Stadtkämmerer-Szenario: 50-WE-MFH mit PV ---
var DEMO_SCENARIOS = [
  { id: "szenario-a", name: "Basis (30 kWp Dach)", we: 50, pvKw: 30, strompreisCt: 32, eegVerguetungCt: 8.2, jahresertragKwh: 31500, gesamtInvest: 45000, laufzeitJahre: 20, zinsSatz: 3.5, wpAnzahl: 25, wpVerbrauchKwh: 75000 },
  { id: "szenario-b", name: "Erweitert (60 kWp Carport)", we: 50, pvKw: 60, strompreisCt: 32, eegVerguetungCt: 8.2, jahresertragKwh: 63000, gesamtInvest: 85000, laufzeitJahre: 20, zinsSatz: 3.5, wpAnzahl: 50, wpVerbrauchKwh: 150000 },
  { id: "szenario-c", name: "Premium (100 kWp + Speicher)", we: 50, pvKw: 100, strompreisCt: 32, eegVerguetungCt: 8.2, jahresertragKwh: 105000, gesamtInvest: 165000, laufzeitJahre: 20, zinsSatz: 3.5, wpAnzahl: 50, wpVerbrauchKwh: 150000 }
];

function berechneWirtschaftlichkeit(s) {
  var jahresVerbrauchKwh = s.we * 3500 + s.wpVerbrauchKwh;
  var eigenverbrauchKwh = Math.min(s.jahresertragKwh, jahresVerbrauchKwh * 0.65);
  var ueberschussKwh = Math.max(0, s.jahresertragKwh - eigenverbrauchKwh);
  var ersparnisEigen = eigenverbrauchKwh * s.strompreisCt / 100;
  var eegEinnahmen = ueberschussKwh * s.eegVerguetungCt / 100;
  var jahresErloes = ersparnisEigen + eegEinnahmen;
  var annuitaetFaktor = (s.zinsSatz / 100 * Math.pow(1 + s.zinsSatz / 100, s.laufzeitJahre)) / (Math.pow(1 + s.zinsSatz / 100, s.laufzeitJahre) - 1);
  var annuitaet = s.gesamtInvest * annuitaetFaktor;
  var jahresUeberschuss = jahresErloes - annuitaet;
  var kapitalwert = jahresUeberschuss * ((1 - Math.pow(1 + s.zinsSatz / 100, -s.laufzeitJahre)) / (s.zinsSatz / 100));
  var amortisation = s.gesamtInvest / jahresErloes;
  var eigenverbrauchsQuote = s.jahresertragKwh > 0 ? (eigenverbrauchKwh / s.jahresertragKwh * 100) : 0;

  return {
    szenarioId: s.id, szenarioName: s.name, jahresVerbrauchKwh: jahresVerbrauchKwh,
    eigenverbrauchKwh: eigenverbrauchKwh, eigenverbrauchsQuote: eigenverbrauchsQuote,
    ueberschussKwh: ueberschussKwh, ersparnisEigen: ersparnisEigen,
    eegEinnahmen: eegEinnahmen, jahresErloes: jahresErloes,
    gesamtInvest: s.gesamtInvest, annuitaet: annuitaet,
    jahresUeberschuss: jahresUeberschuss, kapitalwert: kapitalwert,
    amortisation: amortisation, laufzeitJahre: s.laufzeitJahre,
    we: s.we, pvKw: s.pvKw, strompreisCt: s.strompreisCt
  };
}

var DEMO_ERGEBNISSE = DEMO_SCENARIOS.map(berechneWirtschaftlichkeit);

class CernionAPI {
  constructor() {
    this.config = this.loadConfig();
    this.config.baseUrl = (this.config.baseUrl || 'https://api.cernion.de/').replace(/\/api\/$/, '');
  }
  loadConfig() {
    try {
      var raw = localStorage.getItem(CERNION_CONFIG_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { baseUrl: 'https://api.cernion.de/', tenantId: 'agentic-hackathon', token: '' };
  }
  saveConfig(cfg) {
    for (var k in cfg) this.config[k] = cfg[k];
    localStorage.setItem(CERNION_CONFIG_KEY, JSON.stringify(this.config));
  }
  get headers() {
    var h = { 'Content-Type': 'application/json', 'x-tenant-id': this.config.tenantId };
    if (this.config.token) h['Authorization'] = 'Bearer ' + this.config.token;
    return h;
  }
  async get(endpoint) {
    try {
      var res = await fetch(this.config.baseUrl + endpoint, { headers: this.headers });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    } catch (e) { e.isCORS = e.message.indexOf('Failed') >= 0; throw e; }
  }
  async getScenarios() {
    // Endpoint /finance/mieterstrom/scenarios does not exist in Cernion API.
    // This tool computes economics client-side; returning demo data only.
    return { scenarios: DEMO_SCENARIOS, results: DEMO_ERGEBNISSE };
  }
}

var api = new CernionAPI();
