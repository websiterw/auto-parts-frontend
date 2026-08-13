import { getInvestments } from '../api.js';

export async function renderMyProduct() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  let investments = [];
  try {
    investments = await getInvestments();
  } catch (e) {}
  const totalDaily = investments.reduce((s, i) => s + (i.dailyIncome || 0), 0);

  app.innerHTML = `
    <div style="padding: 16px 0 8px;">
      <h2 class="page-title">My Products</h2>
      <div style="display:flex; gap:10px; margin-bottom:12px;">
        <div class="card" style="flex:1; text-align:center; padding:12px;">
          <p style="color:#b0baca; font-size:12px;">Active products</p>
          <p style="font-size:20px; font-weight:700;">${investments.length}</p>
        </div>
        <div class="card" style="flex:1; text-align:center; padding:12px;">
          <p style="color:#b0baca; font-size:12px;">Daily income</p>
          <p style="font-size:20px; font-weight:700; color:#4caf50;">RWF ${totalDaily.toFixed(2)}</p>
        </div>
      </div>
      ${investments.length === 0 ? `
        <div class="card" style="text-align:center; padding:20px; color:#b0baca;">No active products.</div>
      ` : investments.map(inv => `
        <div class="product-card" style="padding:12px; display:flex; gap:12px; align-items:center;">
          <img src="assets/images/product-${inv.productId || 'default'}.png" alt="${inv.productName}" style="width:60px; height:60px; object-fit:cover; border-radius:8px;" onerror="this.style.display='none'">
          <div style="flex:1;">
            <h3 style="font-size:15px;">${inv.productName}</h3>
            <p style="font-size:13px; color:#b0baca;">Daily income: <span style="color:#4caf50;">RWF ${inv.dailyIncome}</span></p>
            <p style="font-size:13px; color:#b0baca;">Received: RWF ${inv.totalReceived || 0}</p>
            <div style="background:#1e2838; height:4px; border-radius:4px; margin:4px 0; overflow:hidden;">
              <div style="background:#FF6B00; height:100%; width:${((inv.termDays - inv.daysRemaining) / inv.termDays * 100) || 0}%;"></div>
            </div>
            <p style="font-size:12px; color:#b0baca;">${inv.daysRemaining || 0} days remaining</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelector('.nav-item[data-page="myproduct"]')?.classList.add('active');
}
