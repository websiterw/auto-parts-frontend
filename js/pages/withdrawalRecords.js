import { apiCall } from '../api.js';

export async function renderWithdrawalRecords() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  let records = [];
  try {
    const res = await apiCall('/withdrawals');
    records = res;
  } catch (e) {
    // If the endpoint doesn't exist yet, fallback to empty array
    records = [];
  }

  // Sort by date (newest first)
  records.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">

      <!-- Header with Back button -->
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <button id="rec-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">Withdrawal Records</h2>
      </div>

      ${records.length === 0 ? `
        <div class="card" style="text-align:center; padding:24px; color:#b0baca;">
          <i class="fas fa-inbox" style="font-size:48px; color:#2a3040; margin-bottom:12px; display:block;"></i>
          No withdrawal records yet.
        </div>
      ` : records.map(r => {
        // Determine status badge color
        let statusColor = '#ff9800'; // pending
        let statusText = 'PENDING';
        if (r.status === 'approved') {
          statusColor = '#4caf50';
          statusText = 'SUCCESSFUL';
        } else if (r.status === 'rejected') {
          statusColor = '#f44336';
          statusText = 'REJECTED';
        }

        return `
          <div style="background:#0a0e17; border-radius:12px; padding:12px 16px; margin-bottom:8px; border-left:3px solid ${statusColor};">
            <p style="color:#b0baca; font-size:13px;">${r._id || 'N/A'}</p>
            <p style="color:${statusColor}; font-weight:600; font-size:14px;">${statusText}</p>
            <div style="display:flex; justify-content:space-between; margin-top:4px;">
              <div>
                <p style="color:#6a7488; font-size:12px;">Amount</p>
                <p style="color:#fff; font-size:15px;">RWF ${r.amount ? r.amount.toLocaleString() : '0'}</p>
              </div>
              <div>
                <p style="color:#6a7488; font-size:12px;">Received</p>
                <p style="color:#fff; font-size:15px;">RWF ${r.netAmount ? r.netAmount.toLocaleString() : '0'}</p>
              </div>
              <div>
                <p style="color:#6a7488; font-size:12px;">Date</p>
                <p style="color:#b0baca; font-size:13px;">${new Date(r.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Back button → Withdraw page
  document.getElementById('rec-back').addEventListener('click', () => {
    window.location.hash = 'withdraw';
  });

  // Bottom nav highlight (deselect all)
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}