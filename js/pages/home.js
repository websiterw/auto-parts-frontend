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
    <div class="hero" style="background: var(--green);">
      <img src="assets/images/home-banner.png" alt="Style House" class="hero" style="height:200px; object-fit:cover;" onerror="this.style.display='none'">
      <div class="hero-overlay"></div>
      <div class="hero-title">Style House</div>
    </div>

    <div class="px-4 -mt-6">
      <!-- Quick actions -->
      <div class="grid-2 gap-2 bg-white p-4 rounded-2xl border-2 mb-4" style="border-color: var(--green);">
        <button class="btn" onclick="window.location.hash='recharge'">Recharge</button>
        <button class="btn" onclick="window.location.hash='withdraw'">Withdraw</button>
        <button class="btn" onclick="window.location.hash='team'">Team</button>
        <button class="btn" id="checkin-btn">Check in</button>
      </div>

      <!-- Balance -->
      <div class="grid-2 mb-4">
        <div class="card text-center">
          <p class="text-muted">Account balance</p>
          <p class="text-2xl font-black" style="color: var(--red);">RWF ${(user.balance || 0).toFixed(2)}</p>
        </div>
        <div class="card text-center">
          <p class="text-muted">Cumulative income</p>
          <p class="text-2xl font-black" style="color: var(--red);">RWF ${(user.cumulativeIncome || 0).toFixed(2)}</p>
        </div>
      </div>

      <!-- Products preview -->
      <h2 class="text-lg font-black text-center mb-2" style="color: var(--green-dark);">Products</h2>
      <div id="home-products" class="grid-2"></div>
      <button class="btn btn-secondary mt-2" onclick="window.location.hash='product'">See all products</button>

      <!-- Team stats -->
      <div class="grid-2 mt-4">
        <div class="card text-center">
          <p class="text-muted">Team members</p>
          <p class="text-2xl font-black" style="color: var(--red);">${team.totalUsers || 0}</p>
        </div>
        <div class="card text-center">
          <p class="text-muted">Team purchases</p>
          <p class="text-2xl font-black" style="color: var(--red);">RWF ${(team.totalRewards || 0).toFixed(2)}</p>
        </div>
      </div>
    </div>
  `;

  // Load products preview
  try {
    const products = await apiCall('/products');
    const container = document.getElementById('home-products');
    container.innerHTML = products.slice(0, 4).map(p => `
      <div class="product-card">
        <img src="assets/images/product-${p._id}.png" alt="${p.name}" onerror="this.style.display='none'">
        <p class="font-black text-sm mt-1" style="color: var(--green-dark);">${p.name}</p>
        <p class="font-black text-sm" style="color: var(--red);">RWF ${p.price}</p>
        <p class="text-xs" style="color: var(--green-dark);">Daily: RWF ${p.dailyIncome}</p>
        <button class="btn btn-sm mt-1" data-id="${p._id}" data-price="${p.price}">Buy</button>
      </div>
    `).join('');
    // Buy buttons
    container.querySelectorAll('[data-id]').forEach(btn => {
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

  // Check-in
  document.getElementById('checkin-btn').addEventListener('click', async () => {
    try {
      const data = await checkin();
      toastSuccess(`Check-in successful! +RWF ${data.amount || 100}`);
      const fresh = await getMe();
      user.balance = fresh.balance;
      user.cumulativeIncome = fresh.cumulativeIncome;
      localStorage.setItem('user', JSON.stringify(user));
      renderHome(); // Refresh
    } catch (err) {
      toastError(err.message || 'Already checked in today');
    }
  });
}
