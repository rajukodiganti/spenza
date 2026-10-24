/**
 * SPENZA Kitchen & Dining - Core JavaScript
 * Handles Navigation, LocalStorage State, Menu Rendering, Filtering, Admin Authentication,
 * Password Visibility Toggle, Image 2 Menu List Manager, and Secret 4-Tap Admin Trigger.
 */

const STORAGE_KEY = 'ROYAL_MARIGOLD_MENU_ITEMS';

// Initial curated menu items with status tags (Matching Image 2 Reference)
const DEFAULT_MENU_ITEMS = [
    {
        id: 1,
        name: "Zafrani Paneer Tikka",
        category: "Starters",
        price: 380,
        tag: "CHEF SPECIAL",
        description: "Charcoal-grilled cottage cheese cubes infused with royal saffron, crushed spices, and marigold cream.",
        image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 2,
        name: "Murgh Malai Sheekh",
        category: "Starters",
        price: 490,
        tag: "BESTSELLER",
        description: "Minced tender chicken skewers flavored with cardamom, white pepper, and smoked silver-leaf butter.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 3,
        name: "Crispy Calamari Royale",
        category: "Starters",
        price: 520,
        tag: "NONE",
        description: "Golden fried calamari rings seasoned with crushed sea salt, lime zest, and marigold pepper relish.",
        image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 4,
        name: "Dal Bukhara Gold",
        category: "Main Course",
        price: 420,
        tag: "BESTSELLER",
        description: "Overnight slow-simmered black lentils infused with smoked butter, cream, and roasted fenugreek.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 5,
        name: "Nalli Rogan Josh",
        category: "Main Course",
        price: 680,
        tag: "CHEF SPECIAL",
        description: "Slow-cooked Kashmiri lamb shanks in an aromatic gravy of rattan jot, dried ginger, and fennel.",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 6,
        name: "Royal Paneer Korma",
        category: "Main Course",
        price: 460,
        tag: "NONE",
        description: "Velvety cashew and melon seed reduction with fresh cottage cheese and hand-picked royal herbs.",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 7,
        name: "Awadhi Dum Gosht Biryani",
        category: "Biryani",
        price: 650,
        tag: "BESTSELLER",
        description: "Aged long-grain basmati rice layered with succulent prime mutton, saffron broth, and seal-cooked in handi.",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 8,
        name: "Nizami Murgh Dum Biryani",
        category: "Biryani",
        price: 540,
        tag: "BESTSELLER",
        description: "Fragrant spiced basmati rice slow-dum cooked with tender chicken, caramelized onions, and fresh mint.",
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 9,
        name: "Subz Shahi Handi Biryani",
        category: "Biryani",
        price: 440,
        tag: "NONE",
        description: "Garden-fresh vegetables and baby potatoes scented with kewra water, rose petals, and whole warm spices.",
        image: "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 10,
        name: "Gold Leaf Shahi Tukda",
        category: "Desserts",
        price: 320,
        tag: "CHEF SPECIAL",
        description: "Crispy ghee-fried brioche soaked in saffron cardamom rabri, garnished with edible silver vark and pistachios.",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 11,
        name: "Saffron Pistachio Kulfi",
        category: "Desserts",
        price: 260,
        tag: "BESTSELLER",
        description: "Traditional dense caramelized milk frozen kulfi enriched with Kashmiri saffron and roasted nut praline.",
        image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 12,
        name: "Marigold Gold Brew",
        category: "Beverages",
        price: 240,
        tag: "REFRESHING",
        description: "Cold-extracted artisan Arabica infused with organic marigold syrup and a hint of vanilla bean.",
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80"
    },
    {
        id: 13,
        name: "Silver Mist Mocktail",
        category: "Beverages",
        price: 280,
        tag: "COOLER",
        description: "Elderflower extract, fresh cucumber ribbon, lime spritz, and effervescent botanical tonic.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80"
    }
];

// Fallback image URL when an external image cannot be loaded
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80";

const CATEGORIES_KEY = 'SPENZA_CUSTOM_CATEGORIES';
const DEFAULT_CATEGORIES = ['Starters', 'Main Course', 'Biryani', 'Desserts', 'Beverages'];
const LAYOUT_KEY = 'SPENZA_MENU_LAYOUT';

