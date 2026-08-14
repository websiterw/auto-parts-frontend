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

// ============================================================
// MAIN ROUTER – PRESERVES QUERY STRING FOR REFERRAL CODE
// ============================================================
function loadPage() {
  // 1. Get the full hash (including query string)
  const fullHash = window.location.hash; // e.g., "#register?code=HVOMU"

  // 2. Extract page name and query string
  let page = 'register';
  let query = '';
  if (fullHash) {
    const parts = fullHash.split('?');
    page = parts[0].replace('#', '') || 'register';
    query = parts[1] || '';
  }

  // 3. If there's a query string with a code, store it globally
  if (query.includes('code=')) {
    const match = query.match(/code=([^&]+)/);
    if (match) window._referralCode = match[1];
  } else {
    window._referralCode = '';
  }

  const token = localStorage.getItem('token');

  // 4. If not logged in and not on register/login, go to register (but keep the query!)
  if (!token && page !== 'register' && page !== 'login') {
    page = 'register';
    // Preserve the query string if it exists
    const newHash = query ? `#register?${query}` : '#register';
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }
  }

  // 5. Render the page
  const render = routes[page];
  if (render) {
    render();

    const nav = document.getElementById('bottom-nav');
    const mainPages = ['home', 'product', 'myproduct', 'team', 'mine'];

    if (mainPages.includes(page) && token) {
      nav.classList.add('show');
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      const activeNav = document.querySelector(`.nav-item[data-page="${page}"]`);
      if (activeNav) activeNav.classList.add('active');
    } else {
      nav.classList.remove('show');
    }
  } else {
    window.location.hash = 'register';
  }
}

// Navigation clicks
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

// Expose reload function for manual refresh (e.g., after login)
window.reloadPage = loadPage;
