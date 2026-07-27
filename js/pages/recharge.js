import { apiCall, getPublicSettings } from '../api.js';
import { toastError, toastSuccess, toastInfo } from '../api.js';

export function renderRecharge() {
  const app = document.getElementById('app');
  app.className = 'dark-page';

  const presetAmounts = [6000, 12000, 25000, 50000, 100000, 250000];
  let step = 1;
  let selectedAmount = 0;
  let selectedMethod = 'MTN';
  let userAccount = '';
  let pendingId = null;

  let bankDetails = {
    MTN: { account: '0792702997', name: 'ARSENE BAYIRINGIRE' },
    Airtel: { account: '0737217328', name: 'Arsene BAYIRINGIRE' }
  };

  async function fetchSettings() {
    try {
      const res = await getPublicSettings();
      if (res) {
        bankDetails.MTN.account = res.mtnAccount || bankDetails.MTN.account;
        bankDetails.MTN.name = res.mtnName || bankDetails.MTN.name;
        bankDetails.Airtel.account = res.airtelAccount || bankDetails.Airtel.account;
        bankDetails.Airtel.name = res.airtelName || bankDetails.Airtel.name;
      }
    } catch (e) {}
  }

  async function renderStepWithFreshSettings(stepNumber) {
    if (stepNumber === 2 || stepNumber === 3) {
      await fetchSettings();
    }
    step = stepNumber;
    renderStep();
  }

  function renderStep() {
    let html = '';

    if (step === 1) {
      html = `
        <div style="padding: 12px 0 8px;">
          <!-- Header with Back button and Title -->
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
            <button id="recharge-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
              <i class="fas fa-chevron-left"></i>
            </button>
            <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">Recharge</h2>
            <div style="flex:1; text-align:right;">
              <button id="recharge-history" style="background:none; border:none; color:#FF6B00; font-size:22px; cursor:pointer;">
                <i class="fas fa-clock"></i>
              </button>
            </div>
          </div>

          <div class="card">
            <p style="color:#b0baca; font-size:14px; margin-bottom:10px;">Select recharge amount</p>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:8px; margin-bottom:12px;">
              ${presetAmounts.map(amt => `
                <button class="btn btn-secondary amount-btn" style="padding:10px 0; font-size:14px;" data-amount="${amt}">
                  ${amt.toLocaleString()}
                </button>
              `).join('')}
            </div>
            <div class="input-group">
              <label>Enter other amount</label>
              <input type="number" id="recharge-amount" placeholder="RWF Enter amount" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid #2a3040; background:#0a0e17; color:#fff; font-size:15px;">
            </div>

            <p style="color:#b0baca; font-size:14px; margin:16px 0 8px;">Select recharge method</p>
            <div style="display:flex; gap:10px; margin-bottom:12px;">
              <button class="btn method-card" data-method="MTN" style="flex:1; padding:12px; background:${selectedMethod === 'MTN' ? '#FF6B00' : '#1a2a3a'}; border:2px solid ${selectedMethod === 'MTN' ? '#FF6B00' : '#2a3040'}; color:#fff; border-radius:12px; font-weight:600;">
                <i class="fas fa-university"></i><br>Bank A<br><span style="font-size:12px; color:#b0baca;">MTN</span>
              </button>
              <button class="btn method-card" data-method="Airtel" style="flex:1; padding:12px; background:${selectedMethod === 'Airtel' ? '#FF6B00' : '#1a2a3a'}; border:2px solid ${selectedMethod === 'Airtel' ? '#FF6B00' : '#2a3040'}; color:#fff; border-radius:12px; font-weight:600;">
                <i class="fas fa-wifi"></i><br>Bank B<br><span style="font-size:12px; color:#b0baca;">Airtel</span>
              </button>
            </div>

            <button class="btn" id="recharge-next" style="margin-top:8px;">Confirm</button>
            <p style="color:#FF6B00; text-align:center; margin-top:12px; font-size:13px; cursor:pointer;" id="recharge-not-credited">
              If your recharge is not credited for a long time, click here
            </p>
            <div style="font-size:12px; color:#6a7488; margin-top:12px; line-height:1.6;">
              <p>1. The minimum recharge amount is RWF 6000.</p>
              <p>2. Please use your latest account number for each recharge.</p>
              <p>3. Carefully read the payment instructions.</p>
              <p>4. If not credited, contact customer service.</p>
            </div>
          </div>
        </div>
      `;
    } else if (step === 2) {
      html = `
        <div style="padding: 12px 0 8px;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
            <button id="step-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
              <i class="fas fa-chevron-left"></i>
            </button>
            <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">Payment Method</h2>
          </div>
          <div class="card">
            <div style="background:#0a0e17; border-radius:10px; padding:12px; margin-bottom:12px;">
              <p style="color:#b0baca; font-size:13px;">Payment Amount: <strong style="color:#FF6B00;">RWF ${selectedAmount}</strong></p>
              <p style="color:#b0baca; font-size:13px;">Selected Bank: <strong style="color:#fff;">${selectedMethod}</strong></p>
            </div>
            <div class="input-group">
              <label>Please select a payment method</label>
              <div style="display:flex; gap:10px;">
                <button class="btn btn-secondary pay-method" data-method="MTN" style="flex:1; padding:10px; background:${selectedMethod === 'MTN' ? '#FF6B00' : 'transparent'}; border:2px solid ${selectedMethod === 'MTN' ? '#FF6B00' : '#2a3040'};">
                  <i class="fas fa-mobile-alt"></i> MTN
                </button>
                <button class="btn btn-secondary pay-method" data-method="Airtel" style="flex:1; padding:10px; background:${selectedMethod === 'Airtel' ? '#FF6B00' : 'transparent'}; border:2px solid ${selectedMethod === 'Airtel' ? '#FF6B00' : '#2a3040'};">
                  <i class="fas fa-mobile-alt"></i> Airtel
                </button>
              </div>
            </div>
            <div class="input-group">
              <label>+250 Enter your actual payment account</label>
              <input type="text" id="user-account" placeholder="Enter your phone number" style="width:100%; padding:12px 14px; border-radius:10px; border:1px solid #2a3040; background:#0a0e17; color:#fff; font-size:15px;">
            </div>
            <button class="btn" id="payment-confirm">Confirm →</button>
            <p style="color:#b0baca; font-size:12px; margin-top:8px; text-align:center;">Please fill in your payment account accurately, incorrect filling may result in the loss of the transferred funds.</p>
          </div>
        </div>
      `;
    } else if (step === 3) {
      const bank = bankDetails[selectedMethod];
      html = `
        <div style="padding: 12px 0 8px;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
            <button id="step-back" style="background:none; border:none; color:#FF6B00; font-size:24px; cursor:pointer;">
              <i class="fas fa-chevron-left"></i>
            </button>
            <h2 style="font-size:20px; font-weight:700; color:#fff; margin:0;">COPY & PAY</h2>
          </div>
          <div class="card">
            <p style="color:#b0baca; font-size:14px;">Copy this ${selectedMethod} account and make payment</p>
            <div style="background:#0a0e17; border-radius:10px; padding:16px; margin:12px 0;">
              <p style="color:#b0baca; font-size:13px;">Total Amount:</p>
              <p style="font-size:24px; font-weight:700; color:#FF6B00;">RWF ${selectedAmount}</p>
              <p style="color:#b0baca; font-size:13px; margin-top:8px;">${selectedMethod} Account:</p>
              <p style="font-size:20px; font-weight:700; color:#fff;">${bank.account}</p>
              <p style="color:#b0baca; font-size:13px; margin-top:4px;">Account Name:</p>
              <p style="font-size:16px; font-weight:600; color:#fff;">${bank.name}</p>
            </div>
            <button class="btn" id="click-to-pay" style="margin-bottom:8px; background:#FF6B00;">Click to pay</button>
            <p style="color:#b0baca; font-size:13px;">*182*1*1*${bank.account}*${selectedAmount}#</p>
            <div style="margin-top:12px; background:#0a0e17; border-radius:8px; padding:12px;">
              <p style="color:#b0baca; font-size:13px;">Payment completed?<br>Click "Refresh" to check if it is successful!</p>
              <p style="color:#b0baca; font-size:13px;">Amount paid: <span style="color:#FF6B00;">RWF 0</span></p>
              <p style="color:#6a7488; font-size:12px;">The payment is expected to be received in 2-10 minutes. Click to refresh the page.</p>
              <p style="color:#b0baca; font-size:13px;">Your payment account: <span style="color:#fff;">${userAccount || 'Not provided'}</span></p>
            </div>
            <button class="btn btn-secondary" id="refresh-payment" style="margin-top:8px;">Refresh</button>
          </div>
        </div>
      `;
    }

    app.innerHTML = html;
    bindEvents();
  }

  function bindEvents() {
    if (step === 1) {
      document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.getElementById('recharge-amount').value = btn.dataset.amount;
        });
      });
      document.querySelectorAll('.method-card').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedMethod = btn.dataset.method;
          renderStep();
        });
      });
      document.getElementById('recharge-next').addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('recharge-amount').value);
        if (!amount || amount < 6000) {
          window.toastError('Minimum recharge is RWF 6,000');
          return;
        }
        selectedAmount = amount;
        renderStepWithFreshSettings(2);
      });
      document.getElementById('recharge-back').addEventListener('click', () => window.location.hash = 'home');
      document.getElementById('recharge-history').addEventListener('click', () => window.location.hash = 'rechargeRecords');
      document.getElementById('recharge-not-credited').addEventListener('click', () => window.location.hash = 'customerService');
    } else if (step === 2) {
      document.querySelectorAll('.pay-method').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedMethod = btn.dataset.method;
          renderStep();
        });
      });
      document.getElementById('step-back').addEventListener('click', () => {
        step = 1;
        renderStep();
      });
      document.getElementById('payment-confirm').addEventListener('click', async () => {
        userAccount = document.getElementById('user-account').value.trim();
        if (!userAccount) {
          window.toastError('Please enter your payment account number.');
          return;
        }
        try {
          const data = await apiCall('/recharges/request', {
            method: 'POST',
            body: JSON.stringify({ amount: selectedAmount, method: selectedMethod, account: userAccount })
          });
          pendingId = data.pendingId;
          window.toastSuccess('Recharge request submitted for approval.');
          await fetchSettings();
          step = 3;
          renderStep();
        } catch (err) {
          window.toastError(err.message || 'Failed to submit recharge.');
        }
      });
    } else if (step === 3) {
      document.getElementById('step-back').addEventListener('click', () => {
        renderStepWithFreshSettings(2);
      });
      document.getElementById('click-to-pay').addEventListener('click', () => {
        const bank = bankDetails[selectedMethod];
        const ussdCode = `*182*1*1*${bank.account}*${selectedAmount}#`;
        window.location.href = `tel:${ussdCode}`;
        navigator.clipboard.writeText(ussdCode).then(() => {
          window.toastInfo('USSD code copied to clipboard. Dial it from your phone.');
        }).catch(() => {
          window.toastInfo(`Dial ${ussdCode} from your phone.`);
        });
      });
      document.getElementById('refresh-payment').addEventListener('click', () => {
        window.location.hash = 'rechargeRecords';
      });
    }
  }

  fetchSettings().then(() => renderStep());
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
}