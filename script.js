// ===== DOM Elements =====
const loader = document.getElementById('loader');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const skillBars = document.querySelectorAll('.skill-progress');
const revealElements = document.querySelectorAll('.skill-category, .project-card, .about-content, .contact-wrapper, .achievement-card');

// ===== Loading Animation =====
function hideLoader() {
    if (loader) {
        loader.classList.add('hidden');
        // Remove from DOM after animation
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
}

// Hide loader when page is fully loaded
window.addEventListener('load', () => {
    // Minimum display time for loader (1.5s) to show the math animation
    setTimeout(hideLoader, 1500);
});


// ===== Navigation Scroll Effect =====
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// ===== Mobile Menu Toggle =====
function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

// ===== Close Mobile Menu on Link Click =====
function closeMobileMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== Active Navigation Link on Scroll =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// ===== Skill Bar Animation =====
function animateSkillBars(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillItems = entry.target.querySelectorAll('.skill-progress');
            skillItems.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = `${progress}%`;
            });
            observer.unobserve(entry.target);
        }
    });
}

// ===== Reveal Animation on Scroll =====
function handleRevealAnimation(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}

// ===== Smooth Scroll for Navigation Links =====
function handleSmoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }

    closeMobileMenu();
}

// ===== Form Submission Feedback =====
function handleFormSubmit(e) {
    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    // Form will be handled by FormSubmit.co
    // This is just for UX feedback
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 3000);
}

// ===== Initialize =====
function init() {
    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    // Mobile menu toggle
    navToggle.addEventListener('click', toggleMobileMenu);

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', handleSmoothScroll);
    });

    // CTA buttons smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId.length > 1) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    // Intersection Observer for skill bars
    const skillObserver = new IntersectionObserver(animateSkillBars, {
        threshold: 0.5
    });

    document.querySelectorAll('.skill-category').forEach(category => {
        skillObserver.observe(category);
    });

    // Intersection Observer for reveal animations
    const revealObserver = new IntersectionObserver(handleRevealAnimation, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // Form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Keyboard navigation for mobile menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    initMatrixBackground();
    console.log('✨ Portfolio initialized successfully!');
}

// ===== Run on DOM Ready =====
document.addEventListener('DOMContentLoaded', init);

// ===== Parallax Effect for Hero (Optional Enhancement) =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroVisual = document.querySelector('.hero-visual');

    if (heroVisual && scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
});

// ===== Matrix Background Effect =====
function initMatrixBackground() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const characters = '0123456789Σ∫∂∇∞λθπ+-*/=';
    const charArray = characters.split('');

    const fontSize = 16;
    let columns = 0;
    let rows = 0;
    let grid = [];

    let drops = [];
    function initGrid() {
        columns = Math.floor(canvas.width / fontSize) + 1;
        rows = Math.floor(canvas.height / fontSize) + 1;
        grid = [];
        for (let i = 0; i < columns; i++) {
            grid[i] = [];
            for (let j = 0; j < rows; j++) {
                grid[i][j] = {
                    char: charArray[Math.floor(Math.random() * charArray.length)],
                    opacity: 0,
                    targetOpacity: 0
                };
            }
            if (drops[i] === undefined) {
                drops[i] = Math.random() * -rows;
            }
        }
    }

    initGrid();

    let mouse = { x: -1000, y: -1000 };
    document.addEventListener('mousemove', (e) => {
        const nav = document.querySelector('.navbar');
        const isHoveringInteractive = e.target.closest('a, button, .btn, .social-link, .nav-item');

        if ((nav && e.clientY < nav.offsetHeight) || isHoveringInteractive) {
            mouse.x = -1000;
            mouse.y = -1000;
        } else {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }
    });

    document.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    window.addEventListener('resize', initGrid);

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + 'px monospace';

        // Update drops
        for (let i = 0; i < columns; i++) {
            drops[i] += 0.5; // speed

            let dropPos = Math.floor(drops[i]);

            if (dropPos >= 0 && dropPos < rows) {
                if (Math.random() > 0.8) {
                    grid[i][dropPos].char = charArray[Math.floor(Math.random() * charArray.length)];
                }
                grid[i][dropPos].targetOpacity = 0.4;
            }

            if (drops[i] > rows + 10 && Math.random() > 0.98) {
                drops[i] = -Math.random() * rows;
            }
        }

        // Draw grid
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                let cell = grid[i][j];

                cell.targetOpacity -= 0.01;
                if (cell.targetOpacity < 0) cell.targetOpacity = 0;

                let currentOp = cell.targetOpacity;

                const x = i * fontSize;
                const y = j * fontSize;
                const dx = x + fontSize / 2 - mouse.x;
                const dy = y + fontSize / 2 - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const intensity = 1 - (distance / 120);
                    currentOp = Math.max(currentOp, intensity * 0.8);
                }

                if (currentOp > 0.01) {
                    if (currentOp > 0.6) {
                        ctx.fillStyle = `rgba(255, 255, 255, ${currentOp})`;
                    } else {
                        ctx.fillStyle = `rgba(200, 255, 0, ${currentOp})`;
                    }
                    ctx.fillText(cell.char, x, y);
                }
            }
        }
    }

    setInterval(draw, 50);
}

// Dynamic Tab Title
let originalTitle = document.title;
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        document.title = "👋 Come back!";
    } else {
        document.title = originalTitle;
    }
});
