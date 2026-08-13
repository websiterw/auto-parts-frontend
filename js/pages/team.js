import { getMe } from '../api.js';
import { toastSuccess } from '../api.js';

export async function renderMine() {
  const app = document.getElementById('app');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const fresh = await getMe().catch(() => user);
  const balance = fresh.balance || 0;
  const income = fresh.cumulativeIncome || 0;
  const code = fresh.myReferralCode || '';

  app.innerHTML = `
    <div class="hero" style="background: var(--green);">
      <div class="hero-overlay"></div>
      <div class="hero-title">Mine</div>
    </div>
    <div class="px-4 -mt-6">
      <div class="card flex items-center gap-3">
        <span class="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white text-xl font-black">${(user.accountNumber || '').slice(-2) || 'AP'}</span>
        <div>
          <p class="font-black" style="color: var(--green-dark);">Account ${user.accountNumber || '-'}</p>
          <p class="text-xs" style="color: var(--red);">Invite code: ${code}</p>
        </div>
      </div>
      <div class="grid-2">
        <div class="card text-center"><p class="text-muted">Balance</p><p class="text-xl font-black" style="color: var(--red);">RWF ${balance.toFixed(2)}</p></div>
        <div class="card text-center"><p class="text-muted">Total income</p><p class="text-xl font-black" style="color: var(--red);">RWF ${income.toFixed(2)}</p></div>
      </div>
      <div class="grid-2">
        <button class="btn" onclick="window.location.hash='recharge'">Recharge</button>
        <button class="btn" onclick="window.location.hash='withdraw'">Withdraw</button>
        <button class="btn" onclick="window.location.hash='team'">My team</button>
        <button class="btn" id="checkin-btn">Check in</button>
      </div>
      <div class="card mt-4">
        <div class="space-y-2">
          <button class="btn btn-secondary" onclick="window.location.hash='records'">Recharge records</button>
          <button class="btn btn-secondary" onclick="window.location.hash='records'">Withdrawal records</button>
          <button class="btn btn-secondary" onclick="window.location.hash='records'">Income records</button>
          <button class="btn btn-secondary" onclick="window.location.hash='myproduct'">My products</button>
          <button class="btn btn-secondary" onclick="window.location.hash='team'">My team</button>
          <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${window.location.origin}/#register?code=${code}'); toastSuccess('Link copied!')">Invitation link</button>
          <button class="btn btn-secondary" onclick="window.open('https://t.me/your_group', '_blank')">Customer service</button>
          <button class="btn btn-secondary" onclick="window.open('https://t.me/your_group', '_blank')">Join official group</button>
        </div>
      </div>
      <button class="btn btn-red mt-4" onclick="localStorage.clear(); window.location.hash='login';">Logout</button>
    </div>
  `;

  document.getElementById('checkin-btn').addEventListener('click', async () => {
    try {
      await apiCall('/checkin', { method: 'POST' });
      toastSuccess('Check-in successful!');
      renderMine();
    } catch (err) {
      toastError(err.message || 'Already checked in today');
    }
  });
}
