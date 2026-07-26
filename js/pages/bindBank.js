export function renderBindBank() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <button id="bind-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
          <i class="fas fa-chevron-left"></i>
        </button>
        <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">Bind Bank Card</h2>
      </div>
      <div class="card">
        <div class="input-group">
          <label>*Select Bank</label>
          <select id="bind-bank" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid #2a3040; background:#0a0e17; color:#fff; font-size:15px;">
            <option value="">Please select</option>
            <option value="MTN">MTN</option>
            <option value="Airtel">Airtel</option>
            <option value="Bank">Bank</option>
          </select>
        </div>
        <div class="input-group">
          <label>*Account Holder Name</label>
          <input type="text" id="bind-name" placeholder="Please enter account holder name" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid #2a3040; background:#0a0e17; color:#fff; font-size:15px;">
        </div>
        <div class="input-group">
          <label>*Bank Account</label>
          <input type="text" id="bind-account" placeholder="Please enter bank account number" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid #2a3040; background:#0a0e17; color:#fff; font-size:15px;">
        </div>
        <button class="btn" id="bind-confirm" style="margin-top:8px;">Confirm</button>
      </div>
    </div>
  `;

  document.getElementById('bind-back').addEventListener('click', () => window.location.hash = 'bankList');

  document.getElementById('bind-confirm').addEventListener('click', () => {
    const bank = document.getElementById('bind-bank').value;
    const name = document.getElementById('bind-name').value.trim();
    const account = document.getElementById('bind-account').value.trim();
    if (!bank || !name || !account) {
      alert('Please fill all required fields.');
      return;
    }

    // Load existing cards
    let cards = JSON.parse(localStorage.getItem('bankCards')) || [];
    // Avoid duplicates (optional)
    const exists = cards.some(c => c.number === account && c.name === bank);
    if (exists) {
      alert('This card is already bound.');
      return;
    }
    cards.push({ name: bank, holder: name, number: account });
    localStorage.setItem('bankCards', JSON.stringify(cards));

    alert('Bank card bound successfully!');
    window.location.hash = 'bankList';
  });

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}