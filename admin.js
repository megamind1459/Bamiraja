  let sidebarCollapsed = false;

  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    document.getElementById('sidebar').classList.toggle('collapsed', sidebarCollapsed);
  }

  function toggleSub(id, el) {
    const sub = document.getElementById(id);
    sub.classList.toggle('open');
  }

  function showPage(name) {
    document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('page-' + name).classList.add('active');
    // highlight nav
    document.querySelectorAll('.nav-item').forEach(n => {
      if (n.getAttribute('onclick') && n.getAttribute('onclick').includes("'" + name + "'")) {
        n.classList.add('active');
      }
    });
  }

  function toggleNotif() {
    document.getElementById('notif-panel').classList.toggle('open');
  }
  document.addEventListener('click', e => {
    const panel = document.getElementById('notif-panel');
    if (!e.target.closest('.icon-btn') && !e.target.closest('#notif-panel')) {
      panel.classList.remove('open');
    }
  });

  // Tab switching (week/month on summary chart)
  document.querySelectorAll('.tabs .tab').forEach(t => {
    t.addEventListener('click', () => {
      t.closest('.tabs').querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
    });
  });

  // Filter chips
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.addEventListener('click', () => {
      c.closest('.filter-bar').querySelectorAll('.filter-chip').forEach(x => x.classList.remove('active'));
      c.classList.add('active');
    });
  });

  // ── CHARTS ──
  const chartDefaults = {
    tooltip: { backgroundColor:'#0f172a', titleColor:'#f8fafc', bodyColor:'#e2e8f0', borderColor:'#10b981', borderWidth:1, padding:12, displayColors:false },
  };

  // Line chart
  new Chart(document.getElementById('ordersSummaryChart').getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets: [
        { label:'This Week', data:[150,230,180,290,240,320,280], borderColor:'#10b981', backgroundColor:'rgba(16,185,129,0.06)', tension:0.4, fill:true, borderWidth:3, pointRadius:4, pointBackgroundColor:'#10b981' },
        { label:'Last Week', data:[120,190,150,210,180,240,210], borderColor:'#93c5fd', borderDash:[5,5], tension:0.4, fill:false, borderWidth:2, pointRadius:0 }
      ]
    },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:{ ...chartDefaults.tooltip, intersect:false, mode:'index' } }, scales:{ y:{grid:{color:'#e2e8f0'},ticks:{color:'#64748b',font:{size:11}}}, x:{grid:{display:false},ticks:{color:'#64748b',font:{size:11}}} } }
  });

  // Donut
  new Chart(document.getElementById('orderStatusChart').getContext('2d'), {
    type: 'doughnut',
    data: { labels:['Pending','Dispatched','Delivered'], datasets:[{ data:[13,51,32], backgroundColor:['#f59e0b','#10b981','#3b82f6'], borderWidth:4, borderColor:'#fff', hoverOffset:4 }] },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:chartDefaults.tooltip }, cutout:'75%' }
  });

  // Bar charts (dashboard + financials page)
  function makeBarChart(id) {
    const ctx = document.getElementById(id);
    if (!ctx) return;
    new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: {
        labels:['May 1','May 5','May 10','May 15','May 20'],
        datasets:[
          { label:'Revenue', data:[500000,650000,580000,720000,800000], backgroundColor:'#10b981', borderRadius:6 },
          { label:'Expenses', data:[150000,180000,120000,200000,170000], backgroundColor:'#f97316', borderRadius:6 }
        ]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false}, tooltip:chartDefaults.tooltip }, scales:{ y:{grid:{color:'#e2e8f0'},ticks:{color:'#64748b',font:{size:10}}}, x:{grid:{display:false},ticks:{color:'#64748b',font:{size:11}}} } }
    });
  }
  makeBarChart('financialsBarChart');
  makeBarChart('financialsBarChart2');
