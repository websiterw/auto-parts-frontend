export function renderRecords() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  // Read filter from sessionStorage and clear it
  const filter = sessionStorage.getItem('recordFilter') || 'all';
  sessionStorage.removeItem('recordFilter');

  // Dummy data (replace with real API call)
  const allRecords = [
    { type: 'recharge', amount: 6000, ref: '******8102', date: '07/25/2026' },
    { type: 'recharge', amount: 250000, ref: '******4512', date: '07/24/2026' },
    { type: 'recharge', amount: 100000, ref: '******3682R', date: '07/23/2026' },
    { type: 'withdraw', amount: -3125, ref: '******9301', date: '07/22/2026' },
    { type: 'withdraw', amount: -4190, ref: '******2019', date: '07/21/2026' },
    { type: 'withdraw', amount: -3000, ref: '******3821', date: '07/20/2026' }
  ];

  // Filter records
  let filtered = allRecords;
  if (filter === 'recharge') {
    filtered = allRecords.filter(r => r.type === 'recharge');
  } else if (filter === 'withdraw') {
    filtered = allRecords.filter(r => r.type === 'withdraw');
  }

  // Page title
  const title = filter === 'recharge' ? 'Recharge Records' :
                filter === 'withdraw' ? 'Withdrawal Records' :
                'All Records';

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <button id="records-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">${title}</h2>
      </div>

      ${filtered.length === 0 ? `
        <div class="card" style="text-align:center; padding:24px; color:#b0baca;">
          No records found.
        </div>
      ` : filtered.map(r => `
        <div style="background:#0a0e17; border-radius:12px; padding:10px 14px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; border-left:3px solid ${r.amount >= 0 ? '#4caf50' : '#f44336'};">
          <div>
            <p style="font-weight:500; color:#fff; font-size:14px;">${r.type.charAt(0).toUpperCase() + r.type.slice(1)} ${Math.abs(r.amount).toLocaleString()}</p>
            <p style="font-size:11px; color:#6a7488;">${r.ref} · ${r.date}</p>
          </div>
          <p style="color:${r.amount >= 0 ? '#4caf50' : '#f44336'}; font-weight:600;">${r.amount >= 0 ? '+' : ''}RWF ${Math.abs(r.amount).toLocaleString()}</p>
        </div>
      `).join('')}
    </div>
  `;

  // Back button → Home
  document.getElementById('records-back').addEventListener('click', () => {
    window.location.hash = 'home';
  });

  // Bottom nav highlight
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}