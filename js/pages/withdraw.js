import { requestWithdrawal, getMe, apiCall } from '../api.js';
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
  const GOLD = '#d99b1c';
  const GOLD_DARK = '#b8860b';
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
        <div style="position:relative; width:100%; height:180px; background: #22c55e;">
          <img src="assets/images/withdraw-banner.png" alt="Withdraw" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
          <div style="position:absolute; inset:0; background:rgba(0,0,0,0.25);"></div>
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:28px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">WITHDRAWAL</div>
        </div>
        <div style="padding:0 16px; margin-top:100px;">
          <div style="background:#fff; border-radius:16px; padding:20px; border:2px solid ${GOLD}; text-align:center;">
            <span style="font-size:32px;">⏳</span>
            <p style="color:#16a34a; font-weight:bold; font-size:18px; margin-top:8px;">Processing</p>
            <p style="color:#6b6b6b; font-size:14px;">Your withdrawal of RWF ${amount} has been received. Withdrawals arrive within 4-24 hours.</p>
          </div>
          <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid ${GOLD}; margin-top:12px;">
            <p style="color:#6b6b6b; font-size:12px;">Order ID: ${orderId}</p>
            <p style="color:#6b6b6b; font-size:12px;">Method: ${channel}</p>
            <p style="color:#6b6b6b; font-size:12px;">Account: ${phone}</p>
            <p style="color:#6b6b6b; font-size:12px;">Holder: ${holder}</p>
            <p style="color:#6b6b6b; font-size:12px;">Fee (20%): RWF ${(amount * FEE).toFixed(2)}</p>
            <p style="color:#6b6b6b; font-size:12px;">Received: RWF ${(amount * (1 - FEE)).toFixed(2)}</p>
            <p style="color:#16a34a; font-weight:600; font-size:12px;">Status: Processing</p>
          </div>
          <button onclick="window.location.hash='home'" style="width:100%; background:${GOLD}; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; font-size:16px; cursor:pointer; margin-top:16px;">Back to home</button>
        </div>
      `;
      return;
    }

    app.innerHTML = `
      <div style="position:relative; width:100%; height:180px; background: #22c55e;">
        <img src="assets/images/withdraw-banner.png" alt="Withdraw" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
        <div style="position:absolute; inset:0; background:rgba(0,0,0,0.25);"></div>
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:28px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">WITHDRAWAL</div>
      </div>
      <div style="padding:0 16px; margin-top:60px;">
        ${!hasProduct ? `<div style="background:#fdeaea; border:2px solid #dc2626; border-radius:12px; padding:12px; color:#dc2626; font-weight:600; font-size:14px; text-align:center; margin-bottom:16px;">You must buy a product before you can withdraw.</div>` : ''}
        <p style="font-weight:600; color:#343434; margin-bottom:4px;">My balance</p>
        <div style="background:#fff; border-radius:12px; padding:16px; border:2px solid ${GOLD}; display:flex; align-items:center; gap:12px; margin-bottom:16px;">
          <span style="font-size:24px;">📈</span>
          <span style="flex:1; text-align:center; font-size:22px; font-weight:900; color:${GOLD_DARK};">RWF ${balance.toFixed(2)}</span>
        </div>
        <p style="font-weight:600; color:#343434; margin-bottom:4px;">Please select your bank card</p>
        <button id="bank-picker" style="width:100%; background:#fff; border:2px solid ${GOLD}; border-radius:12px; padding:16px; display:flex; align-items:center; gap:12px; cursor:pointer; text-align:left; margin-bottom:16px;">
          <span style="font-size:20px;">💳</span>
          <span style="flex:1; font-size:14px; color:${phone ? '#343434' : '#8a8a8a'};">${phone ? `${channel} · ${phone} · ${holder}` : '_ _ _ _ _ _ - _ _ _ _ _ _ _ _ _ _ _ _ _'}</span>
          <span style="color:#aaa; font-size:18px;">›</span>
        </button>
        <p style="font-weight:600; color:#343434; margin-bottom:4px;">Enter withdrawal amount</p>
        <div style="display:flex; align-items:center; border:2px solid ${GOLD}; border-radius:8px; padding:10px 16px; margin-bottom:16px;">
          <span style="color:#6b6b6b; margin-right:8px;">RWF</span>
          <input id="withdraw-amount" type="number" placeholder="Please enter amount" style="flex:1; outline:none; border:none; background:transparent; font-size:16px; color:#343434;">
        </div>
        <div style="display:flex; justify-content:space-between; font-size:14px; color:#6b6b6b; margin-bottom:16px;">
          <span>Received: <span id="received-display" style="color:${GOLD_DARK}; font-weight:700;">RWF 0</span></span>
          <span>Fee rate: 20%</span>
        </div>
        <button id="withdraw-submit" style="width:100%; background:${hasProduct ? GOLD : '#d9d9d9'}; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; font-size:16px; cursor:${hasProduct ? 'pointer' : 'default'}; margin-bottom:16px;" ${!hasProduct ? 'disabled' : ''}>Confirm</button>
        <ol style="font-size:12px; color:#6b6b6b; line-height:1.6; padding-left:20px;">
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
      // Bank binding modal
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed; inset:0; z-index:50; background:rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; padding:20px;';
      modal.innerHTML = `
        <div style="background:#fff; border-radius:20px; padding:24px; width:100%; max-width:400px;">
          <p style="text-align:center; font-weight:900; font-size:16px; color:#343434; margin-bottom:16px;">Bind your withdrawal account</p>
          <div style="display:flex; gap:10px; margin-bottom:12px;">
            <button class="channel-btn" data-channel="MTN" style="flex:1; border:2px solid ${channel === 'MTN' ? GOLD : '#e5e5e5'}; background:${channel === 'MTN' ? '#fffaf0' : '#fff'}; border-radius:8px; padding:12px; font-weight:600; cursor:pointer; color:#343434;">MTN</button>
            <button class="channel-btn" data-channel="Airtel" style="flex:1; border:2px solid ${channel === 'Airtel' ? GOLD : '#e5e5e5'}; background:${channel === 'Airtel' ? '#fffaf0' : '#fff'}; border-radius:8px; padding:12px; font-weight:600; cursor:pointer; color:#343434;">Airtel</button>
          </div>
          <div style="border:2px solid #e5e5e5; border-radius:8px; padding:10px 14px; margin-bottom:10px;">
            <input id="phone-input" type="text" placeholder="07XXXXXXXX" style="width:100%; outline:none; border:none; background:transparent; font-size:14px; color:#343434;" value="${phone}">
          </div>
          <div style="border:2px solid #e5e5e5; border-radius:8px; padding:10px 14px; margin-bottom:10px;">
            <input id="holder-input" type="text" placeholder="Account holder name" style="width:100%; outline:none; border:none; background:transparent; font-size:14px; color:#343434;" value="${holder}">
          </div>
          <p style="font-size:11px; color:#6b6b6b; margin-bottom:16px;">The name must match the mobile money account owner.</p>
          <button id="save-bank" style="width:100%; background:${GOLD}; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; cursor:pointer;">Save</button>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelectorAll('.channel-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          channel = btn.dataset.channel;
          modal.remove();
          render(); // re-render to update button style
        });
      });
      modal.querySelector('#save-bank').addEventListener('click', () => {
        phone = document.getElementById('phone-input').value.trim();
        holder = document.getElementById('holder-input').value.trim();
        if (!phone || !holder) {
          toastError('Please fill both phone and holder name.');
          return;
        }
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
