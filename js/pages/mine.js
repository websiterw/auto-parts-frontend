import { getMe, apiCall } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderMine() {
  const app = document.getElementById('app');

  // ✅ Always fetch fresh user data FIRST
  let user = JSON.parse(localStorage.getItem('user')) || {};
  try {
    const fresh = await getMe();
    user = fresh;
    localStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    // fallback to cached user
  }

  const balance = user.balance || 0;
  const income = user.cumulativeIncome || 0;
  const code = user.myReferralCode || '';
  const account = user.accountNumber || '';

  let productCount = 0;
  let dailyIncome = 0;
  try {
    const investments = await apiCall('/investments');
    productCount = investments.length;
    dailyIncome = investments.reduce((sum, inv) => sum + (inv.dailyIncome || 0), 0);
  } catch (e) {}

  app.innerHTML = `
    <!-- Banner -->
    <div style="position:relative; width:100%; height:180px; background: #2E6F40;">
      <img src="assets/images/mine-banner.png" alt="Mine" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
      <div style="position:absolute; inset:0; background:rgba(0,0,0,0.25);"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:28px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">Mine</div>
    </div>

    <div style="padding:0 16px; margin-top:-20px;">
      <!-- Profile card -->
      <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #2E6F40; display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <div style="width:56px; height:56px; border-radius:50%; background:#2E6F40; display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; font-weight:900;">${account.slice(-2) || 'AP'}</div>
        <div>
          <p style="font-weight:900; color:#2E6F40; font-size:16px;">Account ${account || '-'}</p>
          <p style="font-size:12px; color:#dc2626;">Invite code: ${code}</p>
        </div>
      </div>

      <!-- Stats grid -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
        <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid #2E6F40; text-align:center;">
          <p style="color:#6b6b6b; font-size:11px;">Balance</p>
          <p style="font-size:18px; font-weight:900; color:#dc2626;">RWF ${balance.toFixed(2)}</p>
        </div>
        <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid #2E6F40; text-align:center;">
          <p style="color:#6b6b6b; font-size:11px;">Total income</p>
          <p style="font-size:18px; font-weight:900; color:#dc2626;">RWF ${income.toFixed(2)}</p>
        </div>
        <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid #2E6F40; text-align:center;">
          <p style="color:#6b6b6b; font-size:11px;">Products owned</p>
          <p style="font-size:18px; font-weight:900; color:#dc2626;">${productCount}</p>
        </div>
        <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid #2E6F40; text-align:center;">
          <p style="color:#6b6b6b; font-size:11px;">Daily income</p>
          <p style="font-size:18px; font-weight:900; color:#dc2626;">RWF ${dailyIncome.toFixed(2)}</p>
        </div>
      </div>

      <!-- Action buttons -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
        <button class="btn" onclick="window.location.hash='recharge'" style="background:#2E6F40; color:#fff; border:none; border-radius:30px; padding:10px; font-weight:700; cursor:pointer;">Recharge</button>
        <button class="btn" onclick="window.location.hash='withdraw'" style="background:#2E6F40; color:#fff; border:none; border-radius:30px; padding:10px; font-weight:700; cursor:pointer;">Withdraw</button>
        <button class="btn" onclick="window.location.hash='team'" style="background:#2E6F40; color:#fff; border:none; border-radius:30px; padding:10px; font-weight:700; cursor:pointer;">My team</button>
        <button class="btn" id="checkin-btn" style="background:#2E6F40; color:#fff; border:none; border-radius:30px; padding:10px; font-weight:700; cursor:pointer;">Check in</button>
      </div>

      <!-- Menu list with icons (left‑aligned) -->
      <div style="background:#fff; border-radius:16px; border:2px solid #2E6F40; overflow:hidden; margin-bottom:16px;">
        ${[
          { icon: 'fa-receipt', label: 'Recharge records', action: "window.location.hash='records'" },
          { icon: 'fa-landmark', label: 'Withdrawal records', action: "window.location.hash='records'" },
          { icon: 'fa-chart-line', label: 'Income records', action: "window.location.hash='records'" },
          { icon: 'fa-box', label: 'My products', action: "window.location.hash='myproduct'" },
          { icon: 'fa-users', label: 'My team', action: "window.location.hash='team'" },
          { icon: 'fa-link', label: 'Invitation link', action: `navigator.clipboard.writeText('${window.location.origin}/#register?code=${code}'); window.toastSuccess('Link copied!')` },
          { icon: 'fa-headset', label: 'Customer service', action: "window.location.hash='customerService'" },
        ].map(item => `
          <div onclick="${item.action}" style="display:flex; align-items:center; gap:12px; padding:14px 16px; border-bottom:1px solid #f0f0f0; cursor:pointer; transition:background 0.1s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='#fff'">
            <i class="fas ${item.icon}" style="color:#2E6F40; width:20px; text-align:center;"></i>
            <span style="flex:1; font-size:14px; font-weight:600; color:#2E6F40;">${item.label}</span>
            <span style="color:#2E6F40;">›</span>
          </div>
        `).join('')}
      </div>

      <!-- Gift code & My orders -->
      <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #2E6F40; margin-bottom:16px;">
        <p style="font-weight:900; color:#2E6F40; margin-bottom:8px;">Gift code</p>
        <div style="display:flex; gap:8px;">
          <input id="gift-input" type="text" placeholder="Enter gift code" style="flex:1; border:2px solid #e5e5e5; border-radius:8px; padding:8px 12px; outline:none;">
          <button id="gift-redeem" style="background:#2E6F40; color:#fff; border:none; border-radius:8px; padding:8px 16px; font-weight:700; cursor:pointer;">Redeem</button>
        </div>
      </div>

      <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #2E6F40; margin-bottom:16px;">
        <p style="font-weight:900; color:#2E6F40; margin-bottom:8px;">My orders</p>
        ${productCount === 0 ? '<p style="color:#6b6b6b; font-size:13px;">No products yet.</p>' : ''}
      </div>

      <button onclick="localStorage.clear(); window.location.hash='login'" style="width:100%; background:#dc2626; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; cursor:pointer; margin-bottom:20px;">Logout</button>
    </div>
  `;

  document.getElementById('checkin-btn').addEventListener('click', async () => {
    try {
      await apiCall('/checkin', { method: 'POST' });
      toastSuccess('Check-in successful!');
      renderMine();
    } catch (err) {
      toastError(err.message || 'Already checked in today');
    }
  });

  document.getElementById('gift-redeem').addEventListener('click', async () => {
    const code = document.getElementById('gift-input').value.trim();
    if (!code) { toastError('Enter a gift code'); return; }
    try {
      const data = await apiCall('/gift/redeem', { method: 'POST', body: JSON.stringify({ code }) });
      toastSuccess(`Gift redeemed! +RWF ${data.amount}`);
      renderMine();
    } catch (err) {
      toastError(err.message);
    }
  });
}
