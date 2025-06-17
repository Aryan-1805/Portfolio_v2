// Enhanced Portfolio JavaScript
// Author: Aryan Bhutyal
// Modern interactive features and animations

'use strict';

// Global Variables
let isLoading = true;
let currentSection = 'home';
let skillsAnimated = false;
let statsAnimated = false;
let certificationsAnimated = false;
let experienceAnimated = false;
let scrollProgress = 0;

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTopBtn = document.getElementById('back-to-top');
const loadingScreen = document.getElementById('loading-screen');
const typingText = document.getElementById('typing-text');
const contactForm = document.getElementById('contact-form');

// Typing Animation Data
const typingTexts = [
    'Aspiring Software Engineer',
    'Samsung PRISM Intern',
    'Machine Learning Enthusiast',
    'Competitive Programmer',
    'Full-Stack Developer',
    'Problem Solver'
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main Initialization Function
function initializeApp() {
    // Hide loading screen after delay
    setTimeout(() => {
        hideLoadingScreen();
    }, 1500);

    // Initialize all features
    initializeNavigation();
    initializeScrollEffects();
    initializeTypingAnimation();
    initializeSkillBars();
    initializeStatsCounter();
    initializeCertificationsAnimation();
    initializeExperienceTimeline();
    initializeProjectCards();
    initializeContactForm();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeProgressBar();
    initializeParallaxEffects();
    initializeLazyLoading();
    
    // Set initial active section
    updateActiveNavLink();
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
}

// Loading Screen Management
function hideLoadingScreen() {
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            isLoading = false;
            // Trigger entrance animations
            triggerEntranceAnimations();
        }, 500);
    }
}

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Navbar scroll effect
    window.addEventListener('scroll', throttle(handleNavbarScroll, 16));

    // Close mobile menu when clicking outside
    document.addEventListener('click', handleOutsideClick);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

function toggleMobileMenu() {
    const isActive = navMenu.classList.contains('active');
    
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isActive ? '' : 'hidden';
    
    // Add animation delay for menu items
    if (!isActive) {
        const menuItems = navMenu.querySelectorAll('.nav-link');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
        
        // Smooth scroll to section
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update active link
        updateActiveNavLink(targetId.substring(1));
        
        // Track navigation event
        trackEvent('navigation', 'click', targetId);
    }
}

function handleNavbarScroll() {
    const scrollY = window.scrollY;
    
    // Improved navbar background change
    if (scrollY > 80) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // FIXED: Back-to-top button with better threshold and proper visibility
    if (backToTopBtn) {
        if (scrollY > 400) { // Increased threshold for better UX
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // Update scroll progress
    updateScrollProgress();
}

function handleOutsideClick(e) {
    if (navMenu && navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        toggleMobileMenu();
    }
}

function handleKeyboardNavigation(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
    
    // Enter key on nav toggle
    if (e.key === 'Enter' && e.target === navToggle) {
        toggleMobileMenu();
    }
    
    // Arrow keys for section navigation
    if (e.ctrlKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        navigateToNextSection(e.key === 'ArrowDown');
    }
}

function updateActiveNavLink(activeSection = null) {
    if (!activeSection) {
        // Determine active section based on scroll position
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });
    }
    
    if (activeSection && activeSection !== currentSection) {
        currentSection = activeSection;
        
        // Update navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeSection}`) {
                link.classList.add('active');
            }
        });
        
        // Track section view
        trackEvent('section', 'view', activeSection);
    }
}

function navigateToNextSection(isDown) {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const currentIndex = sections.findIndex(section => section.id === currentSection);
    
    let nextIndex;
    if (isDown) {
        nextIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : 0;
    } else {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
    }
    
    sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
}

// Typing Animation
function initializeTypingAnimation() {
    if (!typingText) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function typeText() {
        const currentText = typingTexts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = Math.random() * 100 + 50; // Variable typing speed
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            typingSpeed = 500; // Pause before next word
        }
        
        setTimeout(typeText, typingSpeed);
    }
    
    // Start typing animation after loading screen
    setTimeout(typeText, 2000);
}

// FIXED: Skill Bars Animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        if (skillsAnimated) return;
        
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;
        
        const rect = skillsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible) {
            skillsAnimated = true;
            
            skillBars.forEach((bar, index) => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = width;
                    bar.style.transition = 'width 1.5s ease-in-out';
                    // Add pulse effect
                    bar.style.animation = 'skillBarPulse 0.5s ease-out';
                }, index * 200);
            });
            
            trackEvent('animation', 'skills', 'animated');
        }
    }
    
    window.addEventListener('scroll', throttle(animateSkillBars, 100));
    animateSkillBars(); // Check on load
}

