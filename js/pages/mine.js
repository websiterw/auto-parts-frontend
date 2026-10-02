import { getMe, apiCall } from '../api.js';
import { toastError, toastSuccess } from '../api.js';

export async function renderMine() {
  const app = document.getElementById('app');

  // ✅ Always fetch fresh user data FIRST
  let user = JSON.parse(localStorage.getItem('user')) || {};
  try {
    const fresh = await getMe();
    user = fresh;
    localStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    // fallback to cached user
  }

  const balance = user.balance || 0;
  const income = user.cumulativeIncome || 0;
  const code = user.myReferralCode || '';
  const account = user.accountNumber || '';

  let productCount = 0;
  let dailyIncome = 0;
  try {
    const investments = await apiCall('/investments');
    productCount = investments.length;
    dailyIncome = investments.reduce((sum, inv) => sum + (inv.dailyIncome || 0), 0);
  } catch (e) {}

  app.innerHTML = `
    <!-- Banner -->
    <div style="position:relative; width:100%; height:180px; background: #2E6F40;">
      <img src="assets/images/mine-banner.png" alt="Mine" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'">
      <div style="position:absolute; inset:0; background:rgba(0,0,0,0.25);"></div>
      <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:28px; font-weight:900; letter-spacing:2px; text-shadow:0 2px 10px rgba(0,0,0,0.3);">Mine</div>
    </div>

    <div style="padding:0 16px; margin-top:-20px;">
      <!-- Profile card -->
      <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #2E6F40; display:flex; align-items:center; gap:12px; margin-bottom:16px;">
        <div style="width:56px; height:56px; border-radius:50%; background:#2E6F40; display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; font-weight:900;">${account.slice(-2) || 'AP'}</div>
        <div>
          <p style="font-weight:900; color:#2E6F40; font-size:16px;">Account ${account || '-'}</p>
          <p style="font-size:12px; color:#dc2626;">Invite code: ${code}</p>
        </div>
      </div>

      <!-- Stats grid -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
        <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid #2E6F40; text-align:center;">
          <p style="color:#6b6b6b; font-size:11px;">Balance</p>
          <p style="font-size:18px; font-weight:900; color:#dc2626;">RWF ${balance.toFixed(2)}</p>
        </div>
        <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid #2E6F40; text-align:center;">
          <p style="color:#6b6b6b; font-size:11px;">Total income</p>
          <p style="font-size:18px; font-weight:900; color:#dc2626;">RWF ${income.toFixed(2)}</p>
        </div>
        <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid #2E6F40; text-align:center;">
          <p style="color:#6b6b6b; font-size:11px;">Products owned</p>
          <p style="font-size:18px; font-weight:900; color:#dc2626;">${productCount}</p>
        </div>
        <div style="background:#fff; border-radius:12px; padding:12px; border:2px solid #2E6F40; text-align:center;">
          <p style="color:#6b6b6b; font-size:11px;">Daily income</p>
          <p style="font-size:18px; font-weight:900; color:#dc2626;">RWF ${dailyIncome.toFixed(2)}</p>
        </div>
      </div>

      <!-- Action buttons -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
        <button class="btn" onclick="window.location.hash='recharge'" style="background:#2E6F40; color:#fff; border:none; border-radius:30px; padding:10px; font-weight:700; cursor:pointer;">Recharge</button>
        <button class="btn" onclick="window.location.hash='withdraw'" style="background:#2E6F40; color:#fff; border:none; border-radius:30px; padding:10px; font-weight:700; cursor:pointer;">Withdraw</button>
        <button class="btn" onclick="window.location.hash='team'" style="background:#2E6F40; color:#fff; border:none; border-radius:30px; padding:10px; font-weight:700; cursor:pointer;">My team</button>
        <button class="btn" id="checkin-btn" style="background:#2E6F40; color:#fff; border:none; border-radius:30px; padding:10px; font-weight:700; cursor:pointer;">Check in</button>
      </div>

      <!-- Menu list with icons (left‑aligned) -->
      <div style="background:#fff; border-radius:16px; border:2px solid #2E6F40; overflow:hidden; margin-bottom:16px;">
        ${[
          { icon: 'fa-receipt', label: 'Recharge records', action: "window.location.hash='records'" },
          { icon: 'fa-landmark', label: 'Withdrawal records', action: "window.location.hash='records'" },
          { icon: 'fa-chart-line', label: 'Income records', action: "window.location.hash='records'" },
          { icon: 'fa-box', label: 'My products', action: "window.location.hash='myproduct'" },
          { icon: 'fa-users', label: 'My team', action: "window.location.hash='team'" },
          { icon: 'fa-link', label: 'Invitation link', action: `navigator.clipboard.writeText('${window.location.origin}/#register?code=${code}'); window.toastSuccess('Link copied!')` },
          { icon: 'fa-headset', label: 'Customer service', action: "window.location.hash='customerService'" },
          { icon: 'fa-scroll', label: 'Rules & Regulations', action: "window.location.hash='rules'" },
        ].map(item => `
          <div onclick="${item.action}" style="display:flex; align-items:center; gap:12px; padding:14px 16px; border-bottom:1px solid #f0f0f0; cursor:pointer; transition:background 0.1s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='#fff'">
            <i class="fas ${item.icon}" style="color:#2E6F40; width:20px; text-align:center;"></i>
            <span style="flex:1; font-size:14px; font-weight:600; color:#2E6F40;">${item.label}</span>
            <span style="color:#2E6F40;">›</span>
          </div>
        `).join('')}
      </div>

      <!-- Gift code & My orders -->
      <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #2E6F40; margin-bottom:16px;">
        <p style="font-weight:900; color:#2E6F40; margin-bottom:8px;">Gift code</p>
        <div style="display:flex; gap:8px;">
          <input id="gift-input" type="text" placeholder="Enter gift code" style="flex:1; border:2px solid #e5e5e5; border-radius:8px; padding:8px 12px; outline:none;">
          <button id="gift-redeem" style="background:#2E6F40; color:#fff; border:none; border-radius:8px; padding:8px 16px; font-weight:700; cursor:pointer;">Redeem</button>
        </div>
      </div>

      <div style="background:#fff; border-radius:16px; padding:16px; border:2px solid #2E6F40; margin-bottom:16px;">
        <p style="font-weight:900; color:#2E6F40; margin-bottom:8px;">My orders</p>
        ${productCount === 0 ? '<p style="color:#6b6b6b; font-size:13px;">No products yet.</p>' : ''}
      </div>

      <button onclick="localStorage.clear(); window.location.hash='login'" style="width:100%; background:#dc2626; color:#fff; border:none; border-radius:30px; padding:14px; font-weight:700; cursor:pointer; margin-bottom:20px;">Logout</button>
    </div>
  `;

  document.getElementById('checkin-btn').addEventListener('click', async () => {
    try {
      await apiCall('/checkin', { method: 'POST' });
      toastSuccess('Check-in successful!');
      renderMine();
    } catch (err) {
      toastError(err.message || 'Already checked in today');
    }
  });

  document.getElementById('gift-redeem').addEventListener('click', async () => {
    const code = document.getElementById('gift-input').value.trim();
    if (!code) { toastError('Enter a gift code'); return; }
    try {
      const data = await apiCall('/gift/redeem', { method: 'POST', body: JSON.stringify({ code }) });
      toastSuccess(`Gift redeemed! +RWF ${data.amount}`);
      renderMine();
    } catch (err) {
      toastError(err.message);
    }
  });
}


