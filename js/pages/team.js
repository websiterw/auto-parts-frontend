import { getTeamData } from '../api.js';

export async function renderTeam() {
  const app = document.getElementById('app');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const data = await getTeamData().catch(() => ({ totalUsers: 0, totalRewards: 0, code: user.myReferralCode || '' }));

  app.innerHTML = `
    <div class="hero" style="background: var(--green);">
      <div class="hero-overlay"></div>
      <div class="hero-title">My team</div>
    </div>
    <div class="px-4 -mt-6">
      <div class="grid-2">
        <div class="card text-center"><p class="text-muted">Team members</p><p class="text-2xl font-black" style="color: var(--red);">${data.totalUsers || 0}</p></div>
        <div class="card text-center"><p class="text-muted">Team purchases</p><p class="text-2xl font-black" style="color: var(--red);">RWF ${(data.totalRewards || 0).toFixed(2)}</p></div>
      </div>
      <div class="card">
        <p class="font-black" style="color: var(--green-dark);">My invitation code</p>
        <p class="text-2xl font-black tracking-widest" style="color: var(--red);">${data.code || user.myReferralCode || '------'}</p>
        <p class="text-xs break-all mt-2" style="color: var(--green-dark);">${window.location.origin}/#register?code=${data.code || ''}</p>
        <button class="btn mt-2" onclick="navigator.clipboard.writeText('${window.location.origin}/#register?code=${data.code || ''}'); toastSuccess('Link copied!')">Copy invitation link</button>
      </div>
      <div class="card">
        <p class="font-black mb-2" style="color: var(--green-dark);">How the team works</p>
        <ol class="text-xs space-y-1" style="color: var(--green-dark);">
          <li>1. Share your invitation link with friends.</li>
          <li>2. They register with your code and get RWF 3,000 to start.</li>
          <li>3. Every product they buy is counted in your team purchases.</li>
          <li>4. The bigger the team, the bigger the daily rewards.</li>
        </ol>
      </div>
    </div>
  `;
}
