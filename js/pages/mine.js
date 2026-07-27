import { getMe } from '../api.js';
import { toastSuccess } from '../api.js';

export async function renderMine() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  // Fetch fresh user data from the backend
  let user = JSON.parse(localStorage.getItem('user')) || {};
  try {
    const fresh = await getMe();
    user = fresh;
    localStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    // fallback to cached user data
  }

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">

      <!-- Profile Header: image + phone + level + exit (inline) -->
      <div class="card" style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="assets/images/profile.png" alt="Profile" style="width:56px; height:56px; border-radius:50%; object-fit:cover; background:#2a3040;" onerror="this.style.display='none'">
          <div>
            <p style="font-weight:600; color:#fff; font-size:16px;">${user.accountNumber || 'N/A'}</p>
            <p style="color:#FF6B00; font-size:13px;">LV${user.level || 1}</p>
          </div>
        </div>
        <button class="btn btn-danger" style="width:auto; padding:6px 16px; font-size:12px;" id="mine-exit">Exit</button>
      </div>

      <!-- Balance & Income -->
      <div style="display:flex; gap:10px; margin:12px 0;">
        <div class="card" style="flex:1; text-align:center; padding:12px;">
          <p style="color:#b0baca; font-size:12px;">Account Balance</p>
          <p style="font-size:20px; font-weight:700; color:#fff;">RWF ${user.balance?.toFixed(2) || '0.00'}</p>
        </div>
        <div class="card" style="flex:1; text-align:center; padding:12px;">
          <p style="color:#b0baca; font-size:12px;">Cumulative Income</p>
          <p style="font-size:20px; font-weight:700; color:#4caf50;">RWF ${user.cumulativeIncome?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <!-- Four Action Buttons -->
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; margin:12px 0;">
        <button class="btn btn-secondary" style="padding:10px 0; font-size:12px;" id="mine-recharge">Recharge</button>
        <button class="btn btn-secondary" style="padding:10px 0; font-size:12px;" id="mine-withdraw">Withdraw</button>
        <button class="btn btn-secondary" style="padding:10px 0; font-size:12px;" id="mine-help">Help</button>
        <button class="btn" style="padding:10px 0; font-size:12px; background:#FF6B00;" id="mine-checkin">Check-in</button>
      </div>

      <!-- Task Center -->
      <div class="card" style="display:flex; align-items:center; gap:12px; padding:12px 16px;">
        <img src="assets/images/task-icon.png" alt="Tasks" style="width:50px; height:50px; border-radius:8px; background:#2a3040;" onerror="this.style.display='none'">
        <div style="flex:1;">
          <p style="font-weight:600; color:#fff;">Task Center</p>
          <p style="font-size:12px; color:#b0baca;">Complete tasks and get generous bonuses</p>
        </div>
        <button class="btn btn-small" style="width:auto; padding:6px 18px;" id="mine-tasks">GO</button>
      </div>

      <!-- More Section – vertical list -->
      <p style="color:#b0baca; font-size:14px; margin:16px 0 8px;">More</p>
      <div style="display:flex; flex-direction:column; gap:6px;">
        <button class="btn btn-secondary" style="text-align:left; padding:12px 16px; font-size:14px; width:100%;" id="mine-about">About us</button>
        <button class="btn btn-secondary" style="text-align:left; padding:12px 16px; font-size:14px; width:100%;" id="mine-regulation">Regulation</button>
        <button class="btn btn-secondary" style="text-align:left; padding:12px 16px; font-size:14px; width:100%;" id="mine-records">Records</button>
        <button class="btn btn-secondary" style="text-align:left; padding:12px 16px; font-size:14px; width:100%;" id="mine-cs">Customer Service</button>
        <button class="btn btn-secondary" style="text-align:left; padding:12px 16px; font-size:14px; width:100%;" id="mine-report">Report Share</button>
        <button class="btn btn-secondary" style="text-align:left; padding:12px 16px; font-size:14px; width:100%;" id="mine-bank">Bind bank card</button>
        <button class="btn btn-secondary" style="text-align:left; padding:12px 16px; font-size:14px; width:100%;" id="mine-pwd">Change Pwd</button>
        <button class="btn btn-secondary" style="text-align:left; padding:12px 16px; font-size:14px; width:100%;" id="mine-gift">Redeem Gift</button>
      </div>
    </div>
  `;

  // Event listeners
  document.getElementById('mine-recharge').addEventListener('click', () => window.location.hash = 'recharge');
  document.getElementById('mine-withdraw').addEventListener('click', () => window.location.hash = 'withdraw');
  document.getElementById('mine-help').addEventListener('click', () => window.location.hash = 'customerService');
  document.getElementById('mine-checkin').addEventListener('click', () => window.location.hash = 'checkin');
  document.getElementById('mine-tasks').addEventListener('click', () => window.location.hash = 'task');
  document.getElementById('mine-records').addEventListener('click', () => window.location.hash = 'records');
  document.getElementById('mine-cs').addEventListener('click', () => window.location.hash = 'customerService');
  document.getElementById('mine-gift').addEventListener('click', () => window.location.hash = 'redeemGift');
  document.getElementById('mine-about').addEventListener('click', () => window.location.hash = 'about');
  document.getElementById('mine-regulation').addEventListener('click', () => window.location.hash = 'regulation');
  document.getElementById('mine-report').addEventListener('click', () => window.location.hash = 'reportShare');
  document.getElementById('mine-bank').addEventListener('click', () => window.location.hash = 'bankList');
  document.getElementById('mine-pwd').addEventListener('click', () => window.location.hash = 'changePassword');

  document.getElementById('mine-exit').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.toastSuccess('Logged out');
    setTimeout(() => window.location.hash = 'login', 500);
  });

  // Bottom nav highlight
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const activeNav = document.querySelector('.nav-item[data-page="mine"]');
  if (activeNav) activeNav.classList.add('active');
}