import { getMe } from '../api.js';

let refreshInterval = null;

export async function renderHome() {
  const app = document.getElementById('app');
  const user = JSON.parse(localStorage.getItem('user')) || { balance: 0, cumulativeIncome: 0 };
  app.className = 'dark-page';

  // Function to fetch fresh user data and update the UI
  async function refreshBalance() {
    try {
      const fresh = await getMe();
      user.balance = fresh.balance;
      user.cumulativeIncome = fresh.cumulativeIncome;
      localStorage.setItem('user', JSON.stringify(user));
      updateBalanceDisplay();
    } catch (e) {
      // silent fail – user will still see cached balance
    }
  }

  // Function to update only the balance display without re-rendering the whole page
  function updateBalanceDisplay() {
    const balanceEl = document.getElementById('balance-amount');
    const incomeEl = document.getElementById('cumulative-income');
    if (balanceEl) balanceEl.textContent = `RWF ${user.balance.toFixed(2)}`;
    if (incomeEl) incomeEl.textContent = `RWF ${user.cumulativeIncome.toFixed(2)}`;
  }

  // Dummy transactions (replace with real API call later)
  const transactions = [
    { type: 'Recharge', amount: 6000, ref: '******8102', date: '07/25/2026' },
    { type: 'Recharge', amount: 250000, ref: '******4512', date: '07/24/2026' },
    { type: 'Recharge', amount: 100000, ref: '******3682R', date: '07/23/2026' },
    { type: 'Withdraw', amount: -3125, ref: '******9301', date: '07/22/2026' }
  ];

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">
      <img src="assets/images/home-up.png" alt="auto" style="width:100%; border-radius:16px; margin-bottom:12px;" onerror="this.style.display='none'">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-size:20px; font-weight:700; color:#FF6B00;">auto</span>
        <span style="color:#8a94a6; font-size:13px;">${user.accountNumber || ''}</span>
      </div>

      <div class="card-glass" style="padding:16px 18px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="assets/images/account-balance.png" alt="Balance" style="width:32px; height:32px;" onerror="this.style.display='none'">
            <div>
              <p style="color:#b0baca; font-size:12px;">Account balance</p>
              <p id="balance-amount" style="font-size:26px; font-weight:700;">RWF ${user.balance?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="assets/images/cumulative-income.png" alt="Income" style="width:32px; height:32px;" onerror="this.style.display='none'">
            <div style="text-align:right;">
              <p style="color:#b0baca; font-size:12px;">Cumulative income</p>
              <p id="cumulative-income" style="font-size:20px; font-weight:600; color:#4caf50;">RWF ${user.cumulativeIncome?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; margin-top:12px;">
          <button class="btn btn-secondary" style="padding:8px 0; font-size:12px;" id="home-recharge">Recharge</button>
          <button class="btn btn-secondary" style="padding:8px 0; font-size:12px;" id="home-withdraw">Withdraw</button>
          <button class="btn btn-secondary" style="padding:8px 0; font-size:12px;" id="home-help">Help</button>
          <button class="btn" style="padding:8px 0; font-size:12px; background:#FF6B00;" id="home-checkin">Check in</button>
        </div>
      </div>

      <div style="margin-top:16px;">
        <p style="color:#b0baca; font-size:13px; margin-bottom:8px;">Recent Activity</p>
        ${transactions.map(t => `
          <div style="background:#0a0e17; border-radius:12px; padding:10px 14px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center; border-left:3px solid ${t.amount >= 0 ? '#4caf50' : '#f44336'};">
            <div>
              <p style="font-weight:500; color:#fff; font-size:14px;">${t.type} ${Math.abs(t.amount).toLocaleString()}</p>
              <p style="font-size:11px; color:#6a7488;">${t.ref} · ${t.date}</p>
            </div>
            <p style="color:${t.amount >= 0 ? '#4caf50' : '#f44336'}; font-weight:600;">${t.amount >= 0 ? '+' : ''}RWF ${Math.abs(t.amount).toLocaleString()}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Event listeners
  document.getElementById('home-recharge').addEventListener('click', () => window.location.hash = 'recharge');
  document.getElementById('home-withdraw').addEventListener('click', () => window.location.hash = 'withdraw');
  document.getElementById('home-help').addEventListener('click', () => window.location.hash = 'customerService');
  document.getElementById('home-checkin').addEventListener('click', () => window.location.hash = 'checkin');

  // Bottom nav highlight
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const activeNav = document.querySelector('.nav-item[data-page="home"]');
  if (activeNav) activeNav.classList.add('active');

  // Refresh balance immediately and then every 2 seconds
  await refreshBalance();
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(refreshBalance, 2000); // <-- CHANGED TO 2 SECONDS

  // Show launch notification (once per session)
  showLaunchNotification();
}

function showLaunchNotification() {
  if (sessionStorage.getItem('launchShown') === 'true') return;
  // ... existing launch notification code
}

// Optional: clean up interval when leaving the page
export function cleanupHome() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}