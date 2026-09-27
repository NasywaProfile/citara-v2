document.documentElement.classList.add('js');

if (window.lucide) {
  window.lucide.createIcons();
}

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.menu');

const updateHeader = () => {
  header?.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.8);
};

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuButton?.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

menu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const hero = document.querySelector('.hero');
const heroSlides = [...document.querySelectorAll('.hero-slide')];
const heroDots = [...document.querySelectorAll('.pager button')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let heroIndex = 0;
let heroTimer;
let touchStartX = 0;
let pointerStartX = 0;

const showHeroSlide = (index) => {
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => slide.classList.toggle('active', i === heroIndex));
  heroDots.forEach((dot, i) => {
    const active = i === heroIndex;
    dot.classList.toggle('active', active);
    dot.setAttribute('aria-selected', String(active));
  });
};

const stopHeroAutoplay = () => window.clearInterval(heroTimer);
const startHeroAutoplay = () => {
  stopHeroAutoplay();
  if (reduceMotion.matches || document.hidden) return;
  heroTimer = window.setInterval(() => showHeroSlide(heroIndex + 1), 4000);
};

const changeHeroSlide = (offset) => {
  showHeroSlide(heroIndex + offset);
  startHeroAutoplay();
};

if (hero && heroSlides.length > 1) {
  hero.querySelector('.hero-arrow-prev')?.addEventListener('click', () => changeHeroSlide(-1));
  hero.querySelector('.hero-arrow-next')?.addEventListener('click', () => changeHeroSlide(1));
  heroDots.forEach((dot, index) => dot.addEventListener('click', () => {
    showHeroSlide(index);
    startHeroAutoplay();
  }));
  hero.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  hero.addEventListener('touchend', (event) => {
    const delta = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 45) changeHeroSlide(delta < 0 ? 1 : -1);
  }, { passive: true });
  hero.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.target.closest('button, a')) return;
    pointerStartX = event.clientX;
    hero.setPointerCapture(event.pointerId);
  });
  hero.addEventListener('pointerup', (event) => {
    if (event.pointerType !== 'mouse') return;
    const delta = event.clientX - pointerStartX;
    if (Math.abs(delta) > 60) changeHeroSlide(delta < 0 ? 1 : -1);
  });
  document.addEventListener('visibilitychange', startHeroAutoplay);
  reduceMotion.addEventListener('change', startHeroAutoplay);
  startHeroAutoplay();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const zones = {
  plaza: {
    title: ['THE', 'PLAZA'],
    name: 'The Plaza',
    kicker: 'Public heart of CITARA',
    description: 'Ruang publik utama yang mempertemukan aktivitas retail, kuliner, pertunjukan, dan komunitas dalam satu plaza tropis yang terbuka.',
    facilities: ['Amphitheater', 'Community events', 'Retail promenade'],
    image: 'assets/the-plaza.png',
    alt: 'The Plaza at CITARA'
  },
  garden: {
    title: ['GARDEN', 'ROOF'],
    name: 'Garden Roof',
    kicker: 'Landscape above the city',
    description: 'Taman bertingkat yang menghubungkan lanskap, jalur pedestrian, area duduk, dan ruang reflektif di atas bangunan.',
    facilities: ['Urban garden', 'Walking trail', 'View deck'],
    image: 'assets/garden-roof.png',
    alt: 'CITARA Garden Roof'
  },
  lifestyle: {
    title: ['LIFESTYLE', 'HUB'],
    name: 'Nusantara Social Club',
    kicker: 'The lifestyle hub',
    description: 'Social club untuk wellness, komunitas, kreativitas, dan hospitality—dirancang sebagai ruang temu sepanjang hari.',
    facilities: ['Wellness', 'Social lounge', 'Pool courtyard'],
    image: 'assets/video-lifestyle.png',
    alt: 'CITARA lifestyle courtyard'
  },
  residential: {
    title: ['RESIDENTIAL'],
    name: 'Residential',
    kicker: 'A calmer way to live',
    description: 'Hunian dan serviced residence yang hangat, hijau, dan terhubung langsung dengan seluruh pengalaman CITARA.',
    facilities: ['Apartment', 'Serviced residence', 'Private lounge'],
    image: 'assets/living-room.png',
    alt: 'Warm CITARA residential interior'
  },
  mice: {
    title: ['MICE', '&', 'HOSPITALITY'],
    name: 'MICE & Hospitality',
    kicker: 'Meet, stay, and connect',
    description: 'Fasilitas meeting, convention, hotel, dan event yang membawa pengalaman bisnis ke dalam atmosfer sanctuary.',
    facilities: ['Ballroom', 'Meeting rooms', 'Hotel'],
    image: 'assets/facade.png',
    alt: 'CITARA hospitality and event pavilion'
  },
  retail: {
    title: ['OPEN', 'RETAIL', 'MALL'],
    name: 'Open Retail Mall',
    kicker: 'A market in the landscape',
    description: 'Retail terbuka dengan pilihan kuliner, craft, kebutuhan harian, dan pengalaman belanja yang menyatu dengan taman.',
    facilities: ['F&B district', 'Local craft', 'Curated retail'],
    image: 'assets/gallery-fnb.png',
    alt: 'Dining experience at CITARA'
  }
};