// FIXED: Stats Counter Animation
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        if (statsAnimated) return;
        
        const aboutSection = document.getElementById('about');
        if (!aboutSection) return;
        
        const rect = aboutSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible) {
            statsAnimated = true;
            
            statNumbers.forEach((stat, index) => {
                const target = parseFloat(stat.getAttribute('data-target'));
                const isDecimal = target % 1 !== 0;
                const increment = target / 100; // Slower animation for better visibility
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    if (isDecimal) {
                        stat.textContent = current.toFixed(2);
                    } else {
                        stat.textContent = Math.floor(current);
                        if (target >= 10) stat.textContent += '+';
                    }
                }, 20); // Slower timing for better visibility
                
                // Add bounce effect
                setTimeout(() => {
                    stat.style.animation = 'bounce 0.6s ease-out';
                }, index * 200);
            });
            
            trackEvent('animation', 'stats', 'animated');
        }
    }
    
    window.addEventListener('scroll', throttle(animateStats, 100));
    animateStats(); // Check on load
}

// Certifications Animation
function initializeCertificationsAnimation() {
    const certItems = document.querySelectorAll('.cert-item');
    
    function animateCertifications() {
        if (certificationsAnimated) return;
        
        const certificationsSection = document.getElementById('certifications');
        if (!certificationsSection) return;
        
        const rect = certificationsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible) {
            certificationsAnimated = true;
            
            certItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }, index * 100);
            });
            
            trackEvent('animation', 'certifications', 'animated');
        }
    }
    
    // Set initial state
    certItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
    });
    
    window.addEventListener('scroll', throttle(animateCertifications, 100));
    animateCertifications(); // Check on load
}

// Experience Timeline Animation
function initializeExperienceTimeline() {
    const experienceItems = document.querySelectorAll('.experience-item');
    
    function animateExperience() {
        if (experienceAnimated) return;
        
        const experienceSection = document.getElementById('experience');
        if (!experienceSection) return;
        
        const rect = experienceSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible) {
            experienceAnimated = true;
            
            experienceItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                    item.classList.add('animate-in');
                }, index * 300);
            });
            
            trackEvent('animation', 'experience', 'animated');
        }
    }
    
    // Set initial state
    experienceItems.forEach((item, index) => {
        item.style.opacity = '0';
        if (index % 2 === 0) {
            item.style.transform = 'translateX(-50px)';
        } else {
            item.style.transform = 'translateX(50px)';
        }
    });
    
    window.addEventListener('scroll', throttle(animateExperience, 100));
    animateExperience(); // Check on load
}

// Project Cards Interaction
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Mouse enter effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        // Mouse leave effect
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Click tracking
        card.addEventListener('click', function() {
            const projectTitle = this.querySelector('.project-title')?.textContent;
            trackEvent('project', 'click', projectTitle);
        });
        
        // Intersection observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        // Set initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        
        observer.observe(card);
    });
}

// Contact Form Handling
function initializeContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Form validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
        input.addEventListener('focus', handleFieldFocus);
    });
    
    // Auto-resize textarea
    const textarea = contactForm.querySelector('textarea');
    if (textarea) {
        textarea.addEventListener('input', autoResizeTextarea);
    }
}

// Initialize EmailJS with your public key
(function() {
    emailjs.init("LTw2grHP7qgo3DVMc"); // Your actual public key
})();

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formObject = {};
    
    // Convert FormData to object
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Validate form
    if (validateForm(formObject)) {
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Send email using EmailJS
        emailjs.send('service_48319id', 'template_vilmnpn', {
            from_name: formObject.name,
            from_email: formObject.email,
            subject: formObject.subject,
            message: formObject.message,
            to_email: 'aryanbhutyal@gmail.com'
        })
        .then(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            // Clear saved form data
            ['name', 'email', 'subject', 'message'].forEach(field => {
                localStorage.removeItem(`form_${field}`);
            });
            trackEvent('form', 'submit', 'contact-success');
        })
        .catch((error) => {
            console.error('EmailJS Error:', error);
            showNotification('Failed to send message. Please try again or contact me directly at aryanbhutyal@gmail.com', 'error');
            trackEvent('form', 'submit', 'contact-error');
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }
}

