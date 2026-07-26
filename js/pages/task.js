export function renderTask() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  const tasks = [
    { name: 'Invite 3 Level 1 investors', target: 3, reward: 2000, current: 3 },
    { name: 'Invite 10 Level 1 investors', target: 10, reward: 5000, current: 5 },
    { name: 'Invite 30 Level 1 investors', target: 30, reward: 10000, current: 5 }
  ];

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">

      <!-- Header with Back button -->
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <button id="task-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">Task Center</h2>
      </div>

      <!-- Cumulative Rewards -->
      <div class="card" style="text-align:center;">
        <p style="font-size:24px; font-weight:700; color:#FF6B00;">RWF 2,000</p>
        <p style="color:#b0baca;">Cumulative rewards</p>
      </div>

      <!-- Tasks -->
      ${tasks.map(t => `
        <div class="card">
          <p style="font-weight:600; color:#fff;">${t.name}</p>
          <p style="color:#b0baca; font-size:13px;">Current: ${t.current} / ${t.target}</p>
          <div class="task-progress">
            <div class="fill" style="width:${Math.min((t.current/t.target)*100, 100)}%;"></div>
          </div>
          <p style="color:#b0baca; font-size:13px;">Reward: RWF ${t.reward.toLocaleString()}</p>
        </div>
      `).join('')}
    </div>
  `;

  // Back button → Home
  document.getElementById('task-back').addEventListener('click', () => {
    window.location.hash = 'home';
  });

  // Bottom nav highlight
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}