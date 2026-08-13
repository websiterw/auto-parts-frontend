import { requestWithdrawal, getMe } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderWithdraw() {
  const app = document.getElementById('app');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  let balance = user.balance || 0;
  let channel = 'MTN';
  let phone = '';
  let holder = '';
  let amount = 0;
  const MIN = 3000;
  const FEE = 0.2;
  let submitted = false;
  let orderId = '';

  // Check if user has active product
  let hasProduct = false;
  try {
    const investments = await apiCall('/investments');
    hasProduct = investments.length > 0;
  } catch (e) {}

  function render() {
    if (submitted) {
      app.innerHTML = `
        <div class="hero" style="background: var(--green);">
          <div class="hero-overlay"></div>
          <div class="hero-title">WITHDRAWAL</div>
        </div>
        <div class="px-4 -mt-6">
          <div class="card text-center">
            <span class="text-2xl">⏳</span>
            <p class="text-green-600 font-bold text-lg">Processing</p>
            <p class="text-muted text-sm">Your withdrawal of RWF ${amount} has been received. Withdrawals arrive within 4-24 hours.</p>
          </div>
          <div class="card">
            <p class="text-muted text-xs">Order ID: ${orderId}</p>
            <p class="text-muted text-xs">Method: ${channel}</p>
            <p class="text-muted text-xs">Account: ${phone}</p>
            <p class="text-muted text-xs">Holder: ${holder}</p>
            <p class="text-muted text-xs">Fee (20%): RWF ${(amount * FEE).toFixed(2)}</p>
            <p class="text-muted text-xs">Received: RWF ${(amount * (1 - FEE)).toFixed(2)}</p>
            <p class="text-green-600 font-bold text-xs">Status: Processing</p>
          </div>
          <button class="btn" onclick="window.location.hash='home'">Back to home</button>
        </div>
      `;
      return;
    }

    app.innerHTML = `
      <div class="hero" style="background: var(--green);">
        <div class="hero-overlay"></div>
        <div class="hero-title">WITHDRAWAL</div>
      </div>
      <div class="px-4 -mt-6">
        ${!hasProduct ? `<div class="bg-red-50 border border-red-500 text-red-500 text-sm font-semibold p-3 rounded-md mb-4">You must buy a product before you can withdraw.</div>` : ''}
        <p class="font-semibold text-sm">My balance</p>
        <div class="card flex items-center gap-4">
          <span class="text-2xl">📈</span>
          <span class="flex-1 text-center text-2xl font-bold text-green-600">RWF ${balance.toFixed(2)}</span>
        </div>
        <p class="font-semibold text-sm mt-4">Please select your bank card</p>
        <button id="bank-picker" class="card flex items-center gap-3 w-full text-left">
          <span class="text-lg">💳</span>
          <span class="flex-1 text-sm" style="color: ${phone ? '#343434' : '#8a8a8a'};">${phone ? `${channel} · ${phone} · ${holder}` : '_ _ _ _ _ _ - _ _ _ _ _ _ _ _ _ _ _ _ _'}</span>
          <span class="text-gray-400">›</span>
        </button>
        <p class="font-semibold text-sm mt-4">Enter withdrawal amount</p>
        <div class="flex items-center border-2 rounded-md px-4 py-3" style="border-color: var(--green);">
          <span class="text-muted mr-2">RWF</span>
          <input id="withdraw-amount" type="number" placeholder="Please enter amount" class="flex-1 outline-none bg-transparent">
        </div>
        <div class="flex justify-between text-sm text-muted mt-2">
          <span>Received: <span id="received-display" class="text-green-600">RWF 0</span></span>
          <span>Fee rate: 20%</span>
        </div>
        <button id="withdraw-submit" class="btn mt-4" style="background: var(--green);">Confirm</button>
        <ol class="text-xs text-muted mt-4 space-y-1">
          <li>1. Minimum withdrawal: RWF 3000.</li>
          <li>2. Fee is 20% of the amount.</li>
          <li>3. Arrives within 4-24 hours.</li>
          <li>4. You must have an active product.</li>
        </ol>
      </div>
    `;

    // Bind events
    document.getElementById('withdraw-amount').addEventListener('input', (e) => {
      amount = parseFloat(e.target.value) || 0;
      const received = amount * (1 - FEE);
      document.getElementById('received-display').textContent = `RWF ${received.toFixed(2)}`;
    });

    document.getElementById('bank-picker').addEventListener('click', () => {
      // Simple popup for bank selection (we'll do a small modal)
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5';
      modal.innerHTML = `
        <div class="bg-white rounded-xl p-5 w-full max-w-sm">
          <p class="text-center font-semibold text-sm">Bind your withdrawal account</p>
          <div class="grid grid-cols-2 gap-2 mt-3">
            <button class="channel-btn border-2 rounded-md py-2 text-sm font-semibold" data-channel="MTN" style="border-color: ${channel === 'MTN' ? 'var(--green)' : '#e5e5e5'}; background: ${channel === 'MTN' ? '#f3fdf6' : '#fff'};">MTN</button>
            <button class="channel-btn border-2 rounded-md py-2 text-sm font-semibold" data-channel="Airtel" style="border-color: ${channel === 'Airtel' ? 'var(--green)' : '#e5e5e5'}; background: ${channel === 'Airtel' ? '#f3fdf6' : '#fff'};">Airtel</button>
          </div>
          <div class="border-2 rounded-md px-4 py-3 mt-3" style="border-color: #e5e5e5;">
            <input id="phone-input" type="text" placeholder="07XXXXXXXX" class="w-full outline-none bg-transparent text-sm" value="${phone}">
          </div>
          <div class="border-2 rounded-md px-4 py-3 mt-2" style="border-color: #e5e5e5;">
            <input id="holder-input" type="text" placeholder="Account holder name" class="w-full outline-none bg-transparent text-sm" value="${holder}">
          </div>
          <p class="text-xs text-muted mt-1">The name must match the mobile money account owner.</p>
          <button id="save-bank" class="btn mt-3">Save</button>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelectorAll('.channel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          channel = btn.dataset.channel;
          modal.remove();
          render();
        });
      });
      modal.querySelector('#save-bank').addEventListener('click', () => {
        phone = document.getElementById('phone-input').value.trim();
        holder = document.getElementById('holder-input').value.trim();
        modal.remove();
        render();
      });
    });

    document.getElementById('withdraw-submit').addEventListener('click', async () => {
      if (!hasProduct) { toastError('You must have an active product to withdraw.'); return; }
      if (!phone || !holder) { toastError('Please bind your payment account first.'); return; }
      if (amount < MIN) { toastError(`Minimum withdrawal is RWF ${MIN}`); return; }
      if (amount > balance) { toastError('Insufficient balance'); return; }
      const fee = amount * FEE;
      const net = amount - fee;
      orderId = 'WD' + Date.now().toString().slice(-8);
      try {
        await requestWithdrawal({ amount, fee, netAmount: net, bankDetails: { bank: channel, accountName: holder, accountNumber: phone } });
        submitted = true;
        render();
      } catch (err) {
        toastError(err.message);
      }
    });
  }

  render();
}
