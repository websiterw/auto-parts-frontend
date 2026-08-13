import { getProducts, apiCall } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderProduct() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  let products = [];
  try {
    products = await getProducts();
  } catch (e) {}

  app.innerHTML = `
    <div style="padding: 16px 0 8px;">
      <h2 class="page-title">Products</h2>
      <div id="product-list" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        ${products.map(p => `
          <div class="product-card" style="padding:12px;">
            <img src="assets/images/product-${p._id}.png" alt="${p.name}" style="width:100%; height:100px; object-fit:cover; border-radius:8px;" onerror="this.style.display='none'">
            <h3 style="font-size:15px; margin:4px 0;">${p.name}</h3>
            <p style="font-size:13px; color:#b0baca;">Price: <span style="color:#FF6B00;">RWF ${p.price}</span></p>
            <p style="font-size:13px; color:#b0baca;">Daily: RWF ${p.dailyIncome}</p>
            <p style="font-size:13px; color:#b0baca;">Term: ${p.termDays} days</p>
            <button class="btn btn-small" style="width:100%; padding:6px 0; font-size:13px;" data-id="${p._id}" data-price="${p.price}">BUY NOW</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.querySelectorAll('[data-id]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const price = parseFloat(e.target.dataset.price);
      const user = JSON.parse(localStorage.getItem('user')) || { balance: 0 };
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

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelector('.nav-item[data-page="product"]')?.classList.add('active');
}
