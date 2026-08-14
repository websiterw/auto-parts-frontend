export function renderCustomerService() {
  const app = document.getElementById('app');
  const GOLD = '#d99b1c';
  const GOLD_DARK = '#b8860b';

  app.innerHTML = `
    <div style="position:relative; width:100%; height:180px; background: #22c55e; overflow:hidden;">
      <img src="assets/images/customer-service-banner.png" alt="Customer Service" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
      <div style="position:absolute; inset:0; background:rgba(0,0,0,0.25);"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:28px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">Help Center</div>
      <!-- Back button -->
      <button onclick="window.location.hash='home'" style="position:absolute; top:12px; left:12px; background:rgba(0,0,0,0.5); border:none; color:#fff; font-size:24px; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">
        <i class="fas fa-chevron-left"></i>
      </button>
    </div>
    <div style="padding:0 16px; margin-top:-10px;">

      <!-- Support icon -->
      <div style="background:#fff; border-radius:16px; padding:20px; border:2px solid ${GOLD}; text-align:center; margin-bottom:16px;">
        <div style="font-size:56px; color:${GOLD};"><i class="fas fa-headset"></i></div>
        <p style="font-size:20px; font-weight:600; margin:8px 0; color:#343434;">24/7 Support</p>
        <p style="color:#6b6b6b; font-size:14px;">We're here to help you anytime.</p>
      </div>

      <!-- Three Telegram buttons -->
      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
        <button id="cs-telegram-service" style="width:100%; background:${GOLD}; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; font-size:16px; display:flex; align-items:center; justify-content:center; gap:10px; cursor:pointer;">
          <i class="fab fa-telegram"></i> Customer Service Help
        </button>
        <button id="cs-telegram-group" style="width:100%; background:#fff; color:#343434; border:2px solid ${GOLD}; border-radius:30px; padding:14px; font-weight:700; font-size:16px; display:flex; align-items:center; justify-content:center; gap:10px; cursor:pointer;">
          <i class="fab fa-telegram" style="color:${GOLD};"></i> Official Telegram Group
        </button>
        <button id="cs-telegram-channel" style="width:100%; background:#fff; color:#343434; border:2px solid ${GOLD}; border-radius:30px; padding:14px; font-weight:700; font-size:16px; display:flex; align-items:center; justify-content:center; gap:10px; cursor:pointer;">
          <i class="fab fa-telegram" style="color:${GOLD};"></i> Official Telegram Channel
        </button>
      </div>

      <!-- Info text -->
      <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid ${GOLD}; font-size:13px; color:#6b6b6b; line-height:1.8; margin-bottom:20px;">
        <p>1. If you have any questions, please feel free to contact our online customer service.</p>
        <p>2. Please keep your password safe and never disclose it to others. Official staff will never ask for your password.</p>
      </div>

      <button onclick="window.location.hash='home'" style="width:100%; background:${GOLD}; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; font-size:16px; cursor:pointer;">Back to home</button>
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
