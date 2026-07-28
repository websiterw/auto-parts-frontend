import { register } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export function renderRegister() {
  const app = document.getElementById('app');
  app.className = 'auth-page';

  app.innerHTML = `
    <div class="auth-header">
      <div style="position:relative;">
        <img src="assets/images/logo.png" alt="Auto parts" class="auth-logo" 
             onerror="this.style.display='none'; this.parentElement.querySelector('.logo-fallback').style.display='block';">
        <div class="logo-fallback">🚲</div>
      </div>
      <h1>AUTO PARTS</h1>
      <p class="sub">REGISTER</p>
    </div>

    <div class="auth-card">
      <div class="input-group">
        <label>Account number</label>
        <input type="text" id="reg-account" placeholder="Enter account number">
      </div>
      <div class="input-group">
        <label>Enter password</label>
        <input type="password" id="reg-password" placeholder="Enter password">
      </div>
      <div class="input-group">
        <label>Re-enter password</label>
        <input type="password" id="reg-password2" placeholder="Re-enter password">
      </div>
      <div class="input-group">
        <label>Invitation code (optional)</label>
        <input type="text" id="reg-invite" placeholder="Enter invitation code">
      </div>

      <button class="auth-btn" id="register-btn">Register</button>

      <div class="auth-footer">
        Already have an account? <a href="#" class="link" id="go-to-login">Login</a>
      </div>
    </div>
  `;

  // ---- Auto‑fill invitation code from URL parameters ----
  const urlParams = new URLSearchParams(window.location.search);
  // Try multiple parameter names
  const code = urlParams.get('code') || urlParams.get('ref') || urlParams.get('reffcode');
  if (code) {
    const inviteInput = document.getElementById('reg-invite');
    if (inviteInput) inviteInput.value = code;
  }

  // Event listeners (unchanged)
  document.getElementById('register-btn').addEventListener('click', async () => {
    const account = document.getElementById('reg-account').value.trim();
    const pass = document.getElementById('reg-password').value;
    const pass2 = document.getElementById('reg-password2').value;
    const invite = document.getElementById('reg-invite').value.trim();

    if (!account || !pass || !pass2) {
      window.toastError('Please fill all required fields');
      return;
    }
    if (pass !== pass2) {
      window.toastError('Passwords do not match');
      return;
    }

    try {
      const data = await register(account, pass, invite);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.toastSuccess('Registration successful!');
      setTimeout(() => window.location.hash = 'home', 1000);
    } catch (err) {
      window.toastError(err.message);
    }
  });

  document.getElementById('go-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = 'login';
  });

  document.getElementById('bottom-nav').classList.remove('show');
}
