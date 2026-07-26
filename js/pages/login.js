import { login } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export function renderLogin() {
  const app = document.getElementById('app');
  app.className = 'auth-page';

  app.innerHTML = `
    <!-- Full banner image (replace with your own login.png) -->
    <img src="assets/images/login.png" alt="Login" style="width:100%; border-radius:16px 16px 0 0; margin-bottom:20px;" onerror="this.style.display='none'">

    <div class="auth-header" style="margin-top:-10px;">
      <h1 style="font-size:24px;">AUTO PARTS</h1>
      <p class="sub" style="color:#888;">+250 Enter phone number</p>
    </div>

    <div class="auth-card">
      <div class="input-group">
        <label>+250 Enter phone number</label>
        <input type="text" id="login-account" placeholder="Enter phone number" style="padding:14px;">
      </div>
      <div class="input-group">
        <label>Enter password</label>
        <input type="password" id="login-password" placeholder="Enter password" style="padding:14px;">
      </div>

      <button class="auth-btn" id="login-btn" style="padding:16px;">Login</button>

      <div class="auth-footer" style="margin-top:12px;">
        <a href="#" class="link" id="go-to-register" style="font-size:16px;">Go to register ></a>
      </div>
    </div>
  `;

  document.getElementById('login-btn').addEventListener('click', async () => {
    const account = document.getElementById('login-account').value.trim();
    const pass = document.getElementById('login-password').value;

    if (!account || !pass) {
      window.toastError('Please enter account and password');
      return;
    }

    try {
      const data = await login(account, pass);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.toastSuccess('Login successful!');
      setTimeout(() => window.location.hash = 'home', 1000);
    } catch (err) {
      window.toastError(err.message);
    }
  });

  document.getElementById('go-to-register').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = 'register';
  });

  document.getElementById('bottom-nav').classList.remove('show');
}