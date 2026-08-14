import { getMe, getTeamData, getInvestments, checkin, apiCall } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderHome() {
  const app = document.getElementById('app');
  const user = JSON.parse(localStorage.getItem('user')) || { balance: 0, cumulativeIncome: 0 };
  let team = { totalUsers: 0, totalRewards: 0 };
  let investments = [];
  try {
    const [teamData, inv] = await Promise.all([getTeamData(), getInvestments()]);
    team = teamData || team;
    investments = inv || [];
  } catch (e) {}

  const totalDaily = investments.reduce((sum, inv) => sum + (inv.dailyIncome || 0), 0);
  const totalInvested = investments.length;

  app.innerHTML = `
    <div style="position:relative; width:100%; height:180px; background: #22c55e;">
      <img src="assets/images/home-banner.png" alt="Style House" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
      <div style="position:absolute; inset:0; background:rgba(0,0,0,0.25);"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:28px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">Style House</div>
    </div>
    <div style="padding:0 16px; margin-top:-30px;"> <!-- CHANGED: -20px → -30px -->
      <!-- Quick actions -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; background:#fff; padding:16px; border-radius:16px; border:2px solid #22c55e; margin-bottom:16px;">
        <button class="btn" onclick="window.location.hash='recharge'" style="background:#22c55e; color:#fff; border:none; border-radius:30px; padding:10px; font-weight:700; cursor:pointer;">Recharge</button>
        <button class="btn" onclick="window.location.hash='withdraw'" style="background:#22c55e; color:#fff; border:none; border-radius:30px; padding:10px; font-weight:700; cursor:pointer;">Withdraw</button>
        <button class="btn" onclick="window.location.hash='team'" style="background:#22c55e; color:#fff; border:none; border-radius:30px; padding:10px; font-weight:700; cursor:pointer;">Team</button>
        <button class="btn" id="checkin-btn" style="background:#22c55e; color:#fff; border:none; border-radius:30px; padding:10px; font-weight:700; cursor:pointer;">Check in</button>
      </div>
      <!-- Balance -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
        <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #22c55e; text-align:center;">
          <p style="color:#6b6b6b; font-size:12px;">Account balance</p>
          <p style="font-size:22px; font-weight:900; color:#dc2626;">RWF ${(user.balance || 0).toFixed(2)}</p>
        </div>
        <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #22c55e; text-align:center;">
          <p style="color:#6b6b6b; font-size:12px;">Cumulative income</p>
          <p style="font-size:22px; font-weight:900; color:#dc2626;">RWF ${(user.cumulativeIncome || 0).toFixed(2)}</p>
        </div>
      </div>
      <!-- Products preview -->
      <h2 style="font-size:18px; font-weight:900; text-align:center; color:#16a34a; margin-bottom:8px;">Products</h2>
      <div id="home-products" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;"></div>
      <button onclick="window.location.hash='product'" style="width:100%; background:transparent; border:2px solid #22c55e; color:#16a34a; border-radius:30px; padding:10px; font-weight:700; cursor:pointer; margin-top:8px;">See all products</button>
      <!-- Team stats -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:16px;">
        <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #22c55e; text-align:center;">
          <p style="color:#6b6b6b; font-size:12px;">Team members</p>
          <p style="font-size:22px; font-weight:900; color:#dc2626;">${team.totalUsers || 0}</p>
        </div>
        <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #22c55e; text-align:center;">
          <p style="color:#6b6b6b; font-size:12px;">Team purchases</p>
          <p style="font-size:22px; font-weight:900; color:#dc2626;">RWF ${(team.totalRewards || 0).toFixed(2)}</p>
        </div>
      </div>
    </div>
  `;

  // (rest of the code – buy buttons and check‑in)
  try {
    const products = await apiCall('/products');
    const container = document.getElementById('home-products');
    container.innerHTML = products.slice(0, 4).map(p => `
      <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid #22c55e;">
        <img src="assets/images/product-vip${p.level || 1}.png" alt="${p.name}" style="width:100%; height:100px; object-fit:contain; border-radius:8px; background:#f0fdf4;" onerror="this.style.display='none'">
        <p style="font-weight:900; color:#16a34a; font-size:13px; margin-top:6px;">${p.name}</p>
        <p style="font-weight:900; color:#dc2626; font-size:14px;">RWF ${p.price}</p>
        <p style="font-size:12px; color:#16a34a;">Daily: RWF ${p.dailyIncome}</p>
        <button class="product-buy" data-id="${p._id}" data-price="${p.price}" style="width:100%; background:#22c55e; color:#fff; border:none; border-radius:30px; padding:8px; font-weight:700; cursor:pointer; margin-top:8px;">Buy</button>
      </div>
    `).join('');
    container.querySelectorAll('.product-buy').forEach(btn => {
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
  } catch (e) {}

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
}
