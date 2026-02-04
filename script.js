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