/* ============================================================
   ✅ NEW FEATURE: RULES & REGULATIONS PAGE
   Added below — does not modify any existing code above.
   ============================================================ */

export function renderRules() {
  const app = document.getElementById('app');

  const rules = [
    {
      title: '1. Account Registration and Duration',
      icon: 'fa-user-plus',
      points: [
        'Every AEROGROBALSHIPPING employee/user must create and maintain only one valid account.',
        'Each account is valid for a maximum period of 180 days, subject to the terms of the AEROGROBALSHIPPING program.',
        'Users must provide accurate and valid information during registration.',
        'Users are responsible for keeping their account information and login details secure.'
      ]
    },
    {
      title: '2. Account Recharge',
      icon: 'fa-wallet',
      points: [
        'The minimum recharge amount is 6,000 RWF.',
        'A user may recharge 3,000 RWF and, if eligible, receive a 3,000 RWF Welcome Bonus, giving a total balance of 6,000 RWF.',
        'The 6,000 RWF balance may be used to purchase the first eligible product.',
        'Recharge can be made through MTN MoMo or Airtel Money using the official payment instructions provided by AEROGROBALSHIPPING.',
        "Before sending money, every user must carefully follow the provided payment procedure and verify the recipient's name and payment details to avoid sending money to the wrong account."
      ]
    },
    {
      title: '3. Automatic Account Credit',
      icon: 'fa-bolt',
      points: [
        "After a successful recharge has been received and verified, the corresponding amount will be credited to the user's AEROGROBALSHIPPING account according to the platform's processing system.",
        'Users should keep their transaction receipt or transaction reference until the recharge has been successfully reflected in their account.'
      ]
    },
    {
      title: '4. Product Purchase',
      icon: 'fa-box-open',
      points: [
        'A user must purchase an eligible product before becoming eligible to withdraw funds, according to the applicable AEROGROBALSHIPPING conditions.',
        'Users may purchase any available eligible products they wish, subject to availability.',
        'Product prices and availability may change when necessary.'
      ]
    },
    {
      title: '5. Withdrawals',
      icon: 'fa-money-bill-transfer',
      points: [
        'Eligible users may request withdrawals after fulfilling the applicable withdrawal requirements.',
        "Approved withdrawals are sent to the user's registered MTN MoMo account.",
        'Withdrawals are normally expected to arrive within approximately 2–15 minutes, subject to transaction processing and network conditions.',
        'Users are responsible for providing correct Mobile Money details.'
      ]
    },
    {
      title: '6. Gift Code',
      icon: 'fa-gift',
      points: [
        'AEROGROBALSHIPPING may provide a daily Gift Code at 16:20 PM.',
        'The Gift Code is distributed through the official AEROGROBALSHIPPING group by the authorized owner/customer service.',
        'Users must enter the Gift Code exactly as it appears in the official group in the designated section of the AEROGROBALSHIPPING platform.',
        'Users may earn approximately 70–200 RWF through eligible Gift Code activities, according to the applicable daily conditions.',
        'Users should not use unofficial, expired, modified, or fraudulent Gift Codes.',
        'Each Gift Code should be used according to the instructions provided by AEROGROBALSHIPPING.'
      ]
    },
    {
      title: '7. Daily Check-in',
      icon: 'fa-calendar-check',
      points: [
        'In addition to Gift Code earnings, users may earn through the daily Check-in activity.',
        'An eligible Check-in may provide 100 RWF per 24-hour period, subject to the applicable program conditions.',
        'Users should complete Check-in according to the instructions displayed on the platform.',
        'Check-in rewards are subject to account eligibility and verification.'
      ]
    },
    {
      title: '8. Referral and Customer Invitation',
      icon: 'fa-user-group',
      points: [
        'Every employee/user is encouraged to invite customers to join and use AEROGROBALSHIPPING.',
        'Users may earn referral commissions for qualifying invitations.',
        'The commission for one qualifying invitation is 38%, subject to the applicable referral conditions.',
        'As users progress through different categories or levels, they may become eligible for the benefits and earnings associated with those levels.',
        'Referral activities must be genuine. Creating fake accounts, duplicate accounts, or manipulating referrals is prohibited.'
      ]
    },
    {
      title: '9. Employee Responsibilities',
      icon: 'fa-briefcase',
      points: [
        'Every employee is expected to invite and support customers so that AEROGROBALSHIPPING activities can operate effectively.',
        'Employees should provide customers with correct information and guide them through the proper procedures.'
      ]
    }
  ];

  app.innerHTML = `
    <!-- Header / Banner -->
    <div style="position:relative; width:100%; height:160px; background:#2E6F40; display:flex; align-items:center; justify-content:center;">
      <div style="position:absolute; inset:0; background:linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0.05));"></div>
      <div style="position:relative; text-align:center; color:#fff;">
        <i class="fas fa-scroll" style="font-size:34px; margin-bottom:6px; display:block;"></i>
        <h1 style="font-size:24px; font-weight:900; letter-spacing:1px; margin:0;">Rules &amp; Regulations</h1>
        <p style="font-size:12px; opacity:0.9; margin-top:4px;">AEROGROBALSHIPPING</p>
      </div>
    </div>

    <div style="padding:16px;">

      <!-- Back button -->
      <button onclick="window.location.hash='mine'" style="display:flex; align-items:center; gap:6px; background:#fff; border:2px solid #2E6F40; color:#2E6F40; border-radius:30px; padding:8px 16px; font-weight:700; font-size:13px; cursor:pointer; margin-bottom:16px;">
        <i class="fas fa-arrow-left"></i> Back to Mine
      </button>

      <!-- Intro card -->
      <div style="background:#EDF4F0; border-left:4px solid #2E6F40; border-radius:12px; padding:14px; margin-bottom:16px;">
        <p style="font-size:13px; color:#1F4D2B; line-height:1.6; margin:0;">
          Please read the following rules and regulations carefully before using the AEROGROBALSHIPPING platform. By using our services, you agree to comply with all terms below.
        </p>
      </div>

      <!-- Rules list -->
      ${rules.map((rule, idx) => `
        <div style="background:#fff; border-radius:14px; border:2px solid #2E6F40; margin-bottom:14px; overflow:hidden;">
          <!-- Rule header -->
          <div style="background:#2E6F40; color:#fff; padding:12px 14px; display:flex; align-items:center; gap:10px;">
            <div style="width:34px; height:34px; border-radius:50%; background:rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <i class="fas ${rule.icon}" style="font-size:15px;"></i>
            </div>
            <h2 style="font-size:14px; font-weight:900; margin:0; line-height:1.3;">${rule.title}</h2>
          </div>

          <!-- Rule points -->
          <div style="padding:12px 14px;">
            <ul style="margin:0; padding-left:0; list-style:none;">
              ${rule.points.map((p, i) => `
                <li style="display:flex; gap:8px; margin-bottom:${i === rule.points.length - 1 ? '0' : '10px'}; font-size:13px; color:#343434; line-height:1.55;">
                  <i class="fas fa-check-circle" style="color:#2E6F40; font-size:12px; margin-top:3px; flex-shrink:0;"></i>
                  <span>${p}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `).join('')}

      <!-- Footer note -->
      <div style="background:#fff; border-radius:12px; border:2px dashed #2E6F40; padding:14px; margin-bottom:24px; text-align:center;">
        <i class="fas fa-shield-halved" style="color:#2E6F40; font-size:20px; margin-bottom:6px; display:block;"></i>
        <p style="font-size:12px; color:#1F4D2B; margin:0; line-height:1.5;">
          Failure to comply with these rules may result in suspension or termination of your account.
        </p>
      </div>
    </div>
  `;

  // Scroll to top on load
  window.scrollTo(0, 0);
}
