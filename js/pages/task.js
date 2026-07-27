import { getTasks, apiCall } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderTask() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  let tasks = [];
  try {
    const res = await getTasks();
    tasks = res;
  } catch (e) {
    // fallback
    tasks = [
      { _id: '1', name: 'Invite 3 Level 1 investors', level: 1, target: 3, reward: 2000, current: 0, claimed: false },
      { _id: '2', name: 'Invite 10 Level 1 investors', level: 1, target: 10, reward: 5000, current: 0, claimed: false },
      { _id: '3', name: 'Invite 30 Level 1 investors', level: 1, target: 30, reward: 10000, current: 0, claimed: false }
    ];
  }

  const totalRewards = tasks.reduce((sum, t) => {
    if (t.current >= t.target && t.claimed) return sum + t.reward;
    return sum;
  }, 0);

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
        <p style="font-size:24px; font-weight:700; color:#FF6B00;">RWF ${totalRewards.toLocaleString()}</p>
        <p style="color:#b0baca;">Cumulative rewards</p>
      </div>

      <!-- Tasks list -->
      ${tasks.map((t, index) => {
        const progress = Math.min((t.current / t.target) * 100, 100);
        const isCompleted = t.current >= t.target;
        const isClaimed = t.claimed;

        let statusText = 'In Progress';
        let statusColor = '#FF6B00';
        let buttonHtml = '';

        if (isClaimed) {
          statusText = 'Claimed ✅';
          statusColor = '#4caf50';
          buttonHtml = `<button class="btn btn-small" style="width:auto; padding:4px 12px; background:#4caf50; opacity:0.6; cursor:default;" disabled>Claimed</button>`;
        } else if (isCompleted) {
          statusText = 'Ready to Claim!';
          statusColor = '#4caf50';
          buttonHtml = `<button class="btn btn-small claim-btn" data-id="${t._id}" style="width:auto; padding:4px 12px; background:#FF6B00;">Receive</button>`;
        } else {
          buttonHtml = `<button class="btn btn-small" style="width:auto; padding:4px 12px; background:#2a3040; cursor:default;" disabled>In Progress</button>`;
        }

        return `
          <div class="card" style="padding:14px 16px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-weight:600; color:#fff; font-size:15px;">LV${index+1}</span>
              <span style="color:${statusColor}; font-size:13px; font-weight:500;">${statusText}</span>
            </div>
            <p style="color:#b0baca; font-size:14px; margin:2px 0;">${t.name}</p>
            <div style="display:flex; gap:20px; font-size:13px; color:#b0baca; margin:4px 0;">
              <span>Current: <strong style="color:#fff;">${t.current}</strong></span>
              <span>Target: <strong style="color:#fff;">${t.target}</strong></span>
              <span>Progress: <strong style="color:#fff;">${Math.round(progress)}%</strong></span>
            </div>
            <div class="task-progress" style="background:#1e2838; height:6px; border-radius:4px; margin:4px 0;">
              <div class="fill" style="width:${progress}%; background:#FF6B00; height:100%; border-radius:4px; transition:width 0.3s;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
              <span style="color:#b0baca; font-size:13px;">Reward: <strong style="color:#FF6B00;">RWF ${t.reward.toLocaleString()}</strong></span>
              ${buttonHtml}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Back button → Mine
  document.getElementById('task-back').addEventListener('click', () => window.location.hash = 'mine');

  // Claim buttons
  document.querySelectorAll('.claim-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const taskId = e.target.dataset.id;
      try {
        const result = await apiCall(`/tasks/claim/${taskId}`, { method: 'POST' });
        window.toastSuccess('Reward claimed!');
        // Refresh the page to update status
        setTimeout(() => window.location.hash = 'task', 500);
      } catch (err) {
        window.toastError(err.message || 'Failed to claim reward.');
      }
    });
  });

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}