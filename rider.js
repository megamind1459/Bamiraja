  let dutyOn = true;

  function toggleDuty() {
    dutyOn = !dutyOn;
    const track = document.getElementById('duty-toggle');
    const label = document.getElementById('duty-label');
    const card = document.getElementById('offer-card');
    track.classList.toggle('on', dutyOn);
    label.textContent = dutyOn ? 'Online' : 'Offline';
    card.style.opacity = dutyOn ? '1' : '0.4';
    card.style.pointerEvents = dutyOn ? 'auto' : 'none';
  }

  const pageNavMap = {
    'page-jobs': 'nav-jobs',
    'page-earnings': 'nav-earnings',
    'page-history': 'nav-history',
    'page-account': 'nav-account',
  };

  function switchView(viewId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    // Update nav
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const navId = pageNavMap[viewId];
    if (navId) document.getElementById(navId).classList.add('active');
    // hide bottom bar on trip page
    document.getElementById('bottom-bar').style.display = viewId === 'page-trip' ? 'none' : 'flex';
  }

  function declineOffer() {
    const card = document.getElementById('offer-card');
    card.style.opacity = '0.4';
    setTimeout(() => { card.style.opacity = '1'; }, 1500);
  }

  function acceptOrder() {
    switchView('page-trip');
    setTimeout(() => {
      document.getElementById('rider-map-node').style.left = '50%';
      document.getElementById('rider-map-node').style.top = '35%';
    }, 600);
  }

  function confirmPickup() {
    const pill = document.getElementById('trip-status-pill');
    pill.textContent = 'Heading to Dropoff';
    pill.className = 'status-pill blue';
    document.getElementById('step-pickup-ui').style.display = 'none';
    document.getElementById('step-dropoff-ui').style.display = 'block';
    document.getElementById('rider-map-node').style.left = '62%';
    document.getElementById('rider-map-node').style.top = '28%';
  }

  function confirmDelivery() {
    document.getElementById('step-pickup-ui').style.display = 'block';
    document.getElementById('step-dropoff-ui').style.display = 'none';
    const pill = document.getElementById('trip-status-pill');
    pill.textContent = 'Heading to Pickup';
    pill.className = 'status-pill amber';
    document.getElementById('rider-map-node').style.left = '36%';
    document.getElementById('rider-map-node').style.top = '42%';
    switchView('page-jobs');
    // Show toast
    showToast('🎉 Delivered! ₦1,200 added to wallet');
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
      position:'fixed', bottom:'100px', left:'50%', transform:'translateX(-50%)',
      background:'#0c1f0e', color:'white', padding:'12px 20px', borderRadius:'16px',
      fontFamily:"'DM Sans',sans-serif", fontWeight:'600', fontSize:'13px',
      zIndex:'999', boxShadow:'0 8px 24px rgba(0,0,0,0.25)', whiteSpace:'nowrap',
      opacity:'0', transition:'opacity 0.3s',
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; });
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 3000);
  }

  const periodData = {
    today:  { total:'₦14,250', subtitle:'↑ ₦1,500 peak bonus included', trips:'6', avg:'₦2,375', rating:'4.9 ⭐' },
    week:   { total:'₦68,400', subtitle:'↑ ₦6,200 vs last week', trips:'34', avg:'₦2,012', rating:'4.9 ⭐' },
    month:  { total:'₦284,100', subtitle:'↑ 12% vs last month', trips:'142', avg:'₦2,000', rating:'4.9 ⭐' },
  };

  function switchPeriod(btn, period) {
    btn.closest('.period-tabs').querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    const d = periodData[period];
    document.getElementById('earn-total').textContent = d.total;
    document.getElementById('earn-subtitle').textContent = d.subtitle;
    document.getElementById('earn-trips').textContent = d.trips;
    document.getElementById('earn-avg').textContent = d.avg;
    document.getElementById('earn-rating').textContent = d.rating;
  }

  // filter chips
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.addEventListener('click', () => {
      c.closest('.history-filter').querySelectorAll('.filter-chip').forEach(x => x.classList.remove('active'));
      c.classList.add('active');
    });
  });
