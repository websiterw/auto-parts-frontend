import { getTeamData } from '../api.js';

export async function renderTeam() {
  const app = document.getElementById('app');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const data = await getTeamData().catch(() => ({ totalUsers: 0, totalRewards: 0, code: user.myReferralCode || '' }));

  const referralCode = data.code || user.myReferralCode || '';
  const inviteLink = `${window.location.origin}/#register?code=${referralCode}`;

  app.innerHTML = `
    <div style="position:relative; width:100%; height:100px; background: #22c55e;">
      <img src="assets/images/team-banner.png" alt="Team" style="width:100%; height:180%; object-fit:cover;" onerror="this.style.display='none'">
      <div style="position:absolute; inset:0; background:rgba(0,0,0,0.25);"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:28px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">Team</div>
    </div>
    <div style="padding:0 16px; margin-top:100px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
        <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #22c55e; text-align:center;">
          <p style="color:#6b6b6b; font-size:12px;">Team members</p>
          <p style="font-size:24px; font-weight:900; color:#dc2626;">${data.totalUsers || 0}</p>
        </div>
        <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #22c55e; text-align:center;">
          <p style="color:#6b6b6b; font-size:12px;">Team purchases</p>
          <p style="font-size:24px; font-weight:900; color:#dc2626;">RWF ${(data.totalRewards || 0).toFixed(2)}</p>
        </div>
      </div>
      <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #22c55e; margin-bottom:16px;">
        <p style="font-weight:900; color:#16a34a;">My invitation code</p>
        <p style="font-size:24px; font-weight:900; letter-spacing:2px; color:#dc2626;">${referralCode || '------'}</p>
        <p style="font-size:12px; word-break:break-all; margin-top:8px; color:#16a34a;">${inviteLink}</p>
        <button onclick="navigator.clipboard.writeText('${inviteLink}'); window.toastSuccess('Link copied!')" style="width:100%; background:#22c55e; color:#fff; border:none; border-radius:30px; padding:10px; font-weight:700; cursor:pointer; margin-top:8px;">Copy invitation link</button>
      </div>
      <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #22c55e;">
        <p style="font-weight:900; margin-bottom:8px; color:#16a34a;">How the team works</p>
        <ol style="font-size:12px; color:#16a34a; list-style-position:inside; padding-left:0;">
          <li style="margin-bottom:4px;">1. Share your invitation link with friends.</li>
          <li style="margin-bottom:4px;">2. They register with your code and get RWF 3,000 to start.</li>
          <li style="margin-bottom:4px;">3. Every product they buy is counted in your team purchases.</li>
          <li style="margin-bottom:4px;">4. The bigger the team, the bigger the daily rewards.</li>
        </ol>
      </div>
    </div>
  `;
}
