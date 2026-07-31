import { getProducts, purchaseProduct, apiCall } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

// ---- Timer helper ----
function getTimeRemaining(lastIncomeDate) {
  const nextIncome = new Date(lastIncomeDate);
  nextIncome.setHours(nextIncome.getHours() + 24);
  const now = new Date();
  const diff = nextIncome - now;
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, done: true };
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds, done: false };
}

function formatTime(h, m, s) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

let timerInterval = null;

export async function renderProduct() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  // Clear any previous timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // Fetch products
  let allProducts = [];
  try {
    const res = await getProducts();
    allProducts = res;
  } catch (e) {
    allProducts = [
      { _id: 'vip1', name: 'Product-1 Auto Parts', price: 6000, termDays: 180, dailyIncome: 1300, totalIncome: 234000, level: 1 },
      { _id: 'vip2', name: 'Product-2 Auto Parts', price: 12000, termDays: 180, dailyIncome: 2800, totalIncome: 504000, level: 2 },
      { _id: 'vip3', name: 'Product-3 Auto Parts', price: 24000, termDays: 180, dailyIncome: 6000, totalIncome: 1080000, level: 3 },
      { _id: 'vip4', name: 'Product-4 Auto Parts', price: 48000, termDays: 180, dailyIncome: 12500, totalIncome: 2250000, level: 4 },
      { _id: 'vip5', name: 'Product-5 Auto Parts', price: 96000, termDays: 180, dailyIncome: 25000, totalIncome: 4500000, level: 5 },
      { _id: 'vip6', name: 'Product-6 Auto Parts', price: 192000, termDays: 180, dailyIncome: 50000, totalIncome: 9000000, level: 6 }
    ];
  }

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isAdmin = user.accountNumber === 'admin';

  let currentView = 'products'; // 'products' | 'myproducts' | 'myincome'

  // User investments
  let myInvestments = [];
  try {
    const res = await apiCall('/investments');
    myInvestments = res;
  } catch (e) { myInvestments = []; }

  // Income transactions
  let incomeTransactions = [];
  let totalIncome = 0;
  try {
    const res = await apiCall('/transactions');
    incomeTransactions = res.filter(t => t.type === 'product_income');
    totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  } catch (e) { incomeTransactions = []; }

  function renderView() {
    let content = '';

    if (currentView === 'products') {
      // ---- All Products view (unchanged) ----
      content = `
        <div style="margin-top:12px;">
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
        </div>
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
    } else if (currentView === 'myproducts') {
      // ---- My Products view with countdown timer ----
      if (myInvestments.length === 0) {
        content = `<div class="card" style="text-align:center; padding:20px; color:#b0baca;">You haven't purchased any product yet.</div>`;
      } else {
        content = `
          <div style="margin-top:12px;" id="my-products-container">
            ${myInvestments.map((inv, idx) => {
              // Calculate remaining time
              const lastIncome = inv.lastIncomeDate || inv.purchasedAt || new Date().toISOString();
              const remaining = getTimeRemaining(lastIncome);
              const timeStr = remaining.done ? 'Processing...' : formatTime(remaining.hours, remaining.minutes, remaining.seconds);
              return `
                <div class="product-card" style="padding:12px; margin-bottom:12px; display:flex; gap:12px; align-items:center; background:#141c2b; border-radius:12px; border:1px solid #1e2838;">
                  <img src="assets/images/product-${inv.productId || 'vip1'}.png" alt="${inv.productName}" style="width:80px; height:80px; object-fit:cover; border-radius:8px; background:#2a3040;" onerror="this.style.display='none'">
                  <div style="flex:1;">
                    <h3 style="color:#fff; font-size:16px; margin:0;">${inv.productName}</h3>
                    <p style="color:#b0baca; font-size:13px; margin:2px 0;">Price: <span style="color:#FF6B00; font-weight:700;">RWF ${inv.price.toLocaleString()}</span></p>
                    <p style="color:#b0baca; font-size:13px; margin:2px 0;">Daily income: <span style="color:#4caf50;">RWF ${inv.dailyIncome.toLocaleString()}</span></p>
                    <p style="color:#b0baca; font-size:13px; margin:2px 0;">Received: RWF ${inv.totalReceived || 0}</p>
                    <p style="color:#b0baca; font-size:13px; margin:2px 0;">Total income: RWF ${inv.totalIncome.toLocaleString()}</p>
                    <p style="color:#b0baca; font-size:13px; margin:2px 0;">Term: ${inv.daysRemaining || inv.termDays || 0} days remaining</p>
                    <p style="color:#FF6B00; font-weight:600; font-size:14px; margin-top:4px;">
                      Next income in: <span class="timer-display" data-index="${idx}" style="font-family: monospace;">${timeStr}</span>
                    </p>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }
    } else if (currentView === 'myincome') {
      // ---- My Income view (unchanged) ----
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
                <p style="color:#b0baca; font-size:14px;">${t.description || 'Income'}</p>
                <p style="color:#6a7488; font-size:12px;">${new Date(t.createdAt).toLocaleString()}</p>
              </div>
              <p style="color:#4caf50; font-weight:600; font-size:16px;">+RWF ${t.amount.toFixed(2)}</p>
            </div>
          `).join('')}
        </div>
      `;
    }

    app.innerHTML = `
      <div style="padding: 12px 0 8px;">
        <h2 style="font-size:22px; font-weight:700; color:#fff; text-align:left; margin:0 0 12px 0;">PRODUCTS</h2>

        <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:10px 16px; background:#141c2b; border-radius:12px; margin-bottom:16px;">
          <button id="view-products" style="background:none; border:none; color:${currentView === 'products' ? '#FF6B00' : '#6a7488'}; font-size:15px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:4px;">
            All Products
          </button>
          <button id="view-myproducts" style="background:none; border:none; color:${currentView === 'myproducts' ? '#FF6B00' : '#6a7488'}; font-size:15px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:4px;">
            My product <i class="fas fa-chevron-right" style="font-size:12px;"></i>
          </button>
          <button id="view-myincome" style="background:none; border:none; color:${currentView === 'myincome' ? '#FF6B00' : '#6a7488'}; font-size:15px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:4px;">
            My income <i class="fas fa-chevron-right" style="font-size:12px;"></i>
          </button>
        </div>

        ${content}
      </div>
    `;

    // ---- Start timer interval if we are in myproducts view ----
    if (currentView === 'myproducts' && myInvestments.length > 0) {
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        const containers = document.querySelectorAll('.timer-display');
        if (containers.length === 0) {
          // If timers disappeared, clear interval
          clearInterval(timerInterval);
          timerInterval = null;
          return;
        }
        containers.forEach((el, idx) => {
          const inv = myInvestments[idx];
          if (!inv) return;
          const lastIncome = inv.lastIncomeDate || inv.purchasedAt || new Date().toISOString();
          const remaining = getTimeRemaining(lastIncome);
          const timeStr = remaining.done ? 'Processing...' : formatTime(remaining.hours, remaining.minutes, remaining.seconds);
          el.textContent = timeStr;
        });
      }, 1000);
    } else {
      // Stop timer if not on myproducts
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    // ---- Event listeners (unchanged) ----
    document.getElementById('view-products').addEventListener('click', () => {
      currentView = 'products';
      renderView();
    });
    document.getElementById('view-myproducts').addEventListener('click', () => {
      currentView = 'myproducts';
      renderView();
    });
    document.getElementById('view-myincome').addEventListener('click', () => {
      currentView = 'myincome';
      renderView();
    });

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
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const activeNav = document.querySelector('.nav-item[data-page="product"]');
  if (activeNav) activeNav.classList.add('active');
}
