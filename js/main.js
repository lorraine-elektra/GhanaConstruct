const WA_BASE = 'https://wa.me/233548191278';

document.getElementById('year').textContent = new Date().getFullYear();

const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section');
const hamBtn = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const sidebarOverlay = document.getElementById('sidebarOverlay');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  spyScroll();
});

function spyScroll() {
  let currentSectionId = 'home';

  sections.forEach((sec) => {
    const top = sec.offsetTop - 120;
    const height = sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < top + height) {
      currentSectionId = sec.getAttribute('id');
    }
  });

  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentSectionId}`);
  });
}

function toggleMenu() {
  const isOpen = hamBtn.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  sidebarOverlay.classList.toggle('active');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
  hamBtn.classList.remove('open');
  mobileMenu.classList.remove('open');
  sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamBtn.addEventListener('click', toggleMenu);
sidebarOverlay.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-menu a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

let activeTestiIndex = 0;
const testiSlides = document.querySelectorAll('.testi');
const dotIndicators = document.querySelectorAll('.dot');

function goSlide(index) {
  testiSlides[activeTestiIndex].classList.remove('active');
  dotIndicators[activeTestiIndex].classList.remove('active');

  activeTestiIndex = (index + testiSlides.length) % testiSlides.length;

  testiSlides[activeTestiIndex].classList.add('active');
  dotIndicators[activeTestiIndex].classList.add('active');
}

function nextSlide() {
  goSlide(activeTestiIndex + 1);
}

function prevSlide() {
  goSlide(activeTestiIndex - 1);
}

setInterval(nextSlide, 8000);

function submitForm() {
  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const emailInput = document.getElementById('femail').value.trim();
  const email = emailInput || 'Not provided';
  const service = document.getElementById('ftype').value;
  const message = document.getElementById('fmsg').value.trim();

  const errName = document.getElementById('err-name');
  const errPhone = document.getElementById('err-phone');
  const errEmail = document.getElementById('err-email');
  const errType = document.getElementById('err-type');
  const successPanel = document.getElementById('formSuccess');

  [errName, errPhone, errEmail, errType, successPanel].forEach((el) => el.classList.remove('show'));

  let isValid = true;

  if (!name) {
    errName.classList.add('show');
    isValid = false;
  }

  if (!phone) {
    errPhone.classList.add('show');
    isValid = false;
  }

  if (emailInput && (!emailInput.includes('@') || !emailInput.includes('.'))) {
    errEmail.classList.add('show');
    isValid = false;
  }

  if (!service) {
    errType.classList.add('show');
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  successPanel.classList.add('show');

  const formattedMsg = `Hello,
I would like to enquire about your construction services. Please find my details below:
Name: ${name}
Phone: ${phone}
Email: ${email}
Service Requested: ${service}
Enquiry: ${message || 'Not provided'}
Thank you. I look forward to your response.`;

  const redirectUrl = `${WA_BASE}?text=${encodeURIComponent(formattedMsg)}`;

  setTimeout(() => {
    window.open(redirectUrl, '_blank');
    successPanel.classList.remove('show');
  }, 800);
}

function openCapabilityWhatsApp(capabilityName) {
  const message = `Hello GhanaConstruct, I would like to enquire about your ${capabilityName} capability.`;
  window.open(`${WA_BASE}?text=${encodeURIComponent(message)}`, '_blank');
}

function openProjectWhatsApp(projectName, projectCategory) {
  const message = `Hello GhanaConstruct,

I would like to discuss your project: ${projectName} (${projectCategory}).

Could you please share more details about scope, timelines, and how we can work together on this project?

Thank you.`;
  window.open(`${WA_BASE}?text=${encodeURIComponent(message)}`, '_blank');
}

function openNavWhatsAppEnquiry() {
  const message = 'Hello, I would like to enquire about your construction services.';
  window.open(`${WA_BASE}?text=${encodeURIComponent(message)}`, '_blank');
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

function parseStatValue(text) {
  const match = text.trim().match(/^(\d+)(.*)$/);
  if (!match) {
    return { target: 0, suffix: '' };
  }
  return { target: parseInt(match[1], 10), suffix: match[2] };
}

function animateStatCount(el, target, suffix, duration = 1800) {
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(tick);
}

function watchStatCountUp(container, forMobile) {
  if (!container) {
    return;
  }

  const nums = container.querySelectorAll(forMobile ? '.stat-cell .val' : '.hero-stat .num');
  if (!nums.length) {
    return;
  }

  let counted = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || counted) {
          return;
        }

        const mobile = window.matchMedia('(max-width: 768px)').matches;
        if (mobile !== forMobile) {
          return;
        }

        counted = true;
        nums.forEach((numEl) => {
          const { target, suffix } = parseStatValue(numEl.textContent);
          numEl.textContent = `0${suffix}`;
          animateStatCount(numEl, target, suffix);
        });
        observer.unobserve(container);
      });
    },
    { threshold: 0.35 }
  );

  observer.observe(container);
}

watchStatCountUp(document.querySelector('.hero-stats'), false);
watchStatCountUp(document.querySelector('.stats-box'), true);