let currentCustomerCategory = 'All';

/**
 * Retrieve categories from localStorage or initialize with default categories
 */
function getCategories() {
    try {
        const stored = localStorage.getItem(CATEGORIES_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                const set = new Set([...DEFAULT_CATEGORIES, ...parsed]);
                return Array.from(set);
            }
        }
    } catch(e) {}
    return [...DEFAULT_CATEGORIES];
}

/**
 * Save categories array to localStorage
 */
function saveCategories(cats) {
    try {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cats));
    } catch(e) {}
}

/**
 * Add a new category
 */
function addCategory(name) {
    const clean = (name || '').trim();
    if (!clean) return null;
    const cats = getCategories();
    const existing = cats.find(c => c.toLowerCase() === clean.toLowerCase());
    if (existing) {
        renderAllCategoryUI(existing);
        return existing;
    }
    cats.push(clean);
    saveCategories(cats);
    renderAllCategoryUI(clean);
    return clean;
}

/**
 * Apply layout (grid-2, grid-3, grid-4) synchronously across both Admin Panel and Live Website
 */
function applyGlobalMenuLayout(layout) {
    const validLayout = ['grid-2', 'grid-3', 'grid-4'].includes(layout) ? layout : 'grid-3';

    // Main website menu grid
    const mainGrid = document.getElementById('menu-grid');
    if (mainGrid) {
        mainGrid.classList.remove('grid-2', 'grid-3', 'grid-4');
        mainGrid.classList.add(validLayout);
    }

    // Admin food grid
    const adminGrid = document.getElementById('admin-food-grid');
    if (adminGrid) {
        adminGrid.classList.remove('grid-2', 'grid-3', 'grid-4');
        adminGrid.classList.add(validLayout);
    }

    // Admin layout select dropdown
    const layoutSelect = document.getElementById('adminLayoutSelect');
    if (layoutSelect) {
        layoutSelect.value = validLayout;
    }
}

/**
 * Render Category Tabs and Dropdown dynamically across the site
 */
