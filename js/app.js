// Import all page renderers
import * as api from './api.js';
import { showToast, toastError, toastSuccess, toastInfo } from './api.js';

// Auth pages
import { renderLogin } from './pages/login.js';
import { renderRegister } from './pages/register.js';

// Main pages
import { renderHome } from './pages/home.js';
import { renderProduct } from './pages/product.js';
import { renderMyProduct } from './pages/myproduct.js';
import { renderTeam } from './pages/team.js';
import { renderMine } from './pages/mine.js';
import { renderRecharge } from './pages/recharge.js';
import { renderWithdraw } from './pages/withdraw.js';
import { renderRecords } from './pages/records.js';

window.api = api;
window.toastError = toastError;
window.toastSuccess = toastSuccess;
window.toastInfo = toastInfo;
window.showToast = showToast;

// ============================================================
// REFERRAL CODE PRESERVATION
// ============================================================
// Read the code from the full URL before the router changes anything
const fullUrl = window.location.href;
const match = fullUrl.match(/[?&]code=([^&]+)/);
if (match) {
  window._referralCode = match[1];
  console.log('[app.js] Referral code captured:', window._referralCode);
} else {
  // Also check the hash
  const hash = window.location.hash;
  const hashMatch = hash.match(/[?&]code=([^&]+)/);
  if (hashMatch) {
    window._referralCode = hashMatch[1];
    console.log('[app.js] Referral code from hash:', window._referralCode);
  }
}

const routes = {
  register: renderRegister,
  login: renderLogin,
  home: renderHome,
  product: renderProduct,
  myproduct: renderMyProduct,
  team: renderTeam,
  mine: renderMine,
  recharge: renderRecharge,
  withdraw: renderWithdraw,
  records: renderRecords,
};

function loadPage() {
  let hash = window.location.hash.replace('#', '') || 'register';
  // Remove any query string from the hash if present
  if (hash.includes('?')) {
    hash = hash.split('?')[0];
  }

  const token = localStorage.getItem('token');
  if (!token && hash !== 'register' && hash !== 'login') {
    hash = 'register';
    window.location.hash = 'register';
  }

  const render = routes[hash];
  if (render) {
    render();
    const nav = document.getElementById('bottom-nav');
    const mainPages = ['home', 'product', 'myproduct', 'team', 'mine'];
    if (mainPages.includes(hash) && token) {
      nav.classList.add('show');
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      const active = document.querySelector(`.nav-item[data-page="${hash}"]`);
      if (active) active.classList.add('active');
    } else {
      nav.classList.remove('show');
    }
  } else {
    window.location.hash = 'register';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      window.location.hash = page;
    });
  });
  window.addEventListener('hashchange', loadPage);
  loadPage();
});
