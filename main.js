// ---------- Header scroll effect ----------
const header = document.querySelector('.site-header');
function onScroll() {
    if (window.scrollY > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', onScroll, { passive: true });

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll(
    '.section-label, .section-title, .section-lead, ' +
    '.concept-text p, .concept-image, .concept-detail, ' +
    '.menu-card, .voice-card, ' +
    '.reserve-title, .reserve-lead, .reserve-actions, .reserve-info, ' +
    '.detail-item, .img-reveal'   // ← この行を追加
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger siblings slightly
                const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
                const idx = siblings.indexOf(entry.target);
                const delay = Math.min(idx * 80, 320);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// ---------- Smooth anchor nav ----------
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const id = link.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const headerH = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ---------- Accordion ----------
document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const bodyId = btn.getAttribute('aria-controls');
        const body = document.getElementById(bodyId);

        btn.setAttribute('aria-expanded', String(!expanded));
        if (expanded) {
            body.hidden = true;
        } else {
            body.hidden = false;
        }
    });
});

// ––––– Gallery Slideshow –––––
(function () {
const track = document.getElementById(‘galleryTrack’);
if (!track) return;

const slides = Array.from(track.querySelectorAll('.slide'));
const dotsWrap = document.getElementById('galleryDots');
const prevBtn = document.querySelector('.slide-prev');
const nextBtn = document.querySelector('.slide-next');
let current = 0;
let autoTimer;

// ドット生成
slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `スライド ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
});

function goTo(idx) {
    slides[current].classList.remove('active');
    dotsWrap.children[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides[current].classList.add('active');
    dotsWrap.children[current].classList.add('active');
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

function startAuto() {
    autoTimer = setInterval(next, 3500);
}
function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
}

slides[0].classList.add('active');
prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
nextBtn.addEventListener('click', () => { next(); resetAuto(); });
startAuto();

// スワイプ対応
let startX = 0;
track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetAuto(); }
}, { passive: true });
})();
