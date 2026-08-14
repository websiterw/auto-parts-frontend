import { requestRecharge, getPublicSettings } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderRecharge() {
  const app = document.getElementById('app');
  let step = 1;
  let amount = 0;
  let selectedBank = 'MTN'; // 'MTN' or 'Airtel' – the bank that receives the money
  let paymentMethod = 'MTN'; // 'MTN' or 'Airtel' – the user's payment method
  let paymentAccount = '';
  let paymentAccountName = '';
  let orderId = '';

  const presetAmounts = [6000, 12000, 25000, 50000, 100000, 250000, 500000, 1000000];
  const MIN = 6000;
  const GOLD = '#d99b1c';
  const GOLD_DARK = '#b8860b';

  // Bank details from admin settings
  let bankDetails = { MTN: { number: '0785558168', name: 'Donat Munyempundu' }, Airtel: { number: '0732136268', name: 'Job Ntirandekura' } };
  try {
    const settings = await getPublicSettings();
    if (settings) {
      bankDetails.MTN.number = settings.mtnAccount || bankDetails.MTN.number;
      bankDetails.MTN.name = settings.mtnName || bankDetails.MTN.name;
      bankDetails.Airtel.number = settings.airtelAccount || bankDetails.Airtel.number;
      bankDetails.Airtel.name = settings.airtelName || bankDetails.Airtel.name;
    }
  } catch (e) {}

  function render() {
    let html = '';
    if (step === 1) {
      html = `
        <div style="position:relative; width:100%; height:180px; background: #22c55e;">
          <img src="assets/images/recharge-banner.png" alt="Recharge" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
          <div style="position:absolute; inset:0; background:rgba(0,0,0,0.25);"></div>
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:28px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">RECHARGE</div>
        </div>
        <div style="padding:0 16px; margin-top:-20px;">
          <p style="font-weight:600; color:#343434; margin-bottom:8px;">Select recharge amount</p>
          <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:16px;">
            ${presetAmounts.map(a => `
              <button class="amount-btn" data-amount="${a}" style="border:2px solid ${amount === a ? GOLD : '#e5e5e5'}; background:${amount === a ? GOLD : '#fff'}; color:${amount === a ? '#fff' : '#343434'}; border-radius:8px; padding:10px 0; font-weight:600; cursor:pointer; font-size:14px;">${a.toLocaleString()}</button>
            `).join('')}
          </div>
          <div style="display:flex; align-items:center; border:2px solid ${GOLD}; border-radius:8px; padding:10px 16px; margin-bottom:16px;">
            <span style="color:#6b6b6b; margin-right:8px;">RWF</span>
            <input id="custom-amount" type="number" placeholder="Enter amount" style="flex:1; outline:none; border:none; background:transparent; font-size:16px; color:#343434;" value="${amount || ''}">
          </div>

          <!-- Bank Selection (Bank A = MTN, Bank B = Airtel) -->
          <p style="font-weight:600; color:#343434; margin-bottom:4px;">Select recharge method</p>
          <div style="display:flex; gap:10px; margin-bottom:16px;">
            <button class="bank-btn" data-bank="MTN" style="flex:1; border:2px solid ${selectedBank === 'MTN' ? GOLD : '#e5e5e5'}; background:${selectedBank === 'MTN' ? '#fffaf0' : '#fff'}; border-radius:12px; padding:12px; font-weight:600; color:#343434; cursor:pointer;">
              <span style="display:block; font-size:20px;">🏦</span>
              Bank A<br><span style="font-size:12px; color:#6b6b6b;">MTN</span>
            </button>
            <button class="bank-btn" data-bank="Airtel" style="flex:1; border:2px solid ${selectedBank === 'Airtel' ? GOLD : '#e5e5e5'}; background:${selectedBank === 'Airtel' ? '#fffaf0' : '#fff'}; border-radius:12px; padding:12px; font-weight:600; color:#343434; cursor:pointer;">
              <span style="display:block; font-size:20px;">🏦</span>
              Bank B<br><span style="font-size:12px; color:#6b6b6b;">Airtel</span>
            </button>
          </div>

          <button id="confirm-amount" style="width:100%; background:${amount >= MIN ? GOLD : '#d9d9d9'}; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; font-size:16px; cursor:${amount >= MIN ? 'pointer' : 'default'}; margin-bottom:12px;" ${amount < MIN ? 'disabled' : ''}>Confirm</button>
          <button onclick="window.location.hash='records'" style="width:100%; background:transparent; border:2px solid ${GOLD}; color:${GOLD_DARK}; border-radius:30px; padding:12px; font-weight:700; font-size:14px; cursor:pointer; margin-bottom:16px;">View recharge history</button>
          <ol style="font-size:12px; color:#6b6b6b; line-height:1.6; padding-left:20px;">
            <li>1. The minimum recharge amount is RWF6000.</li>
            <li>2. Please use your latest account number for each recharge.</li>
            <li>3. Carefully read the payment instructions.</li>
            <li>4. If not credited, contact customer service.</li>
          </ol>
        </div>
      `;
    } else if (step === 2) {
      html = `
        <div style="position:fixed; inset:0; z-index:50; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; padding:0 20px;">
          <div style="background:#fff; border-radius:20px; padding:24px; width:100%; max-width:400px; position:relative;">
            <button onclick="step=1; render()" style="position:absolute; top:12px; right:16px; background:none; border:none; font-size:24px; color:#999; cursor:pointer;">&times;</button>
            <p style="text-align:center; font-weight:900; color:${GOLD}; font-size:14px; letter-spacing:2px;">◎ STYLE HOUSE PAY</p>
            <p style="font-size:14px; color:#343434; margin-top:8px;">Payment Amount: <span style="font-weight:bold; color:${GOLD};">RWF ${amount}</span></p>
            <p style="font-size:12px; color:#6b6b6b; margin-top:12px;">Please select a payment method</p>
            <div style="display:flex; gap:10px; margin-top:6px;">
              <button class="method-btn" data-method="MTN" style="flex:1; border:2px solid ${paymentMethod === 'MTN' ? GOLD : '#e0e0e0'}; background:${paymentMethod === 'MTN' ? '#fffaf0' : '#fff'}; border-radius:8px; padding:12px; font-weight:600; color:#343434; cursor:pointer;">MTN</button>
              <button class="method-btn" data-method="Airtel" style="flex:1; border:2px solid ${paymentMethod === 'Airtel' ? GOLD : '#e0e0e0'}; background:${paymentMethod === 'Airtel' ? '#fffaf0' : '#fff'}; border-radius:8px; padding:12px; font-weight:600; color:#343434; cursor:pointer;">AIRTEL</button>
            </div>
            <div style="display:flex; align-items:center; border:2px solid #e0e0e0; border-radius:8px; padding:10px 14px; margin-top:12px;">
              <span style="color:${GOLD}; font-weight:600; margin-right:8px;">+250</span>
              <input id="pay-account" type="text" placeholder="Please enter your payment account" style="flex:1; outline:none; border:none; background:transparent; font-size:14px; color:#343434;">
            </div>
            <div style="display:flex; align-items:center; border:2px solid #e0e0e0; border-radius:8px; padding:10px 14px; margin-top:8px;">
              <input id="pay-account-name" type="text" placeholder="Account holder name" style="flex:1; outline:none; border:none; background:transparent; font-size:14px; color:#343434;">
            </div>
            <p style="font-size:11px; color:#dc2626; margin-top:6px;">⚠ Please fill in your payment account accurately.</p>
            <button id="confirm-pay" style="width:100%; background:${GOLD}; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; font-size:16px; cursor:pointer; margin-top:16px;">Confirm →</button>
          </div>
        </div>
      `;
    } else if (step === 3) {
      // Determine USSD code based on selectedBank and paymentMethod
      const bankNumber = bankDetails[selectedBank].number;
      const operatorCode = paymentMethod === 'MTN' ? '1' : '2';
      const ussd = `*182*1*${operatorCode}*${bankNumber}*${amount}#`;

      html = `
        <div style="position:fixed; inset:0; z-index:50; background:#f5f5f5; overflow-y:auto;">
          <div style="background:#2b2b2b; padding:16px; display:flex; justify-content:space-between; align-items:center;">
            <span style="color:${GOLD}; font-weight:900; font-size:14px; letter-spacing:2px;">◎ STYLE HOUSE PAY</span>
            <button onclick="window.location.hash='home'" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">&times;</button>
          </div>
          <div style="padding:16px; max-width:400px; margin:0 auto;">
            <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid ${GOLD}; margin-bottom:16px;">
              <p style="font-weight:600; color:#343434;">COPY &amp; PAY</p>
              <p style="font-size:12px; color:#6b6b6b;">Copy this <span style="font-weight:bold; color:#dc2626;">${selectedBank}</span> account and make payment</p>
              <div style="background:#f7f7f7; border-radius:8px; padding:12px; margin-top:8px;">
                <p style="font-size:12px; color:#6b6b6b;">Total Amount:</p>
                <p style="font-size:24px; font-weight:900; color:${GOLD};">RWF ${amount}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                  <div>
                    <p style="font-size:12px; color:#6b6b6b;">${selectedBank} Account:</p>
                    <p style="font-size:20px; font-weight:700; color:${GOLD};">${bankNumber}</p>
                  </div>
                  <button onclick="navigator.clipboard.writeText('${bankNumber}'); window.toastSuccess('Copied!')" style="background:none; border:none; font-size:20px; color:#999; cursor:pointer;">⧉</button>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                  <div>
                    <p style="font-size:12px; color:#6b6b6b;">Account Name:</p>
                    <p style="font-size:16px; font-weight:600; color:${GOLD};">${bankDetails[selectedBank].name}</p>
                  </div>
                  <button onclick="navigator.clipboard.writeText('${bankDetails[selectedBank].name}'); window.toastSuccess('Copied!')" style="background:none; border:none; font-size:20px; color:#999; cursor:pointer;">⧉</button>
                </div>
              </div>
              <a href="tel:${ussd}" style="display:block; width:100%; background:${GOLD}; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; text-align:center; text-decoration:none; margin-top:12px;">Click to pay</a>
              <p style="text-align:center; color:${GOLD}; font-size:14px; margin-top:6px;">${ussd}</p>
            </div>

            <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid ${GOLD}; margin-bottom:16px;">
              <p style="font-weight:600; color:#343434;">Payment completed?</p>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                <div>
                  <p style="font-size:12px; color:#6b6b6b;">Amount paid:</p>
                  <p style="font-size:20px; font-weight:900; color:${orderId ? GOLD : '#c7c7c7'};">RWF ${orderId ? amount : 0}</p>
                </div>
                <button id="refresh-pay" style="background:${GOLD}; color:#fff; border:none; border-radius:30px; padding:8px 20px; font-weight:700; cursor:pointer;">Refresh</button>
              </div>
              <p style="font-size:11px; color:#6b6b6b; margin-top:4px;">The payment is expected to be successful in 2-10 minutes. Click to refresh the results.</p>
              ${orderId ? `<p style="font-size:13px; color:#16a34a; font-weight:600; margin-top:6px;">Status: Processing · Order ${orderId}</p>` : ''}
            </div>

            <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid ${GOLD}; margin-bottom:16px;">
              <p style="font-size:12px; color:#6b6b6b;">Your payment account:</p>
              <p style="font-size:16px; font-weight:600; color:#343434;">${paymentAccount}</p>
              <p style="font-size:14px; font-weight:500; color:#343434;">${paymentAccountName}</p>
            </div>

            <button onclick="window.location.hash='records'" style="width:100%; background:transparent; border:2px solid ${GOLD}; color:${GOLD_DARK}; border-radius:30px; padding:12px; font-weight:700; cursor:pointer; margin-bottom:10px;">View recharge history</button>
            <button onclick="window.location.hash='home'" style="width:100%; background:${GOLD}; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; cursor:pointer;">Back to home</button>
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
          amount = parseInt(btn.dataset.amount);
          document.getElementById('custom-amount').value = amount;
          render();
        });
      });
      document.getElementById('custom-amount').addEventListener('input', (e) => {
        amount = parseFloat(e.target.value) || 0;
        render();
      });
      document.querySelectorAll('.bank-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedBank = btn.dataset.bank;
          render();
        });
      });
      document.getElementById('confirm-amount').addEventListener('click', () => {
        if (amount < MIN) { toastError('Minimum amount is RWF 6000'); return; }
        step = 2;
        render();
      });
    } else if (step === 2) {
      document.querySelectorAll('.method-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          paymentMethod = btn.dataset.method;
          render();
        });
      });
      document.getElementById('confirm-pay').addEventListener('click', async () => {
        paymentAccount = document.getElementById('pay-account').value.trim();
        paymentAccountName = document.getElementById('pay-account-name').value.trim();
        if (!paymentAccount || !paymentAccountName) {
          toastError('Please enter both payment account and holder name.');
          return;
        }
        try {
          const res = await requestRecharge({ amount, method: paymentMethod, account: paymentAccount, holder: paymentAccountName, bank: selectedBank });
          orderId = res.pendingId || 'AP' + Date.now().toString().slice(-8);
          step = 3;
          render();
        } catch (err) {
          toastError(err.message);
        }
      });
    } else if (step === 3) {
      document.getElementById('refresh-pay').addEventListener('click', () => {
        // Navigate to records to see pending status
        window.location.hash = 'records';
      });
    }
  }

  render();
}
