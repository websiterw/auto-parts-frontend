import { register } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export function renderRegister() {
  const app = document.getElementById('app');
  app.className = 'auth-page';

  app.innerHTML = `
    <!-- Full banner image -->
    <img src="assets/images/register.png" alt="Register" style="width:100%; border-radius:16px 16px 0 0; margin-bottom:20px;" onerror="this.style.display='none'">

    <div class="auth-header" style="margin-top:-10px;">
      <h1 style="font-size:24px;">AUTO PARTS</h1>
      <p class="sub" style="color:#888;">Register</p>
    </div>

    <div class="auth-card">
      <div class="input-group">
        <label>Account number</label>
        <input type="text" id="reg-account" placeholder="Enter account number" style="padding:14px;">
      </div>
      <div class="input-group">
        <label>Enter password</label>
        <input type="password" id="reg-password" placeholder="Enter password" style="padding:14px;">
      </div>
      <div class="input-group">
        <label>Re-enter password</label>
        <input type="password" id="reg-password2" placeholder="Re-enter password" style="padding:14px;">
      </div>
      <div class="input-group">
        <label>Invitation code (optional)</label>
        <input type="text" id="reg-invite" placeholder="Enter invitation code" style="padding:14px;">
      </div>

      <button class="auth-btn" id="register-btn" style="padding:16px;">Register</button>

      <div class="auth-footer" style="margin-top:12px;">
        Already have an account? <a href="#" class="link" id="go-to-login">Go to login ></a>
      </div>
    </div>
  `;

  // ===== AUTO‑FILL INVITATION CODE FROM URL =====
  // Supports both formats:
  //   https://.../#register?code=ABC12
  //   https://.../#/register?code=ABC12
  const hash = window.location.hash; // e.g., "#register?code=ABC12"
  const queryIndex = hash.indexOf('?');
  const queryString = queryIndex !== -1 ? hash.substring(queryIndex + 1) : '';
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get('code');
  if (code) {
    const inviteInput = document.getElementById('reg-invite');
    if (inviteInput) inviteInput.value = code;
  }

  // ----- Event listeners -----
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
