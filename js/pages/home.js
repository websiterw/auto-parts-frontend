import { getMe, getTeamData, getInvestments, checkin, apiCall } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderHome() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  const user = JSON.parse(localStorage.getItem('user')) || { balance: 0, cumulativeIncome: 0 };
  let team = { totalUsers: 0, totalRewards: 0 };
  let investments = [];
  try {
    const [teamData, inv] = await Promise.all([getTeamData(), getInvestments()]);
    team = teamData || team;
    investments = inv || [];
  } catch (e) {}

  const totalDaily = investments.reduce((sum, inv) => sum + (inv.dailyIncome || 0), 0);

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">
      <!-- Banner -->
      <img src="assets/images/home-banner.png" alt="Auto Parts" style="width:100%; border-radius:16px; margin-bottom:12px;" onerror="this.style.display='none'">

      <!-- Quick actions -->
      <div class="card-glass" style="padding:16px;">
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px;">
          <button class="btn btn-secondary" style="padding:8px 0; font-size:12px;" onclick="window.location.hash='recharge'">Recharge</button>
          <button class="btn btn-secondary" style="padding:8px 0; font-size:12px;" onclick="window.location.hash='withdraw'">Withdraw</button>
          <button class="btn btn-secondary" style="padding:8px 0; font-size:12px;" onclick="window.location.hash='team'">Team</button>
          <button class="btn" style="padding:8px 0; font-size:12px; background:#FF6B00;" id="checkin-btn">Check in</button>
        </div>
      </div>

      <!-- Balance -->
      <div style="display:flex; gap:10px; margin:12px 0;">
        <div class="card" style="flex:1; text-align:center; padding:12px;">
          <p style="color:#b0baca; font-size:12px;">Account balance</p>
          <p style="font-size:20px; font-weight:700;">RWF ${(user.balance || 0).toFixed(2)}</p>
        </div>
        <div class="card" style="flex:1; text-align:center; padding:12px;">
          <p style="color:#b0baca; font-size:12px;">Cumulative income</p>
          <p style="font-size:20px; font-weight:700; color:#4caf50;">RWF ${(user.cumulativeIncome || 0).toFixed(2)}</p>
        </div>
      </div>

      <!-- Products preview -->
      <h3 style="color:#fff; margin:16px 0 12px;">Products</h3>
      <div id="home-products" style="display:grid; grid-template-columns:1fr 1fr; gap:10px;"></div>
      <button class="btn btn-secondary" onclick="window.location.hash='product'" style="margin-top:8px;">View All Products</button>

      <!-- Team stats -->
      <div style="display:flex; gap:10px; margin-top:16px;">
        <div class="card" style="flex:1; text-align:center; padding:12px;">
          <p style="color:#b0baca; font-size:12px;">Team members</p>
          <p style="font-size:20px; font-weight:700; color:#FF6B00;">${team.totalUsers || 0}</p>
        </div>
        <div class="card" style="flex:1; text-align:center; padding:12px;">
          <p style="color:#b0baca; font-size:12px;">Team purchases</p>
          <p style="font-size:20px; font-weight:700; color:#FF6B00;">RWF ${(team.totalRewards || 0).toFixed(2)}</p>
        </div>
      </div>
    </div>
  `;

  // Load products (same as before)
  try {
    const products = await apiCall('/products');
    const container = document.getElementById('home-products');
    container.innerHTML = products.slice(0, 4).map(p => `
      <div class="product-card" style="padding:12px;">
        <img src="assets/images/product-${p._id}.png" alt="${p.name}" style="width:100%; height:80px; object-fit:cover; border-radius:8px;" onerror="this.style.display='none'">
        <h3 style="font-size:14px; margin:4px 0;">${p.name}</h3>
        <p style="font-size:12px; color:#b0baca;">RWF ${p.price} · Daily: ${p.dailyIncome}</p>
        <button class="btn btn-small" style="width:100%; padding:4px 0; font-size:12px;" data-id="${p._id}" data-price="${p.price}">Buy</button>
      </div>
    `).join('');
    container.querySelectorAll('[data-id]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const price = parseFloat(e.target.dataset.price);
        if (user.balance < price) { toastError('Insufficient balance'); return; }
        try {
          await apiCall('/investments/purchase', { method: 'POST', body: JSON.stringify({ productId: id }) });
          toastSuccess('Purchase successful!');
          user.balance -= price;
          localStorage.setItem('user', JSON.stringify(user));
          setTimeout(() => window.location.hash = 'myproduct', 1000);
        } catch (err) { toastError(err.message); }
      });
    });
  } catch (e) {}

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
    } catch (err) { toastError(err.message || 'Already checked in today'); }
  });

  // Bottom nav highlight
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelector('.nav-item[data-page="home"]')?.classList.add('active');
}
