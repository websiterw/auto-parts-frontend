import { redeemGift } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export function renderRedeemGift() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <button id="gift-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">Redeem Gift</h2>
      </div>

      <div class="card">
        <p style="color:#b0baca; font-size:14px;">You can get gift codes in the group</p>
        <div class="input-group">
          <label>Official Telegram Group</label>
          <input type="text" id="gift-code" placeholder="*Gift Code" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid #2a3040; background:#0a0e17; color:#fff; font-size:15px;">
        </div>
        <button class="btn" id="gift-submit" style="margin-top:8px;">Confirm</button>
      </div>
    </div>
  `;

  document.getElementById('gift-back').addEventListener('click', () => window.location.hash = 'mine');

  document.getElementById('gift-submit').addEventListener('click', async () => {
    const code = document.getElementById('gift-code').value.trim();
    if (!code) {
      window.toastError('Please enter a gift code.');
      return;
    }
    try {
      const data = await redeemGift(code);
      // Show only the amount gained, NOT the total balance
      window.toastSuccess(`🎁 Gift redeemed! +RWF ${data.amount}`);
      // Update local user balance
      const user = JSON.parse(localStorage.getItem('user'));
      user.balance = data.balance;
      localStorage.setItem('user', JSON.stringify(user));
      setTimeout(() => window.location.hash = 'mine', 1500);
    } catch (err) {
      window.toastError(err.message || 'Invalid or expired code.');
    }
  });

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}
