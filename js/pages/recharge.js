import { requestRecharge, getPublicSettings } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderRecharge() {
  const app = document.getElementById('app');
  let step = 1;
  let amount = 0;
  let method = 'MTN';
  let account = '';
  let orderId = '';

  const presetAmounts = [6000, 12000, 25000, 50000, 100000, 250000, 500000, 1000000];
  const MIN = 6000;

  // Fetch bank details from settings
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
        <div class="hero" style="background: var(--green);">
          <div class="hero-overlay"></div>
          <div class="hero-title">RECHARGE</div>
        </div>
        <div class="px-4 -mt-6">
          <p class="font-semibold text-sm mb-2">Select recharge amount</p>
          <div class="grid grid-cols-4 gap-2 mb-4">
            ${presetAmounts.map(a => `
              <button class="amount-btn border-2 rounded-md py-2 text-sm font-semibold" style="border-color: ${amount === a ? 'var(--green)' : '#e5e5e5'}; background: ${amount === a ? 'var(--green)' : '#fff'}; color: ${amount === a ? '#fff' : '#343434'};">${a.toLocaleString()}</button>
            `).join('')}
          </div>
          <div class="flex items-center border-2 rounded-md px-4 py-3 mb-4" style="border-color: var(--green);">
            <span class="text-muted mr-2">RWF</span>
            <input id="custom-amount" type="number" placeholder="Enter amount" class="flex-1 outline-none bg-transparent" value="${amount || ''}">
          </div>
          <div class="card mb-4">
            <p class="font-semibold text-sm">Recharge method</p>
            <div class="flex items-center border-2 rounded-md px-4 py-3 mt-2" style="border-color: var(--green); background: #f3fdf6;">
              <span class="w-7 h-7 rounded bg-green-500 flex items-center justify-center text-white text-xs mr-3">🏦</span>
              <span class="flex-1 font-semibold">Deposit Bank</span>
              <span class="text-green-500 text-lg">✓</span>
            </div>
          </div>
          <button id="confirm-amount" class="btn" style="background: ${amount >= MIN ? 'var(--green)' : '#d9d9d9'};" ${amount < MIN ? 'disabled' : ''}>Confirm</button>
          <button onclick="window.location.hash='records'" class="btn btn-secondary mt-2">View recharge history</button>
          <ol class="text-xs text-muted mt-4 space-y-1">
            <li>1. The minimum recharge amount is RWF6000.</li>
            <li>2. Please use your latest account number for each recharge.</li>
            <li>3. Carefully read the payment instructions.</li>
            <li>4. If not credited, contact customer service.</li>
          </ol>
        </div>
      `;
    } else if (step === 2) {
      html = `
        <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-5">
          <div class="bg-white rounded-xl p-6 w-full max-w-sm">
            <button onclick="step=1; render()" class="absolute top-2 right-3 text-2xl text-gray-600">&times;</button>
            <p class="text-center text-gold font-black text-sm tracking-widest">◎ AUTOPAY</p>
            <p class="text-sm text-gray-600 mt-2">Payment Amount: <span class="font-bold text-gold">RWF ${amount}</span></p>
            <p class="text-xs text-gray-500 mt-2">Please select a payment method</p>
            <div class="flex gap-2 mt-1">
              <button class="method-btn flex-1 border-2 rounded-md py-2 text-center" data-method="MTN" style="border-color: ${method === 'MTN' ? 'var(--gold)' : '#e0e0e0'}; background: ${method === 'MTN' ? '#fffaf0' : '#fff'};">
                <span class="block text-xs font-black" style="color: ${method === 'MTN' ? 'var(--gold)' : '#343434'};">MTN</span>
              </button>
              <button class="method-btn flex-1 border-2 rounded-md py-2 text-center" data-method="Airtel" style="border-color: ${method === 'Airtel' ? 'var(--gold)' : '#e0e0e0'}; background: ${method === 'Airtel' ? '#fffaf0' : '#fff'};">
                <span class="block text-xs font-black" style="color: ${method === 'Airtel' ? 'var(--gold)' : '#343434'};">AIRTEL</span>
              </button>
            </div>
            <div class="flex items-center border-2 rounded-md px-3 py-2 mt-3" style="border-color: #e0e0e0;">
              <span class="text-gold text-sm mr-2">+250</span>
              <input id="pay-account" type="text" placeholder="Please enter your payment account" class="flex-1 outline-none bg-transparent text-sm">
            </div>
            <p class="text-xs text-red-500 mt-1">⚠ Please fill in your payment account accurately.</p>
            <button id="confirm-pay" class="btn btn-gold w-full mt-3">Confirm →</button>
          </div>
        </div>
      `;
    } else if (step === 3) {
      const bank = bankDetails[method];
      const ussd = `*182*1*1*${bank.number}*${amount}#`;
      html = `
        <div class="fixed inset-0 z-50 bg-white overflow-y-auto">
          <div class="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
            <span class="text-gold font-black text-sm tracking-widest">◎ AUTOPAY</span>
            <button onclick="window.location.hash='home'" class="text-white text-xl">&times;</button>
          </div>
          <div class="p-4 space-y-4">
            <div class="card">
              <p class="text-muted text-sm">COPY &amp; PAY</p>
              <p class="text-xs text-muted">Copy this <span class="font-bold text-red-500">${method}</span> account and make payment</p>
              <div class="bg-gray-100 rounded-md p-3 mt-2">
                <p class="text-muted text-xs">Total Amount:</p>
                <p class="text-gold text-2xl font-bold">RWF ${amount}</p>
                <div class="flex justify-between items-center mt-2">
                  <div>
                    <p class="text-muted text-xs">${method} Account:</p>
                    <p class="text-gold text-xl font-bold">${bank.number}</p>
                  </div>
                  <button onclick="navigator.clipboard.writeText('${bank.number}'); toastSuccess('Copied!')" class="text-gray-400 text-lg">⧉</button>
                </div>
                <div class="flex justify-between items-center mt-1">
                  <div>
                    <p class="text-muted text-xs">Account Name:</p>
                    <p class="text-gold text-lg font-bold">${bank.name}</p>
                  </div>
                  <button onclick="navigator.clipboard.writeText('${bank.name}'); toastSuccess('Copied!')" class="text-gray-400 text-lg">⧉</button>
                </div>
              </div>
              <a href="tel:${ussd}" class="btn btn-gold w-full mt-3">Click to pay</a>
              <p class="text-center text-gold text-sm mt-1">${ussd}</p>
            </div>
            <div class="card">
              <p class="text-muted text-sm">Payment completed?</p>
              <div class="flex items-center justify-between mt-2">
                <div>
                  <p class="text-muted text-xs">Amount paid:</p>
                  <p class="text-2xl font-bold" style="color: ${orderId ? 'var(--gold)' : '#c7c7c7'};">RWF ${orderId ? amount : 0}</p>
                </div>
                <button id="refresh-pay" class="btn btn-gold px-6 py-2 text-sm">Refresh</button>
              </div>
              <p class="text-xs text-muted mt-1">Payment expected in 2-10 minutes.</p>
              ${orderId ? `<p class="text-sm text-green-600 mt-1 font-semibold">Status: Processing · Order ${orderId}</p>` : ''}
            </div>
            <div class="card">
              <p class="text-muted text-sm">Your payment account:</p>
              <p class="text-lg font-bold">${account}</p>
            </div>
            <button onclick="window.location.hash='records'" class="btn btn-secondary">View recharge history</button>
            <button onclick="window.location.hash='home'" class="btn">Back to home</button>
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
          amount = parseInt(btn.textContent.replace(/,/g, ''));
          document.getElementById('custom-amount').value = amount;
          render();
        });
      });
      document.getElementById('custom-amount').addEventListener('input', (e) => {
        amount = parseFloat(e.target.value) || 0;
        render();
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
        if (!account) { toastError('Please enter your payment account'); return; }
        try {
          const res = await requestRecharge({ amount, method, account });
          orderId = res.pendingId || 'AP' + Date.now().toString().slice(-8);
          step = 3;
          render();
        } catch (err) {
          toastError(err.message);
        }
      });
    } else if (step === 3) {
      document.getElementById('refresh-pay').addEventListener('click', () => {
        // Simulate refresh – just go to records
        window.location.hash = 'records';
      });
    }
  }

  render();
}
