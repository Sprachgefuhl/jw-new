const form = document.getElementById('sub-form');
const statusEl = document.getElementById('status');
const iconEl = document.getElementById('status-icon');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.email.value;

  try {
    const res = await fetch('/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
    });

    statusEl.textContent = '';
    iconEl.style.display = 'none';

    const result = await res.json();
    if (result.msg === 'Invalid email' || result.msg === 'Already subscribed') {
      iconEl.className = 'error-dot';
      iconEl.style.display = 'block';
    } else {
      iconEl.className = 'success-dot';
      iconEl.style.display = 'block';
    }
    statusEl.textContent = result.msg;

    form.reset();
  } catch (err) {
    console.error(err);
    alert('Something went wrong. Please try again.');
  }
});