(function initLoader() {
      const bar = document.getElementById('loading-bar');
      const hint = document.getElementById('loading-hint');
      const loadingScreen = document.getElementById('screen-loading');

      const steps = [
        { pct: 25,  msg: 'Loading restaurants…' },
        { pct: 55,  msg: 'Fetching local menus…' },
        { pct: 80,  msg: 'Almost there…' },
        { pct: 100, msg: 'Ready!' },
      ];

      let i = 0;
      function tick() {
        if (i >= steps.length) return;
        const step = steps[i++];
        bar.style.width = step.pct + '%';
        hint.textContent = step.msg;
        if (i < steps.length) {
          setTimeout(tick, 400 + Math.random() * 300);
        } else {
          setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
              loadingScreen.classList.remove('active');
              document.getElementById('screen-welcome').classList.add('active');
            }, 480);
          }, 400);
        }
      }

      setTimeout(tick, 350);
    })();

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