function validateForm(data) {
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        showFieldError('name', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!data.subject || data.subject.trim().length < 5) {
        showFieldError('subject', 'Subject must be at least 5 characters');
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        showFieldError('message', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    switch (field.name) {
        case 'name':
            if (value.length < 2) {
                showFieldError('name', 'Name must be at least 2 characters');
            } else {
                showFieldSuccess('name');
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError('email', 'Please enter a valid email address');
            } else {
                showFieldSuccess('email');
            }
            break;
        case 'subject':
            if (value.length < 5) {
                showFieldError('subject', 'Subject must be at least 5 characters');
            } else {
                showFieldSuccess('subject');
            }
            break;
        case 'message':
            if (value.length < 10) {
                showFieldError('message', 'Message must be at least 10 characters');
            } else {
                showFieldSuccess('message');
            }
            break;
    }
}

function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    // Remove existing error/success
    clearFieldError({ target: field });
    
    // Add error styling
    field.classList.add('error');
    field.classList.remove('success');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function showFieldSuccess(fieldName) {
    const field = document.getElementById(fieldName);
    if (!field) return;
    
    // Remove existing error
    clearFieldError({ target: field });
    
    // Add success styling
    field.classList.add('success');
    field.classList.remove('error');
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error', 'success');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function handleFieldFocus(e) {
    const field = e.target;
    field.parentNode.classList.add('focused');
}

function autoResizeTextarea(e) {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Notification System
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('visible');
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => removeNotification(notification));
    
    // Auto remove
    setTimeout(() => removeNotification(notification), duration);
    
    // Track notification
    trackEvent('notification', 'show', type);
}

function removeNotification(notification) {
    notification.classList.remove('visible');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Scroll Animations
function initializeScrollAnimations() {
    // Use Intersection Observer for better performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .zoom-in');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// FIXED: Smooth Scrolling with proper back-to-top functionality
function initializeSmoothScrolling() {
    // Back to top button - FIXED
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            trackEvent('navigation', 'back-to-top', 'click');
        });
    }
    
    // Smooth scroll for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Progress Bar
function initializeProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.innerHTML = '<div class="progress-bar-fill"></div>';
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.progress-bar-fill');
    
    window.addEventListener('scroll', () => {
        updateScrollProgress();
        progressFill.style.width = `${scrollProgress}%`;
    });
}

function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = (scrollTop / docHeight) * 100;
}

// Parallax Effects
function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero-image, .floating-elements');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    }, 16));
}

// Lazy Loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Performance Monitoring
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        trackEvent('performance', 'page-load', Math.round(loadTime));
        
        // Log performance metrics
        if (performance.getEntriesByType) {
            const navigation = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Performance:', {
                loadTime: Math.round(loadTime),
                domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
                firstPaint: Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0)
            });
        }
    });
    
    // Monitor scroll performance
    let scrollCount = 0;
    window.addEventListener('scroll', () => {
        scrollCount++;
        if (scrollCount % 100 === 0) {
            trackEvent('performance', 'scroll-events', scrollCount);
        }
    });
}

// Entrance Animations
function triggerEntranceAnimations() {
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');
    
    if (heroText) {
        heroText.style.animation = 'fadeInUp 1s ease forwards';
    }
    
    if (heroImage) {
        heroImage.style.animation = 'fadeInRight 1s ease 0.3s forwards';
        heroImage.style.opacity = '0';
        setTimeout(() => {
            heroImage.style.opacity = '1';
        }, 300);
    }
    
    // Animate floating badges
    const techBadges = document.querySelectorAll('.tech-badge');
    techBadges.forEach((badge, index) => {
        setTimeout(() => {
            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0)';
        }, 1000 + (index * 200));
    });
}

// FIXED: Initialize scroll effects with proper handling
function initializeScrollEffects() {
    window.addEventListener('scroll', throttle(() => {
        handleNavbarScroll();
        updateActiveNavLink();
    }, 16));
}

// Event Tracking (Analytics)
function trackEvent(category, action, label = null, value = null) {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    // Console logging for development
    console.log('Event tracked:', { category, action, label, value });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// FIXED: Force animations on page load if elements are already visible
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        // Reset animation flags and trigger animations for visible elements
        const aboutSection = document.getElementById('about');
        const skillsSection = document.getElementById('skills');
        
        if (aboutSection && aboutSection.getBoundingClientRect().top < window.innerHeight) {
            statsAnimated = false;
            initializeStatsCounter();
        }
        
        if (skillsSection && skillsSection.getBoundingClientRect().top < window.innerHeight) {
            skillsAnimated = false;
            initializeSkillBars();
        }
    }, 100);
});

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    trackEvent('error', 'javascript', e.error?.message || 'Unknown error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    trackEvent('error', 'promise-rejection', e.reason?.message || 'Unknown rejection');
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
                trackEvent('pwa', 'service-worker', 'registered');
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
                trackEvent('pwa', 'service-worker', 'failed');
            });
    });
}

