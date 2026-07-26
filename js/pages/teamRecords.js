import { getTeamData } from '../api.js';
import { toastError } from '../api.js';

export async function renderTeamRecords() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  // State
  let teamData = { level1: [], level2: [], level3: [] };
  let totalRecharge = 0;
  let isLoading = true;

  // Fetch real team data from backend
  try {
    const data = await getTeamData();
    teamData = {
      level1: data.level1 || [],
      level2: data.level2 || [],
      level3: data.level3 || []
    };
    // Calculate total recharge (sum of all investments from team members)
    // You'll need to adjust this based on your actual data structure
    // For now, we'll use a placeholder or you can compute from investments
    totalRecharge = data.totalRecharge || 0;
    isLoading = false;
  } catch (err) {
    toastError('Failed to load team data: ' + err.message);
    isLoading = false;
  }

  const levelNames = ['Level 1', 'Level 2', 'Level 3'];
  const levelKeys = ['level1', 'level2', 'level3'];

  // Helper: mask account number (show only last 4 digits)
  function maskAccount(account) {
    if (!account) return '****';
    if (account.length <= 4) return account;
    return '****' + account.slice(-4);
  }

  // Helper: format date
  function formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">

      <!-- Header with Back button -->
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <button id="records-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">Team Records</h2>
      </div>

      <!-- Level tabs -->
      <div style="display:flex; gap:8px; margin-bottom:12px;">
        ${levelNames.map((name, idx) => `
          <button class="btn btn-secondary level-tab" style="flex:1; padding:8px 0; font-size:13px;" data-level="${levelKeys[idx]}">${name}</button>
        `).join('')}
      </div>

      <!-- Team Recharge total -->
      <div class="card" style="text-align:center; padding:12px; margin-bottom:12px;">
        <p style="color:#b0baca; font-size:13px;">Team Recharge</p>
        <p style="font-size:22px; font-weight:700; color:#FF6B00;">RWF ${totalRecharge.toLocaleString()}</p>
      </div>

      <!-- Members List Container -->
      <div id="members-container">
        ${isLoading ? `
          <div class="card" style="text-align:center; padding:20px; color:#b0baca;">
            <i class="fas fa-spinner fa-spin" style="font-size:24px;"></i> Loading...
          </div>
        ` : `
          <div class="card" style="text-align:center; padding:20px; color:#b0baca;">
            No members in this level.
          </div>
        `}
      </div>
    </div>
  `;

  // Function to render members for a given level
  function renderMembers(levelKey) {
    const container = document.getElementById('members-container');
    const list = teamData[levelKey] || [];

    if (list.length === 0) {
      container.innerHTML = `
        <div class="card" style="text-align:center; padding:20px; color:#b0baca;">
          No members in this level.
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(member => {
      // Each member should have: accountNumber, createdAt (registration date), and investments
      // You may need to adjust based on your actual data structure
      const account = member.accountNumber || member.account || 'N/A';
      const masked = maskAccount(account);
      const date = member.createdAt || member.date || new Date();
      // For amount, you might have member.totalInvested or need to fetch from investments
      // For now, use a placeholder or 0
      const amount = member.totalInvested || member.amount || 0;

      return `
        <div style="background:#0a0e17; border-radius:12px; padding:12px 16px; margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <p style="color:#b0baca; font-size:13px;">Account: ${masked}</p>
              <p style="color:#b0baca; font-size:13px;">Date: ${formatDate(date)}</p>
            </div>
            <p style="color:#4caf50; font-weight:600;">RWF ${amount.toLocaleString()}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // Tab click listeners
  document.querySelectorAll('.level-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const level = btn.dataset.level;
      renderMembers(level);
      // Highlight active tab
      document.querySelectorAll('.level-tab').forEach(b => b.style.borderColor = '#2a3040');
      btn.style.borderColor = '#FF6B00';
    });
  });

  // Default: show Level 1
  const defaultTab = document.querySelector('.level-tab[data-level="level1"]');
  if (defaultTab) {
    defaultTab.style.borderColor = '#FF6B00';
    renderMembers('level1');
  }

  // Back button → Team page
  document.getElementById('records-back').addEventListener('click', () => {
    window.location.hash = 'team';
  });

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}