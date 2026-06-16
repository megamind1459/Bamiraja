    let cart = { count: 0, subtotal: 0, items: {} };
    let customerWallet = {
      visible: true,
      balance: 12450,
      transactions: [
        { label: 'Order payment received', amount: 2500, type: 'credit', date: 'Today' },
        { label: 'Delivery fee refund', amount: 300, type: 'credit', date: 'Yesterday' },
        { label: 'Meal purchase', amount: -1800, type: 'debit', date: 'Yesterday' }
      ]
    };

    function formatCurrency(value) {
      return '₦' + value.toLocaleString();
    }

    function renderWallet() {
      const balanceEl = document.getElementById('customer-wallet-balance');
      const statusEl = document.getElementById('customer-wallet-status');
      const historyEl = document.getElementById('customer-transaction-list');
      const badgeEl = document.getElementById('customer-wallet-badge');
      const toggleBtn = document.getElementById('wallet-visibility-btn');
      if (balanceEl) balanceEl.textContent = customerWallet.visible ? formatCurrency(customerWallet.balance) : '••••••';
      if (statusEl) statusEl.textContent = customerWallet.visible ? 'Visible balance · tap to hide' : 'Hidden balance · tap to reveal';
      if (badgeEl) badgeEl.textContent = customerWallet.visible ? 'Visible' : 'Hidden';
      if (toggleBtn) toggleBtn.textContent = customerWallet.visible ? 'Hide balance' : 'Show balance';
      if (historyEl) {
        historyEl.innerHTML = customerWallet.transactions.map(item => `
          <li class="wallet-history-item">
            <span>${item.label}</span>
            <strong class="${item.type === 'credit' ? 'positive' : 'negative'}">${item.type === 'credit' ? '+' : '-'}${formatCurrency(Math.abs(item.amount)).replace('₦', '₦')}</strong>
          </li>
        `).join('');
      }
      const paymentBalance = document.getElementById('wallet-payment-balance');
      if (paymentBalance) paymentBalance.textContent = customerWallet.visible ? formatCurrency(customerWallet.balance) : '••••••';
    }

    function toggleWalletVisibility() {
      customerWallet.visible = !customerWallet.visible;
      renderWallet();
    }

    function updateTotals() {
      cart.count = Object.values(cart.items).reduce((sum, item) => sum + item.qty, 0);
      cart.subtotal = Object.values(cart.items).reduce((sum, item) => sum + item.qty * item.price, 0);
      const basketCount = document.getElementById('basket-count');
      const basketTotal = document.getElementById('basket-total');
      const summarySubtotal = document.getElementById('summary-subtotal');
      const summaryTotal = document.getElementById('summary-total');
      if (basketCount) basketCount.textContent = cart.count;
      if (basketTotal) basketTotal.textContent = '₦' + cart.subtotal.toLocaleString();
      if (summarySubtotal) summarySubtotal.textContent = '₦' + cart.subtotal.toLocaleString();
      if (summaryTotal) summaryTotal.textContent = '₦' + (cart.subtotal + 500).toLocaleString();
    }

    function updateQuantityDisplay(key) {
      const display = document.getElementById(`qty-${key}`);
      if (!display) return;
      display.textContent = cart.items[key]?.qty || 0;
    }

    function updateCartDisplay() {
      const list = document.getElementById('cart-list');
      const count = document.getElementById('cart-count');
      const subtotalEl = document.getElementById('cart-subtotal');
      const totalEl = document.getElementById('cart-total');
      if (count) count.textContent = `${cart.count} item${cart.count !== 1 ? 's' : ''}`;
      if (subtotalEl) subtotalEl.textContent = '₦' + cart.subtotal.toLocaleString();
      if (totalEl) totalEl.textContent = '₦' + (cart.subtotal + 500).toLocaleString();
      if (!list) return;

      const items = Object.values(cart.items);
      if (items.length === 0) {
        list.innerHTML = `<div class="cart-empty"><p>Your cart is empty.</p><small>Add items from the menu to begin.</small></div>`;
        return;
      }

      list.innerHTML = items.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h5>${item.name}</h5>
            <p>Qty ${item.qty}</p>
          </div>
          <span>₦${(item.qty * item.price).toLocaleString()}</span>
        </div>
      `).join('');
    }

    function selectCategory(category) {
      document.querySelectorAll('.cat-chip').forEach(chip => {
        chip.classList.toggle('active', chip.textContent.trim() === category);
      });

      const cards = document.querySelectorAll('.restaurant-list .r-card');
      const emptyState = document.querySelector('.restaurant-list-empty');

      let visibleCount = 0;
      cards.forEach(card => {
        const matches = category === 'All' || card.getAttribute('data-category') === category;
        card.style.display = matches ? 'flex' : 'none';
        if (matches) visibleCount += 1;
      });

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    function navigateTo(pageId) {
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      document.getElementById(pageId).classList.add('active');
      const bar = document.getElementById('basket-bar');
      if (bar) {
        bar.style.display = pageId === 'page-track' || pageId === 'page-cart' ? 'none' : (cart.count > 0 ? 'flex' : 'none');
      }
      if (pageId === 'page-cart') {
        updateCartDisplay();
      }
    }

    function changeMenuQty(key, name, price, delta) {
      const currentQty = cart.items[key]?.qty || 0;
      const newQty = Math.max(0, currentQty + delta);
      if (newQty === currentQty) return;

      if (newQty === 0) {
        delete cart.items[key];
      } else {
        cart.items[key] = { name, price, qty: newQty };
      }

      updateTotals();
      updateQuantityDisplay(key);
      updateCartDisplay();

      const bar = document.getElementById('basket-bar');
      if (bar) bar.style.display = cart.count > 0 ? 'flex' : 'none';
    }

    document.addEventListener('DOMContentLoaded', () => {
      renderWallet();
    });
