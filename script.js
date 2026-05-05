/* ============================
   HAMZ LABS — SCRIPT.JS
   ============================ */

// ── Particle Canvas Background ──────────────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 12000);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.5 + 0.1
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    // Draw dots
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });

    animId = requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

resizeCanvas();
initParticles();
drawParticles();


// ── Typing Animation ─────────────────────────────────────────
const typedTextSpan = document.querySelector("#typed-text");
const textArray = ["Edu-Tech.", "The Future.", "Academics.", "Innovation."];
const typingSpeed = 140;
const erasingSpeed = 80;
const newTextDelay = 2200;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingSpeed);
    } else {
        textArrayIndex = (textArrayIndex + 1) % textArray.length;
        setTimeout(type, typingSpeed + 600);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(type, 800);
});


// ── Navbar Scroll Effect ─────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});


// ── Mobile Hamburger ─────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

// Close nav when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});


// ── Contact Modal ─────────────────────────────────────────────
const overlay = document.getElementById('modal-overlay');
const openBtns = [
    document.getElementById('open-contact'),
    document.getElementById('footer-contact')
];
const closeBtn = document.getElementById('modal-close');

function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

openBtns.forEach(btn => btn && btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
}));

closeBtn.addEventListener('click', closeModal);

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});


// ── Contact Form Submission ───────────────────────────────────
const form = document.getElementById('contact-form');
const result = document.getElementById('result');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = form.querySelector('input[name="name"]').value;
    const message = form.querySelector('textarea[name="message"]').value;

    if (name.length < 3) {
        result.textContent = "Please enter your full name.";
        result.style.color = "#ff4d4d";
        return;
    }

    if (message.length < 10) {
        result.textContent = "Message is too short. Please give more detail.";
        result.style.color = "#ff4d4d";
        return;
    }

    const formData = new FormData(form);
    const json = JSON.stringify(Object.fromEntries(formData));

    result.textContent = "Sending...";
    result.style.color = "#6366f1";
    submitBtn.disabled = true;

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async response => {
        const data = await response.json();
        if (response.status === 200) {
            result.textContent = "✓ Message sent successfully!";
            result.style.color = "#00DFD8";
            form.reset();
        } else {
            result.textContent = data.message || "Something went wrong.";
            result.style.color = "#ff4d4d";
        }
    })
    .catch(() => {
        result.textContent = "Network error. Please try again.";
        result.style.color = "#ff4d4d";
    })
    .finally(() => {
        submitBtn.disabled = false;
        setTimeout(() => { result.textContent = ""; }, 5000);
    });
});


// ── Scroll Reveal (Intersection Observer) ─────────────────────
const revealEls = document.querySelectorAll(
    '.product-card-main, .visual-card, .founder-card, .terminal-window, .about-metrics .metric'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.animationDelay = `${i * 0.08}s`;
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// Trigger reveal
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.revealed').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
});

// CSS class for revealed
const style = document.createElement('style');
style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);