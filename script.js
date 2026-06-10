document.addEventListener('DOMContentLoaded', () => {

    // --- A. NAVBAR DESIGN & SCROLL LOGIC ---
    const navbar = document.getElementById('navbar');
    const navLogoImg = document.getElementById('nav-logo-img');
    const navLinks = document.getElementById('nav-links');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.remove('bg-transparent', 'py-5');
            navbar.classList.add('bg-white/95', 'shadow-md', 'py-3', 'backdrop-blur-sm');
            navLogoImg.classList.remove('logo-white-filter');
            navLinks.classList.remove('text-white');
            navLinks.classList.add('text-neutral-700');
            mobileMenuBtn.classList.remove('text-white');
            mobileMenuBtn.classList.add('text-neutral-900');
        } else {
            navbar.classList.remove('bg-white/95', 'shadow-md', 'py-3', 'backdrop-blur-sm');
            navbar.classList.add('bg-transparent', 'py-5');
            
            if (mobileDrawer.classList.contains('hidden')) {
                navLogoImg.classList.add('logo-white-filter');
                mobileMenuBtn.classList.remove('text-neutral-900');
                mobileMenuBtn.classList.add('text-white');
            }
            
            navLinks.classList.remove('text-neutral-700');
            navLinks.classList.add('text-white');
        }
    });


    // --- B. MOBILE DRAWER ---
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleDrawer() {
        mobileDrawer.classList.toggle('hidden');
        mobileDrawer.classList.toggle('flex');
        hamburgerIcon.classList.toggle('fa-bars');
        hamburgerIcon.classList.toggle('fa-xmark');
        
        if (!mobileDrawer.classList.contains('hidden')) {
            navLogoImg.classList.remove('logo-white-filter');
            mobileMenuBtn.classList.remove('text-white');
            mobileMenuBtn.classList.add('text-neutral-900');
        } else if (window.scrollY <= 50) {
            navLogoImg.classList.add('logo-white-filter');
            mobileMenuBtn.classList.remove('text-neutral-900');
            mobileMenuBtn.classList.add('text-white');
        }
    }

    mobileMenuBtn.addEventListener('click', toggleDrawer);
    mobileLinks.forEach(link => link.addEventListener('click', toggleDrawer));


    // --- C. HERO SLIDER ---
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    let currentSlideIndex = 0;
    let slideIntervalTimer = setInterval(autoAdvanceSlides, 6000);

    function updateSlideLayoutView(targetIndex) {
        slides[currentSlideIndex].classList.remove('opacity-100', 'z-10');
        slides[currentSlideIndex].classList.add('opacity-0', 'z-0');

        currentSlideIndex = targetIndex;

        slides[currentSlideIndex].classList.remove('opacity-0', 'z-0');
        slides[currentSlideIndex].classList.add('opacity-100', 'z-10');
        
        dots.forEach((dot, idx) => {
            if (idx === currentSlideIndex) {
                dot.classList.remove('w-1.5', 'bg-white/40');
                dot.classList.add('w-3', 'bg-white');
            } else {
                dot.classList.remove('w-3', 'bg-white');
                dot.classList.add('w-1.5', 'bg-white/40');
            }
        });
        
        clearInterval(slideIntervalTimer);
        slideIntervalTimer = setInterval(autoAdvanceSlides, 6000);
    }

    function autoAdvanceSlides() {
        let checkNextIndex = (currentSlideIndex + 1) % slides.length;
        updateSlideLayoutView(checkNextIndex);
    }

    prevBtn.addEventListener('click', () => {
        let calcPrev = (currentSlideIndex - 1 + slides.length) % slides.length;
        updateSlideLayoutView(calcPrev);
    });

    nextBtn.addEventListener('click', () => {
        let calcNext = (currentSlideIndex + 1) % slides.length;
        updateSlideLayoutView(calcNext);
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const selectIndex = parseInt(e.target.getAttribute('data-slide'));
            updateSlideLayoutView(selectIndex);
        });
    });


    // --- D. UNIFIED INTERSECTION OBSERVER FOR SCROLL REVEALS ---
    const elementsToReveal = document.querySelectorAll('.reveal-element, .integrated-memory-card');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    elementsToReveal.forEach(el => revealObserver.observe(el));


    // --- E. COUNTER ANIMATION ENGINE ---
    const counters = document.querySelectorAll('.counter-val');
    
    const runCountersCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetElement = entry.target;
                const finalCountValue = parseInt(targetElement.getAttribute('data-target'));
                let currentCountValue = 0;
                const durationWindow = 2000; 
                const loopIncrementStep = Math.ceil(finalCountValue / (durationWindow / 16)); 
                
                const counterTimerLoop = setInterval(() => {
                    currentCountValue += loopIncrementStep;
                    if (currentCountValue >= finalCountValue) {
                        targetElement.innerText = finalCountValue;
                        clearInterval(counterTimerLoop);
                    } else {
                        targetElement.innerText = currentCountValue;
                    }
                }, 16);
                
                observer.unobserve(targetElement);
            }
        });
    };

    const counterObserver = new IntersectionObserver(runCountersCallback, {
        root: null,
        threshold: 0.5
    });

    counters.forEach(counter => counterObserver.observe(counter));


    // --- F. SIMPLE FORM VALIDATION ---
    const form = document.getElementById('intake-form');
    const inputName = document.getElementById('client-name');
    const inputEmail = document.getElementById('client-email');
    const inputPhone = document.getElementById('client-phone');
    const inputMsg = document.getElementById('client-message');
    const formSuccessBox = document.getElementById('form-success');

    function resetErrorToggles() {
        document.getElementById('err-name').classList.add('hidden');
        document.getElementById('err-email').classList.add('hidden');
        document.getElementById('err-phone').classList.add('hidden');
        document.getElementById('err-msg').classList.add('hidden');
        inputName.classList.remove('border-red-400');
        inputEmail.classList.remove('border-red-400');
        inputPhone.classList.remove('border-red-400');
        inputMsg.classList.remove('border-red-400');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        resetErrorToggles();
        let isFormExecutionValid = true;

        if (!inputName.value.trim()) {
            document.getElementById('err-name').classList.remove('hidden');
            inputName.classList.add('border-red-400');
            isFormExecutionValid = false;
        }

        const validationEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!validationEmailPattern.test(inputEmail.value.trim())) {
            document.getElementById('err-email').classList.remove('hidden');
            inputEmail.classList.add('border-red-400');
            isFormExecutionValid = false;
        }

        if (!inputPhone.value.trim() || inputPhone.value.trim().length < 8) {
            document.getElementById('err-phone').classList.remove('hidden');
            inputPhone.classList.add('border-red-400');
            isFormExecutionValid = false;
        }

        if (!inputMsg.value.trim() || inputMsg.value.trim().length < 10) {
            document.getElementById('err-msg').classList.remove('hidden');
            inputMsg.classList.add('border-red-400');
            isFormExecutionValid = false;
        }

        if (isFormExecutionValid) {
            formSuccessBox.classList.remove('hidden');
            form.reset();
            setTimeout(() => {
                formSuccessBox.classList.add('hidden');
            }, 7000);
        }
    });


    // --- G. GLITCH-FREE MARQUEE ENGINE ---
    const track = document.getElementById('js-marquee-track');

    if (track) {
        const originalCards = Array.from(track.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });

        let currentX = 0;
        const speed = 1.2;
        let isPaused = false;

        function animateMarquee() {
            if (!isPaused) {
                currentX -= speed;
                const halfWidth = track.scrollWidth / 2;

                if (Math.abs(currentX) >= halfWidth) {
                    currentX = 0;
                }
                track.style.transform = `translateX(${currentX}px)`;
            }
            requestAnimationFrame(animateMarquee);
        }

        track.addEventListener('mouseenter', () => isPaused = true);
        track.addEventListener('mouseleave', () => isPaused = false);
        track.addEventListener('touchstart', () => isPaused = true);
        track.addEventListener('touchend', () => isPaused = false);

        requestAnimationFrame(animateMarquee);
    }
});