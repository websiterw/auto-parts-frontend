import { apiCall } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export function renderChangePassword() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <button id="pwd-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">Change Password</h2>
      </div>

      <div class="card">
        <div class="input-group">
          <label>Current Password</label>
          <input type="password" id="pwd-current" placeholder="Enter current password" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid #2a3040; background:#0a0e17; color:#fff; font-size:15px;">
        </div>
        <div class="input-group">
          <label>New Password</label>
          <input type="password" id="pwd-new" placeholder="Enter new password" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid #2a3040; background:#0a0e17; color:#fff; font-size:15px;">
        </div>
        <div class="input-group">
          <label>Confirm New Password</label>
          <input type="password" id="pwd-confirm" placeholder="Re-enter new password" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid #2a3040; background:#0a0e17; color:#fff; font-size:15px;">
        </div>
        <button class="btn" id="pwd-submit" style="margin-top:8px;">Confirm</button>
      </div>
    </div>
  `;

  document.getElementById('pwd-back').addEventListener('click', () => window.location.hash = 'mine');

  document.getElementById('pwd-submit').addEventListener('click', async () => {
    const current = document.getElementById('pwd-current').value;
    const newPwd = document.getElementById('pwd-new').value;
    const confirm = document.getElementById('pwd-confirm').value;

    if (!current || !newPwd || !confirm) {
      window.toastError('Please fill all fields.');
      return;
    }
    if (newPwd.length < 6) {
      window.toastError('New password must be at least 6 characters.');
      return;
    }
    if (newPwd !== confirm) {
      window.toastError('Passwords do not match.');
      return;
    }

    try {
      // Call backend API (you need to implement this endpoint)
      await apiCall('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword: current, newPassword: newPwd })
      });
      window.toastSuccess('Password changed successfully!');
      setTimeout(() => window.location.hash = 'mine', 1500);
    } catch (err) {
      window.toastError(err.message || 'Failed to change password.');
    }
  });

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}