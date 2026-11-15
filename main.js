/**
 * B.N ENTERPRISES — B2B WHOLESALE TRADE & DISTRIBUTION PORTAL
 * Principal UI/UX & Frontend Architecture
 * Vanilla JavaScript (Zero External Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Core Enterprise Constants
  const B_N_TRADE_PHONE = '8527606769';
  const B_N_WA_INTL = '918527606769';

  /* --------------------------------------------------------------------------
     1. Sticky Header Elevation on Scroll
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const onScrollHeader = () => {
    if (window.scrollY > 25) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* --------------------------------------------------------------------------
     2. Mobile Navigation Drawer
     -------------------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerItems = document.querySelectorAll('.drawer-item');

  const openDrawer = () => {
    mobileDrawer?.classList.add('open');
    drawerBackdrop?.classList.add('open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'true');
    mobileDrawer?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer?.classList.remove('open');
    drawerBackdrop?.classList.remove('open');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    mobileDrawer?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  mobileMenuBtn?.addEventListener('click', openDrawer);
  drawerCloseBtn?.addEventListener('click', closeDrawer);
  drawerBackdrop?.addEventListener('click', closeDrawer);

  drawerItems.forEach(item => {
    item.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });

  /* --------------------------------------------------------------------------
     3. Corporate Toast Notification Helper
     -------------------------------------------------------------------------- */
  const toastEl = document.getElementById('corporateToast');
  const toastMsg = document.getElementById('toastMessage');
  let toastTimer = null;

  const showToast = (message) => {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = message;
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3000);
  };

  /* --------------------------------------------------------------------------
     4. Copy Trade Desk Phone Number
     -------------------------------------------------------------------------- */
  const btnCopyTradePhone = document.getElementById('btnCopyTradePhone');
  btnCopyTradePhone?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(B_N_TRADE_PHONE);
      showToast(`Trade Hotline ${B_N_TRADE_PHONE} copied to clipboard!`);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = B_N_TRADE_PHONE;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast(`Trade Hotline ${B_N_TRADE_PHONE} copied!`);
    }
  });

  /* --------------------------------------------------------------------------
     5. Category Filter System
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const b2bCards = document.querySelectorAll('.b2b-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterVal = btn.getAttribute('data-filter');

      b2bCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.25s ease';
            card.style.opacity = '1';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     6. Commercial Buyer FAQ Accordion
     -------------------------------------------------------------------------- */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const headerBtn = item.querySelector('.accordion-header');
    headerBtn?.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      // Close all others
      accordionItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isAlreadyActive) {
        item.classList.add('active');
        headerBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* --------------------------------------------------------------------------
     7. Structured B2B Request for Quotation (RFQ) Form Handler
     -------------------------------------------------------------------------- */
  const b2bRfqForm = document.getElementById('b2bRfqForm');
  const rfqName = document.getElementById('rfqName');
  const rfqBusiness = document.getElementById('rfqBusiness');
  const rfqPhone = document.getElementById('rfqPhone');
  const rfqBizType = document.getElementById('rfqBizType');
  const rfqVolume = document.getElementById('rfqVolume');
  const rfqNotes = document.getElementById('rfqNotes');

  const nameErr = document.getElementById('nameErr');
  const bizErr = document.getElementById('bizErr');
  const phoneErr = document.getElementById('phoneErr');
  const typeErr = document.getElementById('typeErr');
  const catErr = document.getElementById('catErr');

  b2bRfqForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Contact Name
    if (!rfqName.value.trim()) {
      rfqName.classList.add('invalid');
      nameErr?.classList.add('visible');
      isValid = false;
    } else {
      rfqName.classList.remove('invalid');
      nameErr?.classList.remove('visible');
    }

    // Validate Business Name
    if (!rfqBusiness.value.trim()) {
      rfqBusiness.classList.add('invalid');
      bizErr?.classList.add('visible');
      isValid = false;
    } else {
      rfqBusiness.classList.remove('invalid');
      bizErr?.classList.remove('visible');
    }

    // Validate Phone Number (10 digits minimum)
    const phoneClean = rfqPhone.value.replace(/\D/g, '');
    if (phoneClean.length < 10) {
      rfqPhone.classList.add('invalid');
      phoneErr?.classList.add('visible');
      isValid = false;
    } else {
      rfqPhone.classList.remove('invalid');
      phoneErr?.classList.remove('visible');
    }

    // Validate Business Type
    if (!rfqBizType.value) {
      rfqBizType.classList.add('invalid');
      typeErr?.classList.add('visible');
      isValid = false;
    } else {
      rfqBizType.classList.remove('invalid');
      typeErr?.classList.remove('visible');
    }

    // Validate Categories Checkboxes
    const selectedCats = [];
    document.querySelectorAll('input[name="rfqCats"]:checked').forEach(cb => {
      selectedCats.push(cb.value);
    });

    if (selectedCats.length === 0) {
      catErr?.classList.add('visible');
      isValid = false;
    } else {
      catErr?.classList.remove('visible');
    }

    if (!isValid) {
      showToast('Please correct the highlighted fields before submitting.');
      return;
    }

    // Format Structured B2B WhatsApp Message
    const formattedRfq = 
`*B.N ENTERPRISES — WHOLESALE INQUIRY (RFQ)*
──────────────────────────────
• *Contact Name:* ${rfqName.value.trim()}
• *Business / Shop:* ${rfqBusiness.value.trim()}
• *Phone Number:* ${rfqPhone.value.trim()}
• *Business Channel:* ${rfqBizType.value}
• *Required Categories:* ${selectedCats.join(', ')}
• *Estimated Volume Slab:* ${rfqVolume.value}
• *Specific SKUs / Notes:* ${rfqNotes.value.trim() || 'Please share live batch rates and case MOQs.'}
──────────────────────────────
_Submitted via B.N Enterprises Official B2B Trade Portal_`;

    const waLink = `https://wa.me/${B_N_WA_INTL}?text=${encodeURIComponent(formattedRfq)}`;

    showToast('Redirecting inquiry to Trade Desk on WhatsApp...');
    window.open(waLink, '_blank');
  });

  // Remove validation error on user input
  [rfqName, rfqBusiness, rfqPhone, rfqBizType].forEach(el => {
    el?.addEventListener('input', () => {
      el.classList.remove('invalid');
    });
    el?.addEventListener('change', () => {
      el.classList.remove('invalid');
    });
  });

  /* --------------------------------------------------------------------------
     8. Footer Dynamic Year
     -------------------------------------------------------------------------- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});