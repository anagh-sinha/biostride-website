/* Bio-Stride Shared JavaScript Framework */

// ========== CORE FUNCTIONALITY ==========

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeMobileMenu();
    initializeFormValidation();
    initializeLoadingStates();
    initializeScrollToTop();
    initializeCarousels();
    initializeTabs();
    initializeModals();
    initializeTooltips();
    initializeParallax();
    console.log('Bio-Stride framework initialized');
});

// ========== NAVIGATION SYSTEM ==========

function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Add scrolled class when scrolling
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide navbar on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Highlight active navigation item
    updateActiveNavItem();
    window.addEventListener('scroll', updateActiveNavItem);
}

function updateActiveNavItem() {
    const sections = document.querySelectorAll('section[id], .section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ========== MOBILE MENU ==========

function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuBtn || !navLinks) return;

    mobileMenuBtn.addEventListener('click', function() {
        const isActive = navLinks.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    navLinks.classList.add('active');
    mobileMenuBtn.classList.add('active');
    mobileMenuBtn.innerHTML = '✕';
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    navLinks.classList.remove('active');
    mobileMenuBtn.classList.remove('active');
    mobileMenuBtn.innerHTML = '☰';
    document.body.style.overflow = '';
}

// ========== SCROLL ANIMATIONS ==========

function initializeScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.animate-staggered');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.animate-fade-in, .animate-slide-in-left, .animate-slide-in-right, .card, .feature-card, .metric-card').forEach(el => {
        observer.observe(el);
    });
}

// ========== FORM VALIDATION ==========

function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('.form-input, .form-textarea, .form-select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                handleFormSubmit(form);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    clearFieldError(field);

    if (required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }

    if (value && type === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }

    if (value && type === 'tel' && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }

    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.form-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.form-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function handleFormSubmit(form) {
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    
    if (submitButton) {
        submitButton.classList.add('loading');
        submitButton.disabled = true;
    }

    // Simulate form submission
    setTimeout(() => {
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        
        if (submitButton) {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }, 2000);
}

// ========== LOADING STATES ==========

function initializeLoadingStates() {
    // Add loading states to buttons with data-loading attribute
    document.querySelectorAll('[data-loading]').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                
                // Remove loading state after specified time or 3 seconds
                const duration = this.dataset.loading || 3000;
                setTimeout(() => {
                    this.classList.remove('loading');
                }, duration);
            }
        });
    });
}

// ========== SCROLL TO TOP ==========

function initializeScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '↑';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollButton);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========== CAROUSELS ==========

function initializeCarousels() {
    document.querySelectorAll('.carousel').forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-slide');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        
        if (!track || !slides.length) return;

        let currentSlide = 0;
        const totalSlides = slides.length;

        function updateCarousel() {
            const translateX = -currentSlide * 100;
            track.style.transform = `translateX(${translateX}%)`;
            
            // Update indicators
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });

            // Update button states
            if (prevButton) prevButton.disabled = currentSlide === 0;
            if (nextButton) nextButton.disabled = currentSlide === totalSlides - 1;
        }

        function nextSlide() {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateCarousel();
            }
        }

        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        }

        function goToSlide(index) {
            currentSlide = index;
            updateCarousel();
        }

        // Event listeners
        if (nextButton) nextButton.addEventListener('click', nextSlide);
        if (prevButton) prevButton.addEventListener('click', prevSlide);
        
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => goToSlide(index));
        });

        // Auto-play if specified
        if (carousel.dataset.autoplay) {
            const interval = parseInt(carousel.dataset.autoplay) || 5000;
            setInterval(() => {
                if (currentSlide === totalSlides - 1) {
                    currentSlide = 0;
                } else {
                    currentSlide++;
                }
                updateCarousel();
            }, interval);
        }

        // Initialize
        updateCarousel();
    });
}

// ========== TABS ==========

function initializeTabs() {
    document.querySelectorAll('.tab-container').forEach(container => {
        const tabs = container.querySelectorAll('.tab');
        const panels = container.querySelectorAll('.tab-panel');

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panels
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));

                // Add active class to clicked tab and corresponding panel
                tab.classList.add('active');
                if (panels[index]) {
                    panels[index].classList.add('active');
                }
            });
        });
    });
}

// ========== MODALS ==========

function initializeModals() {
    // Open modal triggers
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.dataset.modal;
            openModal(modalId);
        });
    });

    // Close modal triggers
    document.querySelectorAll('.modal-close, .modal-backdrop').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(closeBtn.closest('.modal'));
        });
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.active');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.querySelector('.modal-content')?.focus();
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========== TOOLTIPS ==========

function initializeTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.dataset.tooltip;
        
        element.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
            positionTooltip(element, tooltip);
            tooltip.classList.add('visible');
        });

        element.addEventListener('mouseleave', () => {
            tooltip.remove();
        });

        element.addEventListener('mousemove', (e) => {
            if (tooltip.parentNode) {
                positionTooltip(element, tooltip, e);
            }
        });
    });
}

function positionTooltip(element, tooltip, event) {
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    let top = rect.top - tooltipRect.height - 10;

    // Adjust if tooltip goes off screen
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 10) {
        top = rect.bottom + 10;
    }

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
}

// ========== PARALLAX EFFECTS ==========

function initializeParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    if (parallaxElements.length === 0) return;

    function updateParallax() {
        const scrollTop = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Use requestAnimationFrame for smooth animation
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', () => {
        requestTick();
        ticking = false;
    });
}

// ========== NOTIFICATION SYSTEM ==========

function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentNode.parentNode.remove()">×</button>
        </div>
    `;

    // Add to page
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    container.appendChild(notification);

    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);

    // Slide in animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
}

// ========== UTILITY FUNCTIONS ==========

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Animate counter numbers
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize counters when they come into view
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.target);
                animateCounter(counter, 0, target, 2000);
                observer.unobserve(counter);
            }
        });
    });

    counters.forEach(counter => observer.observe(counter));
}

// Format numbers with Indian numbering system
function formatIndianNumber(num) {
    const x = num.toString();
    const afterPoint = x.indexOf('.') > 0 ? x.substring(x.indexOf('.'), x.length) : '';
    const beforePoint = x.substring(0, x.indexOf('.') > 0 ? x.indexOf('.') : x.length);
    
    if (beforePoint.length > 3) {
        const lastThree = beforePoint.substring(beforePoint.length - 3);
        const otherNumbers = beforePoint.substring(0, beforePoint.length - 3);
        
        if (otherNumbers !== '') {
            return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree + afterPoint;
        } else {
            return lastThree + afterPoint;
        }
    } else {
        return beforePoint + afterPoint;
    }
}

// Copy text to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success', 2000);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Copied to clipboard!', 'success', 2000);
    }
}

// Lazy load images
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

    images.forEach(img => imageObserver.observe(img));
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeCounters();
    initializeLazyLoading();
});

// Export functions for external use
window.BioStrideFramework = {
    showNotification,
    openModal,
    closeModal,
    copyToClipboard,
    formatIndianNumber,
    animateCounter,
    openMobileMenu,
    closeMobileMenu
};