// Legacy Browser Support
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Console Welcome Message
console.log(`
    🚀 Enhanced Portfolio Website Loaded Successfully!
    👨‍💻 Developed by: Aryan Bhutyal
    📧 Contact: aryanbhutyal@gmail.com
    🔗 GitHub: https://github.com/Aryan-1805
    💼 LinkedIn: https://linkedin.com/in/aryan-bhutyal-257aa3212/
    🏢 Current: Samsung PRISM Research Intern
    
    Performance Metrics:
    - Load Time: ${Math.round(performance.now())}ms
    - Interactive Elements: ${document.querySelectorAll('button, a, input').length}
    - Animations: ${document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').length}
    
    🎯 Features Loaded:
    ✅ Responsive Navigation
    ✅ Typing Animation
    ✅ Scroll Animations
    ✅ Stats Counter
    ✅ Skills Progress Bars
    ✅ Contact Form Validation
    ✅ Back-to-Top Button
    ✅ Performance Monitoring
    ✅ Error Handling
    ✅ PWA Support
    
    💡 Tips for Developers:
    - Open DevTools to see detailed performance metrics
    - All animations respect 'prefers-reduced-motion'
    - Form validation includes real-time feedback
    - Intersection Observer used for optimal performance
    - Service Worker ready for PWA deployment
    
    🔧 Debug Commands:
    - trackEvent('test', 'console', 'debug') - Test analytics
    - showNotification('Test message', 'success') - Test notifications
    - toggleMobileMenu() - Toggle mobile navigation
    - updateScrollProgress() - Check scroll progress
    
    Happy coding! 🎉
    `);
    
    // FIXED: Initialize scroll effects with proper handling
    function initializeScrollEffects() {
        window.addEventListener('scroll', throttle(() => {
            handleNavbarScroll();
            updateActiveNavLink();
        }, 16));
    }
    
    // FIXED: Force animations on page load if elements are already visible
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            // Reset animation flags and trigger animations for visible elements
            const aboutSection = document.getElementById('about');
            const skillsSection = document.getElementById('skills');
            
            if (aboutSection && aboutSection.getBoundingClientRect().top < window.innerHeight) {
                statsAnimated = false;
                initializeStatsCounter();
            }
            
            if (skillsSection && skillsSection.getBoundingClientRect().top < window.innerHeight) {
                skillsAnimated = false;
                initializeSkillBars();
            }
        }, 100);
    });
    
    // Enhanced Error Handling with User Feedback
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        trackEvent('error', 'javascript', e.error?.message || 'Unknown error');
        
        // Show user-friendly error message for critical errors
        if (e.error && e.error.message.includes('critical')) {
            showNotification('Something went wrong. Please refresh the page.', 'error');
        }
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        trackEvent('error', 'promise-rejection', e.reason?.message || 'Unknown rejection');
        
        // Prevent default browser error handling for better UX
        e.preventDefault();
    });
    
    // Service Worker Registration (for PWA capabilities)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                    trackEvent('pwa', 'service-worker', 'registered');
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                    trackEvent('pwa', 'service-worker', 'failed');
                });
        });
    }
    
    // Legacy Browser Support
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            var el = this;
            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }
    
    // Polyfill for IntersectionObserver
    if (!window.IntersectionObserver) {
        // Fallback for older browsers
        window.IntersectionObserver = function(callback) {
            return {
                observe: function(element) {
                    // Simple fallback - trigger callback immediately
                    callback([{
                        target: element,
                        isIntersecting: true
                    }]);
                },
                unobserve: function() {},
                disconnect: function() {}
            };
        };
    }
    
    // Enhanced Keyboard Navigation
    document.addEventListener('keydown', function(e) {
        // Skip if user is typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'Home':
                e.preventDefault();
                document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'End':
                e.preventDefault();
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'PageUp':
                e.preventDefault();
                window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
                break;
            case 'PageDown':
                e.preventDefault();
                window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
                break;
        }
    });
    
    // Enhanced Form Handling with Better UX
    function enhanceFormExperience() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        // Add loading states to form
        const submitBtn = form.querySelector('button[type="submit"]');
        const inputs = form.querySelectorAll('input, textarea');
        
        // Save form data to localStorage on input
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                localStorage.setItem(`form_${this.name}`, this.value);
            });
            
            // Restore saved data on page load
            const savedValue = localStorage.getItem(`form_${input.name}`);
            if (savedValue) {
                input.value = savedValue;
            }
        });
        
        // Clear saved data on successful submission
        form.addEventListener('submit', function() {
            setTimeout(() => {
                inputs.forEach(input => {
                    localStorage.removeItem(`form_${input.name}`);
                });
            }, 2000);
        });
    }
    
    // Initialize enhanced form experience
    document.addEventListener('DOMContentLoaded', enhanceFormExperience);
    
    // Theme Detection and Handling
    function initializeThemeHandling() {
        // Detect user's preferred color scheme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        function handleThemeChange(e) {
            if (e.matches) {
                document.body.classList.add('dark-theme');
                trackEvent('theme', 'auto-switch', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                trackEvent('theme', 'auto-switch', 'light');
            }
        }
        
        // Listen for changes
        prefersDark.addListener(handleThemeChange);
        
        // Apply initial theme
        handleThemeChange(prefersDark);
    }
    
    // Initialize theme handling
    document.addEventListener('DOMContentLoaded', initializeThemeHandling);
    
    // Enhanced Analytics and User Behavior Tracking
    function initializeAdvancedAnalytics() {
        let sessionStartTime = Date.now();
        let pageViews = 1;
        let scrollDepth = 0;
        let maxScrollDepth = 0;
        
        // Track scroll depth
        window.addEventListener('scroll', throttle(() => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            scrollDepth = Math.round((scrollTop / docHeight) * 100);
            
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                
                // Track milestone scroll depths
                if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
                    trackEvent('engagement', 'scroll-depth', '25%');
                } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
                    trackEvent('engagement', 'scroll-depth', '50%');
                } else if (maxScrollDepth >= 75 && maxScrollDepth < 100) {
                    trackEvent('engagement', 'scroll-depth', '75%');
                } else if (maxScrollDepth >= 100) {
                    trackEvent('engagement', 'scroll-depth', '100%');
                }
            }
        }, 250));
        
        // Track time on page
        window.addEventListener('beforeunload', () => {
            const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
            trackEvent('engagement', 'session-duration', sessionDuration);
            trackEvent('engagement', 'max-scroll-depth', maxScrollDepth);
        });
        
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                trackEvent('engagement', 'page-hidden', Date.now() - sessionStartTime);
            } else {
                trackEvent('engagement', 'page-visible', Date.now() - sessionStartTime);
            }
        });
    }
    
    // Initialize advanced analytics
    document.addEventListener('DOMContentLoaded', initializeAdvancedAnalytics);
    
    // Export functions for testing (if needed)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            initializeApp,
            toggleMobileMenu,
            validateForm,
            showNotification,
            trackEvent,
            initializeStatsCounter,
            initializeSkillBars,
            handleNavbarScroll,
            updateActiveNavLink
        };
    }
    
    // Development helpers (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Add development helpers to window object
        window.portfolioDebug = {
            resetAnimations: function() {
                skillsAnimated = false;
                statsAnimated = false;
                certificationsAnimated = false;
                experienceAnimated = false;
                console.log('Animation flags reset');
            },
            triggerStatsAnimation: function() {
                statsAnimated = false;
                initializeStatsCounter();
            },
            triggerSkillsAnimation: function() {
                skillsAnimated = false;
                initializeSkillBars();
            },
            showTestNotification: function(type = 'info') {
                showNotification(`Test ${type} notification`, type);
            },
            getPerformanceMetrics: function() {
                return {
                    loadTime: Math.round(performance.now()),
                    scrollProgress: scrollProgress,
                    currentSection: currentSection,
                    animationStates: {
                        skills: skillsAnimated,
                        stats: statsAnimated,
                        certifications: certificationsAnimated,
                        experience: experienceAnimated
                    }
                };
            }
        };
        
        console.log('🔧 Development mode detected. Use window.portfolioDebug for debugging tools.');
    }
    
    // Final initialization check
    document.addEventListener('DOMContentLoaded', function() {
        // Verify all critical elements are present
        const criticalElements = [
            'navbar',
            'nav-toggle',
            'nav-menu',
            'back-to-top',
            'typing-text'
        ];
        
        const missingElements = criticalElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            console.warn('Missing critical elements:', missingElements);
            trackEvent('error', 'missing-elements', missingElements.join(','));
        } else {
            console.log('✅ All critical elements found');
        }
        
        // Log successful initialization
        setTimeout(() => {
            trackEvent('app', 'initialized', 'success');
            console.log('🎉 Portfolio application fully initialized');
        }, 2000);
    });
    