const API_BASE = 'https://auto-parts-backend.onrender.com/api'; // Change to production URL when deploying

// Helper to get token
const getToken = () => localStorage.getItem('token');

// ============================================
// GENERIC API CALLER (with auth)
// ============================================
export const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'x-auth-token': token }),
    ...options.headers
  };
  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Request failed');
  return data;
};

// ============================================
// PUBLIC SETTINGS (no auth needed)
// ============================================
export const getPublicSettings = async () => {
  const res = await fetch(`${API_BASE}/settings/public`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.msg || 'Failed to fetch settings');
  return data;
};

// ============================================
// AUTH
// ============================================
export const register = (accountNumber, password, invitationCode) =>
  apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ accountNumber, password, invitationCode })
  });

export const login = (accountNumber, password) =>
  apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ accountNumber, password })
  });

export const getMe = () => apiCall('/auth/me');

// ============================================
// PRODUCTS
// ============================================
export const getProducts = () => apiCall('/products');
export const purchaseProduct = (productId) =>
  apiCall('/investments/purchase', {
    method: 'POST',
    body: JSON.stringify({ productId })
  });

// ============================================
// INVESTMENTS
// ============================================
export const getInvestments = () => apiCall('/investments');

// ============================================
// TEAM (GET)
// ============================================
export const getTeamData = () => apiCall('/team');

// ============================================
// TRANSACTIONS
// ============================================
export const getTransactions = () => apiCall('/transactions');

// ============================================
// WITHDRAWALS
// ============================================
export const requestWithdrawal = (data) =>
  apiCall('/withdrawals/request', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const getWithdrawals = () => apiCall('/withdrawals');

// ============================================
// RECHARGES
// ============================================
export const requestRecharge = (data) =>
  apiCall('/recharges/request', {
    method: 'POST',
    body: JSON.stringify(data)
  });

export const getRecharges = () => apiCall('/recharges');

// ============================================
// CHECK-IN
// ============================================
export const checkin = () => apiCall('/checkin', { method: 'POST' });

// ============================================
// TASKS
// ============================================
export const getTasks = () => apiCall('/tasks');

// ============================================
// GIFT CODES
// ============================================
export const redeemGift = (code) =>
  apiCall('/gift/redeem', {
    method: 'POST',
    body: JSON.stringify({ code })
  });

// ============================================
// TOAST NOTIFICATIONS
// ============================================
export function showToast(message, type = 'error') {
  const existing = document.getElementById('global-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'global-toast';
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'error' ? '#d32f2f' : type === 'success' ? '#2e7d32' : '#FF6B00'};
    color: #fff;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 15px;
    z-index: 999999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    animation: slideDown 0.3s ease;
    max-width: 90%;
    text-align: center;
    pointer-events: none;
  `;

  const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
  toast.innerHTML = `${icon} ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }
  }, 1500);

  if (!document.getElementById('toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
}

export const toastError = (msg) => showToast(msg, 'error');
export const toastSuccess = (msg) => showToast(msg, 'success');
export const toastInfo = (msg) => showToast(msg, 'info');