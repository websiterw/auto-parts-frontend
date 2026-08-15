import { requestRecharge, getPublicSettings } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderRecharge() {
  const app = document.getElementById('app');
  let step = 1;
  let amount = 0;
  let depositBank = 'MTN'; // the bank the user is paying to (admin's bank)
  let method = 'MTN';      // the user's own mobile money operator
  let account = '';
  let holderName = '';
  let orderId = '';
  const GOLD = '#d99b1c';
  const GOLD_DARK = '#b8860b';

  const presetAmounts = [6000, 12000, 25000, 50000, 100000, 250000, 500000, 1000000];
  const MIN = 6000;

  // Fetch bank details from settingsimport { requestRecharge, getPublicSettings } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderRecharge() {
  const app = document.getElementById('app');
  let step = 1;
  let amount = 0;
  let depositBank = 'MTN';   // Admin bank the user pays to (Bank A = MTN, Bank B = Airtel)
  let userMethod = 'MTN';    // User's own payment method
  let account = '';
  let holderName = '';
  let orderId = '';
  const GOLD = '#d99b1c';
  const GOLD_DARK = '#b8860b';

  const presetAmounts = [6000, 12000, 25000, 50000, 100000, 250000, 500000, 1000000];
  const MIN = 6000;

  // Fetch bank details from settings (admin config)
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

          <!-- Deposit Bank Selection (Bank A / Bank B) -->
          <p style="font-weight:600; color:#343434; margin-bottom:8px;">Select deposit bank</p>
          <div style="display:flex; gap:10px; margin-bottom:16px;">
            <button class="deposit-bank-btn" data-bank="MTN" style="flex:1; border:2px solid ${depositBank === 'MTN' ? GOLD : '#e5e5e5'}; background:${depositBank === 'MTN' ? '#fffaf0' : '#fff'}; border-radius:8px; padding:12px; font-weight:600; cursor:pointer; color:#343434;">
              Bank A (MTN)
            </button>
            <button class="deposit-bank-btn" data-bank="Airtel" style="flex:1; border:2px solid ${depositBank === 'Airtel' ? GOLD : '#e5e5e5'}; background:${depositBank === 'Airtel' ? '#fffaf0' : '#fff'}; border-radius:8px; padding:12px; font-weight:600; cursor:pointer; color:#343434;">
              Bank B (Airtel)
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
      const bank = bankDetails[depositBank];
      html = `
        <div style="position:fixed; inset:0; z-index:50; background:rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; padding:0 20px;">
          <div style="background:#fff; border-radius:20px; padding:24px; width:100%; max-width:400px; position:relative;">
            <button onclick="step=1; render()" style="position:absolute; top:12px; right:16px; background:none; border:none; font-size:24px; color:#999; cursor:pointer;">&times;</button>
            <p style="text-align:center; font-weight:900; color:${GOLD}; font-size:14px; letter-spacing:2px;">❌ STYLE HOUSE PAY</p>
            <p style="font-size:14px; color:#343434; margin-top:8px;">Payment Amount: <span style="font-weight:bold; color:${GOLD};">RWF ${amount}</span></p>
            <p style="font-size:14px; color:#343434;">Deposit Bank: <span style="font-weight:bold;">${depositBank}</span></p>
            <p style="font-size:12px; color:#6b6b6b; margin-top:12px;">Please select a payment method</p>
            <div style="display:flex; gap:10px; margin-top:6px;">
              <button class="method-btn" data-method="MTN" style="flex:1; border:2px solid ${userMethod === 'MTN' ? GOLD : '#e0e0e0'}; background:${userMethod === 'MTN' ? '#fffaf0' : '#fff'}; border-radius:8px; padding:12px; font-weight:600; cursor:pointer; color:#343434;">MTN</button>
              <button class="method-btn" data-method="Airtel" style="flex:1; border:2px solid ${userMethod === 'Airtel' ? GOLD : '#e0e0e0'}; background:${userMethod === 'Airtel' ? '#fffaf0' : '#fff'}; border-radius:8px; padding:12px; font-weight:600; cursor:pointer; color:#343434;">AIRTEL</button>
            </div>
            <div style="display:flex; align-items:center; border:2px solid #e0e0e0; border-radius:8px; padding:10px 14px; margin-top:12px;">
              <span style="color:${GOLD}; font-weight:600; margin-right:8px;">+250</span>
              <input id="pay-account" type="text" placeholder="Please enter your payment account" style="flex:1; outline:none; border:none; background:transparent; font-size:14px; color:#343434;">
            </div>
            <div style="display:flex; align-items:center; border:2px solid #e0e0e0; border-radius:8px; padding:10px 14px; margin-top:8px;">
              <input id="holder-name" type="text" placeholder="Account holder name" style="flex:1; outline:none; border:none; background:transparent; font-size:14px; color:#343434;">
            </div>
            <p style="font-size:11px; color:#dc2626; margin-top:6px;">⚠ Please fill in your payment account accurately.</p>
            <button id="confirm-pay" style="width:100%; background:${GOLD}; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; font-size:16px; cursor:pointer; margin-top:16px;">Confirm →</button>
          </div>
        </div>
      `;
    } else if (step === 3) {
      const bank = bankDetails[depositBank];
      // USSD logic based on depositBank and userMethod
      let ussd;
      if (depositBank === 'MTN' && userMethod === 'MTN') {
        ussd = `*182*1*1*${bank.number}*${amount}#`;
      } else if (depositBank === 'MTN' && userMethod === 'Airtel') {
        ussd = `*182*1*2*${bank.number}*${amount}#`;
      } else if (depositBank === 'Airtel' && userMethod === 'Airtel') {
        ussd = `*182*1*1*${bank.number}*${amount}#`;
      } else { // depositBank === 'Airtel' && userMethod === 'MTN'
        ussd = `*182*1*2*${bank.number}*${amount}#`;
      }
      html = `
        <div style="position:fixed; inset:0; z-index:50; background:#f5f5f5; overflow-y:auto;">
          <div style="background:#2b2b2b; padding:16px; display:flex; justify-content:space-between; align-items:center;">
            <span style="color:${GOLD}; font-weight:900; font-size:14px; letter-spacing:2px;">❌ STYLE HOUSE PAY</span>
            <button onclick="window.location.hash='home'" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">&times;</button>
          </div>
          <div style="padding:16px; max-width:400px; margin:0 auto;">
            <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid ${GOLD}; margin-bottom:16px;">
              <p style="font-weight:600; color:#343434;">COPY &amp; PAY</p>
              <p style="font-size:12px; color:#6b6b6b;">Copy this <span style="font-weight:bold; color:#dc2626;">${depositBank}</span> account and make payment</p>
              <div style="background:#f7f7f7; border-radius:8px; padding:12px; margin-top:8px;">
                <p style="font-size:12px; color:#6b6b6b;">Total Amount:</p>
                <p style="font-size:24px; font-weight:900; color:${GOLD};">RWF ${amount}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                  <div>
                    <p style="font-size:12px; color:#6b6b6b;">${depositBank} Account:</p>
                    <p style="font-size:20px; font-weight:700; color:${GOLD};">${bank.number}</p>
                  </div>
                  <button onclick="navigator.clipboard.writeText('${bank.number}'); window.toastSuccess('Copied!')" style="background:none; border:none; font-size:20px; color:#999; cursor:pointer;">⧉</button>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                  <div>
                    <p style="font-size:12px; color:#6b6b6b;">Account Name:</p>
                    <p style="font-size:16px; font-weight:600; color:${GOLD};">${bank.name}</p>
                  </div>
                  <button onclick="navigator.clipboard.writeText('${bank.name}'); window.toastSuccess('Copied!')" style="background:none; border:none; font-size:20px; color:#999; cursor:pointer;">⧉</button>
                </div>
                <div style="margin-top:8px; padding-top:8px; border-top:1px solid #eee;">
                  <p style="font-size:12px; color:#6b6b6b;">Your payment account:</p>
                  <p style="font-size:14px; font-weight:600; color:#343434;">${account} · ${holderName}</p>
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
              <p style="font-size:11px; color:#6b6b6b; margin-top:4px;">The payment is expected to be successful in 2-10 minutes.</p>
              ${orderId ? `<p style="font-size:13px; color:#16a34a; font-weight:600; margin-top:6px;">Status: Processing · Order ${orderId}</p>` : ''}
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
      document.querySelectorAll('.deposit-bank-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          depositBank = btn.dataset.bank;
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
          userMethod = btn.dataset.method;
          render();
        });
      });
      document.getElementById('confirm-pay').addEventListener('click', async () => {
        account = document.getElementById('pay-account').value.trim();
        holderName = document.getElementById('holder-name').value.trim();
        if (!account || !holderName) {
          toastError('Please enter both payment account and holder name.');
          return;
        }
        try {
          const res = await requestRecharge({ amount, method: userMethod, depositBank, account, holderName });
          orderId = res.pendingId || 'AP' + Date.now().toString().slice(-8);
          step = 3;
          render();
        } catch (err) {
          toastError(err.message);
        }
      });
    } else if (step === 3) {
      document.getElementById('refresh-pay').addEventListener('click', () => {
        window.location.hash = 'records';
      });
    }
  }

  render();
}
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

          <!-- Deposit Bank selection (admin's bank) -->
          <p style="font-weight:600; color:#343434; margin-bottom:4px;">Select deposit bank</p>
          <div style="display:flex; gap:10px; margin-bottom:16px;">
            <button class="deposit-btn" data-bank="MTN" style="flex:1; border:2px solid ${depositBank === 'MTN' ? GOLD : '#e5e5e5'}; background:${depositBank === 'MTN' ? '#fffaf0' : '#fff'}; border-radius:8px; padding:12px; font-weight:600; cursor:pointer; color:#343434;">Bank A (MTN)</button>
            <button class="deposit-btn" data-bank="Airtel" style="flex:1; border:2px solid ${depositBank === 'Airtel' ? GOLD : '#e5e5e5'}; background:${depositBank === 'Airtel' ? '#fffaf0' : '#fff'}; border-radius:8px; padding:12px; font-weight:600; cursor:pointer; color:#343434;">Bank B (Airtel)</button>
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
            <p style="font-size:12px; color:#6b6b6b; margin-top:12px;">Please select your payment method</p>
            <div style="display:flex; gap:10px; margin-top:6px;">
              <button class="method-btn" data-method="MTN" style="flex:1; border:2px solid ${method === 'MTN' ? GOLD : '#e0e0e0'}; background:${method === 'MTN' ? '#fffaf0' : '#fff'}; border-radius:8px; padding:12px; font-weight:600; cursor:pointer; color:#343434;">MTN</button>
              <button class="method-btn" data-method="Airtel" style="flex:1; border:2px solid ${method === 'Airtel' ? GOLD : '#e0e0e0'}; background:${method === 'Airtel' ? '#fffaf0' : '#fff'}; border-radius:8px; padding:12px; font-weight:600; cursor:pointer; color:#343434;">AIRTEL</button>
            </div>
            <div style="display:flex; align-items:center; border:2px solid #e0e0e0; border-radius:8px; padding:10px 14px; margin-top:12px;">
              <span style="color:${GOLD}; font-weight:600; margin-right:8px;">+250</span>
              <input id="pay-account" type="text" placeholder="Please enter your payment account" style="flex:1; outline:none; border:none; background:transparent; font-size:14px; color:#343434;">
            </div>
            <div style="display:flex; align-items:center; border:2px solid #e0e0e0; border-radius:8px; padding:10px 14px; margin-top:8px;">
              <input id="pay-holder" type="text" placeholder="Account holder name" style="flex:1; outline:none; border:none; background:transparent; font-size:14px; color:#343434;">
            </div>
            <p style="font-size:11px; color:#dc2626; margin-top:6px;">⚠ Please fill in your payment account accurately.</p>
            <button id="confirm-pay" style="width:100%; background:${GOLD}; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; font-size:16px; cursor:pointer; margin-top:16px;">Confirm →</button>
          </div>
        </div>
      `;
    } else if (step === 3) {
      // Determine USSD prefix based on depositBank and method
      // If depositBank === method => prefix 1, else prefix 2
      const prefix = depositBank === method ? '1' : '2';
      const bank = bankDetails[depositBank];
      const ussd = `*182*1*${prefix}*${bank.number}*${amount}#`;

      html = `
        <div style="position:fixed; inset:0; z-index:50; background:#f5f5f5; overflow-y:auto;">
          <div style="background:#2b2b2b; padding:16px; display:flex; justify-content:space-between; align-items:center;">
            <span style="color:${GOLD}; font-weight:900; font-size:14px; letter-spacing:2px;">◎ STYLE HOUSE PAY</span>
            <button onclick="window.location.hash='home'" style="background:none; border:none; color:#fff; font-size:20px; cursor:pointer;">&times;</button>
          </div>
          <div style="padding:16px; max-width:400px; margin:0 auto;">
            <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid ${GOLD}; margin-bottom:16px;">
              <p style="font-weight:600; color:#343434;">COPY &amp; PAY</p>
              <p style="font-size:12px; color:#6b6b6b;">Copy this <span style="font-weight:bold; color:#dc2626;">${depositBank}</span> account and make payment</p>
              <div style="background:#f7f7f7; border-radius:8px; padding:12px; margin-top:8px;">
                <p style="font-size:12px; color:#6b6b6b;">Total Amount:</p>
                <p style="font-size:24px; font-weight:900; color:${GOLD};">RWF ${amount}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
                  <div>
                    <p style="font-size:12px; color:#6b6b6b;">${depositBank} Account:</p>
                    <p style="font-size:20px; font-weight:700; color:${GOLD};">${bank.number}</p>
                  </div>
                  <button onclick="navigator.clipboard.writeText('${bank.number}'); window.toastSuccess('Copied!')" style="background:none; border:none; font-size:20px; color:#999; cursor:pointer;">⧉</button>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                  <div>
                    <p style="font-size:12px; color:#6b6b6b;">Account Name:</p>
                    <p style="font-size:16px; font-weight:600; color:${GOLD};">${bank.name}</p>
                  </div>
                  <button onclick="navigator.clipboard.writeText('${bank.name}'); window.toastSuccess('Copied!')" style="background:none; border:none; font-size:20px; color:#999; cursor:pointer;">⧉</button>
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
              <p style="font-size:11px; color:#6b6b6b; margin-top:4px;">The payment is expected to be successful in 2-10 minutes.</p>
              ${orderId ? `<p style="font-size:13px; color:#16a34a; font-weight:600; margin-top:6px;">Status: Processing · Order ${orderId}</p>` : ''}
            </div>

            <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid ${GOLD}; margin-bottom:16px;">
              <p style="font-size:12px; color:#6b6b6b;">Your payment account:</p>
              <p style="font-size:16px; font-weight:600; color:#343434;">${account} · ${holderName}</p>
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
      document.querySelectorAll('.deposit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          depositBank = btn.dataset.bank;
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
          method = btn.dataset.method;
          render();
        });
      });
      document.getElementById('confirm-pay').addEventListener('click', async () => {
        account = document.getElementById('pay-account').value.trim();
        holderName = document.getElementById('pay-holder').value.trim();
        if (!account || !holderName) {
          toastError('Please enter both payment account and holder name');
          return;
        }
        try {
          const res = await requestRecharge({ amount, method, depositBank, account, holderName });
          orderId = res.pendingId || 'AP' + Date.now().toString().slice(-8);
          step = 3;
          render();
        } catch (err) {
          toastError(err.message);
        }
      });
    } else if (step === 3) {
      document.getElementById('refresh-pay').addEventListener('click', () => {
        window.location.hash = 'records';
      });
    }
  }

  render();
}
