export function renderCustomerService() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">

      <!-- Big banner image (replace with your own) -->
      <img src="assets/images/customer-service-banner.png" alt="Customer Service" style="width:100%; border-radius:16px; margin-bottom:16px;" onerror="this.style.display='none'">

      <div class="service-card" style="padding:20px;">
        <div class="icon"><i class="fas fa-headset" style="font-size:48px; color:#FF6B00;"></i></div>
        <p class="title" style="font-size:18px; font-weight:600; margin:8px 0;">24/7 Support</p>
        <p class="sub" style="color:#b0baca; font-size:14px;">We're here to help you anytime.</p>
      </div>

      <!-- Three Telegram links -->
      <div style="display:flex; flex-direction:column; gap:10px; margin-top:16px;">
        <button class="btn" id="cs-telegram-service" style="padding:12px; font-size:16px; background:#FF6B00; color:#fff; border:none; border-radius:30px; display:flex; align-items:center; justify-content:center; gap:8px;">
          <i class="fab fa-telegram"></i> Customer Service Help
        </button>
        <button class="btn" id="cs-telegram-group" style="padding:12px; font-size:16px; background:#1a2a3a; color:#fff; border:1px solid #2a3040; border-radius:30px; display:flex; align-items:center; justify-content:center; gap:8px;">
          <i class="fab fa-telegram"></i> Official Telegram Group
        </button>
        <button class="btn" id="cs-telegram-channel" style="padding:12px; font-size:16px; background:#1a2a3a; color:#fff; border:1px solid #2a3040; border-radius:30px; display:flex; align-items:center; justify-content:center; gap:8px;">
          <i class="fab fa-telegram"></i> Official Telegram Channel
        </button>
      </div>

      <div class="card" style="font-size:13px; color:#b0baca; margin-top:16px; line-height:1.6;">
        <p>1. If you have any questions, please feel free to contact our online customer service.</p>
        <p>2. Please keep your password safe and never disclose it to others. Official staff will never ask for your password.</p>
      </div>
    </div>
  `;

  // Telegram links – replace with your actual URLs
  document.getElementById('cs-telegram-service').addEventListener('click', () => {
    window.open('https://t.me/Autopartsowner', '_blank');
  });
  document.getElementById('cs-telegram-group').addEventListener('click', () => {
    window.open('https://t.me/+A8If4xQRH7Y1YzBk', '_blank');
  });
  document.getElementById('cs-telegram-channel').addEventListener('click', () => {
    window.open('https://t.me/+A8If4xQRH7Y1YzBk', '_blank');
  });

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}