const zoneStage = document.querySelector('[data-zone-stage]');
const zoneImage = document.querySelector('[data-zone-image]');
const zoneTitle = document.querySelector('[data-zone-title]');
const zoneName = document.querySelector('[data-zone-name]');
const zoneKicker = document.querySelector('[data-zone-kicker]');
const zoneDescription = document.querySelector('[data-zone-description]');
const zoneFacilities = document.querySelector('[data-zone-facilities]');

const fitZoneTitle = () => {
  const titleWord = zoneTitle?.querySelector('span');
  if (!zoneTitle || !titleWord) return;

  zoneTitle.style.setProperty('--zone-title-scale', '1');
  const titleStyle = window.getComputedStyle(zoneTitle);
  const availableWidth = zoneTitle.clientWidth - parseFloat(titleStyle.paddingLeft) - parseFloat(titleStyle.paddingRight);
  const naturalWidth = titleWord.offsetWidth;
  if (!naturalWidth) return;

  const scale = Math.max(.45, Math.min(2.4, availableWidth / naturalWidth));
  zoneTitle.style.setProperty('--zone-title-scale', scale.toFixed(4));
};

window.requestAnimationFrame(fitZoneTitle);
document.fonts?.ready.then(fitZoneTitle);
if (zoneStage && 'ResizeObserver' in window) new ResizeObserver(fitZoneTitle).observe(zoneStage);
window.addEventListener('resize', fitZoneTitle, { passive: true });

document.querySelectorAll('.zone-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const zone = zones[tab.dataset.zone];
    if (!zone) return;

    document.querySelectorAll('.zone-tab').forEach((item) => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });

    zoneStage?.classList.add('is-changing');
    window.setTimeout(() => {
      zoneImage.src = zone.image;
      zoneImage.alt = zone.alt;
      const titleText = zone.title.join(' ');
      zoneTitle.innerHTML = `<span>${titleText}</span>`;
      window.requestAnimationFrame(fitZoneTitle);
      zoneName.textContent = zone.name;
      zoneKicker.textContent = zone.kicker;
      zoneDescription.textContent = zone.description;
      zoneFacilities.innerHTML = zone.facilities.map((item) => `<li>${item}</li>`).join('');
      zoneStage?.classList.remove('is-changing');
    }, 160);
  });
});

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelector('.gallery-grid')?.classList.toggle('is-filtered', filter !== 'all');
    document.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelectorAll('.gallery-item').forEach((item) => {
      item.classList.toggle('is-hidden', filter !== 'all' && item.dataset.category !== filter);
    });
  });
});

// Experience Video Autoplay ensure
const experienceVideo = document.getElementById('experience-video');
if (experienceVideo) {
  experienceVideo.play().catch(() => {});
}

// Section 8 Testimonials Slider
const testimonialsTrack = document.getElementById('testimonials-track');
const testimonialsPrev = document.getElementById('testimonials-prev');
const testimonialsNext = document.getElementById('testimonials-next');
const testimonialsDots = document.getElementById('testimonials-dots');
const testimonialCards = document.querySelectorAll('.testimonial-card');

if (testimonialsTrack && testimonialCards.length > 0) {
  let currentIndex = 0;

  const getVisibleCount = () => (window.innerWidth <= 768 ? 1 : 2);
  const getMaxIndex = () => Math.max(0, testimonialCards.length - getVisibleCount());

  const buildDots = () => {
    if (!testimonialsDots) return;
    testimonialsDots.innerHTML = '';
    const totalPages = getMaxIndex() + 1;
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `testimonial-dot ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      testimonialsDots.appendChild(dot);
    }
  };

  const updateSlider = () => {
    const card = testimonialCards[0];
    if (!card) return;
    const cardWidth = card.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(testimonialsTrack).gap) || 0;
    const offset = currentIndex * (cardWidth + gap);
    testimonialsTrack.style.transform = `translateX(-${offset}px)`;

    const maxIdx = getMaxIndex();
    if (testimonialsPrev) testimonialsPrev.disabled = currentIndex === 0;
    if (testimonialsNext) testimonialsNext.disabled = currentIndex >= maxIdx;

    const dots = testimonialsDots?.querySelectorAll('.testimonial-dot');
    dots?.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  const goToSlide = (index) => {
    const maxIdx = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, maxIdx));
    updateSlider();
  };

  testimonialsPrev?.addEventListener('click', () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  });

  testimonialsNext?.addEventListener('click', () => {
    const maxIdx = getMaxIndex();
    if (currentIndex < maxIdx) {
      goToSlide(currentIndex + 1);
    }
  });

  window.addEventListener('resize', () => {
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) currentIndex = maxIdx;
    buildDots();
    updateSlider();
  });

  buildDots();
  updateSlider();
}

const contactForm = document.querySelector('[data-contact-form]');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = document.querySelector('[data-form-status]');
  if (status) {
    status.textContent = 'Thank you! Your message has been sent. Our team will be in touch with you shortly.';
  }
  contactForm.reset();
});
