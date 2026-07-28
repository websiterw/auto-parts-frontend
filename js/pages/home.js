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
      // silent fail
    }
  }

  function updateBalanceDisplay() {
    const balanceEl = document.getElementById('balance-amount');
    const incomeEl = document.getElementById('cumulative-income');
    if (balanceEl) balanceEl.textContent = `RWF ${user.balance.toFixed(2)}`;
    if (incomeEl) incomeEl.textContent = `RWF ${user.cumulativeIncome.toFixed(2)}`;
  }

  // Dummy transaction data (replace with API later)
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

  // Refresh balance immediately and then every 30 seconds
  await refreshBalance();
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(refreshBalance, 30000);

  // ===== SHOW THE LAUNCH NOTIFICATION (once per session) =====
  showLaunchNotification();
}

// ============================================================
// LAUNCH NOTIFICATION (POPUP) – appears once per browser session
// ============================================================
function showLaunchNotification() {
  // If you want it to appear every time, remove this line:
  if (sessionStorage.getItem('launchShown') === 'true') return;

  const overlay = document.createElement('div');
  overlay.id = 'launch-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  `;

  const popup = document.createElement('div');
  popup.style.cssText = `
    background: #141c2b;
    border-radius: 20px;
    max-width: 400px;
    width: 92%;
    padding: 24px 20px 20px;
    border: 1px solid #2a3040;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
    max-height: 90vh;
    overflow-y: auto;
  `;

  popup.innerHTML = `
    <h2 style="color: #FF6B00; font-size: 20px; font-weight: 700; text-align: center; margin: 0 0 4px 0;">
      Auto parts Rwanda Officially Launched
    </h2>
    <p style="color: #b0baca; font-size: 14px; text-align: center; margin: 0 0 16px 0;">
      A brand new experience begins July 18, 2026!
    </p>
    <ul style="list-style: none; padding: 0; margin: 0 0 20px 0; font-size: 13px; color: #d0d8e8; line-height: 1.7;">
      <li style="padding: 4px 0; border-bottom: 1px solid #1e2838;">✓ Invest RWF 5,000 and you can apply for a withdrawal of RWF 3,000</li>
      <li style="padding: 4px 0; border-bottom: 1px solid #1e2838;">✓ Registration Bonus: RWF 3,000</li>
      <li style="padding: 4px 0; border-bottom: 1px solid #1e2838;">✓ Daily Check-in: RWF 50</li>
      <li style="padding: 4px 0; border-bottom: 1px solid #1e2838;">✓ Invite friends to participate and earn up to 38% cash rewards</li>
      <li style="padding: 4px 0; border-bottom: 1px solid #1e2838;">✓ Daily Return Rate 20%-40%</li>
      <li style="padding: 4px 0; border-bottom: 1px solid #1e2838;">✓ Product earnings are automatically deposited into your account daily</li>
      <li style="padding: 4px 0;">✓ Purchase multiple devices to enjoy more earning opportunities</li>
    </ul>
    <div style="display: flex; gap: 10px; margin-top: 8px;">
      <button id="launch-telegram" style="flex: 1; padding: 12px; border: none; border-radius: 30px; background: #FF6B00; color: #fff; font-weight: 700; font-size: 15px; cursor: pointer;">
        Telegram <i class="fas fa-chevron-right" style="font-size: 12px; margin-left: 4px;"></i>
      </button>
      <button id="launch-ok" style="flex: 1; padding: 12px; border: 1px solid #2a3040; border-radius: 30px; background: transparent; color: #b0baca; font-weight: 600; font-size: 15px; cursor: pointer;">
        OK
      </button>
    </div>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Add animation keyframes
  if (!document.getElementById('launch-styles')) {
    const style = document.createElement('style');
    style.id = 'launch-styles';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  document.getElementById('launch-telegram').addEventListener('click', () => {
    window.open('https://t.me/your_telegram_bot', '_blank');
  });

  document.getElementById('launch-ok').addEventListener('click', () => {
    overlay.remove();
    sessionStorage.setItem('launchShown', 'true');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      sessionStorage.setItem('launchShown', 'true');
    }
  });
}

// Cleanup interval when leaving the page (optional)
export function cleanupHome() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}
