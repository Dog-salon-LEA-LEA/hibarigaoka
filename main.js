// ––––– Header scroll effect –––––
const header = document.querySelector(’.site-header’);
function onScroll() {
if (window.scrollY > 60) {
header.classList.add(‘scrolled’);
} else {
header.classList.remove(‘scrolled’);
}
}
window.addEventListener(‘scroll’, onScroll, { passive: true });

// ––––– Scroll reveal –––––
const revealEls = document.querySelectorAll(
’.section-label, .section-title, .section-lead, ’ +
’.concept-text p, .concept-image, .concept-detail, ’ +
‘.menu-card, .voice-card, ’ +
‘.reserve-title, .reserve-lead, .reserve-actions, .reserve-info, ’ +
‘.detail-item’
);
revealEls.forEach(el => el.classList.add(‘reveal’));
const revealObserver = new IntersectionObserver(
(entries) => {
entries.forEach((entry) => {
if (entry.isIntersecting) {
const siblings = Array.from(entry.target.parentElement.querySelectorAll(’.reveal’));
const idx = siblings.indexOf(entry.target);
const delay = Math.min(idx * 80, 320);
setTimeout(() => {
entry.target.classList.add(‘visible’);
}, delay);
revealObserver.unobserve(entry.target);
}
});
},
{ threshold: 0.12, rootMargin: ‘0px 0px -40px 0px’ }
);
revealEls.forEach(el => revealObserver.observe(el));

// ––––– Smooth anchor nav –––––
document.querySelectorAll(‘a[href^=”#”]’).forEach(link => {
link.addEventListener(‘click’, (e) => {
const id = link.getAttribute(‘href’);
if (id === ‘#’) return;
const target = document.querySelector(id);
if (!target) return;
e.preventDefault();
const headerH = header.offsetHeight;
const top = target.getBoundingClientRect().top + window.scrollY - headerH;
window.scrollTo({ top, behavior: ‘smooth’ });
});
});

// ––––– Accordion –––––
document.querySelectorAll(’.accordion-btn’).forEach(btn => {
btn.addEventListener(‘click’, () => {
const expanded = btn.getAttribute(‘aria-expanded’) === ‘true’;
const bodyId = btn.getAttribute(‘aria-controls’);
const body = document.getElementById(bodyId);
btn.setAttribute(‘aria-expanded’, String(!expanded));
body.hidden = expanded;
});
});

// ––––– Slideshow（共通関数） –––––
function initSlideshow(container, interval) {
const track = container.querySelector(’.mini-track, .slideshow-track’);
const slides = Array.from(container.querySelectorAll(’.mini-slide, .slide’));
const dotsWrap = container.querySelector(’.mini-dots, .slide-dots’);
const prevBtn = container.querySelector(’.mini-prev, .slide-prev’);
const nextBtn = container.querySelector(’.mini-next, .slide-next’);


if (!track || slides.length === 0) return;

let current = 0;
let autoTimer;

// ドット生成
if (dotsWrap) {
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'mini-dot slide-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `スライド ${i + 1}`);
        dot.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsWrap.appendChild(dot);
    });
}

function goTo(idx) {
    slides[current].classList.remove('active');
    if (dotsWrap) dotsWrap.children[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides[current].classList.add('active');
    if (dotsWrap) dotsWrap.children[current].classList.add('active');
}

function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), interval || 3500);
}
function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
}

slides[0].classList.add('active');

if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

startAuto();

// スワイプ
let startX = 0;
track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
        diff > 0 ? goTo(current + 1) : goTo(current - 1);
        resetAuto();
    }
}, { passive: true });

}

// ギャラリースライドショー（大）
const gallerySlideshow = document.querySelector(’.slideshow’);
if (gallerySlideshow) initSlideshow(gallerySlideshow, 3500);

// ミニスライドショー（シャンプー・カット・外装・内装）
document.querySelectorAll(’.mini-slideshow’).forEach(el => {
initSlideshow(el, 4000);
});