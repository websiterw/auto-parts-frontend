import { getProducts, purchaseProduct, apiCall } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderProduct() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  // Fetch all products (for buying)
  let allProducts = [];
  try {
    const res = await getProducts();
    allProducts = res;
  } catch (e) {
    // fallback dummy
    allProducts = [
      { _id: 'vip1', name: 'VIP1 Anywheel Bike', price: 6000, termDays: 180, dailyIncome: 1300, totalIncome: 234000, level: 1 },
      { _id: 'vip2', name: 'VIP2 Anywheel Bike', price: 12000, termDays: 180, dailyIncome: 2800, totalIncome: 504000, level: 2 },
      { _id: 'vip3', name: 'VIP3 Electric Scooter', price: 24000, termDays: 180, dailyIncome: 6000, totalIncome: 1080000, level: 3 },
      { _id: 'vip4', name: 'VIP4 Premium E-Bike', price: 48000, termDays: 180, dailyIncome: 12500, totalIncome: 2250000, level: 4 },
      { _id: 'vip5', name: 'VIP5 Elite E-Bike', price: 96000, termDays: 180, dailyIncome: 25000, totalIncome: 4500000, level: 5 },
      { _id: 'vip6', name: 'VIP6 Ultimate E-Bike', price: 192000, termDays: 180, dailyIncome: 50000, totalIncome: 9000000, level: 6 }
    ];
  }

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = user.accountNumber === 'admin';

  let currentView = 'products'; // 'products' or 'income'

  // Fetch user's investments (for "My product")
  let myInvestments = [];
  try {
    const res = await apiCall('/investments');
    myInvestments = res;
  } catch (e) {
    // fallback dummy
    myInvestments = [
      { productName: 'VIP1 Anywheel Bike', price: 6000, dailyIncome: 1300, received: 8400, totalIncome: 234000, purchaseDate: '07/19/2026 08:15:06', daysRemaining: '7/180', productId: 'vip1' }
    ];
  }

  // Fetch income transactions (for "My income")
  let incomeTransactions = [];
  try {
    const res = await apiCall('/transactions');
    incomeTransactions = res.filter(t => t.type === 'product_income');
  } catch (e) {
    // fallback
    incomeTransactions = [
      { amount: 1300, description: 'Daily income from VIP1 Anywheel Bike', createdAt: '07/26/2026 08:15:06' }
    ];
  }
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);

  function renderView() {
    let content = '';
    if (currentView === 'products') {
      // Show user's investments
      if (myInvestments.length === 0) {
        content = `<div class="card" style="text-align:center; padding:20px; color:#b0baca;">You haven't purchased any product yet.</div>`;
      } else {
        content = `
          <div style="margin-top:12px;">
            ${myInvestments.map(inv => `
              <div class="product-card" style="padding:12px; margin-bottom:12px; display:flex; gap:12px; align-items:center; background:#141c2b; border-radius:12px; border:1px solid #1e2838;">
                <img src="assets/images/product-${inv.productId || 'vip1'}.png" alt="${inv.productName}" style="width:80px; height:80px; object-fit:cover; border-radius:8px; background:#2a3040;" onerror="this.style.display='none'">
                <div style="flex:1;">
                  <h3 style="color:#fff; font-size:16px; margin:0;">${inv.productName}</h3>
                  <p style="color:#b0baca; font-size:13px; margin:2px 0;">Price: <span style="color:#FF6B00; font-weight:700;">RWF ${inv.price.toLocaleString()}</span></p>
                  <p style="color:#b0baca; font-size:13px; margin:2px 0;">Daily income: <span style="color:#4caf50;">RWF ${inv.dailyIncome.toLocaleString()}</span></p>
                  <p style="color:#b0baca; font-size:13px; margin:2px 0;">Received: RWF ${inv.received || 0}</p>
                  <p style="color:#b0baca; font-size:13px; margin:2px 0;">Total income: RWF ${inv.totalIncome.toLocaleString()}</p>
                  <p style="color:#b0baca; font-size:13px; margin:2px 0;">Term: ${inv.daysRemaining || inv.termDays || 0} days remaining</p>
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
      // Also show all products for buying (optional – keep as "Buy Products" section)
      content += `
        <h4 style="color:#fff; margin:20px 0 12px;">Available Products</h4>
        ${allProducts.map(p => `
          <div class="product-card" style="padding:12px; margin-bottom:12px; display:flex; gap:12px; align-items:center; background:#141c2b; border-radius:12px; border:1px solid #1e2838;">
            <img src="assets/images/product-vip${p.level || 1}.png" alt="${p.name}" style="width:80px; height:80px; object-fit:cover; border-radius:8px; background:#2a3040;" onerror="this.style.display='none'">
            <div style="flex:1;">
              <h3 style="color:#fff; font-size:16px; margin:0;">${p.name}</h3>
              <p style="color:#b0baca; font-size:13px; margin:2px 0;">Price: <span style="color:#FF6B00; font-weight:700;">RWF ${p.price.toLocaleString()}</span></p>
              <p style="color:#b0baca; font-size:13px; margin:2px 0;">Term: ${p.termDays}-day</p>
              <p style="color:#b0baca; font-size:13px; margin:2px 0;">Daily income: <span style="color:#4caf50;">RWF ${p.dailyIncome.toLocaleString()}</span></p>
              <p style="color:#b0baca; font-size:13px; margin:2px 0;">Total income: RWF ${p.totalIncome.toLocaleString()}</p>
            </div>
            <button class="btn product-buy" data-id="${p._id}" data-price="${p.price}" style="width:auto; padding:8px 16px; font-size:13px;">BUY NOW</button>
          </div>
        `).join('')}
      `;
      if (isAdmin) {
        content += `
          <div class="card" style="margin-top:20px; padding:16px; border:1px solid #FF6B00;">
            <h4 style="color:#FF6B00;">Admin: Add New Product</h4>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
              <input id="prod-name" placeholder="Name" style="padding:8px; border-radius:6px; background:#0a0e17; color:#fff; border:1px solid #2a3040;">
              <input id="prod-price" type="number" placeholder="Price" style="padding:8px; border-radius:6px; background:#0a0e17; color:#fff; border:1px solid #2a3040;">
              <input id="prod-term" type="number" placeholder="Term (days)" style="padding:8px; border-radius:6px; background:#0a0e17; color:#fff; border:1px solid #2a3040;">
              <input id="prod-daily" type="number" placeholder="Daily income" style="padding:8px; border-radius:6px; background:#0a0e17; color:#fff; border:1px solid #2a3040;">
              <input id="prod-total" type="number" placeholder="Total income" style="padding:8px; border-radius:6px; background:#0a0e17; color:#fff; border:1px solid #2a3040;">
              <input id="prod-level" type="number" placeholder="Level" style="padding:8px; border-radius:6px; background:#0a0e17; color:#fff; border:1px solid #2a3040;">
            </div>
            <button class="btn" id="prod-add" style="margin-top:8px; padding:8px;">Add Product</button>
          </div>
        `;
      }
    } else {
      // Income view
      content = `
        <div style="margin-top:12px;">
          <div class="card" style="background:#0a0e17; text-align:center; padding:16px;">
            <p style="color:#b0baca;">Product income is settled every 24 hours</p>
            <p style="color:#b0baca;">You can purchase multiple devices to increase your income</p>
            <p style="font-size:24px; font-weight:700; color:#FF6B00; margin:8px 0;">RWF ${totalIncome.toFixed(2)}</p>
            <p style="color:#b0baca;">Total Income</p>
          </div>
          ${incomeTransactions.length === 0 ? `
            <div class="card" style="text-align:center; color:#b0baca; padding:20px;">No income yet.</div>
          ` : incomeTransactions.map(t => `
            <div class="product-card" style="padding:12px; background:#141c2b; border-radius:12px; margin-bottom:8px; border:1px solid #1e2838; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <p style="color:#b0baca; font-size:13px;">${t.description || 'Income'}</p>
                <p style="color:#6a7488; font-size:11px;">${new Date(t.createdAt).toLocaleString()}</p>
              </div>
              <p style="color:#4caf50; font-weight:600;">+RWF ${t.amount.toFixed(2)}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    app.innerHTML = `
      <div style="padding: 12px 0 8px;">

        <!-- Header Card: My product > | My income > -->
        <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:#141c2b; border-radius:12px; margin-bottom:16px;">
          <button id="view-products" style="background:none; border:none; color:${currentView === 'products' ? '#FF6B00' : '#6a7488'}; font-size:15px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:4px;">
            My product <i class="fas fa-chevron-right" style="font-size:12px;"></i>
          </button>
          <button id="view-income" style="background:none; border:none; color:${currentView === 'income' ? '#FF6B00' : '#6a7488'}; font-size:15px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:4px;">
            My income <i class="fas fa-chevron-right" style="font-size:12px;"></i>
          </button>
        </div>

        ${content}
      </div>
    `;

    // Tab listeners
    document.getElementById('view-products').addEventListener('click', () => {
      currentView = 'products';
      renderView();
    });
    document.getElementById('view-income').addEventListener('click', () => {
      currentView = 'income';
      renderView();
    });

    // Buy buttons (for "Available Products")
    document.querySelectorAll('.product-buy').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const productId = e.target.dataset.id;
        const price = parseFloat(e.target.dataset.price);
        const user = JSON.parse(localStorage.getItem('user')) || { balance: 0 };
        if (user.balance < price) {
          window.toastError('Insufficient balance');
          return;
        }
        try {
          await purchaseProduct(productId);
          window.toastSuccess('Purchase successful!');
          user.balance -= price;
          localStorage.setItem('user', JSON.stringify(user));
          setTimeout(() => window.location.hash = 'product', 1500);
        } catch (err) {
          window.toastError(err.message || 'Purchase failed');
        }
      });
    });

    // Admin add product
    const addBtn = document.getElementById('prod-add');
    if (addBtn) {
      addBtn.addEventListener('click', async () => {
        const name = document.getElementById('prod-name').value.trim();
        const price = parseFloat(document.getElementById('prod-price').value);
        const termDays = parseInt(document.getElementById('prod-term').value);
        const dailyIncome = parseFloat(document.getElementById('prod-daily').value);
        const totalIncome = parseFloat(document.getElementById('prod-total').value);
        const level = parseInt(document.getElementById('prod-level').value);
        if (!name || !price || !termDays || !dailyIncome || !totalIncome || !level) {
          window.toastError('Fill all fields');
          return;
        }
        try {
          await apiCall('/products', {
            method: 'POST',
            body: JSON.stringify({ name, price, termDays, dailyIncome, totalIncome, level })
          });
          window.toastSuccess('Product added!');
          setTimeout(() => window.location.hash = 'product', 500);
        } catch (err) {
          window.toastError(err.message);
        }
      });
    }
  }

  renderView();

  // Bottom nav highlight
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const activeNav = document.querySelector('.nav-item[data-page="product"]');
  if (activeNav) activeNav.classList.add('active');
}