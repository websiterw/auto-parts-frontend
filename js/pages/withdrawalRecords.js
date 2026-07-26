export function renderWithdrawalRecords() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  const records = [
    { id: 'B2607250905280751', status: 'Successful', amount: 3000, received: 2400, date: '07/25/2026 09:05:28' },
    { id: 'B2607230948430578', status: 'Successful', amount: 3125, received: 2500, date: '07/23/2026 09:48:44' },
    { id: 'B2607221008310449', status: 'Successful', amount: 4190, received: 3350, date: '07/22/2026 10:08:31' }
  ];

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <button id="rec-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">Withdrawal Records</h2>
      </div>
      ${records.map(r => `
        <div style="background:#0a0e17; border-radius:12px; padding:12px 16px; margin-bottom:8px; border-left:3px solid #4caf50;">
          <p style="color:#b0baca; font-size:13px;">${r.id}</p>
          <p style="color:#4caf50; font-weight:600; font-size:14px;">${r.status}</p>
          <div style="display:flex; justify-content:space-between; margin-top:4px;">
            <div><p style="color:#6a7488; font-size:12px;">Amount</p><p style="color:#fff; font-size:15px;">RWF ${r.amount.toLocaleString()}</p></div>
            <div><p style="color:#6a7488; font-size:12px;">Received</p><p style="color:#fff; font-size:15px;">RWF ${r.received.toLocaleString()}</p></div>
            <div><p style="color:#6a7488; font-size:12px;">Date</p><p style="color:#b0baca; font-size:13px;">${r.date}</p></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('rec-back').addEventListener('click', () => window.location.hash = 'withdraw');
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}