/**
 * Timeless Beauty Raritan - Interactive Modern App Logic
 * Enhanced with Hero Slider, Review Carousel & Luxury Card Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileDrawer();
  initParticleCanvas();
  initHeroSlider();
  initServiceFiltering();
  initReviewsCarousel();
  initGalleryLightbox();
  initBookingModal();
  initPromoPopup();
  initCouponCopy();
  initBusinessHours();
  initContactForm();
});

// Toast notification helper
function showToast(message, duration = 3500) {
  let toast = document.getElementById('toastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C69850" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// 1. Sticky Navigation Scroll Effect
function initStickyHeader() {
  const header = document.querySelector('.header-sticky');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 2. Mobile Drawer Navigation
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const closeBtn = document.querySelector('.mobile-close-btn');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const drawer = document.querySelector('.mobile-drawer');
  const links = document.querySelectorAll('.mobile-links a');

  const openDrawer = () => {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  links.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

// 3. Floating Gold & Rose Dust Sparkle Particles (Like Sugar Polish Newnan)
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;
  let width = canvas.width = parent ? parent.offsetWidth : window.innerWidth;
  let height = canvas.height = parent ? parent.offsetHeight : 700;
  let isRunning = true;
  let animationFrameId = null;
  let resizeTimeout;

  const onResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }, 150);
  };
  window.addEventListener('resize', onResize);

  const particleCount = window.innerWidth < 768 ? 26 : 58;
  const particles = [];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initPhase = false) {
      this.x = Math.random() * width;
      this.y = initPhase ? Math.random() * height : height + 10;
      this.r = Math.random() * 2.2 + 0.8;
      this.speedY = -(Math.random() * 0.42 + 0.16); // floating upwards
      this.speedX = Math.random() * 0.36 - 0.18;   // horizontal drift
      this.opacity = Math.random() * 0.5 + 0.2;
      this.pulse = Math.random() * 0.015 + 0.006;
      this.pulseDir = 1;

      // Color palette: Warm Champagne Gold & Soft Rose Dust
      const isRose = Math.random() > 0.8;
      this.color = isRose ? '248, 180, 189' : '198, 152, 80';
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity += this.pulse * this.pulseDir;

      if (this.opacity > 0.82) this.pulseDir = -1;
      if (this.opacity < 0.15) this.pulseDir = 1;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < -15) this.reset(false);
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${this.color}, 0.75)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function loop() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animationFrameId = requestAnimationFrame(loop);
  }

  loop();

  // Pause when hero is scrolled out of view to save battery & CPU
  const heroSection = document.getElementById('home');
  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isRunning) {
            isRunning = true;
            loop();
          }
        } else {
          isRunning = false;
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
      });
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);
  }
}

// 4. Hero Section Transformation Slider Animation
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide-img');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  let currentIndex = 0;
  let timer = null;

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  };

  const nextSlide = () => {
    const next = (currentIndex + 1) % slides.length;
    showSlide(next);
  };

  const startAuto = () => {
    stopAuto();
    timer = setInterval(nextSlide, 4500);
  };

  const stopAuto = () => {
    if (timer) clearInterval(timer);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      startAuto();
    });
  });

  const wrapper = document.querySelector('.hero-media-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);
  }

  startAuto();
}

// 4. Service Category Filtering
function initServiceFiltering() {
  const tabs = document.querySelectorAll('.services-filter-tabs .tab-btn');
  const cards = document.querySelectorAll('.service-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 5. Feedback Carousel (Compacts space & smooth UX)
function initReviewsCarousel() {
  const track = document.querySelector('.reviews-track');
  const slides = document.querySelectorAll('.review-slide');
  const prevBtn = document.querySelector('.carousel-prev-btn');
  const nextBtn = document.querySelector('.carousel-next-btn');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  let timer = null;
  let itemsPerView = window.innerWidth <= 860 ? 1 : 2;

  const updateItemsPerView = () => {
    itemsPerView = window.innerWidth <= 860 ? 1 : 2;
    buildDots();
    moveToSlide(Math.min(currentIndex, maxIndex()));
  };

  const maxIndex = () => Math.max(0, slides.length - itemsPerView);

  const buildDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const numPages = maxIndex() + 1;
    for (let i = 0; i < numPages; i++) {
      const dot = document.createElement('div');
      dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        moveToSlide(i);
        startAuto();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const moveToSlide = (index) => {
    currentIndex = Math.max(0, Math.min(index, maxIndex()));
    
    // Calculate slide translation percentage
    const slidePercent = 100 / itemsPerView;
    const gapOffset = 1.5 * (currentIndex / itemsPerView); // accounting for 1.5rem gap
    track.style.transform = `translateX(calc(-${currentIndex * slidePercent}% - ${currentIndex * 0.75}rem))`;

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }
  };

  const next = () => {
    if (currentIndex >= maxIndex()) {
      moveToSlide(0);
    } else {
      moveToSlide(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex <= 0) {
      moveToSlide(maxIndex());
    } else {
      moveToSlide(currentIndex - 1);
    }
  };

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  const startAuto = () => {
    stopAuto();
    timer = setInterval(next, 5000);
  };

  const stopAuto = () => {
    if (timer) clearInterval(timer);
  };

  const carouselBox = document.querySelector('.reviews-carousel-wrapper');
  if (carouselBox) {
    carouselBox.addEventListener('mouseenter', stopAuto);
    carouselBox.addEventListener('mouseleave', startAuto);

    // Touch swipe support
    let startX = 0;
    let endX = 0;

    carouselBox.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });

    carouselBox.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) next();
        else prev();
      }
      startAuto();
    }, { passive: true });
  }

  window.addEventListener('resize', updateItemsPerView);
  buildDots();
  startAuto();
}

// 6. Gallery Lightbox Modal
function initGalleryLightbox() {
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.querySelector('.lightbox-close-btn');
  const items = document.querySelectorAll('.gallery-item');

  if (!lightbox || !lightboxImg) return;

  const openLightbox = (src) => {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  items.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src') || item.querySelector('img').src;
      openLightbox(src);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-img-wrapper')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// 7. Booking Modal Logic
function initBookingModal() {
  const modal = document.getElementById('bookingModal');
  const closeBtn = document.querySelector('.booking-close-btn');
  const openButtons = document.querySelectorAll('[data-open-booking]');
  const serviceSelect = document.getElementById('bookingServiceSelect');
  const promoInput = document.getElementById('bookPromo');
  const bookingForm = document.getElementById('appointmentForm');

  if (!modal) return;

  const openModal = (preselectedService = '', promoCode = '') => {
    if (preselectedService && serviceSelect) {
      for (let i = 0; i < serviceSelect.options.length; i++) {
        if (serviceSelect.options[i].text.toLowerCase().includes(preselectedService.toLowerCase())) {
          serviceSelect.selectedIndex = i;
          break;
        }
      }
    }
    if (promoCode && promoInput) {
      promoInput.value = promoCode;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || '';
      const promoCode = btn.getAttribute('data-promo') || '';
      openModal(serviceName, promoCode);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientName = document.getElementById('bookName')?.value || 'Client';
      const serviceVal = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex]?.text : 'Treatment';
      
      closeModal();
      showToast(`Thank you, ${clientName}! Your request for ${serviceVal} has been received. Leena will contact you to confirm.`);
      bookingForm.reset();
    });
  }
}

// 8. Promo Code Copy
function initCouponCopy() {
  const copyBtn = document.getElementById('copyPromoBtn');
  const codeEl = document.getElementById('promoCodeText');

  if (!copyBtn || !codeEl) return;

  copyBtn.addEventListener('click', () => {
    const code = codeEl.innerText.trim();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        showToast(`Promo code "${code}" copied to clipboard!`);
      }).catch(() => {
        showToast(`Code: ${code} - Mention during booking for special offer!`);
      });
    } else {
      showToast(`Code: ${code} - Mention during booking for special offer!`);
    }
  });
}

// 9. Business Hours & Live Status
function initBusinessHours() {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const currentDayName = days[today.getDay()];
  
  // Highlight today's row in hours table
  const rows = document.querySelectorAll('.hours-table tr');
  rows.forEach(row => {
    const dayCell = row.querySelector('td:first-child');
    if (dayCell && dayCell.innerText.trim() === currentDayName) {
      row.classList.add('current-day');
      dayCell.innerHTML = `<strong>${currentDayName} (Today)</strong>`;
    }
  });

  // Calculate open status (NJ timezone approx)
  const statusBadge = document.getElementById('liveHoursBadge');
  if (statusBadge) {
    const day = today.getDay(); // 0 = Sun, 1 = Mon, ...
    const hour = today.getHours();
    
    let isOpen = false;
    if (day >= 2 && day <= 5) {
      if (hour >= 9 && hour < 19) isOpen = true;
    } else if (day === 0) {
      if (hour >= 9 && hour < 19) isOpen = true;
    }

    if (isOpen) {
      statusBadge.className = 'hours-status-badge badge-open';
      statusBadge.innerHTML = '● Open Today';
    } else if (day === 6) {
      statusBadge.className = 'hours-status-badge badge-open';
      statusBadge.innerHTML = '● By Appointment';
    } else {
      statusBadge.className = 'hours-status-badge badge-closed';
      statusBadge.innerHTML = '● Closed Now';
    }
  }
}

// 10. Contact Form
function initContactForm() {
  const form = document.getElementById('mainContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value || 'Valued Guest';
    showToast(`Thank you, ${name}! Your message has been sent. We will reply shortly.`);
    form.reset();
  });
}

// 11. Entry Promotion Popup Logic (Appears immediately on load)
function initPromoPopup() {
  const popup = document.getElementById('promoPopupModal');
  if (!popup) return;

  const closeBtn = popup.querySelector('.promo-popup-close-btn');
  const dismissBtn = popup.querySelector('.promo-popup-dismiss-text');
  const claimBtn = document.getElementById('popupClaimBtn');
  const copyBtn = document.getElementById('popupCopyPromoBtn');
  const codeEl = document.getElementById('popupPromoCodeText');

  const openPopup = () => {
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    popup.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Trigger popup right when page appears (700ms smooth delay)
  setTimeout(() => {
    openPopup();
  }, 700);

  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (dismissBtn) dismissBtn.addEventListener('click', closePopup);

  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) {
      closePopup();
    }
  });

  if (copyBtn && codeEl) {
    copyBtn.addEventListener('click', () => {
      const code = codeEl.innerText.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          showToast(`Promo code "${code}" copied to clipboard!`);
        }).catch(() => {
          showToast(`Code: ${code} - Mention during booking for $350 rate!`);
        });
      } else {
        showToast(`Code: ${code} - Mention during booking for $350 rate!`);
      }
    });
  }

  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      closePopup();
      // Open booking modal with $350 special offer preselected
      const bookingModal = document.getElementById('bookingModal');
      const serviceSelect = document.getElementById('bookingServiceSelect');
      const promoInput = document.getElementById('bookPromo');

      if (bookingModal) {
        if (serviceSelect) {
          serviceSelect.value = 'special_brows_350';
        }
        if (promoInput) {
          promoInput.value = 'TIMELESS350';
        }
        setTimeout(() => {
          bookingModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }, 150);
      }
    });
  }
}