function renderAllCategoryUI(selectedCategory) {
    const categories = getCategories();

    // 1. Modal Category Select (#foodCategory)
    const catSelect = document.getElementById('foodCategory');
    if (catSelect) {
        const currentVal = selectedCategory !== undefined ? selectedCategory : catSelect.value;
        catSelect.innerHTML = `
            <option value="" disabled ${!currentVal ? 'selected' : ''}>Select a Category</option>
            ${categories.map(c => `<option value="${escapeHtml(c)}" ${currentVal === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
            <option value="__NEW_CATEGORY__">+ Add New Category...</option>
        `;
    }

    // 2. Admin Category Tabs (#adminCategoryTabs)
    const adminTabsContainer = document.getElementById('adminCategoryTabs');
    if (adminTabsContainer) {
        adminTabsContainer.innerHTML = `
            <button type="button" class="admin-cat-tab ${currentAdminCategory === 'All' ? 'active' : ''}" data-category="All">ALL ITEMS</button>
            ${categories.map(c => `
                <button type="button" class="admin-cat-tab ${currentAdminCategory === c ? 'active' : ''}" data-category="${escapeHtml(c)}">${escapeHtml(c.toUpperCase())}</button>
            `).join('')}
            <button type="button" class="admin-cat-tab-add" id="adminAddCategoryTabBtn" title="Create a new category for menu">+ NEW CATEGORY</button>
        `;
        // Re-attach admin category click listeners
        adminTabsContainer.querySelectorAll('.admin-cat-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                adminTabsContainer.querySelectorAll('.admin-cat-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const cat = tab.getAttribute('data-category');
                renderAdminFoodGrid(cat, currentAdminSearch);
            });
        });
        const addCatTabBtn = document.getElementById('adminAddCategoryTabBtn');
        if (addCatTabBtn) {
            addCatTabBtn.addEventListener('click', () => {
                const newCat = prompt('Enter new menu category name (e.g. Tandoori Specials, Mocktails):');
                if (newCat && newCat.trim()) {
                    const added = addCategory(newCat.trim());
                    showGlobalAdminAlert(`Category "${added}" added successfully!`, 'success');
                }
            });
        }
    }

    // 3. Customer Website Category Tabs (.category-tabs)
    const customerTabs = document.querySelector('.category-tabs');
    if (customerTabs) {
        customerTabs.innerHTML = `
            <button class="category-btn ${currentCustomerCategory === 'All' ? 'active' : ''}" data-category="All">All Items</button>
            ${categories.map(c => `
                <button class="category-btn ${currentCustomerCategory === c ? 'active' : ''}" data-category="${escapeHtml(c)}">${escapeHtml(c)}</button>
            `).join('')}
        `;
        setupCategoryFilters();
    }
}

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
 * Render Menu Cards on menu.html and index.html
 */
function renderMenu(categoryFilter = currentCustomerCategory) {
    const container = document.getElementById('menu-grid');
    if (!container) return;

    currentCustomerCategory = categoryFilter;
    const items = getMenuItems();
    const filteredItems = categoryFilter === 'All' 
        ? items 
        : items.filter(item => item.category.toLowerCase() === categoryFilter.toLowerCase());

    if (filteredItems.length === 0) {
        container.innerHTML = `
            <div class="empty-menu-msg" style="grid-column: 1/-1; text-align: center; color: var(--sand-muted); padding: 3.5rem 1rem;">
                <p style="font-size: 1.25rem; color: var(--light-sand); margin-bottom: 0.5rem;">No dishes found under <strong>${escapeHtml(categoryFilter)}</strong></p>
                <p style="font-size: 0.9rem;">Please choose another culinary category above.</p>
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
 * Setup category filter button listeners on customer menu
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
 * Helper to determine CSS class for status badges
 */
function getTagClass(tag) {
    if (!tag) return '';
    const lower = tag.toLowerCase();
    if (lower.includes('bestseller')) return 'badge-bestseller';
    if (lower.includes('refreshing')) return 'badge-refreshing';
    if (lower.includes('cooler')) return 'badge-cooler';
    if (lower.includes('special')) return 'badge-special';
    return 'badge-special';
}

/**
 * Image 2: Render Admin Food Grid
 * Displays dishes as interactive cards with status tags, layout support, and deletion
 */
let currentAdminCategory = 'All';
let currentAdminSearch = '';

function renderAdminFoodGrid(filterCategory = currentAdminCategory, searchQuery = currentAdminSearch) {
    const gridContainer = document.getElementById('admin-food-grid');
    if (!gridContainer) return;

    currentAdminCategory = filterCategory;
    currentAdminSearch = searchQuery;

    const items = getMenuItems();
    const query = (searchQuery || '').trim().toLowerCase();

    const filtered = items.filter(item => {
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        const matchesSearch = !query || 
            item.name.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            (item.tag && item.tag.toLowerCase().includes(query));
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        gridContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--sand-muted); padding: 4rem 1rem;">
                <p style="font-size: 1.25rem; color: var(--light-sand); margin-bottom: 0.5rem;">No food dishes found</p>
                <p style="font-size: 0.9rem;">Try selecting another category or clear your search term.</p>
            </div>
        `;
        return;
    }

    gridContainer.innerHTML = filtered.map(item => {
        const tag = item.tag && item.tag !== 'NONE' ? item.tag : '';
        const tagClass = getTagClass(tag);
        const tagHtml = tag ? `<span class="badge-tag ${tagClass}">${escapeHtml(tag)}</span>` : '';

        return `
            <div class="admin-food-card" data-id="${item.id}">
                <div class="admin-card-img-wrap">
                    ${tagHtml}
                    <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="admin-card-img" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';">
                </div>
                <div class="admin-card-body">
                    <span class="admin-dish-category">${escapeHtml(item.category)}</span>
                    <div class="admin-card-head">
                        <h3 class="admin-dish-name">${escapeHtml(item.name)}</h3>
                        <span class="admin-dish-price">₹${Number(item.price).toLocaleString('en-IN')}</span>
                    </div>
                    <p class="admin-dish-desc">${escapeHtml(item.description)}</p>
                    <div class="admin-card-foot">
                        <span class="admin-dish-id">ID: #${item.id}</span>
                        <div class="admin-card-actions">
                            <button type="button" class="btn-edit-dish" data-id="${item.id}" title="Edit dish details">
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                </svg>
                                Edit
                            </button>
                            <button type="button" class="btn-delete-dish" data-id="${item.id}" title="Remove dish from menu">
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Attach edit button listeners
    gridContainer.querySelectorAll('.btn-edit-dish').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            openEditDishModal(id);
        });
    });

    // Attach delete button listeners
    gridContainer.querySelectorAll('.btn-delete-dish').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            deleteMenuItem(id);
        });
    });
}

