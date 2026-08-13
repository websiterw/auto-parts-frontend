import { register } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export function renderRegister() {
  const app = document.getElementById('app');
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code') || '';

  app.innerHTML = `
    <div class="hero" style="background: var(--green);">
      <img src="assets/images/register-banner.png" alt="Style House" class="hero" style="height:280px; object-fit:cover;" onerror="this.style.display='none'">
      <div class="hero-overlay"></div>
      <div class="hero-title">Style House</div>
    </div>
    <div class="px-4 -mt-6">
      <form id="register-form" class="bg-white rounded-t-3xl border-t-4 pt-6 pb-8 px-6" style="border-color: var(--red);">
        <h1 class="text-center text-4xl font-extrabold mb-6" style="color: var(--red);">REGISTER</h1>
        <div class="space-y-4">
          <div class="flex items-center border-2 rounded-xl px-4 py-3" style="border-color: var(--green);">
            <span class="w-6 h-6 rounded-full bg-green-500 mr-3"></span>
            <input id="reg-account" type="text" placeholder="Account number" class="flex-1 outline-none bg-transparent" style="color: var(--green-dark);">
          </div>
          <div class="flex items-center border-2 rounded-xl px-4 py-3" style="border-color: var(--green);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--green)" class="mr-3"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-9V7a3 3 0 1 1 6 0h2a5 5 0 0 0-5-5z"/></svg>
            <input id="reg-password" type="password" placeholder="Enter password" class="flex-1 outline-none bg-transparent" style="color: var(--green-dark);">
          </div>
          <div class="flex items-center border-2 rounded-xl px-4 py-3" style="border-color: var(--green);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--green)" class="mr-3"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-9V7a3 3 0 1 1 6 0h2a5 5 0 0 0-5-5z"/></svg>
            <input id="reg-password2" type="password" placeholder="Re-enter password" class="flex-1 outline-none bg-transparent" style="color: var(--green-dark);">
          </div>
          <div class="flex items-center border-2 rounded-xl px-4 py-3" style="border-color: var(--green);">
            <span class="text-xl font-bold text-red-500 mr-3">{"< >"}</span>
            <input id="reg-invite" type="text" placeholder="Invitation code (optional)" value="${code}" class="flex-1 outline-none bg-transparent" style="color: var(--green-dark);">
          </div>
        </div>
        <div class="text-right mt-4">
          <a href="#login" class="underline font-medium" style="color: var(--red);">Go to login &gt;</a>
        </div>
        <button type="submit" class="btn btn-red w-full py-4 text-2xl font-bold mt-4" style="background: var(--red);">Register</button>
        <div id="reg-msg" class="mt-3 text-center text-sm font-medium text-red-500"></div>
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
