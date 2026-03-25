// ── Custom cursor ───────────────────────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
});

// Ring follows with slight lag
(function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
})();

// Ring grows on hoverable elements
document.querySelectorAll('a, .nav-item, .work-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        ring.style.width  = '48px';
        ring.style.height = '48px';
        ring.style.borderColor = 'rgba(245,240,232,0.25)';
    });
    el.addEventListener('mouseleave', () => {
        ring.style.width  = '28px';
        ring.style.height = '28px';
        ring.style.borderColor = 'rgba(245,240,232,0.5)';
    });
});

// ── Page navigation ─────────────────────────────────────
const container  = document.getElementById('scroll-container');
const pages      = document.querySelectorAll('.page');
const navItems   = document.querySelectorAll('.nav-item');
const currentNum = document.getElementById('current-page');
const pageNums   = ['01', '02', '03', '04'];

function updateNav(index) {
    navItems.forEach((n, i) => n.classList.toggle('active', i === index));
    currentNum.textContent = pageNums[index] || '01';
}

// Observe which page is in view
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = Array.from(pages).indexOf(entry.target);
            updateNav(index);
        }
    });
}, { root: container, threshold: 0.5 });

pages.forEach(p => observer.observe(p));

// Click nav dots to scroll to section
navItems.forEach((item, i) => {
    item.addEventListener('click', () => {
        pages[i].scrollIntoView({ behavior: 'smooth' });
    });
});
