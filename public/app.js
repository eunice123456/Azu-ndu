/* ---------- prefill the email from a link ---------- */
function emailFromLink() {
  const params = new URLSearchParams(window.location.search);
  let value = params.get('email');

  if (!value && window.location.hash.length > 1) {
    value = window.location.hash.slice(1);
    if (value.toLowerCase().startsWith('email=')) value = value.slice(6);
    value = decodeURIComponent(value);
  }

  return (value || '').trim();
}

const linkEmail = emailFromLink();

if (linkEmail) {
  // came from a link — use that address and jump to the password box
  emailInput.value = linkEmail;
  localStorage.setItem(SAVED_EMAIL, linkEmail);
  passInput.focus();
} else {
  // normal visit — restore whatever they typed last time
  const remembered = localStorage.getItem(SAVED_EMAIL);
  if (remembered) emailInput.value = remembered;
}