document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // HEADER & NAVIGATION LOGIC
    // ==========================================================================
    const header = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerClose = document.getElementById('drawer-close');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerLinks = document.querySelectorAll('.drawer-link');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveNavLink();
    });

    // Mobile Navigation Drawer Toggle
    function openDrawer() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });

    // Active Nav Link Highlighting on Scroll
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 200; // Offset for header height
        
        document.querySelectorAll('section').forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPosition >= top && scrollPosition < top + height) {
                // Update Desktop Links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
                
                // Update Mobile Links
                drawerLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ==========================================================================
    // MENU CATEGORY TABS LOGIC
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.menu-tab-btn');
    const menuGrids = document.querySelectorAll('.menu-grid');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetCategory = btn.getAttribute('data-target');
            
            // Toggle active button styling
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle visible menu grid with transition
            menuGrids.forEach(grid => {
                grid.classList.remove('active');
                if (grid.getAttribute('id') === `menu-${targetCategory}`) {
                    // Small delay to allow fade out transition
                    setTimeout(() => {
                        grid.classList.add('active');
                    }, 50);
                }
            });
        });
    });

    // ==========================================================================
    // CATERING BUDGET CALCULATOR LOGIC
    // ==========================================================================
    const calcGuests = document.getElementById('calc-guests');
    const guestCountVal = document.getElementById('guest-count-val');
    const calcEventType = document.getElementById('calc-event-type');
    const calcPackages = document.getElementsByName('calc-package');
    const calcTotalDisplay = document.getElementById('calc-total-display');
    const breakdownTier = document.getElementById('breakdown-tier');
    const breakdownBaseTotal = document.getElementById('breakdown-base-total');
    const breakdownPerGuest = document.getElementById('breakdown-per-guest');
    const breakdownAddonsTotal = document.getElementById('breakdown-addons-total');
    const calcActiveAddonsList = document.getElementById('calc-active-addons-list');
    
    // Addon Elements
    const addonStaff = document.getElementById('addon-staff');
    const addonCooking = document.getElementById('addon-cooking');
    const addonDecor = document.getElementById('addon-decor');
    const addonBar = document.getElementById('addon-bar');

    // Packages and Multipliers Mapping
    const packageRates = {
        silver: 25,
        gold: 45,
        platinum: 75
    };

    const eventMultipliers = {
        wedding: 1.1,      // Luxury wedding premium
        corporate: 1.0,    // Standard
        private: 0.9,      // Informal discount
        cocktail: 0.85     // Appetizer only discount
    };

    function calculateEstimate() {
        if (!calcGuests || !calcTotalDisplay) return;

        const guests = parseInt(calcGuests.value);
        guestCountVal.textContent = `${guests} Guests`;

        // Get Package tier
        let selectedPackage = 'gold';
        calcPackages.forEach(radio => {
            if (radio.checked) {
                selectedPackage = radio.value;
            }
        });

        // Toggle active styling on visual cards
        document.querySelectorAll('.package-option').forEach(card => {
            const radio = card.querySelector('input');
            if (radio.checked) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Get Event Type multiplier
        const eventType = calcEventType.value;
        const multiplier = eventMultipliers[eventType] || 1.0;
        
        // Base rate calculation
        const baseRate = packageRates[selectedPackage];
        const finalPerGuestRate = baseRate * multiplier;
        const baseTotal = guests * finalPerGuestRate;

        // Add-ons calculations
        let addonsTotal = 0;
        const activeAddons = [];

        if (addonStaff && addonStaff.checked) {
            addonsTotal += 350;
            activeAddons.push({ name: 'Professional Wait Staff', cost: 350 });
        }
        if (addonCooking && addonCooking.checked) {
            addonsTotal += 500;
            activeAddons.push({ name: 'Live Cooking Station Chef', cost: 500 });
        }
        if (addonDecor && addonDecor.checked) {
            addonsTotal += 600;
            activeAddons.push({ name: 'Premium Floral & Table Decor', cost: 600 });
        }
        if (addonBar && addonBar.checked) {
            addonsTotal += 400;
            activeAddons.push({ name: 'Premium Mixology Mocktail Bar', cost: 400 });
        }

        // Grand Total
        const grandTotal = baseTotal + addonsTotal;

        // Update DOM elements
        calcTotalDisplay.textContent = `$${Math.round(grandTotal).toLocaleString()}`;
        breakdownTier.textContent = selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1);
        breakdownBaseTotal.textContent = `$${Math.round(baseTotal).toLocaleString()}`;
        breakdownPerGuest.textContent = `$${finalPerGuestRate.toFixed(2)} x ${guests}`;
        breakdownAddonsTotal.textContent = `$${addonsTotal.toLocaleString()}`;

        // Render Active Addons List
        if (calcActiveAddonsList) {
            calcActiveAddonsList.innerHTML = '';
            if (activeAddons.length === 0) {
                calcActiveAddonsList.innerHTML = '<li class="text-muted">No additional add-ons selected</li>';
            } else {
                activeAddons.forEach(addon => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fa-solid fa-plus font-xs"></i> ${addon.name} ($${addon.cost})`;
                    calcActiveAddonsList.appendChild(li);
                });
            }
        }
    }

    // Attach Calculator Event Listeners
    if (calcGuests) calcGuests.addEventListener('input', calculateEstimate);
    if (calcEventType) calcEventType.addEventListener('change', calculateEstimate);
    calcPackages.forEach(radio => radio.addEventListener('change', calculateEstimate));
    
    [addonStaff, addonCooking, addonDecor, addonBar].forEach(checkbox => {
        if (checkbox) checkbox.addEventListener('change', calculateEstimate);
    });

    // Run initial calculation on page load
    calculateEstimate();

    // Lock in Quote / Autopopulate contact form
    const calcCtaBtn = document.getElementById('calc-cta-btn');
    const formMsg = document.getElementById('form-msg');

    if (calcCtaBtn && formMsg) {
        calcCtaBtn.addEventListener('click', () => {
            const guests = calcGuests.value;
            const eventTypeName = calcEventType.options[calcEventType.selectedIndex].text;
            
            let selectedPackage = 'Gold';
            calcPackages.forEach(radio => {
                if (radio.checked) {
                    selectedPackage = radio.value.charAt(0).toUpperCase() + radio.value.slice(1);
                }
            });

            const totalEst = calcTotalDisplay.textContent;
            
            // Build selected addons string
            const addonsArr = [];
            if (addonStaff && addonStaff.checked) addonsArr.push('Professional Wait Staff');
            if (addonCooking && addonCooking.checked) addonsArr.push('Live Cooking Station');
            if (addonDecor && addonDecor.checked) addonsArr.push('Premium Floral/Decor');
            if (addonBar && addonBar.checked) addonsArr.push('Mixology Mocktail Bar');
            
            const addonsText = addonsArr.length > 0 ? addonsArr.join(', ') : 'None';

            // Set Form Message text
            formMsg.value = `Hi Bappus Catering!\n\nI just estimated our event budget using your online calculator and would like to lock in this package:\n\n- Event Type: ${eventTypeName}\n- Guest Count: ${guests}\n- Package Selected: ${selectedPackage} Package\n- Selected Add-ons: ${addonsText}\n- Estimated Quote: ${totalEst}\n\nPlease contact me to discuss our customized gourmet menu choices. Thank you!`;
            
            // Smooth Scroll to Contact Form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
                
                // Highlight form textarea briefly to draw attention
                setTimeout(() => {
                    formMsg.focus();
                    formMsg.style.borderColor = 'var(--accent-gold)';
                    formMsg.style.boxShadow = '0 0 15px rgba(197, 160, 89, 0.4)';
                    
                    setTimeout(() => {
                        formMsg.style.borderColor = '';
                        formMsg.style.boxShadow = '';
                    }, 1500);
                }, 800);
            }
        });
    }

    // ==========================================================================
    // TESTIMONIALS SLIDER LOGIC
    // ==========================================================================
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dotButtons = document.querySelectorAll('.dot-btn');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        testimonialSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (dotButtons[i]) dotButtons[i].classList.remove('active');
        });

        testimonialSlides[index].classList.add('active');
        if (dotButtons[index]) dotButtons[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= testimonialSlides.length) {
            next = 0;
        }
        showSlide(next);
    }

    // Initialize Auto Slider
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 6000); // Change slide every 6 seconds
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // Dot navigation click handlers
    dotButtons.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            stopSlideShow();
            showSlide(i);
            startSlideShow(); // restart interval
        });
    });

    if (testimonialSlides.length > 0) {
        startSlideShow();
    }

    // ==========================================================================
    // CONTACT FORM SUBMISSION HANDLING
    // ==========================================================================
    const inquiryForm = document.getElementById('catering-inquiry-form');
    const successCard = document.getElementById('form-success-message');
    const successResetBtn = document.getElementById('success-reset-btn');
    const formSubmitBtn = document.getElementById('form-submit-btn');

    if (inquiryForm && successCard) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Disable form and show submitting state in button
            if (formSubmitBtn) {
                const originalBtnHtml = formSubmitBtn.innerHTML;
                formSubmitBtn.disabled = true;
                formSubmitBtn.innerHTML = 'Submitting Proposal <i class="fa-solid fa-circle-notch fa-spin"></i>';
                
                // Simulate network latency (1.2 seconds)
                setTimeout(() => {
                    // Hide Form, Show Success Card
                    inquiryForm.style.opacity = '0';
                    setTimeout(() => {
                        inquiryForm.classList.add('sr-only'); // Remove from flow
                        successCard.classList.add('active');
                        
                        // Scroll slightly to align contact card in window
                        successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 300);
                    
                    // Reset Button
                    formSubmitBtn.disabled = false;
                    formSubmitBtn.innerHTML = originalBtnHtml;
                }, 1200);
            }
        });

        // Reset Inquiry Form
        if (successResetBtn) {
            successResetBtn.addEventListener('click', () => {
                // Clear inputs
                inquiryForm.reset();
                if (formMsg) formMsg.value = '';
                
                // Reset calculator outputs to default
                if (calcGuests) {
                    calcGuests.value = 100;
                    if (calcEventType) calcEventType.value = 'corporate';
                    
                    // Reset radios to gold
                    calcPackages.forEach(radio => {
                        radio.checked = (radio.value === 'gold');
                    });
                    
                    // Reset checkboxes
                    if (addonStaff) addonStaff.checked = true;
                    if (addonCooking) addonCooking.checked = false;
                    if (addonDecor) addonDecor.checked = false;
                    if (addonBar) addonBar.checked = false;
                    
                    calculateEstimate();
                }

                // Hide Success, Show Form
                successCard.classList.remove('active');
                setTimeout(() => {
                    inquiryForm.classList.remove('sr-only');
                    inquiryForm.style.opacity = '1';
                }, 300);
            });
        }
    }
});
