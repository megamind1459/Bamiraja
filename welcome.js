    function showScreen(id) {
      document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
      document.getElementById(id).classList.add('active');
    }
    function handleLogin() {
      const role = document.getElementById('login-role').value;
      const dest = { customer: 'customer.html', rider: 'rider.html', supplier: 'supplier.html', admin: 'admin.html' }[role] || 'customer.html';
      alert('✅ Login successful! Redirecting…');
      window.location.href = dest;
    }
    function handleRegister() {
      const role = document.getElementById('register-role').value;
      const dest = { customer: 'customer.html', rider: 'rider.html', supplier: 'supplier.html', admin: 'admin.html' }[role] || 'customer.html';
      alert('🎉 Account created! Redirecting…');
      window.location.href = dest;
    }
