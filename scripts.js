async function handleLogin(event) {
  event.preventDefault();
  const phone = document.getElementById('loginPhone').value;
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      throw new Error(data.error || 'Invalid credentials');
    }
  } catch (error) {
    errorEl.textContent = error.message || 'Invalid credentials';
    errorEl.classList.remove('hidden');
  }
}

async function handleSendOTP() {
  const phone = document.getElementById('regPhone').value;
  const errorEl = document.getElementById('registerError');

  try {
    const response = await fetch('http://localhost:5000/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
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
    const otpResponse = await fetch('http://localhost:5000/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp })
    });
    const otpData = await otpResponse.json();
    if (!otpResponse.ok) throw new Error(otpData.error || 'Invalid OTP');

    const regResponse = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, city, state, country, password })
    });
    const regData = await regResponse.json();
    if (!regResponse.ok) throw new Error(regData.error || 'Registration failed');

    window.location.href = 'dashboard.html';
  } catch (error) {
    errorEl.textContent = error.message || 'Registration failed';
    errorEl.classList.remove('hidden');
  }
}

async function handleInvest() {
  try {
    const response = await fetch('http://localhost:5000/api/invest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ amount: 500 })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Investment failed');
    alert('Investment of ₹500 successful! ₹800 will be credited after 8 days.');
  } catch (error) {
    alert(error.message || 'Investment failed');
  }
}

async function handleAddBalance(event) {
  event.preventDefault();
  const amount = document.getElementById('addAmount').value;

  try {
    const response = await fetch('http://localhost:5000/api/add-balance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ amount })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create payment order');

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay Key ID
      amount: data.amount * 100,
      currency: 'INR',
      order_id: data.orderId,
      handler: async function (response) {
        const verifyResponse = await fetch('http://localhost:5000/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(response)
        });
        const verifyData = await verifyResponse.json();
        if (verifyResponse.ok) {
          alert(`₹${amount} added successfully!`);
          window.location.href = 'dashboard.html';
        } else {
          alert(verifyData.error || 'Payment verification failed');
        }
      }
    };
    const rzp = new Razorpay(options);
    rzp.open();
  } catch (error) {
    alert(error.message || 'Failed to add balance');
  }
}

async function handleWithdraw(event) {
  event.preventDefault();
  const amount = document.getElementById('withdrawAmount').value;

  try {
    const response = await fetch('http://localhost:5000/api/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ amount })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Withdrawal request failed');
    alert(`Withdrawal request for ₹${amount} submitted!`);
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message || 'Withdrawal request failed');
  }
}
