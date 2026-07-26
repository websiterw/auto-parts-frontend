import { apiCall } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export function renderWithdraw() {
  const app = document.getElementById('app');
  const user = JSON.parse(localStorage.getItem('user')) || { balance: 0, id: null };
  app.className = 'dark-page';

  let banks = JSON.parse(localStorage.getItem('bankCards')) || [];

  app.innerHTML = `
    <div style="padding: 12px 0 8px;">

      <div style="position:relative; width:100%; margin-bottom:16px;">
        <img src="assets/images/withdraw-up.png" alt="Withdraw" style="width:100%; border-radius:16px; display:block;" onerror="this.style.display='none'">
        <button id="withdraw-back" style="position:absolute; top:12px; left:12px; background:rgba(0,0,0,0.5); border:none; color:#fff; font-size:22px; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button id="withdraw-history" style="position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.5); border:none; color:#fff; font-size:22px; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer;">
          <i class="fas fa-clock"></i>
        </button>
        <div style="position:absolute; bottom:12px; left:50%; transform:translateX(-50%); color:#fff; font-weight:700; font-size:18px; text-shadow:0 2px 8px rgba(0,0,0,0.8);">
          My balance
        </div>
      </div>

      <div class="card">
        <div style="text-align:center; padding:8px 0 16px;">
          <p style="color:#b0baca; font-size:13px;">Available Balance</p>
          <p style="font-size:28px; font-weight:700; color:#FF6B00;">RWF ${user.balance?.toFixed(2) || '0.00'}</p>
        </div>

        <div class="input-group">
          <label>Please select your bank card</label>
          ${banks.length === 0 ? `
            <div style="background:#0a0e17; border-radius:10px; padding:12px; text-align:center; color:#b0baca; border:1px solid #2a3040;">
              No bank card added. 
              <button class="btn btn-small" style="width:auto; padding:4px 12px; margin-top:8px; background:#FF6B00;" id="withdraw-add-card">Add Bank Card</button>
            </div>
          ` : `
            <select id="withdraw-bank-select" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid #2a3040; background:#0a0e17; color:#fff; font-size:15px;">
              <option value="">Select a card</option>
              ${banks.map((b, index) => `
                <option value="${index}">${b.name} - ${b.number.slice(-4)} (${b.holder})</option>
              `).join('')}
            </select>
          `}
        </div>

        <div class="input-group">
          <label>Enter withdrawal amount</label>
          <input type="number" id="withdraw-amount" placeholder="RWF Please enter withdrawal amount" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid #2a3040; background:#0a0e17; color:#fff; font-size:15px;">
        </div>

        <div style="display:flex; justify-content:space-between; padding:8px 0; color:#b0baca; font-size:14px;">
          <span>Fee rate: 20%</span>
          <span>Received amount: <span id="received-amount" style="color:#FF6B00; font-weight:700;">RWF 0</span></span>
        </div>

        <button class="btn" id="withdraw-confirm" style="margin-top:8px;">Confirm</button>

        <div style="font-size:12px; color:#6a7488; margin-top:16px; line-height:1.6;">
          <p>1. Minimum withdrawal amount: RWF 3000.</p>
          <p>2. Withdrawal fee is 20% of the withdrawal amount.</p>
          <p>3. You can withdraw at any time. Withdrawals arrive within 4-24 hours.</p>
          <p>4. To protect the interests of the platform and its members, you must have at least one device to activate the withdrawal function.</p>
        </div>
      </div>
    </div>
  `;

  const addCardBtn = document.getElementById('withdraw-add-card');
  if (addCardBtn) {
    addCardBtn.addEventListener('click', () => window.location.hash = 'bindBank');
  }

  document.getElementById('withdraw-amount').addEventListener('input', (e) => {
    const amt = parseFloat(e.target.value) || 0;
    const fee = amt * 0.2;
    const received = amt - fee;
    document.getElementById('received-amount').textContent = `RWF ${received.toFixed(2)}`;
  });

  document.getElementById('withdraw-confirm').addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const select = document.getElementById('withdraw-bank-select');

    if (!amount || amount < 3000) {
      window.toastError('Minimum withdrawal is RWF 3,000');
      return;
    }
    if (amount > user.balance) {
      window.toastError('Insufficient balance');
      return;
    }
    if (!select) {
      window.toastError('Please add a bank card first.');
      return;
    }
    const index = select.value;
    if (index === '') {
      window.toastError('Please select a bank card.');
      return;
    }
    const bank = banks[parseInt(index)];
    if (!bank) {
      window.toastError('Selected card not found.');
      return;
    }

    const fee = amount * 0.2;
    const netAmount = amount - fee;
    const payload = {
      amount,
      fee,
      netAmount,
      bankDetails: {
        bank: bank.name,
        accountName: bank.holder,
        accountNumber: bank.number
      }
    };

    try {
      await apiCall('/withdrawals/request', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      window.toastSuccess('Withdrawal request submitted for approval.');
      // Deduct balance immediately (will be refunded if rejected)
      user.balance -= amount;
      localStorage.setItem('user', JSON.stringify(user));
      setTimeout(() => window.location.hash = 'home', 1500);
    } catch (err) {
      window.toastError(err.message || 'Failed to submit withdrawal.');
    }
  });

  document.getElementById('withdraw-back').addEventListener('click', () => window.location.hash = 'home');
  document.getElementById('withdraw-history').addEventListener('click', () => window.location.hash = 'withdrawalRecords');

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}