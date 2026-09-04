import { getMe, getTeamData, getInvestments, checkin, apiCall } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderHome() {
  const app = document.getElementById('app');

  // ✅ Always fetch fresh user data FIRST
  let user = JSON.parse(localStorage.getItem('user')) || { balance: 0, cumulativeIncome: 0 };
  try {
    const fresh = await getMe();
    user = fresh;
    localStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    // fallback to cached user
  }

  let team = { totalUsers: 0, totalRewards: 0 };
  let investments = [];
  let products = [];

  try {
    const [teamData, inv, prod] = await Promise.all([
      getTeamData().catch(() => ({ totalUsers: 0, totalRewards: 0 })),
      getInvestments().catch(() => []),
      apiCall('/products').catch(() => [])
    ]);
    team = teamData || team;
    investments = inv || [];
    products = prod || [];
  } catch (e) {
    console.error('Home load error:', e);
  }

  const totalDaily = investments.reduce((sum, inv) => sum + (inv.dailyIncome || 0), 0);

  app.innerHTML = `
    <div style="min-height:100vh; background:#f5f5f5; padding-bottom:80px;">

      <!-- HERO BANNER -->
      <div style="position:relative; width:100%; height:200px; background: #22c55e; overflow:hidden;">
        <img src="assets/images/home-banner.png" alt="Style House" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
        <div style="position:absolute; inset:0; background:rgba(0,0,0,0.25);"></div>
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:32px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">SUPERMARKET</div>
        <div style="position:absolute; bottom:12px; left:50%; transform:translateX(-50%); color:#fff; font-size:13px; font-weight:600; text-shadow:0 2px 8px rgba(0,0,0,0.5);">FRESH. QUALITY. EVERYDAY.</div>
      </div>

      <!-- QUICK ACTIONS -->
      <div style="background:#fff; border-radius:16px; border:2px solid #22c55e; margin:-16px 16px 12px; padding:12px 8px; display:grid; grid-template-columns:repeat(5,1fr); gap:4px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
        <button onclick="window.location.hash='recharge'" style="display:flex; flex-direction:column; align-items:center; gap:4px; background:none; border:none; cursor:pointer; padding:4px;">
          <span style="width:40px; height:40px; border-radius:50%; background:#22c55e; display:flex; align-items:center; justify-content:center; color:#fff; font-size:18px;"><i class="fas fa-wallet"></i></span>
          <span style="font-size:10px; font-weight:700; color:#16a34a;">Recharge</span>
        </button>
        <button onclick="window.location.hash='withdraw'" style="display:flex; flex-direction:column; align-items:center; gap:4px; background:none; border:none; cursor:pointer; padding:4px;">
          <span style="width:40px; height:40px; border-radius:50%; background:#22c55e; display:flex; align-items:center; justify-content:center; color:#fff; font-size:18px;"><i class="fas fa-arrow-up"></i></span>
          <span style="font-size:10px; font-weight:700; color:#16a34a;">Withdraw</span>
        </button>
        <button onclick="window.location.hash='team'" style="display:flex; flex-direction:column; align-items:center; gap:4px; background:none; border:none; cursor:pointer; padding:4px;">
          <span style="width:40px; height:40px; border-radius:50%; background:#22c55e; display:flex; align-items:center; justify-content:center; color:#fff; font-size:18px;"><i class="fas fa-users"></i></span>
          <span style="font-size:10px; font-weight:700; color:#16a34a;">Team</span>
        </button>
        <button id="home-checkin-btn" style="display:flex; flex-direction:column; align-items:center; gap:4px; background:none; border:none; cursor:pointer; padding:4px;">
          <span style="width:40px; height:40px; border-radius:50%; background:#22c55e; display:flex; align-items:center; justify-content:center; color:#fff; font-size:18px;"><i class="fas fa-check"></i></span>
          <span style="font-size:10px; font-weight:700; color:#16a34a;">Check in</span>
        </button>
        <button onclick="window.location.hash='customerService'" style="display:flex; flex-direction:column; align-items:center; gap:4px; background:none; border:none; cursor:pointer; padding:4px;">
          <span style="width:40px; height:40px; border-radius:50%; background:#22c55e; display:flex; align-items:center; justify-content:center; color:#fff; font-size:18px;"><i class="fas fa-headset"></i></span>
          <span style="font-size:10px; font-weight:700; color:#16a34a;">Help</span>
        </button>
      </div>

      <!-- SCROLLING TICKER -->
      <div style="margin:0 16px 12px; background:#fff; border-radius:12px; border:2px solid #dc2626; padding:8px 12px; overflow:hidden;">
        <div style="display:flex; gap:12px; align-items:center;">
          <span style="color:#dc2626; font-size:18px;">🔔</span>
          <div style="flex:1; overflow:hidden;">
            <p style="white-space:nowrap; animation: ticker 18s linear infinite; color:#16a34a; font-size:13px; font-weight:600;">
              🛒 ****${(user.accountNumber || '').slice(-4) || '0000'} bought sneakers RWF 25,000 · ****3326 bought a dress RWF 40,000 · ****5557 recharged RWF 10,000
            </p>
          </div>
        </div>
      </div>

      <!-- BALANCE CARDS -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:0 16px 12px;">
        <div style="background:#fff; border-radius:16px; padding:12px; border:2px solid #22c55e; text-align:center;">
          <p style="color:#6b6b6b; font-size:11px;">Account balance</p>
          <p style="font-size:22px; font-weight:900; color:#dc2626;">RWF ${(user.balance || 0).toFixed(2)}</p>
        </div>
        <div style="background:#fff; border-radius:16px; padding:12px; border:2px solid #22c55e; text-align:center;">
          <p style="color:#6b6b6b; font-size:11px;">Cumulative income</p>
          <p style="font-size:22px; font-weight:900; color:#dc2626;">RWF ${(user.cumulativeIncome || 0).toFixed(2)}</p>
        </div>
      </div>

      <!-- DAILY CHECK-IN -->
      <div style="margin:0 16px 12px; background:#fff; border-radius:16px; padding:16px; border:2px solid #22c55e;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <p style="font-weight:900; color:#16a34a; font-size:15px;">Daily check-in</p>
            <p style="font-size:12px; color:#6b6b6b;">Claim 1% of your balance (min RWF 100) — once every 24 hours</p>
          </div>
          <button id="checkin-btn" style="background:#22c55e; color:#fff; border:none; border-radius:30px; padding:8px 20px; font-weight:700; cursor:pointer;">Claim</button>
        </div>
      </div>

      <!-- PRODUCTS SECTION -->
      <h2 style="text-align:center; font-size:20px; font-weight:900; color:#16a34a; margin:16px 0 8px;">Products</h2>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:0 16px 12px;" id="product-grid">
        ${products.slice(0, 4).map(p => `
          <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid #22c55e;">
            <img src="assets/images/product-vip${p.level || 1}.png" alt="${p.name}" style="width:100%; height:90px; object-fit:contain; border-radius:8px; background:#f0fdf4;" onerror="this.style.display='none'">
            <p style="font-weight:900; color:#16a34a; font-size:12px; margin-top:4px;">${p.name}</p>
            <p style="font-weight:900; color:#dc2626; font-size:14px;">RWF ${p.price}</p>
            <p style="font-size:11px; color:#16a34a;">Daily: RWF ${p.dailyIncome}</p>
            <p style="font-size:10px; color:#6b6b6b;">${p.termDays} days total: RWF ${p.totalIncome}</p>
            <button class="product-buy" data-id="${p._id}" data-price="${p.price}" style="width:100%; background:#22c55e; color:#fff; border:none; border-radius:30px; padding:6px; font-size:12px; font-weight:700; cursor:pointer; margin-top:6px;">Buy</button>
          </div>
        `).join('')}
      </div>
      <button onclick="window.location.hash='product'" style="display:block; margin:0 16px 16px; width:calc(100% - 32px); background:transparent; border:2px solid #22c55e; border-radius:30px; padding:10px; font-weight:700; color:#16a34a; cursor:pointer;">See all products</button>

      <style>
        @keyframes ticker {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
      </style>
    </div>
  `;

  // Check-in
  document.getElementById('checkin-btn').addEventListener('click', async () => {
    try {
      const data = await checkin();
      toastSuccess(`Check-in successful! +RWF ${data.amount || 100}`);
      const fresh = await getMe();
      user.balance = fresh.balance;
      user.cumulativeIncome = fresh.cumulativeIncome;
      localStorage.setItem('user', JSON.stringify(user));
      renderHome();
    } catch (err) {
      toastError(err.message || 'Already checked in today');
    }
  });

  // Buy buttons
  document.querySelectorAll('.product-buy').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const price = parseFloat(e.target.dataset.price);
      if (user.balance < price) {
        toastError('Insufficient balance');
        return;
      }
      try {
        await apiCall('/investments/purchase', { method: 'POST', body: JSON.stringify({ productId: id }) });
        toastSuccess('Purchase successful!');
        user.balance -= price;
        localStorage.setItem('user', JSON.stringify(user));
        setTimeout(() => window.location.hash = 'myproduct', 1000);
      } catch (err) {
        toastError(err.message);
      }
    });
  });

  // ✅ SHOW WELCOME POPUP EVERY TIME HOME IS LOADED
  showWelcomePopup(user);
}

