async function handleLogin(event) {
  event.preventDefault();
  const phone = document.getElementById('loginPhone').value;
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');

  try {
    // Replace with actual API call
    // const response = await fetch('/api/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone, password })
    // });
    // const data = await response.json();
    // if (response.ok) {
    //   localStorage.setItem('token', data.token);
    //   window.location.href = 'dashboard.html';
    // } else {
    //   throw new Error(data.error || 'Invalid credentials');
    // }
    window.location.href = 'dashboard.html'; // Mock redirect
  } catch (error) {
    errorEl.textContent = error.message || 'Invalid credentials';
    errorEl.classList.remove('hidden');
  }
}

async function handleSendOTP() {
  const phone = document.getElementById('regPhone').value;
  const errorEl = document.getElementById('registerError');

  try {
    // Replace with actual API call
    // const response = await fetch('/api/send-otp', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone })
    // });
    // if (!response.ok) throw new Error('Failed to send OTP');
    document.getElementById('registerStep1').classList.add('hidden');
    document.getElementById('registerStep2').classList.remove('hidden');
  } catch (error) {
    errorEl.textContent = error.message || 'Failed to send OTP';
    errorEl.classList.remove('hidden');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const phone = document.getElementById('regPhone').value;
  const city = document.getElementById('regCity').value;
  const state = document.getElementById('regState').value;
  const country = document.getElementById('regCountry').value;
  const otp = document.getElementById('regOtp').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const errorEl = document.getElementById('registerError');

  if (password !== confirmPassword) {
    errorEl.textContent = 'Passwords do not match';
    errorEl.classList.remove('hidden');
    return;
  }

  try {
    // Replace with actual API calls
    // const otpResponse = await fetch('/api/verify-otp', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone, otp })
    // });
    // if (!otpResponse.ok) throw new Error('Invalid OTP');
    // const regResponse = await fetch('/api/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phone, city, state, country, password })
    // });
    // if (!regResponse.ok) throw new Error('Registration failed');
    window.location.href = 'dashboard.html'; // Mock redirect
  } catch (error) {
    errorEl.textContent = error.message || 'Registration failed';
    errorEl.classList.remove('hidden');
  }
}

async function handleInvest() {
  try {
    // Replace with actual API call
    // const response = await fetch('/api/invest', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount: 500 })
    // });
    // if (!response.ok) throw new Error('Investment failed');
    alert('Investment of ₹500 successful! ₹800 will be credited after 8 days.');
  } catch (error) {
    alert(error.message || 'Investment failed');
  }
}

async function handleAddBalance(event) {
  event.preventDefault();
  const amount = document.getElementById('addAmount').value;

  try {
    // Replace with actual API call (e.g., Razorpay integration)
    // const response = await fetch('/api/add-balance', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount })
    // });
    // if (!response.ok) throw new Error('Failed to add balance');
    alert(`₹${amount} added successfully!`);
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message || 'Failed to add balance');
  }
}

async function handleWithdraw(event) {
  event.preventDefault();
  const amount = document.getElementById('withdrawAmount').value;

  try {
    // Replace with actual API call
    // const response = await fetch('/api/withdraw', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ amount })
    // });
    // if (!response.ok) throw new Error('Withdrawal request failed');
    alert(`Withdrawal request for ₹${amount} submitted!`);
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message || 'Withdrawal request failed');
  }
}
