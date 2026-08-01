import { getTeamData } from '../api.js';

export async function renderTeam() {
  const app = document.getElementById('app');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  app.className = 'dark-page';

  // ===== UPDATED: Use your new domain =====
  const FRONTEND_URL = 'https://auto-parts-nine-chi.online';

  const topImage = 'assets/images/team-1.png';
  const bottomImage = 'assets/images/team-2.png';

  let teamData = {
    totalUsers: 0,
    totalRewards: 0,
    levels: [
      { level: 1, commission: 35, users: 0, rewards: 0 },
      { level: 2, commission: 2, users: 0, rewards: 0 },
      { level: 3, commission: 1, users: 0, rewards: 0 }
    ]
  };

  try {
    const data = await getTeamData();
    if (data) {
      teamData.totalUsers = data.totalUsers || 0;
      teamData.totalRewards = data.totalRewards || 0;
      teamData.levels[0].users = data.level1 ? data.level1.length : 0;
      teamData.levels[1].users = data.level2 ? data.level2.length : 0;
      teamData.levels[2].users = data.level3 ? data.level3.length : 0;
    }
  } catch (err) {
    console.error('Error loading team data:', err);
  }

  const referralCode = user.myReferralCode || 'ABC12';
  const referralLink = `${FRONTEND_URL}/#register?code=${referralCode}`;

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <h2 style="font-size:24px; font-weight:700; color:#fff; text-align:left; margin:0;">TEAM</h2>
        <button id="team-records-link" style="background:none; border:none; color:#FF6B00; font-size:14px; font-weight:600; cursor:pointer;">
          My team <i class="fas fa-chevron-right" style="font-size:12px;"></i>
        </button>
      </div>

      <img src="${topImage}" alt="Team banner" style="width:100%; border-radius:16px; margin-bottom:12px;" onerror="this.style.display='none'">

      <div class="card" style="text-align:center; padding:16px;">
        <p style="font-weight:600; color:#fff;">Start inviting friends now</p>
        <div style="display:flex; gap:8px; align-items:center; margin:8px 0;">
          <code style="background:#0a0e17; padding:4px 10px; border-radius:4px; flex:1; color:#fff;">${referralCode}</code>
          <button class="btn btn-small" id="copy-code">Copy</button>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <code style="background:#0a0e17; padding:4px 10px; border-radius:4px; flex:1; color:#fff; font-size:12px;">${referralLink}</code>
          <button class="btn btn-small" id="copy-link">Copy</button>
        </div>
      </div>

      <div style="display:flex; gap:10px; margin:12px 0;">
        <button id="stats-users" style="flex:1; background:none; border:none; cursor:pointer; padding:0; text-align:center;">
          <div class="card" style="padding:12px;">
            <p style="font-size:22px; font-weight:700; color:#FF6B00;">${teamData.totalUsers}</p>
            <p style="color:#b0baca; font-size:12px;">Total users ></p>
          </div>
        </button>
        <button id="stats-rewards" style="flex:1; background:none; border:none; cursor:pointer; padding:0; text-align:center;">
          <div class="card" style="padding:12px;">
            <p style="font-size:22px; font-weight:700; color:#FF6B00;">RWF ${teamData.totalRewards.toLocaleString()}</p>
            <p style="color:#b0baca; font-size:12px;">Total Rewards ></p>
          </div>
        </button>
      </div>

      <img src="${bottomImage}" alt="Team bottom" style="width:100%; border-radius:16px; margin-bottom:12px;" onerror="this.style.display='none'">

      ${teamData.levels.map(l => `
        <div class="team-level" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:#141c2b; border-radius:12px; margin-bottom:8px; border-left:3px solid #FF6B00;">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-weight:700; font-size:16px; color:#fff;">LV${l.level}</span>
            <span style="color:#FF6B00; font-weight:700;">${l.commission}%</span>
          </div>
          <div style="display:flex; gap:20px;">
            <div><span style="color:#b0baca; font-size:12px;">Commission</span><br><span style="color:#fff;">${l.commission}%</span></div>
            <div><span style="color:#b0baca; font-size:12px;">Users</span><br><span style="color:#fff;">${l.users}</span></div>
            <div><span style="color:#b0baca; font-size:12px;">Rewards</span><br><span style="color:#fff;">RWF ${l.rewards.toLocaleString()}</span></div>
          </div>
        </div>
      `).join('')}

      <div class="card" style="background:#1a2a3a; margin-top:12px; font-size:13px; color:#b0baca;">
        <p>When a friend you invite registers and invests, you will immediately receive a <strong style="color:#FF6B00;">35%</strong> cash reward on their investment.</p>
        <p style="margin-top:4px;">When your second-tier team members invest, you will receive a <strong style="color:#FF6B00;">2%</strong> cash reward.</p>
        <p style="margin-top:4px;">When your third-tier team members invest, you will receive a <strong style="color:#FF6B00;">1%</strong> cash reward.</p>
        <p style="margin-top:4px;">Once your team members invest, the cash reward will be immediately deposited into your account balance, which you can withdraw instantly.</p>
      </div>
    </div>
  `;

  document.getElementById('copy-code').addEventListener('click', () => {
    const code = user.myReferralCode || 'ABC12';
    navigator.clipboard.writeText(code);
    alert('Code copied!');
  });
  document.getElementById('copy-link').addEventListener('click', () => {
    const code = user.myReferralCode || 'ABC12';
    const link = `${FRONTEND_URL}/#register?code=${code}`;
    navigator.clipboard.writeText(link);
    alert('Link copied!');
  });

  const goToTeamRecords = () => window.location.hash = 'teamRecords';
  document.getElementById('team-records-link').addEventListener('click', goToTeamRecords);
  document.getElementById('stats-users').addEventListener('click', goToTeamRecords);
  document.getElementById('stats-rewards').addEventListener('click', goToTeamRecords);

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const activeNav = document.querySelector('.nav-item[data-page="team"]');
  if (activeNav) activeNav.classList.add('active');
}
