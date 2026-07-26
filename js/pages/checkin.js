import { checkin } from '../api.js';
import { toastSuccess, toastError } from '../api.js';

export async function renderCheckin() {
  const app = document.getElementById('app');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  app.className = 'dark-page';

  app.innerHTML = `
    <div style="padding: 16px 0 8px;">
      <h2 class="page-title">Check-in</h2>
      <div class="card" style="text-align:center; padding:24px;">
        <img src="assets/images/checkin-icon.png" alt="Check-in" style="width:80px; height:80px; margin:0 auto 10px; border-radius:50%; background:#FF6B00; padding:10px;" onerror="this.style.display='none'">
        <p style="font-size:28px; font-weight:700; color:#FF6B00;">RWF 100</p>
        <p style="color:#b0baca;">Daily Check-in Reward</p>
        <p style="color:#b0baca; font-size:13px;">Check-in days: ${user.checkinDays || 0}</p>
        <button class="btn" id="checkin-btn" style="margin-top:12px;">Check in</button>
      </div>
      <div class="card" style="font-size:13px; color:#b0baca;">
        <p>1. Daily check-in reward: RWF 100.</p>
        <p>2. Check in once a day.</p>
        <p>3. Check in again after 24:00 each day.</p>
      </div>
    </div>
  `;

  document.getElementById('checkin-btn').addEventListener('click', async () => {
    try {
      const data = await checkin();
      window.toastSuccess('Check-in successful! +100 RWF');
      const user = JSON.parse(localStorage.getItem('user'));
      user.balance = data.balance;
      user.checkinDays = data.checkinDays;
      localStorage.setItem('user', JSON.stringify(user));
      setTimeout(() => window.location.hash = 'home', 1500);
    } catch (err) {
      window.toastError(err.message || 'Already checked in today');
    }
  });

  // Bottom nav highlight
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}