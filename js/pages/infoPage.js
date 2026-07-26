export function renderInfoPage(title, content) {
  return function() {
    const app = document.getElementById('app');
    app.className = 'dark-page';

    app.innerHTML = `
      <div style="padding: 12px 0 8px;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
          <button id="info-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
            <i class="fas fa-chevron-left"></i>
          </button>
          <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">${title}</h2>
        </div>
        <div class="card" style="padding:20px; color:#b0baca; line-height:1.8;">
          ${content}
        </div>
      </div>
    `;

    document.getElementById('info-back').addEventListener('click', () => window.location.hash = 'mine');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  };
}