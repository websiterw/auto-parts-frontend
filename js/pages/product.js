import { getProducts, purchaseProduct, apiCall } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

// Map product level to Lovable names
const productNameMap = {
  1: 'Product 1',
  2: 'Product 2',
  3: 'Product 3',
  4: 'Product 4',
  5: 'Product 5',
  6: 'Product 6',
  7: 'Product 7',
};

export async function renderProduct() {
  const app = document.getElementById('app');
  const user = JSON.parse(localStorage.getItem('user')) || { balance: 0 };
  let products = [];
  try {
    products = await getProducts();
  } catch (e) {}

  app.innerHTML = `
    <div style="position:relative; width:100%; height:180px; background: #22c55e;">
      <img src="assets/images/product-banner.png" alt="Products" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
      <div style="position:absolute; inset:0; background:rgba(0,0,0,0.25);"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:28px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">Products</div>
    </div>
    <div style="padding:0 16px; margin-top:100px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        ${products.map(p => {
          const level = p.level || 1;
          const displayName = productNameMap[level] || p.name;
          return `
            <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid #22c55e;">
              <img src="assets/images/product-vip${level}.png" alt="${displayName}" style="width:100%; height:100px; object-fit:contain; border-radius:8px; background:#f0fdf4;" onerror="this.style.display='none'">
              <p style="font-weight:900; color:#16a34a; font-size:13px; margin-top:6px;">${displayName}</p>
              <p style="font-weight:900; color:#dc2626; font-size:14px;">RWF ${p.price}</p>
              <p style="font-size:12px; color:#16a34a;">Daily: RWF ${p.dailyIncome}</p>
              <p style="font-size:11px; color:#dc2626;">${p.termDays} days total: RWF ${p.totalIncome}</p>
              <button class="product-buy" data-id="${p._id}" data-price="${p.price}" style="width:100%; background:#22c55e; color:#fff; border:none; border-radius:30px; padding:8px; font-weight:700; cursor:pointer; margin-top:8px;">Buy</button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  document.querySelectorAll('.product-buy').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const price = parseFloat(e.target.dataset.price);
      if (user.balance < price) {
        toastError('Insufficient balance');
        return;
      }
      try {
        await purchaseProduct(id);
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
