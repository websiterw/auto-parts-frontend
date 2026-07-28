// Import all page renderers
import * as api from './api.js';
import { showToast, toastError, toastSuccess, toastInfo } from './api.js';

// Auth pages
import { renderRegister } from './pages/register.js';
import { renderLogin } from './pages/login.js';

// Main app pages
import { renderHome } from './pages/home.js';
import { renderProduct } from './pages/product.js';
import { renderTeam } from './pages/team.js';
import { renderRecharge } from './pages/recharge.js';
import { renderWithdraw } from './pages/withdraw.js';
import { renderMine } from './pages/mine.js';
import { renderCheckin } from './pages/checkin.js';
import { renderTask } from './pages/task.js';
import { renderRecords } from './pages/records.js';
import { renderCustomerService } from './pages/customerService.js';

// Bank & records pages
import { renderBindBank } from './pages/bindBank.js';
import { renderBankList } from './pages/bankList.js';
import { renderWithdrawalRecords } from './pages/withdrawalRecords.js';
import { renderRechargeRecords } from './pages/rechargeRecords.js';

// Team records
import { renderTeamRecords } from './pages/teamRecords.js';

// New pages
import { renderChangePassword } from './pages/changePassword.js';
import { renderRedeemGift } from './pages/redeemGift.js';
import { renderInfoPage } from './pages/infoPage.js';

// Expose API and toast functions globally
window.api = api;
window.toastError = toastError;
window.toastSuccess = toastSuccess;
window.toastInfo = toastInfo;
window.showToast = showToast;

// Route map – all pages
const routes = {
  // Auth
  register: renderRegister,
  login: renderLogin,

  // Main tabs
  home: renderHome,
  product: renderProduct,
  team: renderTeam,
  mine: renderMine,

  // Functions
  recharge: renderRecharge,
  withdraw: renderWithdraw,
  checkin: renderCheckin,
  task: renderTask,
  records: renderRecords,
  customerService: renderCustomerService,

  // Bank & records
  bindBank: renderBindBank,
  bankList: renderBankList,
  withdrawalRecords: renderWithdrawalRecords,
  rechargeRecords: renderRechargeRecords,
  teamRecords: renderTeamRecords,

  // More items
  changePassword: renderChangePassword,
  redeemGift: renderRedeemGift,

  // Static info pages (using renderInfoPage)
  about: renderInfoPage('About us', `
    <p>Auto parts is a leading investment platform that offers daily returns through our innovative bike-sharing model.</p>
    <p>We are committed to providing secure and profitable opportunities for our investors.</p>
  `),
  regulation: renderInfoPage('Regulation', `
    <p>All transactions on this platform comply with local and international financial regulations.</p>
    <p>We are licensed and regulated by the relevant authorities.</p>
  `),
  reportShare: renderInfoPage('Report Share', `
    <p>Share your referral report with friends and earn additional rewards.</p>
    <p>Use your referral link to invite others and earn commissions.</p>
  `)
};

// ============================================================
// MAIN ROUTER – PRESERVES QUERY STRING FOR REFERRAL CODE
// ============================================================
function loadPage() {
  // 1. Get the full hash (including query string)
  const fullHash = window.location.hash; // e.g., "#register?code=BN1EL"
  
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
    const mainPages = ['home', 'product', 'team', 'mine'];

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
