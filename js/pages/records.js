import { getTransactions } from '../api.js';

export async function renderRecords() {
  const app = document.getElementById('app');
  let txs = [];
  try {
    txs = await getTransactions();
  } catch (e) {}

  app.innerHTML = `
    <div class="hero" style="background: var(--green);">
      <div class="hero-overlay"></div>
      <div class="hero-title">RECORDS</div>
    </div>
    <div class="px-4 -mt-6">
      <div class="bg-white rounded-t-2xl shadow-sm p-4">
        <div class="flex gap-4 border-b pb-2">
          <button class="tab-btn font-bold text-sm" data-tab="recharge" style="color: var(--green-dark); border-bottom: 2px solid var(--green);">Recharge</button>
          <button class="tab-btn font-bold text-sm" data-tab="withdrawal" style="color: #8a8a8a;">Withdrawal</button>
          <button class="tab-btn font-bold text-sm" data-tab="income" style="color: #8a8a8a;">Income</button>
        </div>
        <div id="records-list" class="mt-4 space-y-3">
          ${txs.filter(t => t.type === 'recharge').slice(0, 10).map(t => `
            <div class="bg-white rounded-lg p-3 border">
              <div class="flex justify-between">
                <span class="font-bold">${t.type}</span>
                <span class="font-bold text-green-600">+RWF ${t.amount}</span>
              </div>
              <div class="text-xs text-muted">Order: ${t.reference || t._id}</div>
              <div class="text-xs text-muted">Method: ${t.method || '-'}</div>
              <div class="text-xs text-muted">Time: ${new Date(t.createdAt).toLocaleString()}</div>
              <div class="text-xs font-semibold" style="color: ${t.status === 'success' ? 'var(--green)' : 'var(--red)'};">${t.status || 'success'}</div>
            </div>
          `).join('')}
          ${txs.filter(t => t.type === 'recharge').length === 0 ? '<p class="text-muted text-sm">No recharge records.</p>' : ''}
        </div>
      </div>
    </div>
  `;

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => { b.style.color = '#8a8a8a'; b.style.borderBottom = 'none'; });
      btn.style.color = 'var(--green-dark)';
      btn.style.borderBottom = '2px solid var(--green)';
      const tab = btn.dataset.tab;
      const list = document.getElementById('records-list');
      const filtered = txs.filter(t => t.type === tab);
      if (filtered.length === 0) {
        list.innerHTML = `<p class="text-muted text-sm">No ${tab} records.</p>`;
        return;
      }
      list.innerHTML = filtered.map(t => `
        <div class="bg-white rounded-lg p-3 border">
          <div class="flex justify-between">
            <span class="font-bold">${t.type}</span>
            <span class="font-bold ${t.type === 'withdrawal' ? 'text-red-500' : 'text-green-600'}">${t.type === 'withdrawal' ? '-' : '+'}RWF ${t.amount}</span>
          </div>
          <div class="text-xs text-muted">Order: ${t.reference || t._id}</div>
          <div class="text-xs text-muted">Method: ${t.method || '-'}</div>
          <div class="text-xs text-muted">Time: ${new Date(t.createdAt).toLocaleString()}</div>
          <div class="text-xs font-semibold" style="color: ${t.status === 'success' ? 'var(--green)' : 'var(--red)'};">${t.status || 'success'}</div>
        </div>
      `).join('');
    });
  });
}
