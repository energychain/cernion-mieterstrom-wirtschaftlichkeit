/**
 * §42c Wirtschaftlichkeitsrechner — App Logic
 * Stadtkaemmerer-Tool fuer kommunale Mieterstrom-Investitionen
 */

var chartInstances = {};
var isDemoMode = false;

document.addEventListener('DOMContentLoaded', function() {
  initSettings();
  setupTabs();
  testConnection().then(function(connected) {
    if (!connected) {
      isDemoMode = true;
      var badge = document.getElementById('demo-badge');
      if (badge) badge.style.display = 'block';
    }
    loadDashboard();
  });
});

function testConnection() {
  return new Promise(function(resolve) {
    api.get('api/openapi.json').then(function() { resolve(true); }).catch(function() { resolve(false); });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('nav[aria-label="breadcrumb"] button').forEach(function(btn) {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabId) btn.classList.add('active');
  });
  document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
  var panel = document.getElementById(tabId);
  if (panel) panel.classList.add('active');
  if (tabId === 'dashboard') loadDashboard();
}

function setupTabs() {
  document.querySelectorAll('nav[aria-label="breadcrumb"] button').forEach(function(btn) {
    btn.addEventListener('click', function() { switchTab(btn.dataset.tab); });
  });
}

// ===== Dashboard =====
function loadDashboard() {
  showLoading(true);
  api.getScenarios().then(function(data) {
    renderSzenarien(data.results || []);
    renderVergleichChart(data.results || []);
    renderAmortisationChart(data.results || []);
    showLoading(false);
  }).catch(function() {
    renderSzenarien(DEMO_ERGEBNISSE);
    renderVergleichChart(DEMO_ERGEBNISSE);
    renderAmortisationChart(DEMO_ERGEBNISSE);
    showLoading(false);
  });
}

function renderSzenarien(results) {
  var container = document.getElementById('szenarien-cards');
  if (!container) return;
  container.innerHTML = '';

  results.forEach(function(r) {
    var rentabel = r.jahresUeberschuss > 0;
    var statusColor = rentabel ? '#2a8a2a' : '#d05050';
    var statusText = rentabel ? 'Rentabel' : 'Nicht rentabel';

    var card = document.createElement('article');
    card.className = 'szenario-card';
    card.innerHTML =
      '<h3>' + r.szenarioName + '</h3>' +
      '<div class="szenario-kpi" style="color:' + statusColor + '">' + statusText + '</div>' +
      '<div class="grid mini-kpi-grid">' +
      '<div><strong>PV-Leistung</strong><br>' + r.pvKw + ' kWp</div>' +
      '<div><strong>Investition</strong><br>' + r.gesamtInvest.toLocaleString('de-DE') + ' €</div>' +
      '<div><strong>Jahresüberschuss</strong><br>' + r.jahresUeberschuss.toFixed(0) + ' €</div>' +
      '<div><strong>Kapitalwert</strong><br>' + r.kapitalwert.toFixed(0) + ' €</div>' +
      '<div><strong>Amortisation</strong><br>' + r.amortisation.toFixed(1) + ' Jahre</div>' +
      '<div><strong>Eigenverbrauch</strong><br>' + r.eigenverbrauchsQuote.toFixed(1) + '%</div>' +
      '</div>' +
      '<table class="mini-table">' +
      '<tr><td>Jahresverbrauch</td><td>' + r.jahresVerbrauchKwh.toLocaleString('de-DE') + ' kWh</td></tr>' +
      '<tr><td>PV-Ertrag</td><td>' + r.szenarioId === 'szenario-a' ? '31.500' : (r.szenarioId === 'szenario-b' ? '63.000' : '105.000') + ' kWh</td></tr>' +
      '<tr><td>EEG-Einspeisevergütung</td><td>' + r.eegEinnahmen.toFixed(0) + ' €/Jahr</td></tr>' +
      '<tr><td>Ersparnis Eigenverbrauch</td><td>' + r.ersparnisEigen.toFixed(0) + ' €/Jahr</td></tr>' +
      '<tr><td>Annuität</td><td>' + r.annuitaet.toFixed(0) + ' €/Jahr</td></tr>' +
      '</table>';
    container.appendChild(card);
  });
}

function renderVergleichChart(results) {
  var canvas = document.getElementById('vergleich-chart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  if (chartInstances['vergleich']) chartInstances['vergleich'].destroy();

  chartInstances['vergleich'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: results.map(function(r) { return r.szenarioName; }),
      datasets: [
        { label: 'Investition (€)', data: results.map(function(r) { return r.gesamtInvest; }), backgroundColor: '#d05050' },
        { label: 'Kapitalwert (€)', data: results.map(function(r) { return Math.max(0, r.kapitalwert); }), backgroundColor: '#2a8a2a' }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { title: { display: true, text: 'Investition vs. Kapitalwert (20 Jahre)' } },
      scales: { y: { beginAtZero: true } }
    }
  });
}

function renderAmortisationChart(results) {
  var canvas = document.getElementById('amortisation-chart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  if (chartInstances['amortisation']) chartInstances['amortisation'].destroy();

  chartInstances['amortisation'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: results.map(function(r) { return r.szenarioName; }),
      datasets: [{
        label: 'Amortisation (Jahre)',
        data: results.map(function(r) { return r.amortisation; }),
        backgroundColor: '#e8b339'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { title: { display: true, text: 'Amortisationsdauer' } },
      scales: { y: { beginAtZero: true, title: { display: true, text: 'Jahre' } } }
    }
  });
}

// ===== Settings =====
function initSettings() {
  var form = document.getElementById('settings-form');
  if (!form || form._initialized) return;
  form._initialized = true;
  form.onsubmit = function(e) {
    e.preventDefault();
    api.saveConfig({
      baseUrl: document.getElementById('cfg-url').value,
      tenantId: document.getElementById('cfg-tenant').value,
      token: document.getElementById('cfg-token').value
    });
    alert('Einstellungen gespeichert');
  };
}

function showLoading(show) {
  var el = document.getElementById('loading');
  if (el) el.style.display = show ? 'block' : 'none';
}
