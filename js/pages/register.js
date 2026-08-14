import { register } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export function renderRegister() {
  const app = document.getElementById('app');
  // Read code from the hash (e.g., #register?code=ABC12)
  let code = '';
  const hash = window.location.hash;
  if (hash.includes('?code=')) {
    const match = hash.match(/[?&]code=([^&]+)/);
    if (match) code = match[1];
  }

  app.innerHTML = `
    <div style="position:relative; width:100%; height:280px; background: #22c55e;">
      <img src="assets/images/register-banner.png" alt="Style House" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
      <div style="position:absolute; inset:0; background:rgba(0,0,0,0.25);"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:32px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">Style House</div>
    </div>
    <div style="padding:0 16px; margin-top:-24px;">
      <form id="register-form" style="background:#fff; border-radius:32px 32px 0 0; border-top:4px solid #dc2626; padding:24px 24px 32px;">
        <h1 style="text-align:center; font-size:36px; font-weight:900; color:#dc2626; margin-bottom:24px;">REGISTER</h1>
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; align-items:center; border:2px solid #22c55e; border-radius:12px; padding:12px 16px;">
            <input id="reg-account" type="text" placeholder="Account number" style="flex:1; outline:none; border:none; background:transparent; color:#16a34a; font-size:16px;">
          </div>
          <div style="display:flex; align-items:center; border:2px solid #22c55e; border-radius:12px; padding:12px 16px;">
            <input id="reg-password" type="password" placeholder="Enter password" style="flex:1; outline:none; border:none; background:transparent; color:#16a34a; font-size:16px;">
          </div>
          <div style="display:flex; align-items:center; border:2px solid #22c55e; border-radius:12px; padding:12px 16px;">
            <input id="reg-password2" type="password" placeholder="Re-enter password" style="flex:1; outline:none; border:none; background:transparent; color:#16a34a; font-size:16px;">
          </div>
          <div style="display:flex; align-items:center; border:2px solid #22c55e; border-radius:12px; padding:12px 16px;">
            <input id="reg-invite" type="text" placeholder="Invitation code (optional)" value="${code}" style="flex:1; outline:none; border:none; background:transparent; color:#16a34a; font-size:16px;">
          </div>
        </div>
        <div style="text-align:right; margin-top:16px;">
          <a href="#login" style="color:#dc2626; font-weight:600; text-decoration:underline;">Go to login &gt;</a>
        </div>
        <button type="submit" style="width:100%; background:#dc2626; color:#fff; border:none; border-radius:30px; padding:16px; font-size:20px; font-weight:900; margin-top:16px; cursor:pointer;">Register</button>
        <div id="reg-msg" style="margin-top:12px; text-align:center; font-size:14px; font-weight:500; color:#dc2626;"></div>
      </form>
    </div>
  `;

  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const account = document.getElementById('reg-account').value.trim();
    const pass = document.getElementById('reg-password').value;
    const pass2 = document.getElementById('reg-password2').value;
    const invite = document.getElementById('reg-invite').value.trim();
    if (!account || !pass || !pass2) {
      toastError('Please fill all fields');
      return;
    }
    if (pass !== pass2) {
      toastError('Passwords do not match');
      return;
    }
    try {
      const data = await register(account, pass, invite);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toastSuccess('Registration successful!');
      setTimeout(() => window.location.hash = 'home', 500);
    } catch (err) {
      toastError(err.message);
    }
  });
}
