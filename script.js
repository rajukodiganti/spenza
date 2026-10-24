/**
 * Restaurant Website - Core JavaScript
 * Handles Navigation, LocalStorage State, Menu Rendering, Filtering, and Admin Submissions.
 */

const STORAGE_KEY = 'ROYAL_MARIGOLD_MENU_ITEMS';

// Initial curated menu items across all 5 categories
const DEFAULT_MENU_ITEMS = [
    {
        id: 1,
        name: "Zafrani Paneer Tikka",
        category: "Starters",
        price: 380,
        description: "Charcoal-grilled cottage cheese cubes infused with royal saffron, crushed spices, and marigold cream.",
        image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Murgh Malai Sheekh",
        category: "Starters",
        price: 490,
        description: "Minced tender chicken skewers flavored with cardamom, white pepper, and smoked silver-leaf butter.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Crispy Calamari Royale",
        category: "Starters",
        price: 520,
        description: "Golden fried calamari rings seasoned with crushed sea salt, lime zest, and marigold pepper relish.",
        image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Dal Bukhara Gold",
        category: "Main Course",
        price: 420,
        description: "Overnight slow-simmered black lentils infused with smoked butter, cream, and roasted fenugreek.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Nalli Rogan Josh",
        category: "Main Course",
        price: 680,
        description: "Slow-cooked Kashmiri lamb shanks in an aromatic gravy of rattan jot, dried ginger, and fennel.",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Royal Paneer Korma",
        category: "Main Course",
        price: 460,
        description: "Velvety cashew and melon seed reduction with fresh cottage cheese and hand-picked royal herbs.",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Awadhi Dum Gosht Biryani",
        category: "Biryani",
        price: 650,
        description: "Aged long-grain basmati rice layered with succulent prime mutton, saffron broth, and seal-cooked in handi.",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Nizami Murgh Dum Biryani",
        category: "Biryani",
        price: 540,
        description: "Fragrant spiced basmati rice slow-dum cooked with tender chicken, caramelized onions, and fresh mint.",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 9,
        name: "Subz Shahi Handi Biryani",
        category: "Biryani",
        price: 440,
        description: "Garden-fresh vegetables and baby potatoes scented with kewra water, rose petals, and whole warm spices.",
        image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 10,
        name: "Gold Leaf Shahi Tukda",
        category: "Desserts",
        price: 320,
        description: "Crispy ghee-fried brioche soaked in saffron cardamom rabri, garnished with edible silver vark and pistachios.",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 11,
        name: "Saffron Pistachio Kulfi",
        category: "Desserts",
        price: 260,
        description: "Traditional dense caramelized milk frozen kulfi enriched with Kashmiri saffron and roasted nut praline.",
        image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 12,
        name: "Marigold Gold Brew",
        category: "Beverages",
        price: 240,
        description: "Cold-extracted artisan Arabica infused with organic marigold syrup and a hint of vanilla bean.",
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 13,
        name: "Silver Mist Mocktail",
        category: "Beverages",
        price: 280,
        description: "Elderflower extract, fresh cucumber ribbon, lime spritz, and effervescent botanical tonic.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80"
    }
];

// Fallback image URL when an external image cannot be loaded
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80";

/**
 * Retrieve menu items from localStorage or initialize with default items
 */
function getMenuItems() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_MENU_ITEMS));
            return [...DEFAULT_MENU_ITEMS];
        }
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
        }
        return [...DEFAULT_MENU_ITEMS];
    } catch (e) {
        console.error("Error accessing localStorage:", e);
        return [...DEFAULT_MENU_ITEMS];
    }
}

/**
 * Save menu items to localStorage
 */
function saveMenuItems(items) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
        console.error("Error saving to localStorage:", e);
    }
}

/**
 * Add a new menu item
 */
function addMenuItem(item) {
    const items = getMenuItems();
    items.unshift(item); // Add new item to the top
    saveMenuItems(items);
}

/**
 * Render Menu Cards on menu.html
 */
