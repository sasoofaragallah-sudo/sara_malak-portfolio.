document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle (Dark/Light Mode) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Animate hamburger icon
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (navLinks.classList.contains('active')) {
            spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                mobileMenuBtn.click();
            }
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Scroll Reveal Animation ---
    const sections = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    sections.forEach(section => {
        revealOnScroll.observe(section);
    });

    // --- Smooth Scrolling for Navigation Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed navbar height
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - setNavbarOffset(targetId, navbarHeight);

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    function setNavbarOffset(id, height) {
        // Special case for hero, we want it right at top
        if (id === '#hero') return window.pageYOffset;
        return height;
    }

    // --- Simple Form Submission Prevent Default ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.style.opacity = '0.8';

            // Simulate network request
            setTimeout(() => {
                btn.innerText = 'Message Sent!';
                btn.style.background = '#10B981'; // Success Green
                btn.style.color = 'white';
                contactForm.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = ''; // Revert to css class
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

    // --- Active Nav Link Highlight ---
    const navAnchors = document.querySelectorAll('.nav-links a');
    const sectionsObj = Array.from(document.querySelectorAll('section, header'));

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sectionsObj.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150; // Offset for trigger point

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navAnchors.forEach(anchor => {
            anchor.classList.remove('active');
            if (anchor.getAttribute('href') === `#${current}`) {
                anchor.classList.add('active');
            }
        });
    });

    // --- Video Lazy Autoplay ---
    const videos = document.querySelectorAll(".project-image video");
    if("IntersectionObserver" in window) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.play().catch(e => console.log("Video play error:", e));
                } else {
                    entry.target.pause();
                }
            });
        }, { threshold: 0.1 });
        videos.forEach(v => {
            v.setAttribute("playsinline", "");
            v.setAttribute("muted", "");
            v.muted = true;
            videoObserver.observe(v);
        });
    } else {
        videos.forEach(v => v.play().catch(e => {}));
    }
});
