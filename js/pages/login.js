import { login } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export function renderLogin() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="hero" style="background: var(--green);">
      <img src="assets/images/login-banner.png" alt="Style House" class="hero" style="height:280px; object-fit:cover;" onerror="this.style.display='none'">
      <div class="hero-overlay"></div>
      <div class="hero-title">Style House</div>
    </div>
    <div class="px-4 -mt-6">
      <form id="login-form" class="bg-white rounded-t-3xl border-t-4 pt-6 pb-8 px-6" style="border-color: var(--red);">
        <h1 class="text-center text-4xl font-extrabold mb-6" style="color: var(--red);">LOGIN</h1>
        <div class="space-y-4">
          <div class="flex items-center border-2 rounded-xl px-4 py-3" style="border-color: var(--green);">
            <span class="w-6 h-6 rounded-full bg-green-500 mr-3"></span>
            <input id="login-account" type="text" placeholder="Account number" class="flex-1 outline-none bg-transparent" style="color: var(--green-dark);">
          </div>
          <div class="flex items-center border-2 rounded-xl px-4 py-3" style="border-color: var(--green);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--green)" class="mr-3"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-9V7a3 3 0 1 1 6 0h2a5 5 0 0 0-5-5z"/></svg>
            <input id="login-password" type="password" placeholder="Password" class="flex-1 outline-none bg-transparent" style="color: var(--green-dark);">
          </div>
        </div>
        <div class="text-right mt-4">
          <a href="#register" class="underline font-medium" style="color: var(--red);">Go to register &gt;</a>
        </div>
        <button type="submit" class="btn btn-red w-full py-4 text-2xl font-bold mt-4" style="background: var(--red);">Login</button>
        <div id="login-msg" class="mt-3 text-center text-sm font-medium text-red-500"></div>
      </form>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const account = document.getElementById('login-account').value.trim();
    const password = document.getElementById('login-password').value;
    if (!account || !password) {
      toastError('Please fill all fields');
      return;
    }
    try {
      const data = await login(account, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      toastSuccess('Login successful!');
      setTimeout(() => window.location.hash = 'home', 500);
    } catch (err) {
      toastError(err.message);
    }
  });
}
