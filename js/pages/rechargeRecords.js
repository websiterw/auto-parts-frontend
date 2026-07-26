import { apiCall } from '../api.js';

export async function renderRechargeRecords() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  let records = [];
  try {
    const res = await apiCall('/recharges');
    records = res;
  } catch (e) {
    records = [];
  }

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <button id="rec-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">Recharge Records</h2>
      </div>
      ${records.length === 0 ? `
        <div class="card" style="text-align:center; color:#b0baca; padding:20px;">No recharge records.</div>
      ` : records.map(r => `
        <div style="background:#0a0e17; border-radius:12px; padding:12px 16px; margin-bottom:8px; border-left:3px solid ${r.status === 'approved' ? '#4caf50' : r.status === 'pending' ? '#ff9800' : '#f44336'};">
          <p style="color:#b0baca; font-size:13px;">${r._id}</p>
          <p style="color:${r.status === 'approved' ? '#4caf50' : r.status === 'pending' ? '#ff9800' : '#f44336'}; font-weight:600; font-size:14px;">${r.status.toUpperCase()}</p>
          <div style="display:flex; justify-content:space-between; margin-top:4px;">
            <div>
              <p style="color:#6a7488; font-size:12px;">Amount</p>
              <p style="color:#fff; font-size:15px;">RWF ${r.amount.toLocaleString()}</p>
            </div>
            <div>
              <p style="color:#6a7488; font-size:12px;">Method</p>
              <p style="color:#fff; font-size:14px;">${r.method}</p>
            </div>
            <div>
              <p style="color:#6a7488; font-size:12px;">Date</p>
              <p style="color:#b0baca; font-size:12px;">${new Date(r.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('rec-back').addEventListener('click', () => window.location.hash = 'recharge');
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}