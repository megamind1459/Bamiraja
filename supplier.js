document.addEventListener('DOMContentLoaded', () => {
  const stockForm = document.getElementById('stock-form');
  const stockSuccess = document.getElementById('stock-success');
  const notificationList = document.getElementById('notification-list');
  const ordersBoard = document.getElementById('orders-board');
  const notifCount = document.getElementById('notif-count');
  const ordersToday = document.getElementById('orders-today');
  const stockCount = document.getElementById('stock-count');
  const earningsTotal = document.getElementById('earnings-total');
  const lowStockCount = document.getElementById('low-stock-count');
  const topSeller = document.getElementById('top-seller');
  const leastSeller = document.getElementById('least-seller');
  const todaySales = document.getElementById('today-sales');
  const latestNote = document.getElementById('latest-note');
  const walletBalance = document.getElementById('wallet-balance');
  const walletPayout = document.getElementById('wallet-payout');
  const walletStatus = document.getElementById('wallet-status');
  const queueNote = document.getElementById('queue-note');
  const viewQueueBtn = document.getElementById('view-queue-btn');
  const addItemBtn = document.getElementById('add-item-btn');
  const toast = document.getElementById('toast');

  let orders = [
    { id: 'BR-1012', customer: 'Amina Yusuf', items: '2 × Jollof Rice, 1 × Chicken Soup', total: 14500, status: 'Pending', available: true, note: 'Fresh stock available' },
    { id: 'BR-1013', customer: 'Tolu Ade', items: '1 × Fried Rice, 2 × Plantain Bowls', total: 11800, status: 'Pending', available: false, note: 'Low stock on plantain' },
    { id: 'BR-1014', customer: 'Kemi Bello', items: '3 × Drinks, 1 × Burger', total: 9800, status: 'Accepted', available: true, note: 'Ready for pickup' }
  ];
  let supplierWallet = 54000;

  function showToast(message, type = 'success') {
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      toast.className = 'toast';
    }, 3200);
  }

  function renderNotifications() {
    if (!notificationList) return;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;
    const acceptedOrders = orders.filter(order => order.status === 'Accepted').length;
    const deliveredOrders = orders.filter(order => order.status === 'Delivered').length;

    notificationList.innerHTML = [
      pendingOrders > 0 ? `<li>🔔 ${pendingOrders} new customer order(s) are waiting for confirmation.</li>` : '<li>✅ No pending orders at the moment.</li>',
      acceptedOrders > 0 ? `<li>🍽️ ${acceptedOrders} order(s) are ready for kitchen prep.</li>` : '<li>🍽️ No active orders are being prepared right now.</li>',
      deliveredOrders > 0 ? `<li>💸 ${deliveredOrders} order(s) have been delivered and credited to your wallet.</li>` : '<li>💸 Deliver an accepted order to release payment into your wallet.</li>'
    ].join('');
  }

  function renderOrders() {
    if (!ordersBoard) return;
    ordersBoard.innerHTML = orders.map(order => `
      <article class="order-row">
        <div class="order-meta">
          <strong>${order.id} — ${order.customer}</strong>
          <p>${order.items}</p>
          <p>₦${order.total.toLocaleString()} · ${order.note}</p>
        </div>
        <div class="order-actions">
          <span class="order-status ${order.status === 'Cancelled' ? 'cancelled' : order.available ? '' : 'low'}">${order.status === 'Delivered' ? 'Delivered' : order.status === 'Cancelled' ? 'Declined' : order.available ? 'Available' : 'Low stock'}</span>
          ${order.status === 'Pending' ? '<button class="ghost-btn" type="button" data-action="accept" data-id="' + order.id + '">Accept order</button>' : ''}
          ${order.status === 'Pending' ? '<button class="danger-btn" type="button" data-action="cancel" data-id="' + order.id + '">Decline order</button>' : ''}
          ${order.status === 'Accepted' ? '<button class="primary-btn" type="button" data-action="deliver" data-id="' + order.id + '">Mark delivered</button>' : ''}
        </div>
      </article>
    `).join('');

    const pending = orders.filter(o => o.status === 'Pending').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const accepted = orders.filter(o => o.status === 'Accepted').length;
    if (notifCount) notifCount.textContent = pending + delivered + accepted;
    if (ordersToday) ordersToday.textContent = String(orders.length + 12);
    if (stockCount) stockCount.textContent = String(86 + delivered + accepted);
    if (earningsTotal) earningsTotal.textContent = '₦' + orders.reduce((sum, o) => sum + (o.status === 'Delivered' ? o.total : 0), 0).toLocaleString();
    if (lowStockCount) lowStockCount.textContent = String(orders.filter(o => !o.available).length + 1);
    if (topSeller) topSeller.textContent = 'Jollof Rice';
    if (leastSeller) leastSeller.textContent = 'Plantain Bowl';
    if (todaySales) todaySales.textContent = '₦' + (orders.reduce((sum, o) => sum + (o.status === 'Delivered' ? o.total : 0), 0) + 12000).toLocaleString();
    if (latestNote) latestNote.textContent = pending > 0 ? 'New order requests are waiting for your confirmation.' : 'All current orders have been reviewed.';
    if (queueNote) queueNote.textContent = `${pending} orders are waiting for kitchen prep.`;
    if (walletBalance) walletBalance.textContent = '₦' + supplierWallet.toLocaleString();
    if (walletPayout) walletPayout.textContent = '₦' + orders.reduce((sum, o) => sum + (o.status === 'Delivered' ? o.total : 0), 0).toLocaleString();
    if (walletStatus) walletStatus.textContent = delivered > 0 ? 'Wallet funded with delivered sales.' : 'Ready to receive your next delivery payout.';
    renderNotifications();
  }

  if (ordersBoard) {
    ordersBoard.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;

      const id = button.getAttribute('data-id');
      const action = button.getAttribute('data-action');
      const order = orders.find(item => item.id === id);
      if (!order) return;

      if (action === 'accept') {
        if (!order.available) {
          showToast('This item is currently low in stock. Please restock first.', 'warn');
          return;
        }
        order.status = 'Accepted';
        order.note = 'Accepted and ready for kitchen prep';
        if (latestNote) latestNote.textContent = `${order.id} accepted successfully.`;
        showToast(`Order ${order.id} accepted. Kitchen prep has started.`, 'success');
      }

      if (action === 'cancel') {
        order.status = 'Cancelled';
        order.note = 'Declined by supplier';
        if (latestNote) latestNote.textContent = `${order.id} declined successfully.`;
        showToast(`Order ${order.id} declined. The customer has been notified.`, 'warn');
      }

      if (action === 'deliver') {
        if (order.status !== 'Accepted') return;
        order.status = 'Delivered';
        order.note = 'Delivered and payment credited to supplier wallet';
        supplierWallet += order.total;
        if (latestNote) latestNote.textContent = `Credit alert for ${order.id} has entered your wallet.`;
        showToast(`Credit alert for ${order.id} has entered your wallet.`, 'success');
      }

      renderOrders();
    });
  }

  if (stockForm) {
    stockForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('product-name').value.trim();
      const category = document.getElementById('product-category').value.trim();
      const price = Number(document.getElementById('product-price').value);
      const stock = Number(document.getElementById('product-stock').value);

      if (!name || !category || !price || !stock) return;

      const newItem = { id: `NEW-${Date.now()}`, customer: 'Supplier Added', items: `${stock} × ${name}`, total: price * stock, status: 'Pending', available: stock > 5, note: `${category} added to inventory` };
      orders.unshift(newItem);
      if (stockSuccess) stockSuccess.textContent = `${name} has been added successfully to your stock list.`;
      showToast(`${name} has been added successfully to inventory.`, 'success');
      stockForm.reset();
      renderOrders();
    });
  }

  if (viewQueueBtn) {
    viewQueueBtn.addEventListener('click', () => {
      window.location.href = 'supplier-orders.html#queue';
    });
  }

  if (addItemBtn) {
    addItemBtn.addEventListener('click', () => {
      document.getElementById('stock-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.getElementById('product-name')?.focus();
    });
  }

  renderOrders();
});