function renderMenu(categoryFilter = 'All') {
    const container = document.getElementById('menu-grid');
    if (!container) return;

    const items = getMenuItems();
    const filteredItems = categoryFilter === 'All' 
        ? items 
        : items.filter(item => item.category.toLowerCase() === categoryFilter.toLowerCase());

    if (filteredItems.length === 0) {
        container.innerHTML = `
            <div class="empty-menu-msg">
                <p>No dishes found under the <strong>${categoryFilter}</strong> category.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredItems.map(item => `
        <article class="menu-card" data-category="${escapeHtml(item.category)}">
            <div class="menu-card-image">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';">
                <span class="category-badge">${escapeHtml(item.category)}</span>
            </div>
            <div class="menu-card-content">
                <div class="menu-card-header">
                    <h3 class="food-name">${escapeHtml(item.name)}</h3>
                    <span class="food-price">₹${Number(item.price).toLocaleString('en-IN')}</span>
                </div>
                <p class="food-desc">${escapeHtml(item.description)}</p>
            </div>
        </article>
    `).join('');
}

/**
 * Setup category filter button listeners
 */
function setupCategoryFilters() {
    const buttons = document.querySelectorAll('.category-btn');
    if (!buttons.length) return;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            const category = button.getAttribute('data-category');
            renderMenu(category);
        });
    });
}

/**
 * Render Admin Table on admin.html
 */
function renderAdminTable() {
    const tableBody = document.getElementById('admin-table-body');
    const countBadge = document.getElementById('item-count-badge');
    if (!tableBody) return;

    const items = getMenuItems();
    if (countBadge) {
        countBadge.textContent = `${items.length} Items`;
    }

    if (items.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem;">No menu items available.</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = items.map((item, index) => `
        <tr>
            <td>
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="table-thumb" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';">
            </td>
            <td>
                <strong style="color: var(--white);">${escapeHtml(item.name)}</strong>
                <div style="font-size: 0.8rem; color: var(--silver); max-width: 280px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                    ${escapeHtml(item.description)}
                </div>
            </td>
            <td>
                <span class="table-badge">${escapeHtml(item.category)}</span>
            </td>
            <td>
                <strong style="color: var(--marigold-gold);">₹${Number(item.price).toLocaleString('en-IN')}</strong>
            </td>
            <td style="color: var(--silver); font-size: 0.8rem;">
                #${item.id || index + 1}
            </td>
        </tr>
    `).join('');
}

/**
 * Handle Admin Add Menu Item Form Submission
 */
function setupAdminForm() {
    const form = document.getElementById('add-menu-form');
    if (!form) return;

    const alertBox = document.getElementById('form-alert');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nameInput = document.getElementById('foodName');
        const descInput = document.getElementById('foodDesc');
        const priceInput = document.getElementById('foodPrice');
        const categoryInput = document.getElementById('foodCategory');
        const imageHidden = document.getElementById('foodImageBase64');
        const imagePreview = document.getElementById('imagePreview');
        const fileNameDisplay = document.getElementById('fileNameDisplay');

        const name = nameInput.value.trim();
        const description = descInput.value.trim();
        const price = parseFloat(priceInput.value);
        const category = categoryInput.value;
        const image = imageHidden ? imageHidden.value : '';

        // Validation
        if (!name || !description || !category || !image || isNaN(price)) {
            showAlert("Please fill out all required fields and upload a food image.", "error");
            return;
        }

        if (price <= 0) {
            showAlert("Price must be a valid positive amount greater than ₹0.", "error");
            priceInput.focus();
            return;
        }

        // Construct new item
        const newItem = {
            id: Date.now(),
            name,
            description,
            price: Math.round(price * 100) / 100,
            category,
            image
        };

        // Save locally
        addMenuItem(newItem);

        // Feedback & UI Update
        showAlert(`Dish "${name}" added successfully to the menu!`, "success");
        form.reset();
        if (imageHidden) imageHidden.value = '';
        if (imagePreview) imagePreview.style.display = 'none';
        if (fileNameDisplay) fileNameDisplay.textContent = 'Click to upload dish photo';
        renderAdminTable();
    });

    function showAlert(message, type) {
        if (!alertBox) return;
        alertBox.textContent = message;
        alertBox.className = `alert-message alert-${type}`;
        alertBox.style.display = 'block';

        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000);
    }
}

/**
 * Setup Image File Upload with Instant Local Base64 Conversion and Preview
 */
function setupImageUpload() {
    const fileInput = document.getElementById('foodImageFile');
    const imagePreview = document.getElementById('imagePreview');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const hiddenBase64 = document.getElementById('foodImageBase64');

    if (!fileInput) return;

    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
                fileInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const base64Data = e.target.result;
                if (hiddenBase64) hiddenBase64.value = base64Data;
                if (imagePreview) {
                    imagePreview.src = base64Data;
                    imagePreview.style.display = 'block';
                }
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = `Selected: ${file.name}`;
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

/**
 * Mobile navigation menu toggle
 */
function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
            const expanded = toggle.getAttribute('aria-expanded') === 'true' || false;
            toggle.setAttribute('aria-expanded', !expanded);
        });

        // Close menu on mobile when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

/**
 * Admin Authentication Credentials
 */
const AUTH_KEY = 'ROYAL_MARIGOLD_ADMIN_AUTH';
const ADMIN_USER = 'spenza';
const ADMIN_PASS = 'spenza123';

/**
 * Check admin authentication state and toggle views
 */
function checkAdminAuth() {
    const loginView = document.getElementById('admin-login-view');
    const dashboardView = document.getElementById('admin-dashboard-view');
    if (!loginView || !dashboardView) return;

    const isAuthenticated = sessionStorage.getItem(AUTH_KEY) === 'true';

    if (isAuthenticated) {
        loginView.style.display = 'none';
        dashboardView.style.display = 'block';
        renderAdminTable();
    } else {
        loginView.style.display = 'block';
        dashboardView.style.display = 'none';
    }
}

/**
 * Setup Admin Login and Logout Handlers
 */
function setupAdminAuth() {
    const loginForm = document.getElementById('admin-login-form');
    const logoutBtn = document.getElementById('admin-logout-btn');
    const loginAlert = document.getElementById('login-alert');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const usernameInput = document.getElementById('adminUsername');
            const passwordInput = document.getElementById('adminPassword');

            const username = usernameInput ? usernameInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            if (username === ADMIN_USER && password === ADMIN_PASS) {
                sessionStorage.setItem(AUTH_KEY, 'true');
                if (loginAlert) {
                    loginAlert.style.display = 'none';
                }
                loginForm.reset();
                checkAdminAuth();
            } else {
                if (loginAlert) {
                    loginAlert.textContent = 'Invalid username or password. Please try again.';
                    loginAlert.className = 'alert-message alert-error';
                    loginAlert.style.display = 'block';
                }
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            sessionStorage.removeItem(AUTH_KEY);
            checkAdminAuth();
        });
    }
}

/**
 * Setup Scroll Animations and Active Navigation Spy
 * Moves the active Wine-Red underline smoothly as the user navigates between sections:
 * Home (#home), About Us (#about), Menu (#menu), and Reach Us (#reach-us)
 */
function setupScrollEffects() {
    const header = document.querySelector('.site-header');
    const sections = [
        document.getElementById('home'),
        document.getElementById('about'),
        document.getElementById('menu'),
        document.getElementById('reach-us')
    ].filter(Boolean);

    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function updateActiveNav() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = header ? header.offsetHeight : 70;

        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Active link scroll spy
        const scrollBottom = window.innerHeight + scrollY;
        const docHeight = document.documentElement.scrollHeight;

        let currentActiveId = 'home';

        // Check if user is scrolled to the bottom of the page
        if (docHeight - scrollBottom < 90) {
            currentActiveId = 'reach-us';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 120;
                const sectionHeight = section.offsetHeight;
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    currentActiveId = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentActiveId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', updateActiveNav);
    // Initial run on page load
    updateActiveNav();

    // Instant click feedback
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // IntersectionObserver for smooth scroll reveals
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for browsers without IntersectionObserver
        revealElements.forEach(el => el.classList.add('active'));
    }
}

/**
 * Secret 4-Tap Admin Trigger
 * Tapping 4 times in quick succession on the SPENZA text near copyright
 * (or on the brand logo) opens the admin panel (admin.html).
 */
function setupSecretAdminTrigger() {
    const copyrightTrigger = document.getElementById('footer-copyright-trigger') || document.getElementById('copyright-spenza');
    const brandLogo = document.querySelector('.brand-logo');

    let tapCount = 0;
    let tapTimeout = null;

    function registerTap(e) {
        tapCount++;

        if (tapTimeout) {
            clearTimeout(tapTimeout);
        }

        if (tapCount >= 4) {
            e.preventDefault();
            e.stopPropagation();
            tapCount = 0;
            window.location.href = 'admin.html';
            return;
        }

        tapTimeout = setTimeout(() => {
            tapCount = 0;
        }, 1500);
    }

    if (copyrightTrigger) {
        copyrightTrigger.addEventListener('click', registerTap);
    }
    if (brandLogo) {
        brandLogo.addEventListener('click', registerTap);
    }
}

/**
 * Setup Privacy Policy Modal
 */
function setupPrivacyModal() {
    const modal = document.getElementById('privacy-policy-modal');
    const openBtns = document.querySelectorAll('.open-privacy-btn');
    const closeBtn = document.querySelector('.privacy-modal-close');

    if (!modal) return;

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

/**
 * Escape HTML to prevent XSS injection
 */
function escapeHtml(string) {
    if (typeof string !== 'string') return String(string);
    return string
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupScrollEffects();
    setupPrivacyModal();
    setupSecretAdminTrigger();

    // Check which page we are on and initialize accordingly
    if (document.getElementById('menu-grid')) {
        renderMenu('All');
        setupCategoryFilters();
    }

    if (document.getElementById('admin-login-view')) {
        setupAdminAuth();
        checkAdminAuth();
        setupAdminForm();
        setupImageUpload();
    }
});
