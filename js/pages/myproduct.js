import { getInvestments } from '../api.js';

export async function renderMyProduct() {
  const app = document.getElementById('app');
  const investments = await getInvestments().catch(() => []);
  const totalDaily = investments.reduce((s, i) => s + (i.dailyIncome || 0), 0);

  app.innerHTML = `
    <div class="hero" style="background: var(--green);">
      <div class="hero-overlay"></div>
      <div class="hero-title">My product</div>
    </div>
    <div class="px-4 -mt-6">
      <div class="grid-2">
        <div class="card text-center"><p class="text-muted">Active products</p><p class="text-2xl font-black" style="color: var(--red);">${investments.length}</p></div>
        <div class="card text-center"><p class="text-muted">Daily income</p><p class="text-2xl font-black" style="color: var(--red);">RWF ${totalDaily.toFixed(2)}</p></div>
      </div>
      ${investments.length === 0 ? `
        <div class="card text-center"><p class="text-muted">No active products.</p>
        <button class="btn" onclick="window.location.hash='product'">Buy a product</button></div>
      ` : investments.map(inv => `
        <div class="product-card flex items-center gap-3">
          <img src="assets/images/product-${inv.productId || 'default'}.png" alt="${inv.productName}" class="w-20 h-20 object-contain rounded-lg" onerror="this.style.display='none'">
          <div class="flex-1">
            <p class="font-black" style="color: var(--green-dark);">${inv.productName}</p>
            <p class="text-sm" style="color: var(--red);">RWF ${inv.dailyIncome}/day</p>
            <p class="text-xs" style="color: var(--green-dark);">Earned: RWF ${inv.totalReceived || 0} · ${inv.daysRemaining || 0} days left</p>
            <div class="w-full h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div class="h-full rounded-full" style="width: ${((inv.termDays - inv.daysRemaining) / inv.termDays * 100) || 0}%; background: var(--green);"></div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
