/**
 * Theme Application JavaScript
 * Dedicated modular script for interactions, slideshows, navigation, and forms.
 */
document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Interactive Presentation Deck Slideshow
  // ==========================================
  const slideshows = document.querySelectorAll('.slideshow-container');

  slideshows.forEach(container => {
    const slides = container.querySelectorAll('.slide-item');
    const counter = container.querySelector('.slide-counter');
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

    if (nextBtn) nextBtn.addEventListener('click', goToNext);
    if (prevBtn) prevBtn.addEventListener('click', goToPrev);

    // Keyboard navigation support when slideshow is in view
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    });

    // Initialize first slide
    renderSlide(currentIndex);
  });

  // ==========================================
  // 2. Contact Form Submission Handler
  // ==========================================
  const contactForms = document.querySelectorAll('form.contact-form, #contactForm');
  contactForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const successMsg = document.getElementById('formSuccess') || form.querySelector('.form-success-msg');
      const submitBtn = form.querySelector('button[type="submit"]');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
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
        console.warn('Backend endpoint unreachable:', err);
      }

      if (successMsg) {
        successMsg.style.display = 'block';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
      form.reset();
    });
  });

  // ==========================================
  // 3. Mobile Hamburger Menu Toggle
  // ==========================================
  const hamburgerButtons = document.querySelectorAll('.hamburger');
  hamburgerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.toggle('nav-open');
    });
  });

});
