export function renderRegister() {
  const app = document.getElementById('app');
  app.className = 'auth-page';

  // ===== READ THE CODE FROM THE GLOBAL VARIABLE =====
  const referralCode = window._referralCode || '';

  app.innerHTML = `
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
        <input type="text" id="reg-invite" placeholder="Enter invitation code" value="${referralCode}" style="padding:14px;">
      </div>

      <button class="auth-btn" id="register-btn" style="padding:16px;">Register</button>

      <div class="auth-footer" style="margin-top:12px;">
        Already have an account? <a href="#" class="link" id="go-to-login">Go to login ></a>
      </div>
    </div>
  `;

  // ... rest of event listeners (unchanged)
}
