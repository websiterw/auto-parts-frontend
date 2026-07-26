export function renderBankList() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  // Load bank cards from localStorage
  let banks = JSON.parse(localStorage.getItem('bankCards')) || [];

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <button id="bank-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">Bank Account List</h2>
      </div>
      ${banks.length === 0 ? `
        <div class="card" style="text-align:center; padding:20px; color:#b0baca;">
          No bank cards added yet.
        </div>
      ` : banks.map((b, index) => `
        <div class="card" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px;">
          <div>
            <p style="font-weight:600; color:#fff;">${b.name}</p>
            <p style="color:#b0baca; font-size:14px;">${b.holder}</p>
            <p style="color:#6a7488; font-size:13px;">${b.number}</p>
          </div>
          <button class="btn btn-small" style="width:auto; padding:4px 12px; font-size:12px; background:#d32f2f;" data-index="${index}">Delete</button>
        </div>
      `).join('')}
      <button class="btn" id="bank-add" style="margin-top:8px;">Add</button>
    </div>
  `;

  // Delete button
  document.querySelectorAll('[data-index]').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index);
      banks.splice(index, 1);
      localStorage.setItem('bankCards', JSON.stringify(banks));
      renderBankList(); // re-render
    });
  });

  document.getElementById('bank-back').addEventListener('click', () => window.location.hash = 'mine');
  document.getElementById('bank-add').addEventListener('click', () => window.location.hash = 'bindBank');
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}