/**
 * Open Modal in Edit Mode for a Menu Item
 */
function openEditDishModal(id) {
    const items = getMenuItems();
    const dish = items.find(item => String(item.id) === String(id));
    if (!dish) return;

    const modal = document.getElementById('add-food-modal');
    const modalTitle = document.getElementById('modalTitleText');
    const modalSubtitle = document.getElementById('modalSubtitleText');
    const submitBtn = document.getElementById('modalSubmitBtn');
    const editDishIdInput = document.getElementById('editDishId');

    const nameInput = document.getElementById('foodName');
    const descInput = document.getElementById('foodDesc');
    const priceInput = document.getElementById('foodPrice');
    const categoryInput = document.getElementById('foodCategory');
    const tagInput = document.getElementById('foodTag');
    const imageHidden = document.getElementById('foodImageBase64');
    const imagePreview = document.getElementById('imagePreview');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const formAlert = document.getElementById('form-alert');

    if (formAlert) formAlert.style.display = 'none';

    if (editDishIdInput) editDishIdInput.value = dish.id;
    if (modalTitle) modalTitle.textContent = '✏️ Edit Menu Item';
    if (modalSubtitle) modalSubtitle.textContent = `Modify details for "${dish.name}". Changes update immediately.`;
    if (submitBtn) submitBtn.textContent = 'Update Menu Item';

    if (nameInput) nameInput.value = dish.name;
    if (descInput) descInput.value = dish.description;
    if (priceInput) priceInput.value = dish.price;
    if (categoryInput) {
        renderAllCategoryUI(dish.category);
        categoryInput.value = dish.category;
    }
    if (tagInput) tagInput.value = dish.tag || 'NONE';
    if (imageHidden) imageHidden.value = dish.image;

    const inputWrap = document.getElementById('newCategoryInputWrap');
    if (inputWrap) inputWrap.style.display = 'none';

    if (imagePreview) {
        imagePreview.src = dish.image;
        imagePreview.style.display = 'block';
    }
    if (fileNameDisplay) {
        fileNameDisplay.textContent = 'Current dish photo loaded (click to replace)';
    }

    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Delete menu item from localStorage and re-render
 */
function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to remove this dish from the menu?')) return;
    const items = getMenuItems();
    const updated = items.filter(item => String(item.id) !== String(id));
    saveMenuItems(updated);
    renderAdminFoodGrid();
    showGlobalAdminAlert('Dish removed successfully from the menu.', 'success');
}

/**
 * Display alert banner in admin dashboard
 */
function showGlobalAdminAlert(msg, type = 'success') {
    const alertBox = document.getElementById('admin-global-alert');
    if (!alertBox) return;
    alertBox.textContent = msg;
    alertBox.className = `alert-message alert-${type}`;
    alertBox.style.display = 'block';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 4000);
}

/**
 * Image 2: Setup Admin Food Manager UI Handlers
 * Handles real-time search, category tabs, layout grid selector, and add modal dialog
 */
