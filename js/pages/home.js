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
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:32px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">Style House</div>
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
}
