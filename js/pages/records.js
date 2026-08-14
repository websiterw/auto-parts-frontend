import { getTransactions } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderRecords() {
  const app = document.getElementById('app');
  let txs = [];
  let currentTab = 'recharge';

  try {
    txs = await getTransactions();
  } catch (err) {
    toastError('Failed to load records');
  }

  const GOLD = '#d99b1c';
  const GOLD_DARK = '#b8860b';

  function render() {
    const filtered = txs.filter(t => t.type === currentTab);
    const total = filtered.reduce((sum, t) => sum + t.amount, 0);

    app.innerHTML = `
      <div style="position:relative; width:100%; height:160px; background: #22c55e; overflow:hidden;">
        <img src="assets/images/records-banner.png" alt="Records" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
        <div style="position:absolute; inset:0; background:rgba(0,0,0,0.25);"></div>
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:26px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">RECORDS</div>
      </div>
      <div style="padding:0 16px; margin-top:-10px;">
        <!-- Tabs -->
        <div style="display:flex; background:#fff; border-radius:16px; border:2px solid ${GOLD}; overflow:hidden; margin-bottom:16px;">
          ${['recharge', 'withdrawal', 'income'].map(tab => `
            <button class="records-tab" data-tab="${tab}" style="flex:1; padding:12px; border:none; background:${currentTab === tab ? GOLD : 'transparent'}; color:${currentTab === tab ? '#fff' : '#343434'}; font-weight:700; font-size:14px; cursor:pointer; transition:0.2s;">
              ${tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          `).join('')}
        </div>

        <!-- Stats -->
        <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid ${GOLD}; text-align:center; margin-bottom:16px;">
          <p style="color:#6b6b6b; font-size:12px;">Total ${currentTab}</p>
          <p style="font-size:22px; font-weight:900; color:${GOLD_DARK};">RWF ${total.toFixed(2)}</p>
        </div>

        <!-- Records list -->
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
          ${filtered.length === 0 ? `
            <div style="background:#fff; border-radius:12px; padding:20px; border:2px solid ${GOLD}; text-align:center; color:#6b6b6b;">
              No ${currentTab} records.
            </div>
          ` : filtered.map(t => `
            <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid ${GOLD};">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:700; color:#343434;">${t.type.charAt(0).toUpperCase() + t.type.slice(1)}</span>
                <span style="font-weight:900; color:${t.amount >= 0 ? '#16a34a' : '#dc2626'};">${t.amount >= 0 ? '+' : ''}RWF ${t.amount.toFixed(2)}</span>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-top:6px; font-size:12px; color:#6b6b6b;">
                <span>Order: ${t.reference || t._id}</span>
                <span>Method: ${t.method || '-'}</span>
                <span>Date: ${new Date(t.createdAt).toLocaleString()}</span>
                <span style="font-weight:600; color:${t.status === 'success' ? '#16a34a' : '#dc2626'};">Status: ${t.status || 'success'}</span>
              </div>
            </div>
          `).join('')}
        </div>

        <button onclick="window.location.hash='home'" style="width:100%; background:${GOLD}; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; font-size:16px; cursor:pointer; margin-bottom:20px;">Back to home</button>
      </div>
    `;

    // Tab switching
    document.querySelectorAll('.records-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTab = btn.dataset.tab;
        render();
      });
    });
  }

  render();
}