// ============================================
// WELCOME POPUP – shows every time Home loads
// ============================================
function showWelcomePopup(user) {
  // Remove existing popup if any
  const existing = document.getElementById('welcome-popup-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'welcome-popup-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  `;

  const popup = document.createElement('div');
  popup.style.cssText = `
    background: #fff;
    border-radius: 20px;
    max-width: 380px;
    width: 92%;
    padding: 28px 24px 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    text-align: center;
    border: 2px solid #22c55e;
    max-height: 90vh;
    overflow-y: auto;
  `;

  // Get account number (last 4 digits for display)
  const accountDisplay = user.accountNumber ? `****${user.accountNumber.slice(-4)}` : '****';

  popup.innerHTML = `
    <!-- Green checkmark icon -->
    <div style="width:64px; height:64px; border-radius:50%; background:#22c55e; display:flex; align-items:center; justify-content:center; margin:0 auto 12px;">
      <i class="fas fa-check" style="color:#fff; font-size:30px;"></i>
    </div>

    <h2 style="color:#16a34a; font-size:20px; font-weight:900; margin:0 0 4px 0;">Welcome Back!</h2>
    <p style="color:#6b6b6b; font-size:14px; margin:0 0 16px 0;">Account: ${accountDisplay}</p>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:12px 0 16px;">
      <div style="background:#f0fdf4; border-radius:12px; padding:10px; border:1px solid #22c55e;">
        <p style="color:#6b6b6b; font-size:10px;">Balance</p>
        <p style="color:#dc2626; font-size:18px; font-weight:900;">RWF ${(user.balance || 0).toFixed(2)}</p>
      </div>
      <div style="background:#f0fdf4; border-radius:12px; padding:10px; border:1px solid #22c55e;">
        <p style="color:#6b6b6b; font-size:10px;">Income</p>
        <p style="color:#16a34a; font-size:18px; font-weight:900;">RWF ${(user.cumulativeIncome || 0).toFixed(2)}</p>
      </div>
    </div>

    <button id="popup-ok" style="background:#22c55e; color:#fff; border:none; border-radius:30px; padding:12px 40px; font-weight:700; font-size:16px; cursor:pointer; width:100%;">
      Continue
    </button>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Add fade animation if not present
  if (!document.getElementById('popup-styles')) {
    const style = document.createElement('style');
    style.id = 'popup-styles';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  // Close popup
  document.getElementById('popup-ok').addEventListener('click', () => {
    overlay.remove();
  });

  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}