function setupAdminManagerUI() {
    // Real-time search
    const searchInput = document.getElementById('adminSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderAdminFoodGrid(currentAdminCategory, e.target.value);
        });
    }

    // Category filter tabs
    const catTabs = document.querySelectorAll('.admin-cat-tab');
    catTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            catTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.getAttribute('data-category');
            renderAdminFoodGrid(cat, currentAdminSearch);
        });
    });

    // Layout Dropdown (Synchronized with Live Website)
    const layoutSelect = document.getElementById('adminLayoutSelect');
    if (layoutSelect) {
        layoutSelect.addEventListener('change', () => {
            const val = layoutSelect.value;
            localStorage.setItem(LAYOUT_KEY, val);
            applyGlobalMenuLayout(val);
            showGlobalAdminAlert(`Menu layout set to ${val.replace('grid-', '')} columns (applied to admin & live site)!`, 'success');
        });
    }

    // Add Food Modal Open / Close
    const modal = document.getElementById('add-food-modal');
    const openBtn = document.getElementById('openAddDishModalBtn');
    const closeBtn = document.getElementById('closeAddFoodModalBtn');
    const cancelBtn = document.getElementById('cancelAddFoodBtn');

    if (modal && openBtn) {
        openBtn.addEventListener('click', () => {
            // Reset to Add mode
            const editDishIdInput = document.getElementById('editDishId');
            const modalTitle = document.getElementById('modalTitleText');
            const modalSubtitle = document.getElementById('modalSubtitleText');
            const submitBtn = document.getElementById('modalSubmitBtn');
            const form = document.getElementById('add-menu-form');
            const imageHidden = document.getElementById('foodImageBase64');
            const imagePreview = document.getElementById('imagePreview');
            const fileNameDisplay = document.getElementById('fileNameDisplay');
            const inputWrap = document.getElementById('newCategoryInputWrap');

            if (editDishIdInput) editDishIdInput.value = '';
            if (modalTitle) modalTitle.textContent = '+ Add New Food Item';
            if (modalSubtitle) modalSubtitle.textContent = 'Upload a dish to SPENZA Kitchen menu. Items are saved locally and immediately available across the site.';
            if (submitBtn) submitBtn.textContent = 'Add Menu Item';

            if (form) form.reset();
            renderAllCategoryUI('');
            if (inputWrap) inputWrap.style.display = 'none';
            if (imageHidden) imageHidden.value = '';
            if (imagePreview) imagePreview.style.display = 'none';
            if (fileNameDisplay) fileNameDisplay.textContent = 'Click to upload dish photo';

            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            const formAlert = document.getElementById('form-alert');
            if (formAlert) formAlert.style.display = 'none';
        });

        const closeModal = () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
}

/**
 * Setup category creation handlers inside the Add/Edit dish modal
 */
function setupCategoryAddHandlers() {
    const catSelect = document.getElementById('foodCategory');
    const toggleBtn = document.getElementById('toggleAddCustomCatBtn');
    const inputWrap = document.getElementById('newCategoryInputWrap');
    const inputField = document.getElementById('newCategoryInput');
    const saveBtn = document.getElementById('saveNewCategoryBtn');
    const cancelBtn = document.getElementById('cancelNewCategoryBtn');

    if (!catSelect || !inputWrap) return;

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = inputWrap.style.display === 'none' || !inputWrap.style.display;
            inputWrap.style.display = isHidden ? 'block' : 'none';
            if (isHidden && inputField) {
                inputField.focus();
            }
        });
    }

    catSelect.addEventListener('change', () => {
        if (catSelect.value === '__NEW_CATEGORY__') {
            inputWrap.style.display = 'block';
            if (inputField) {
                inputField.value = '';
                inputField.focus();
            }
        } else {
            inputWrap.style.display = 'none';
        }
    });

    const handleSave = () => {
        if (!inputField) return;
        const val = inputField.value.trim();
        if (!val) {
            alert('Please enter a category name.');
            inputField.focus();
            return;
        }
        const added = addCategory(val);
        inputWrap.style.display = 'none';
        inputField.value = '';
        renderAllCategoryUI(added);
        if (catSelect) catSelect.value = added;
    };

    if (saveBtn) saveBtn.addEventListener('click', handleSave);
    if (inputField) {
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSave();
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            inputWrap.style.display = 'none';
            if (inputField) inputField.value = '';
            if (catSelect.value === '__NEW_CATEGORY__') {
                catSelect.value = '';
            }
        });
    }
}

/**
 * Handle Admin Add/Edit Menu Item Form Submission
 */
