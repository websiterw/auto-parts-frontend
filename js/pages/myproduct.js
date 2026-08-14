import { getInvestments } from '../api.js';

const productNameMap = {
  1: 'Product 1 · T-shirts',
  2: 'Product 2 · Sneakers',
  3: 'Product 3 · Jeans',
  4: 'Product 4 · Dresses',
  5: 'Product 5 · Leather shoes',
  6: 'Product 6 · Jackets',
  7: 'Product 7 · Bags & accessories',
};

export async function renderMyProduct() {
  const app = document.getElementById('app');
  const investments = await getInvestments().catch(() => []);
  const totalDaily = investments.reduce((s, i) => s + (i.dailyIncome || 0), 0);

  app.innerHTML = `
    <div style="position:relative; width:100%; height:140px; background: #22c55e;">
      <img src="assets/images/myproduct-banner.png" alt="My product" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
      <div style="position:absolute; inset:0; background:rgba(0,0,0,0.25);"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:26px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">My product</div>
    </div>
    <div style="padding:0 16px; margin-top:-10px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
        <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid #22c55e; text-align:center;">
          <p style="color:#6b6b6b; font-size:11px;">Active products</p>
          <p style="font-size:18px; font-weight:900; color:#dc2626;">${investments.length}</p>
        </div>
        <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid #22c55e; text-align:center;">
          <p style="color:#6b6b6b; font-size:11px;">Daily income</p>
          <p style="font-size:18px; font-weight:900; color:#dc2626;">RWF ${totalDaily.toFixed(2)}</p>
        </div>
      </div>

      ${investments.length === 0 ? `
        <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #22c55e; text-align:center; color:#6b6b6b;">
          <p style="font-size:14px;">You have no active product yet.</p>
          <button onclick="window.location.hash='product'" style="background:#22c55e; color:#fff; border:none; border-radius:30px; padding:10px 20px; font-weight:700; cursor:pointer; margin-top:12px;">Buy a product</button>
        </div>
      ` : investments.map(inv => {
        const level = inv.productId || 1;
        const displayName = productNameMap[level] || inv.productName;
        return `
          <div style="background:#fff; border-radius:12px; padding:10px; border:2px solid #22c55e; display:flex; gap:10px; align-items:center; margin-bottom:10px;">
            <img src="assets/images/product-vip${level}.png" alt="${displayName}" style="width:56px; height:56px; object-fit:contain; border-radius:8px; background:#f0fdf4;" onerror="this.style.display='none'">
            <div style="flex:1;">
              <p style="font-weight:900; color:#16a34a; font-size:13px;">${displayName}</p>
              <p style="color:#dc2626; font-size:12px; font-weight:600;">RWF ${inv.dailyIncome}/day</p>
              <p style="color:#16a34a; font-size:11px;">Earned: RWF ${inv.totalReceived || 0} · ${inv.daysRemaining || 0} days left</p>
              <div style="width:100%; height:4px; background:#e5e5e5; border-radius:4px; margin-top:4px; overflow:hidden;">
                <div style="height:100%; background:#22c55e; border-radius:4px; width:${((inv.termDays - inv.daysRemaining) / inv.termDays * 100) || 0}%;"></div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
