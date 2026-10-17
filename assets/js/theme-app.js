/**
 * Theme Application JavaScript (Website Redesign - Nordic Interactions)
 * Dedicated modular script for:
 * 1. Reading Scroll Progress Bar
 * 2. Floating Back-to-Top Interaction
 * 3. Reactive Frosted Navigation Dock
 * 4. Presentation Deck Slideshow with Touch Swipe & Keyboard Navigation
 * 5. Contact Form Submission & Feedback
 * 6. Mobile Drawer Accessibility & Gestures
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Reading Scroll Progress Bar
  // ==========================================
  let progressBar = document.getElementById('nordicProgressBar');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'nordicProgressBar';
    document.body.prepend(progressBar);
  }

  // ==========================================
  // 2. Floating Back-to-Top Button
  // ==========================================
  let backToTopBtn = document.getElementById('nordicBackToTop');
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'nordicBackToTop';
    backToTopBtn.setAttribute('aria-label', 'Back to top of page');
    backToTopBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <path d="m18 15-6-6-6 6"/>
      </svg>
    `;
    document.body.appendChild(backToTopBtn);

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 3. Optimized Scroll Handler (Progress, Dock, Back-to-Top)
  // ==========================================
  const header = document.querySelector('.birdseye-header');
  let ticking = false;

  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    // Progress Bar
    if (progressBar && maxScroll > 0) {
      const progressPercent = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
      progressBar.style.width = `${progressPercent}%`;
    }

    // Header Dock Scrolled State
    if (header) {
      if (scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // Back-to-Top Button
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  // ==========================================
  // 4. Interactive Presentation Deck Slideshow
  // ==========================================
  const slideshows = document.querySelectorAll('.slideshow-container');

  slideshows.forEach(container => {
    const slides = container.querySelectorAll('.slide-item');
    const counter = container.querySelector('.slide-counter') || document.getElementById('slideCounter');
    const prevBtn = container.querySelector('.slideshow-btn:first-child');
    const nextBtn = container.querySelector('.slideshow-btn:last-child');

    if (!slides.length) return;

    let currentIndex = 0;

    function renderSlide(index) {
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      if (counter) {
        counter.textContent = `Slide ${index + 1} of ${slides.length}`;
      }
    }

    function goToNext() {
      currentIndex = (currentIndex + 1) % slides.length;
      renderSlide(currentIndex);
    }

    function goToPrev() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      renderSlide(currentIndex);
    }

    // Global hooks for inline onclick="prevSlide()" & onclick="nextSlide()"
    window.nextSlide = goToNext;
    window.prevSlide = goToPrev;

    if (nextBtn) nextBtn.addEventListener('click', goToNext);
    if (prevBtn) prevBtn.addEventListener('click', goToPrev);

    // Keyboard navigation (ArrowLeft & ArrowRight)
    document.addEventListener('keydown', (e) => {
      // Check if slideshow is in viewport or page has focus
      const rect = container.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPrev();
        }
      }
    });

    // Touch swipe gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
          goToNext(); // Swiped left -> next slide
        } else {
          goToPrev(); // Swiped right -> prev slide
        }
      }
    }

    // Initialize first slide
    renderSlide(currentIndex);
  });

  // ==========================================
  // 5. Contact Form Submission Handler
  // ==========================================
  const contactForms = document.querySelectorAll('form.contact-form, #contactForm');
  contactForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const successMsg = document.getElementById('formSuccess') || form.querySelector('.form-success-msg');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Send Message';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';
      }

      try {
        const actionUrl = form.getAttribute('action') || '/api/contact';
        await fetch(actionUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json' 
          },
          body: JSON.stringify(data)
        });
      } catch (err) {
        console.warn('Backend endpoint unreachable, falling back gracefully:', err);
      }

      if (successMsg) {
        successMsg.style.display = 'block';
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
      }
      form.reset();
    });
  });

  // ==========================================
  // 6. Mobile Hamburger Drawer Interactions & Accessibility
  // ==========================================
  const hamburgerButtons = document.querySelectorAll('.hamburger');
  const mobileNav = document.getElementById('navMobile');

  function toggleMobileMenu(forceState) {
    const shouldOpen = typeof forceState === 'boolean' 
      ? forceState 
      : !document.body.classList.contains('nav-open');

    if (shouldOpen) {
      document.body.classList.add('nav-open');
    } else {
      document.body.classList.remove('nav-open');
    }

    hamburgerButtons.forEach(btn => {
      btn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    });
  }

  hamburgerButtons.forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMobileMenu();
    });
  });

  // Close drawer when clicking any link inside mobile nav
  if (mobileNav) {
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggleMobileMenu(false);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        toggleMobileMenu(false);
      }
    });
  }

  // ==========================================
  // 7. Smooth Scrolling for Internal Anchor Links
  // ==========================================
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 8. Portfolio Category Filter Pills (Option 1)
  // ==========================================
  const filterPills = document.querySelectorAll('.portfolio-pill');
  const projectCards = document.querySelectorAll('.portfolio-grid .project-card');

  if (filterPills.length > 0 && projectCards.length > 0) {
    function filterProjects(selectedCategory) {
      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-categories') || '').split(/\s+/);
        const matches = selectedCategory === 'all' || categories.includes(selectedCategory);

        if (matches) {
          card.classList.remove('is-hidden');
          card.classList.remove('fade-in');
          void card.offsetWidth;
          card.classList.add('fade-in');
        } else {
          card.classList.add('is-hidden');
          card.classList.remove('fade-in');
        }
      });
    }

    filterPills.forEach((pill, index) => {
      pill.addEventListener('click', () => {
        const targetCategory = pill.getAttribute('data-filter');

        filterPills.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('aria-selected', 'false');
        });

        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');

        filterProjects(targetCategory);
      });

      // Keyboard accessibility navigation
      pill.addEventListener('keydown', (e) => {
        let nextIndex = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          nextIndex = (index + 1) % filterPills.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          nextIndex = (index - 1 + filterPills.length) % filterPills.length;
        }

        if (nextIndex !== null) {
          e.preventDefault();
          filterPills[nextIndex].focus();
          filterPills[nextIndex].click();
        }
      });
    });
  }

});

