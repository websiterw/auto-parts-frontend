import { getTeamData } from '../api.js';

export async function renderTeam() {
  const app = document.getElementById('app');
  const user = JSON.parse(localStorage.getItem('user')) || {};
  app.className = 'dark-page';

  const FRONTEND_URL = 'https://auto-parts-nine-chi.vercel.app';

  const topImage = 'assets/images/team-1.png';
  const bottomImage = 'assets/images/team-2.png';

  // ... rest of teamData fetching

  const referralCode = user.myReferralCode || 'ABC12';
  // Build link with #register?code=...
  const referralLink = `${FRONTEND_URL}/#register?code=${referralCode}`;

  // ... render HTML with the link

  // In the event listener for copying the link:
  document.getElementById('copy-link').addEventListener('click', () => {
    navigator.clipboard.writeText(referralLink);
    alert('Link copied!');
  });
}