function setupAdminForm() {
    const form = document.getElementById('add-menu-form');
    if (!form) return;

    const alertBox = document.getElementById('form-alert');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const editDishIdInput = document.getElementById('editDishId');
        const nameInput = document.getElementById('foodName');
        const descInput = document.getElementById('foodDesc');
        const priceInput = document.getElementById('foodPrice');
        const categoryInput = document.getElementById('foodCategory');
        const tagInput = document.getElementById('foodTag');
        const imageHidden = document.getElementById('foodImageBase64');
        const imagePreview = document.getElementById('imagePreview');
        const fileNameDisplay = document.getElementById('fileNameDisplay');

        const editDishId = editDishIdInput ? editDishIdInput.value.trim() : '';
        const name = nameInput.value.trim();
        const description = descInput.value.trim();
        const price = parseFloat(priceInput.value);
        const category = categoryInput.value;
        const tag = tagInput ? tagInput.value : 'NONE';
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

        if (editDishId) {
            // Edit existing dish
            const items = getMenuItems();
            const index = items.findIndex(item => String(item.id) === String(editDishId));
            if (index !== -1) {
                items[index] = {
                    ...items[index],
                    name,
                    description,
                    price: Math.round(price * 100) / 100,
                    category,
                    tag: tag !== 'NONE' ? tag : '',
                    image
                };
                saveMenuItems(items);
                showAlert(`Dish "${name}" updated successfully!`, "success");
                renderAdminFoodGrid(currentAdminCategory, currentAdminSearch);

                setTimeout(() => {
                    const modal = document.getElementById('add-food-modal');
                    if (modal) {
                        modal.classList.remove('show');
                        document.body.style.overflow = 'auto';
                    }
                    showGlobalAdminAlert(`Dish "${name}" updated successfully!`, "success");
                }, 1000);
                return;
            }
        }

        // Construct new item
        const newItem = {
            id: Date.now(),
            name,
            description,
            price: Math.round(price * 100) / 100,
            category,
            tag: tag !== 'NONE' ? tag : '',
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

        renderAdminFoodGrid(currentAdminCategory, currentAdminSearch);

        // Close modal after 1.2s and show global alert
        setTimeout(() => {
            const modal = document.getElementById('add-food-modal');
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
            showGlobalAdminAlert(`Dish "${name}" added to menu!`, "success");
        }, 1200);
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
 * Password Visibility Toggle
 */
function setupPasswordToggle() {
    const toggleBtn = document.getElementById('togglePasswordBtn');
    const passwordInput = document.getElementById('adminPassword');
    const eyeOpen = document.getElementById('eyeIconOpen');
    const eyeClosed = document.getElementById('eyeIconClosed');

    if (!toggleBtn || !passwordInput) return;

    toggleBtn.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            if (eyeOpen) eyeOpen.style.display = 'none';
            if (eyeClosed) eyeClosed.style.display = 'inline-block';
        } else {
            passwordInput.type = 'password';
            if (eyeOpen) eyeOpen.style.display = 'inline-block';
            if (eyeClosed) eyeClosed.style.display = 'none';
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
        renderAdminFoodGrid();
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

    // Initialize layout and categories from localStorage
    const savedLayout = localStorage.getItem(LAYOUT_KEY) || 'grid-3';
    applyGlobalMenuLayout(savedLayout);
    renderAllCategoryUI();

    // Check which page we are on and initialize accordingly
    if (document.getElementById('menu-grid')) {
        renderMenu('All');
        setupCategoryFilters();
    }

    if (document.getElementById('admin-login-view')) {
        setupPasswordToggle();
        setupAdminAuth();
        checkAdminAuth();
        setupAdminManagerUI();
        setupCategoryAddHandlers();
        setupAdminForm();
        setupImageUpload();
    }

    // Sync across open tabs in real-time
    window.addEventListener('storage', (e) => {
        if (e.key === LAYOUT_KEY) {
            applyGlobalMenuLayout(e.newValue);
        }
        if (e.key === CATEGORIES_KEY) {
            renderAllCategoryUI();
        }
        if (e.key === STORAGE_KEY) {
            if (document.getElementById('menu-grid')) renderMenu();
            if (document.getElementById('admin-food-grid')) renderAdminFoodGrid();
        }
    });
});
