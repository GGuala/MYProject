// ── Page navigation ─────────────────────────────────────
const container  = document.getElementById(‘scroll-container’);
const pages      = document.querySelectorAll(’.page’);
const navItems   = document.querySelectorAll(’.nav-item’);
const currentNum = document.getElementById(‘current-page’);
const pageNums   = [‘01’, ‘02’, ‘03’, ‘04’];

function updateNav(index) {
navItems.forEach((n, i) => n.classList.toggle(‘active’, i === index));
currentNum.textContent = pageNums[index] || ‘01’;
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
item.addEventListener(‘click’, () => {
pages[i].scrollIntoView({ behavior: ‘smooth’ });
});
});