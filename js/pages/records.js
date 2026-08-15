import { getRecharges, getTransactions } from '../api.js';
import { toastError } from '../api.js';

export async function renderRecords() {
  const app = document.getElementById('app');
  let txs = [];
  let currentTab = 'recharge';
  const GOLD = '#d99b1c';
  const GOLD_DARK = '#b8860b';

  try {
    // For recharge records, we use the dedicated recharge endpoint which includes pending status
    const recharges = await getRecharges();
    // For withdrawal and income, we use transactions
    const transactions = await getTransactions();
    // Combine: we'll show recharge records from the recharge endpoint
    // For withdrawal and income, we'll use transactions
    // We'll create a unified list based on tab
    txs = transactions;
  } catch (err) {
    toastError('Failed to load records');
  }

  function render() {
    let filtered = [];
    let total = 0;
    let records = [];

    if (currentTab === 'recharge') {
      // Use recharge endpoint data (which includes pending)
      // We'll fetch fresh on each render
      getRecharges().then(data => {
        records = data;
        renderRecordsList(records);
      }).catch(() => {
        records = [];
        renderRecordsList(records);
      });
    } else {
      // For withdrawal and income, use transactions
      const type = currentTab === 'withdrawal' ? 'withdrawal' : 'product_income';
      filtered = txs.filter(t => t.type === type);
      total = filtered.reduce((sum, t) => sum + t.amount, 0);
      records = filtered;
      renderRecordsList(records);
    }
  }

  function renderRecordsList(records) {
    const totalAmount = records.reduce((sum, r) => sum + (r.amount || 0), 0);
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
          <p style="font-size:22px; font-weight:900; color:${GOLD_DARK};">RWF ${totalAmount.toFixed(2)}</p>
        </div>

        <!-- Records list -->
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
          ${records.length === 0 ? `
            <div style="background:#fff; border-radius:12px; padding:20px; border:2px solid ${GOLD}; text-align:center; color:#6b6b6b;">
              No ${currentTab} records.
            </div>
          ` : records.map(r => {
            const status = r.status || 'success';
            const isPending = status === 'pending';
            const isSuccess = status === 'approved' || status === 'success';
            const statusColor = isPending ? '#d99b1c' : isSuccess ? '#16a34a' : '#dc2626';
            const statusLabel = isPending ? 'Pending' : isSuccess ? 'Success' : 'Rejected';
            const amount = r.amount || 0;
            const method = r.method || r.paymentMethod || '-';
            const account = r.account || r.phone || '-';
            const holder = r.holderName || '-';
            const createdAt = r.createdAt || new Date();
            return `
              <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid ${GOLD};">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-weight:700; color:#343434;">${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</span>
                  <span style="font-weight:900; color:${statusColor};">${statusLabel}</span>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                  <span style="font-weight:900; color:${amount >= 0 ? '#16a34a' : '#dc2626'};">${amount >= 0 ? '+' : ''}RWF ${amount.toFixed(2)}</span>
                  <span style="font-size:12px; color:#6b6b6b;">${method}</span>
                </div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px; margin-top:4px; font-size:12px; color:#6b6b6b;">
                  <span>Account: ${account}</span>
                  <span>Holder: ${holder}</span>
                  <span>Date: ${new Date(createdAt).toLocaleString()}</span>
                  <span style="font-weight:600; color:${statusColor};">Status: ${statusLabel}</span>
                </div>
              </div>
            `;
          }).join('')}
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
