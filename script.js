// =========================
// ELEMENTS
// =========================
const navbar       = document.getElementById("navbar");
const navIndicator = document.getElementById("navIndicator");
const navLinks     = document.querySelectorAll(".nav-link");
const sections     = document.querySelectorAll("section");
const polygonWrapper = document.querySelector(".polygon-wrapper");

// =========================
// NAV INDICATOR
// =========================
function moveIndicator(el) {
    if (!el) return;
    const r  = el.getBoundingClientRect();
    const nr = navbar.getBoundingClientRect();
    navIndicator.style.width  = r.width  + "px";
    navIndicator.style.height = r.height + "px";
    navIndicator.style.left   = (r.left - nr.left) + "px";
    navIndicator.style.top    = (r.top  - nr.top)  + "px";
}

// =========================
// SCROLL REVEAL
// =========================
const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);
document.querySelectorAll(".reveal-text, .reveal-block")
    .forEach(el => revealObserver.observe(el));

// =========================
// SECTION DETECTION + NAV
// =========================
function updateSection() {
    let current = null;
    const mid   = window.innerHeight * 0.45;
    sections.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) current = s;
    });
    if (!current) return;

    const isLight = current.classList.contains("light-section");
    navbar.classList.toggle("light-nav",  isLight);
    navbar.classList.toggle("dark-nav",  !isLight);

    let activeLink = null;
    navLinks.forEach(link => {
        const match = link.getAttribute("href") === "#" + current.id;
        link.classList.toggle("active", match);
        if (match) activeLink = link;
    });
    moveIndicator(activeLink);
}

let ticking = false;
window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateSection(); ticking = false; });
}, { passive: true });

// =========================
// NAV HOVER & CLICK
// =========================
navLinks.forEach(link => {
    link.addEventListener("mouseenter", () => moveIndicator(link));
});
navLinks.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        moveIndicator(link);
        const target = document.querySelector(link.getAttribute("href"));
        if (target) window.scrollTo({ top: target.offsetTop - 70, behavior: "smooth" });
    });
});
navbar.addEventListener("mouseleave", () => {
    moveIndicator(document.querySelector(".nav-link.active"));
});

// =========================
// HERO PARALLAX — on wrapper
// polygon-wrapper pakai CSS float animation
// parallax tambahkan offset X/Y via CSS custom property
// =========================
if (polygonWrapper) {
    let mx = 0, my = 0, cx = 0, cy = 0, rafId = null;

    window.addEventListener("mousemove", e => {
        mx = (e.clientX / window.innerWidth  - 0.5) * 28;
        my = (e.clientY / window.innerHeight - 0.5) * 28;
        if (!rafId) rafId = requestAnimationFrame(lerp);
    }, { passive: true });

    function lerp() {
        cx += (mx - cx) * 0.07;
        cy += (my - cy) * 0.07;
        // pakai CSS var agar bisa dikombinasi dengan animation float
        polygonWrapper.style.setProperty('--px', cx + 'px');
        polygonWrapper.style.setProperty('--py', cy + 'px');

        if (Math.abs(mx - cx) > 0.05 || Math.abs(my - cy) > 0.05) {
            rafId = requestAnimationFrame(lerp);
        } else {
            rafId = null;
        }
    }
}

// =========================
// RESIZE & INIT
// =========================
window.addEventListener("resize", () => {
    moveIndicator(document.querySelector(".nav-link.active"));
});
window.addEventListener("load", () => {
    updateSection();
    moveIndicator(document.querySelector(".nav-link.active"));
});