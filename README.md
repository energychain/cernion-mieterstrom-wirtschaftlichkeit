# 💰 §42c Wirtschaftlichkeitsrechner

> **Agentic-Hackathon Lauf #6** — UI-Tool für Stadtkämmerer zur Prüfung kommunaler Mieterstrom-Investitionen.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-GitHub_Pages-e8b339)](https://energychain.github.io/cernion-mieterstrom-wirtschaftlichkeit)
[![Cernion](https://img.shields.io/badge/Powered_by-Cernion_a²mdm-16213e)](https://github.com/energychain/cernion-energy-tools)

## 🎯 Der Use Case

**Medien-Anker:** Kommunen prüfen, ob Mieterstrom-Gemeinschaften finanziell tragbar sind — vor allem bei Neubauten mit PV-Pflicht.

> **„Als Stadtkämmerer muss ich vor der Bauausschuss-Sitzung schnell prüfen: Lohnt sich ein 30/60/100 kWp Mieterstrom-Modell für unser 50-WE-MFH? Was ist der Kapitalwert, die Amortisation und die Eigenverbrauchsquote?“**

## 💻 Was das Tool zeigt

| Feature | Beschreibung |
|---------|-------------|
| **3 Szenarien** | Basis (30 kWp), Erweitert (60 kWp), Premium (100 kWp + Speicher) |
| **Rentabilitäts-KPI** | Jahresüberschuss, Kapitalwert, Amortisation, Eigenverbrauchsquote |
| **Investition vs. Kapitalwert** | Gestapelte Balken über 20 Jahre Laufzeit |
| **Amortisationsdauer** | Vergleich der 3 Szenarien |
| **§42c Hinweis** | Regulatorischer Kontext für kommunale Entscheidungsträger |

## 🏗 Technischer Stack

HTML5 + CSS3 + ES6 + Pico.css + Chart.js + Cernion a²mdm API

## 🚀 Schnellstart

👉 **[energychain.github.io/cernion-mieterstrom-wirtschaftlichkeit](https://energychain.github.io/cernion-mieterstrom-wirtschaftlichkeit)**

## 💡 Der Cernion-Mehrwert

| Ohne Cernion | Mit Cernion a²mdm |
|-------------|-------------------|
| Manuelle Excel-Kalkulation mit statischen Annahmen | **Dynamische Berechnung** aus realen Zeitreihen (EDM) |
| Keine Einbindung von EEG-Vergütung | **Automatische Vergütungsberechnung** nach aktuellem Stand |
| Keine Tenant-isolierte Szenarienverwaltung | **Pro Quartier/Gemeinde isoliert** — keine Datenvermischung |

## 📊 Demo-Daten

| Szenario | PV | Invest | Kapitalwert | Amortisation | Status |
|----------|-----|--------|-------------|--------------|--------|
| Basis (30 kWp) | 30 kWp | 45.000 € | ~8.500 € | ~12 Jahre | 🟡 knapp |
| Erweitert (60 kWp) | 60 kWp | 85.000 € | ~42.000 € | ~9 Jahre | 🟢 rentabel |
| Premium (100 kWp + Speicher) | 100 kWp | 165.000 € | ~71.000 € | ~10 Jahre | 🟢 rentabel |

## 📄 Lizenz

AGPL-3.0

## 👤 Autor

**Cernion Agentic Hackathon 2026** — Thorsten Zörner & Hermes Agent.  
Betrieben von [STROMDAO GmbH](https://stromdao.com).
