// Main Application Controller
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
    
    // Set up page-specific functionality
    setupPage();
});

// Global Variables
let currentUser = null;
let products = [];
let cart = [];
let orders = [];

// Initialize Application
function initApp() {
    // Load user data if logged in
    loadUser();
    
    // Load product data
    loadProducts();
    
    // Load cart from localStorage
    loadCart();
    
    // Load orders if user is logged in
    if (currentUser) {
        loadOrders();
    }
    
    // Set up event listeners for navigation
    setupNavigation();
    
    // Initialize search functionality
    initSearch();
    
    // Update UI based on user state
    updateUI();
}

function setupPage() {
  const path = window.location.pathname.split('/').pop();
  
  switch(path) {
    case 'index.html':
    case '':
      setupHomePage();
      break;
      
    case 'product.html':
      // Immediately-invoked function expression
      (function setupProductPage() {
        let currentProductId = null;

        function checkAndLoadProduct() {
          const productId = getProductIdFromUrl();
          
          if (!productId) {
            window.location.href = 'index.html';
            return;
          }
          
          if (productId !== currentProductId) {
            currentProductId = productId;
            loadProductDetails(productId);
            setupProductGallery();
            setupProductTabs();
            setupAddToCart();
          }
        }

        // Initial load
        checkAndLoadProduct();
        
        // Handle back/forward navigation
        window.addEventListener('popstate', checkAndLoadProduct);
        
        // Check navigation type
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0 && navEntries[0].type === "navigate") {
          window.location.reload();
        }
      })();
      break;
      
    default:
      console.log('Unknown page:', path);
  }
}

// Setup Cart Page
function setupCartPage() {
    // Display cart items
    displayCartItems();
    
    // Set up cart item controls
    setupCartItemControls();
    
    // Set up promo code functionality
    setupPromoCode();
    
    // Set up checkout button
    setupCheckoutButton();
    
    // Display recently viewed items
    displayRecentlyViewed();
}

// Setup Orders Page
function setupOrdersPage() {
    // Display order history
    displayOrderHistory();
    
    // Set up order filtering
    setupOrderFilters();
    
    // Set up order actions
    setupOrderActions();
}

// Setup Admin Page
function setupAdminPage() {
    // Load admin stats
    loadAdminStats();
    
    // Set up admin charts
    setupAdminCharts();
    
    // Display recent orders
    displayRecentOrders();
    
    // Display top products
    displayTopProducts();
    
    // Set up admin sidebar toggle for mobile
    setupAdminSidebarToggle();
}

// Navigation Functions
function setupNavigation() {
    // Handle navigation links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default for demo purposes
            e.preventDefault();
            
            // Get the target page
            const target = this.getAttribute('href');
            
            // Navigate to the target page
            navigateTo(target);
        });
    });
    
    // Handle logo click
    document.querySelector('.logo a').addEventListener('click', function(e) {
        e.preventDefault();
        navigateTo('index.html');
    });
}

function navigateTo(page) {
    // In a real app, this would use a router or load content dynamically
    window.location.href = page;
}

// User Management
function loadUser() {
    // In a real app, this would check for a logged-in user via session or token
    const userData = localStorage.getItem('currentUser');
    
    if (userData) {
        currentUser = JSON.parse(userData);
    }
}

function loginUser(email, password) {
    // In a real app, this would make an API call
    // For demo, we'll use mock data
    const mockUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', isAdmin: false },
        { id: 2, name: 'Admin User', email: 'admin@example.com', isAdmin: true }
    ];
    
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUI();
        return true;
    }
    
    return false;
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
}

function updateUI() {
    // Update user display
    const userElements = document.querySelectorAll('.user-actions a');
    
    if (currentUser) {
        userElements[0].innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        userElements[0].href = '#';
        userElements[0].addEventListener('click', function(e) {
            e.preventDefault();
            // Show account dropdown or navigate to account page
        });
        
        // Show logout option
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign Out';
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
        
        // Replace or add logout link
        if (userElements.length > 3) {
            userElements[2].replaceWith(logoutLink);
        } else {
            document.querySelector('.user-actions').appendChild(logoutLink);
        }
    } else {
        userElements[0].innerHTML = '<i class="fas fa-user"></i> Sign In';
        userElements[0].href = 'login.html'; // Would need a login page
        
        // Remove logout link if present
        if (userElements.length > 3) {
            userElements[2].remove();
        }
    }
    
    // Update cart count
    updateCartCount();
}

// Product Management
function loadProducts() {
    // In a real app, this would be an API call
    // Mock product data
    products = [
        { id: 1, name: 'Apple AirPods Pro (2nd Generation)', price: 199.99, oldPrice: 249.99, category: 'electronics', rating: 4.5, reviews: 1245, image: 'https://imgs.search.brave.com/4UkzQ2Gm9zhfj7tDWGrzS1ZhUmSxREAwCAAB0Nhymd4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9pbGx1c3RyYXRp/b24tYWlycG9kcy1w/cm8tMmctd2l0aG91/dC1iYWNrZ3JvdW5k/LWdlbmVyYXRpdmUt/YWlfNzU2NDA1LTcw/MTc5LmpwZz9zZW10/PWFpc19pdGVtc19i/b29zdGVkJnc9NzQw',
            images: [
      "assets/airpodsimages/airpods1.png",  // Main image (index 0)
      "assets/airpodsimages/airpod4.webp",      // Thumbnail 1 (index 1)
      "assets/airpodsimages/airpods2.png",      // Thumbnail 2 (index 2)
      "assets/airpodsimages/airpods3.png"       // Thumbnail 3 (index 3)
    ],
            description: 'Active Noise Cancellation blocks outside noise...', features: ['Active Noise Cancellation', 'Transparency mode', 'Spatial audio'] },
        { id: 2, name: 'Samsung 55" 4K Smart TV', price: 499.99, oldPrice: 599.99, category: 'electronics', rating: 4.0, reviews: 892, image: 'https://imgs.search.brave.com/jJ3FtIEDfioe0Qx2YFJLbqkKmZJ_xxLZQjm6zW1P3b0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/OTFibFNpckVqT0wu/anBn', 
            images: [
      "https://imgs.search.brave.com/jJ3FtIEDfioe0Qx2YFJLbqkKmZJ_xxLZQjm6zW1P3b0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/OTFibFNpckVqT0wu/anBn",  // Main image (index 0)
      "assets/samsungtvimages/samsungtv2.webp",      // Thumbnail 1 (index 1)
      "assets/samsungtvimages/samsung1.webp",      // Thumbnail 2 (index 2)
      "assets/samsungtvimages/samsungtv3webp.webp"       // Thumbnail 3 (index 3)
    ],
            description: 'Crystal clear 4K resolution...', features: ['4K UHD resolution', 'Smart TV capabilities', 'HDR'] },
        { id: 3, name: 'Instant Pot Duo 7-in-1', price: 79.99, oldPrice: 99.99, category: 'home', rating: 4.8, reviews: 2453, image: 'https://imgs.search.brave.com/id7G0a7b50yWnkgjQtZghfB7aRHyB9mSfee4sCxHSJM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/MzFrSS1IOVZoMEwu/anBn',
            images: [
      "https://imgs.search.brave.com/id7G0a7b50yWnkgjQtZghfB7aRHyB9mSfee4sCxHSJM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/MzFrSS1IOVZoMEwu/anBn",  // Main image (index 0)
      "assets/instantpot/instantpot1.webp",      // Thumbnail 1 (index 1)
      "assets/instantpot/instantpot2.webp",      // Thumbnail 2 (index 2)
      "assets/instantpot/instantpot3.webp"       // Thumbnail 3 (index 3)
    ],
            description: '7-in-1 functionality...', features: ['Pressure cooker', 'Slow cooker', 'Rice cooker'] },
        { id: 4, name: 'Nintendo Switch - Neon', price: 299.99, category: 'electronics', rating: 4.7, reviews: 1876, image: 'https://imgs.search.brave.com/a6N8m4En84Th-PBUiLiIRBctVYZ7rjHeSmm8be7eCfE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nYW1lc3RvcC5j/b20vaS9nYW1lc3Rv/cC8xMTA5NTgxOV9B/TFQwMS9OaW50ZW5k/by1Td2l0Y2gtQ29u/c29sZT8kcGRwJA',
             images: [
      "https://imgs.search.brave.com/a6N8m4En84Th-PBUiLiIRBctVYZ7rjHeSmm8be7eCfE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nYW1lc3RvcC5j/b20vaS9nYW1lc3Rv/cC8xMTA5NTgxOV9B/TFQwMS9OaW50ZW5k/by1Td2l0Y2gtQ29u/c29sZT8kcGRwJA",  // Main image (index 0)
      "assets/neo/neo1.webp",      // Thumbnail 1 (index 1)
      "assets/neo/neo2.webp",      // Thumbnail 2 (index 2)
      "assets/neo/neo3.webp"       // Thumbnail 3 (index 3)
    ],
            description: 'Hybrid gaming console...', features: ['Portable and docked play', 'Joy-Con controllers', 'Multiplayer'] },
        { id: 5, name: 'Apple AirPods (3rd Generation)', price: 169.99, category: 'electronics', rating: 4.3, reviews: 876, image: 'https://imgs.search.brave.com/3C3I-XiSMu70BwIpDVG2lnwcDGrh0OY-iqCFMSZCLY8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pNS53/YWxtYXJ0aW1hZ2Vz/LmNvbS9zZW8vQXBw/bGUtQWlyUG9kcy0z/cmQtR2VuZXJhdGlv/bl82Nzc2YTQyMi0x/MWFmLTRkZmMtOGFl/Zi00MGMwYjRlYTcx/YWMuYzBjMmYzMmEx/ZWI2YzcyZWIyODU4/MjQzNjA2MWQ0ZTYu/anBlZz9vZG5IZWln/aHQ9NTczJm9kbldp/ZHRoPTU3MyZvZG5C/Zz1GRkZGRkY',
            images: [
      "https://imgs.search.brave.com/3C3I-XiSMu70BwIpDVG2lnwcDGrh0OY-iqCFMSZCLY8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pNS53/YWxtYXJ0aW1hZ2Vz/LmNvbS9zZW8vQXBw/bGUtQWlyUG9kcy0z/cmQtR2VuZXJhdGlv/bl82Nzc2YTQyMi0x/MWFmLTRkZmMtOGFl/Zi00MGMwYjRlYTcx/YWMuYzBjMmYzMmEx/ZWI2YzcyZWIyODU4/MjQzNjA2MWQ0ZTYu/anBlZz9vZG5IZWln/aHQ9NTczJm9kbldp/ZHRoPTU3MyZvZG5C/Zz1GRkZGRkY",  // Main image (index 0)
      "assets/Apple airpods(3rd gen)/airpod1.webp",      // Thumbnail 1 (index 1)
      "assets/Apple airpods(3rd gen)/airpods2.webp",      // Thumbnail 2 (index 2)
      "assets/Apple airpods(3rd gen)/airpods3.webp"       // Thumbnail 3 (index 3)
    ],
            description: 'Spatial audio with dynamic head tracking...', features: ['Spatial audio', 'Sweat and water resistant', 'Long battery life'] },
        { id: 6, name: 'Sony WH-1000XM4 Headphones', price: 348.00, oldPrice: 399.99, category: 'electronics', rating: 4.9, reviews: 1543, image: 'https://m.media-amazon.com/images/I/51JNqP2C4rL.__AC_SY445_SX342_QL70_FMwebp_.jpg', 
             images: [
      "https://m.media-amazon.com/images/I/51JNqP2C4rL.__AC_SY445_SX342_QL70_FMwebp_.jpg",  // Main image (index 0)
      "assets/sonyheadphones/sony4.jpg",      // Thumbnail 1 (index 1)
      "assets/sonyheadphones/sony5.jpg",      // Thumbnail 2 (index 2)
      "assets/sonyheadphones/sony6.jpg"       // Thumbnail 3 (index 3)
    ],
            description: 'Industry-leading noise cancellation...', features: ['Noise cancellation', '30-hour battery', 'Touch controls'] },
        { id: 7, name: 'Apple AirPods Max', price: 499.99, category: 'electronics', rating: 4.6, reviews: 932, image: 'https://ideogram.ai/assets/progressive-image/fast/response/5f9p4SFmSq6s_ssLTkwDWQ', 
             images: [
      "assets/Apple AirPods Max/applehead1.jpg",  // Main image (index 0)
      "assets/Apple AirPods Max/applehead2.jpg",      // Thumbnail 1 (index 1)
      "assets/Apple AirPods Max/applehead3.jpg",      // Thumbnail 2 (index 2)
      "assets/Apple AirPods Max/applehead4.jpg"       // Thumbnail 3 (index 3)
    ],
            description: 'High-fidelity audio...', features: ['Active Noise Cancellation', 'Transparency mode', 'Spatial audio'] },
        { id: 8, name: 'Beats Fit Pro', price: 199.99, category: 'electronics', rating: 4.2, reviews: 654, image: 'https://imgs.search.brave.com/aau2IRkgJ0IGu-V5l5jPlp0pazE0rSGvr0L-VgTMFmI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YmVhdHNieWRyZS5j/b20vY29udGVudC9k/YW0vYmVhdHMvd2Vi/L3Byb2R1Y3QvZWFy/YnVkcy9iZWF0cy1m/aXQtcHJvL3BkcC9m/aXRwcm8tcGRwLXAw/Mi5wbmcubGFyZ2Uu/MngucG5n', 
             images: [
      "https://imgs.search.brave.com/aau2IRkgJ0IGu-V5l5jPlp0pazE0rSGvr0L-VgTMFmI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YmVhdHNieWRyZS5j/b20vY29udGVudC9k/YW0vYmVhdHMvd2Vi/L3Byb2R1Y3QvZWFy/YnVkcy9iZWF0cy1m/aXQtcHJvL3BkcC9m/aXRwcm8tcGRwLXAw/Mi5wbmcubGFyZ2Uu/MngucG5n",  // Main image (index 0)
      "assets/Beats Fit Pro/beatfitpro1.jpg",      // Thumbnail 1 (index 1)
      "assets/Beats Fit Pro/beatfitpro2.jpg",      // Thumbnail 2 (index 2)
      "assets/Beats Fit Pro/beatfitpro3.jpg"       // Thumbnail 3 (index 3)
    ],
            description: 'Secure-fit wingtips...', features: ['Active Noise Cancellation', 'Sweat and water resistant', 'Long battery life'] },
        { id: 9, name: 'Apple Watch Series 8', price: 399.00, oldPrice: 429.00, category: 'electronics', rating: 4.4, reviews: 932, image: 'https://imgs.search.brave.com/zZCcrNRxfbMmhNKuid7m9kczmjzDAmQHzd3E-5cmHvg/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/Y2l0eXBuZy5jb20v/cHVibGljL3VwbG9h/ZHMvcHJldmlldy9o/ZC1ibHVlLWFwcGxl/LXNtYXJ0LXdhdGNo/LXNlcmllcy02LXBu/Zy03MDQwODE2OTQ2/MjIxNzBvZ2Z1bHVj/eHc1LnBuZz92PTIw/MjUwMjEwMDQ', description: 'Advanced health monitoring...', features: ['Heart rate monitoring', 'ECG', 'Sleep tracking'] },
        { id: 10, name: 'Echo Dot (5th Gen)', price: 49.99, category: 'electronics', rating: 4.5, reviews: 2453, image: 'https://m.media-amazon.com/images/I/710exCeNPJL._AC_SY450_.jpg', description: 'Smart speaker with Alexa...', features: ['Voice control', 'Smart home hub', 'Compact design'] },
        { id: 11, name: 'PlayStation 5 Console', price: 499.99, category: 'electronics', rating: 5.0, reviews: 3210, image: 'https://m.media-amazon.com/images/I/31kTNmpm6vL._SX300_SY300_QL70_FMwebp_.jpg', description: 'Next-gen gaming console...', features: ['4K gaming', 'Ultra-high speed SSD', 'Haptic feedback'] }
    ];
}
//initialize the gallary
function initProductGallery() {
  const productId = getProductIdFromUrl();
  const product = products.find(p => p.id == productId);
  
  if (!product) {
    window.location.href = 'index.html'; // Redirect if product not found
    return;
  }

  loadProductImages(product);
  setupThumbnailInteractions();
  updateProductDetails(product);
}

// ======================
// 2. Load Images
// ======================
function loadProductImages(product) {
  const mainImg = document.querySelector('.main-image img');
  const thumbnailContainer = document.querySelector('.thumbnail-images');
  
  // Set main image (first in array)
  mainImg.src = product.images[0];
  mainImg.alt = `${product.name} - Main View`;

  // Clear existing thumbnails
  thumbnailContainer.innerHTML = '';

  // Generate thumbnails (skip index 0 = main image)
  product.images.slice(1).forEach((imgPath, index) => {
    const thumb = document.createElement('img');
    thumb.src = imgPath;
    thumb.alt = `${product.name} - View ${index + 1}`;
    thumb.className = 'thumbnail';
    thumb.dataset.fullImage = imgPath; // Store full image path
    
    // Highlight first thumbnail by default
    if (index === 0) thumb.classList.add('active');
    
    thumbnailContainer.appendChild(thumb);
  });

  // Hide thumbnail container if no additional images
  if (product.images.length <= 1) {
    thumbnailContainer.style.display = 'none';
  }
}

// ======================
// 3. Thumbnail Click Handler
// ======================
function setupThumbnailInteractions() {
  document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', function() {
      // Update main image
      document.querySelector('.main-image img').src = this.dataset.fullImage;
      
      // Update active thumbnail
      document.querySelectorAll('.thumbnail').forEach(t => 
        t.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// ======================
// 4. Update Product Details
// ======================
function updateProductDetails(product) {
  document.querySelector('.product-info h1').textContent = product.name;
  document.querySelector('.price .current-price').textContent = `$${product.price.toFixed(2)}`;
  document.querySelector('.product-description').textContent = product.description;
  // Update other details...
}

// ======================
// 5. Get Product ID from URL
// ======================
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  return isNaN(id) ? null : id;
}

// ======================
// 6. Error Handling for Broken Images
// ======================
function setupImageErrorHandling() {
  document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
      this.src = 'assets/fallback-image.png'; // Fallback image
      this.style.opacity = '0.7';
    };
  });
}

// ======================
// Initialize on Page Load
// ======================
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('product.html')) {
    initProductGallery();
    setupImageErrorHandling();
  }
});

function displayFeaturedProducts() {
    const featuredContainer = document.querySelector('.featured-products .products-grid');
    
    if (featuredContainer) {
        // Get featured products (first 4 for demo)
        const featured = products.slice(0, 8);
        
        featuredContainer.innerHTML = featured.map(product => `
            <div class="product-card">
                <div class="product-badge">Featured</div>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    ${product.oldPrice ? `<span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>` : ''}
                </div>
                <div class="rating">
                    ${renderStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `).join('');
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.featured-products .add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                addToCart(this.getAttribute('data-id'));
            });
        });
    }
}

function displayDealsOfTheDay() {
    const dealsContainer = document.querySelector('.deals .products-grid');
    
    if (dealsContainer) {
        // Get deals (products with oldPrice for demo)
        const deals = products.filter(p => p.oldPrice).slice(0, 8);
        
        dealsContainer.innerHTML = deals.map(product => `
            <div class="product-card">
                <div class="product-badge">Hot Deal</div>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    <span class="old-price">$${product.oldPrice.toFixed(2)}</span>
                    <span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>
                </div>
                <div class="rating">
                    ${renderStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `).join('');
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.deals .add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                addToCart(this.getAttribute('data-id'));
            });
        });
    }
}

function displayRecommendedProducts() {
    const recommendedContainer = document.querySelector('.recommended-products .products-grid');
    
    if (recommendedContainer) {
        // Get recommended products (last 4 for demo)
        const recommended = products.slice(4);
        
        recommendedContainer.innerHTML = recommended.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    ${product.oldPrice ? `<span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>` : ''}
                </div>
                <div class="rating">
                    ${renderStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `).join('');
        
        // Add event listeners to "Add to Cart" buttons
        document.querySelectorAll('.recommended-products .add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                addToCart(this.getAttribute('data-id'));
            });
        });
    }
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Product Page Functions
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'));
}

function loadProductDetails(productId) {
    const product = products.find(p => p.id == productId);
    
    if (product) {
        // Update product images
        document.querySelector('.main-image img').src = product.image;
        // document.querySelector('.thumbnail-images').innerHTML = `
        //     <img src="${product.image}" alt="Thumbnail 1">
        //     <img src="https://via.placeholder.com/100" alt="Thumbnail 2">
        //     <img src="https://via.placeholder.com/100" alt="Thumbnail 3">
        //     <img src="https://via.placeholder.com/100" alt="Thumbnail 4">
        // `;
        
        // Update product info
        document.querySelector('.product-info h1').textContent = product.name;
        document.querySelector('.brand').textContent = `by ${product.name.split(' ')[0]}`;
        document.querySelector('.rating').innerHTML = `
            ${renderStars(product.rating)}
            <span>${product.rating.toFixed(1)} (${product.reviews} reviews)</span>
            <a href="#reviews">See all reviews</a>
        `;
        
        document.querySelector('.price').innerHTML = `
            <span class="current-price">$${product.price.toFixed(2)}</span>
            ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
            ${product.oldPrice ? `<span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>` : ''}
        `;
        
        document.querySelector('.product-highlights ul').innerHTML = product.features.map(f => `
            <li>${f}</li>
        `).join('');
        
        // Update description tab
        document.querySelector('#description').innerHTML = `
            <h3>Product Description</h3>
            <p>${product.description}</p>
        `;
        
        // Update specifications tab
        document.querySelector('#specs').innerHTML = `
            <h3>Technical Specifications</h3>
            <table>
                <tr>
                    <th>Brand</th>
                    <td>${product.name.split(' ')[0]}</td>
                </tr>
                <tr>
                    <th>Model</th>
                    <td>${product.name}</td>
                </tr>
                <tr>
                    <th>Category</th>
                    <td>${product.category}</td>
                </tr>
                <tr>
                    <th>Price</th>
                    <td>$${product.price.toFixed(2)}</td>
                </tr>
                <tr>
                    <th>Rating</th>
                    <td>${product.rating.toFixed(1)} (${product.reviews} reviews)</td>
                </tr>
            </table>
        `;
    }
}

function setupProductGallery() {
    document.querySelectorAll('.thumbnail-images img').forEach(thumb => {
        thumb.addEventListener('click', function() {
            document.querySelector('.main-image img').src = this.src;
        });
    });
}

function setupProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function setupAddToCart() {
    document.querySelector('.add-to-cart-btn').addEventListener('click', function() {
        const productId = getProductIdFromUrl();
        const quantity = parseInt(document.querySelector('.quantity-selector input').value);
        
        if (productId) {
            addToCart(productId, quantity);
            showToast('Product added to cart!');
        }
    });
    
    document.querySelector('.buy-now-btn').addEventListener('click', function() {
        const productId = getProductIdFromUrl();
        const quantity = parseInt(document.querySelector('.quantity-selector input').value);
        
        if (productId) {
            addToCart(productId, quantity);
            window.location.href = 'cart.html';
        }
    });
}

function displayRelatedProducts(productId) {
    const relatedContainer = document.querySelector('.recommended-products .products-grid');
    
    if (relatedContainer) {
        // Get current product
        const currentProduct = products.find(p => p.id == productId);
        
        if (currentProduct) {
            // Get related products (same category, excluding current)
            const related = products.filter(p => 
                p.category === currentProduct.category && 
                p.id != currentProduct.id
            ).slice(0, 4);
            
            relatedContainer.innerHTML = related.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <div class="price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                        ${product.oldPrice ? `<span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>` : ''}
                    </div>
                    <div class="rating">
                        ${renderStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `).join('');
            
            // Add event listeners to "Add to Cart" buttons
            document.querySelectorAll('.recommended-products .add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    addToCart(this.getAttribute('data-id'));
                });
            });
        }
    }
}

// Cart Functions
// cart.js - Complete Cart Functionality

// Wait for DOM and products to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    loadCart();
    displayCartItems();
    setupCartEventListeners();
    updateCartCount();
    updateCartSummary();
});

// Cart Data Functions
function loadCart() {
    const cartData = localStorage.getItem('cart');
    cart = cartData ? JSON.parse(cartData) : [];
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id == productId);
    if (!product) return false;

    const existingItem = cart.find(item => item.productId == productId && !item.savedForLater);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
            savedForLater: false,
            addedAt: new Date().getTime()
        });
    }

    saveCart();
    updateCartCount();
    return true;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.productId != productId);
    saveCart();
    displayCartItems();
    updateCartCount();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.productId == productId);
    if (!item) return;

    if (newQuantity < 1) {
        removeFromCart(productId);
    } else if (newQuantity > 10) {
        item.quantity = 10;
    } else {
        item.quantity = newQuantity;
    }

    saveCart();
    updateCartSummary();
}

function toggleSaveForLater(productId) {
    const item = cart.find(item => item.productId == productId);
    if (!item) return;

    item.savedForLater = !item.savedForLater;
    saveCart();
    displayCartItems();
}

// Display Functions
function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const savedItemsContainer = document.querySelector('.saved-for-later');
    
    // Filter items
    const inCart = cart.filter(item => !item.savedForLater);
    const savedForLater = cart.filter(item => item.savedForLater);
    
    // Display cart items
    if (inCart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Start shopping to add items to your cart</p>
                <a href="index.html" class="btn">Continue Shopping</a>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = inCart.map(item => createCartItemElement(item)).join('');
    }
    
    // Display saved items
    if (savedForLater.length === 0) {
        savedItemsContainer.innerHTML = '';
    } else {
        savedItemsContainer.innerHTML = `
            <h3>Saved for later (${savedForLater.length})</h3>
            ${savedForLater.map(item => createSavedItemElement(item)).join('')}
        `;
    }
    
    // Update header
    document.querySelector('.cart-header h1').textContent = `Your Cart (${inCart.length} items)`;
    updateCartSummary();
}

function createCartItemElement(item) {
    const product = products.find(p => p.id == item.productId);
    if (!product) return '';
    
    return `
        <div class="cart-item" data-id="${product.id}">
            <div class="item-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/100'">
            </div>
            <div class="item-details">
                <h3 class="item-title">${product.name}</h3>
                <div class="item-price">$${product.price.toFixed(2)}</div>
                <div class="item-availability"><i class="fas fa-check-circle"></i> In stock</div>
                <div class="item-delivery">Free delivery <strong>Tomorrow</strong></div>
                <div class="item-actions">
                    <div class="quantity-selector">
                        <button class="qty-minus">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="10">
                        <button class="qty-plus">+</button>
                    </div>
                    <button class="save-for-later"><i class="far fa-bookmark"></i> Save for later</button>
                    <button class="remove-item"><i class="far fa-trash-alt"></i> Remove</button>
                </div>
            </div>
        </div>
    `;
}

function createSavedItemElement(item) {
    const product = products.find(p => p.id == item.productId);
    if (!product) return '';
    
    return `
        <div class="saved-item" data-id="${product.id}">
            <div class="item-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/100'">
            </div>
            <div class="item-details">
                <h3 class="item-title">${product.name}</h3>
                <div class="item-price">$${product.price.toFixed(2)}</div>
                <div class="item-actions">
                    <button class="move-to-cart">Move to cart</button>
                    <button class="remove-item"><i class="far fa-trash-alt"></i> Remove</button>
                </div>
            </div>
        </div>
    `;
}

// Update Functions
function updateCartCount() {
    const count = cart.reduce((total, item) => {
        return item.savedForLater ? total : total + item.quantity;
    }, 0);
    
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

function updateCartSummary() {
    const inCart = cart.filter(item => !item.savedForLater);
    const subtotal = inCart.reduce((sum, item) => {
        const product = products.find(p => p.id == item.productId);
        return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    const tax = subtotal * 0.07; // Example 7% tax
    const total = subtotal + tax;
    
    if (document.querySelector('.item-count')) {
        document.querySelector('.item-count').textContent = inCart.length;
        document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
        document.querySelector('.total-price').textContent = `$${total.toFixed(2)}`;
    }
}

// Event Listeners
function setupCartEventListeners() {
    // Delegate all cart item interactions
    document.addEventListener('click', function(e) {
        // Quantity minus
        if (e.target.classList.contains('qty-minus')) {
            const item = e.target.closest('[data-id]');
            const input = item.querySelector('input');
            const newQty = parseInt(input.value) - 1;
            updateQuantity(parseInt(item.dataset.id), newQty);
        }
        
        // Quantity plus
        if (e.target.classList.contains('qty-plus')) {
            const item = e.target.closest('[data-id]');
            const input = item.querySelector('input');
            const newQty = parseInt(input.value) + 1;
            updateQuantity(parseInt(item.dataset.id), newQty);
        }
        
        // Save for later
        if (e.target.classList.contains('save-for-later') || e.target.closest('.save-for-later')) {
            const item = e.target.closest('[data-id]');
            toggleSaveForLater(parseInt(item.dataset.id));
        }
        
        // Move to cart
        if (e.target.classList.contains('move-to-cart') || e.target.closest('.move-to-cart')) {
            const item = e.target.closest('[data-id]');
            toggleSaveForLater(parseInt(item.dataset.id));
        }
        
        // Remove item
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const item = e.target.closest('[data-id]');
            removeFromCart(parseInt(item.dataset.id));
        }
    });
    
    // Quantity input changes
    document.addEventListener('change', function(e) {
        if (e.target.matches('.quantity-selector input')) {
            const item = e.target.closest('[data-id]');
            updateQuantity(parseInt(item.dataset.id), parseInt(e.target.value));
        }
    });
    
    // Checkout button
    document.getElementById('checkoutBtn')?.addEventListener('click', function() {
        if (cart.filter(item => !item.savedForLater).length === 0) {
            alert('Your cart is empty!');
            return;
        }
        window.location.href = 'checkout.html';
    });
    
    // Apply promo code
    document.querySelector('.apply-btn')?.addEventListener('click', function() {
        const promoCode = document.querySelector('.promo-code input').value;
        if (promoCode) {
            alert(`Promo code "${promoCode}" applied! (Demo)`);
        }
    });
    
    // Find store button
    document.querySelector('.find-store-btn')?.addEventListener('click', function() {
        alert('Store finder would open here');
    });
}

function displayRecentlyViewed() {
    const recentlyViewedContainer = document.querySelector('.recently-viewed .products-grid');
    
    if (recentlyViewedContainer) {
        // Get recently viewed from localStorage
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        
        // Get products that match the IDs
        const viewedProducts = recentlyViewed.map(id => 
            products.find(p => p.id == id)
        ).filter(p => p).slice(0, 4);
        
        if (viewedProducts.length > 0) {
            recentlyViewedContainer.innerHTML = viewedProducts.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <div class="price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                        ${product.oldPrice ? `<span class="discount">${Math.round((1 - product.price / product.oldPrice) * 100)}% off</span>` : ''}
                    </div>
                    <div class="rating">
                        ${renderStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            `).join('');
            
            // Add event listeners to "Add to Cart" buttons
            document.querySelectorAll('.recently-viewed .add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    addToCart(this.getAttribute('data-id'));
                });
            });
        } else {
            recentlyViewedContainer.innerHTML = `
                <div class="empty-recent">
                    <p>Your recently viewed items will appear here</p>
                </div>
            `;
        }
    }
}

// Orders Functions
function loadOrders() {
    // In a real app, this would be an API call for the current user's orders
    // Mock order data
    orders = [
        {
            id: 'WMT-2023-987654',
            date: '2023-10-15',
            status: 'delivered',
            deliveryDate: '2023-10-17',
            total: 748.98,
            items: [
                { id: 1, name: 'Apple AirPods Pro (2nd Generation)', price: 199.99, quantity: 1 },
                { id: 2, name: 'Samsung 55" 4K Smart TV', price: 499.99, quantity: 1 }
            ]
        },
        {
            id: 'WMT-2023-123456',
            date: '2023-09-28',
            status: 'delivered',
            deliveryDate: '2023-09-30',
            total: 129.97,
            items: [
                { id: 3, name: 'Instant Pot Duo 7-in-1', price: 79.99, quantity: 1 },
                { id: 10, name: 'Echo Dot (5th Gen)', price: 49.99, quantity: 1 }
            ]
        }
    ];
}

function displayOrderHistory() {
    const ordersContainer = document.querySelector('.orders-list');
    
    if (ordersContainer) {
        if (orders.length === 0) {
            ordersContainer.innerHTML = `
                <div class="empty-orders">
                    <i class="fas fa-box-open"></i>
                    <h3>You haven't placed any orders yet</h3>
                    <p>Start shopping to see your order history here</p>
                    <a href="index.html" class="btn">Start Shopping</a>
                </div>
            `;
        } else {
            ordersContainer.innerHTML = orders.map(order => `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-info">
                            <div class="order-number">Order #${order.id}</div>
                            <div class="order-date">Placed on ${formatDate(order.date)}</div>
                        </div>
                        <div class="order-status ${order.status}">
                            <i class="fas fa-check-circle"></i> Delivered on ${formatDate(order.deliveryDate)}
                        </div>
                        <div class="order-total">$${order.total.toFixed(2)}</div>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <div class="item-image">
                                    <img src="${products.find(p => p.id == item.id)?.image || 'https://via.placeholder.com/80'}" alt="${item.name}">
                                </div>
                                <div class="item-details">
                                    <h3 class="item-title">${item.name}</h3>
                                    <div class="item-price">$${item.price.toFixed(2)}</div>
                                    <div class="item-quantity">Quantity: ${item.quantity}</div>
                                </div>
                                <div class="item-actions">
                                    <button class="buy-again" data-id="${item.id}">Buy it again</button>
                                    <button class="view-product" data-id="${item.id}">View product</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-footer">
                        <button class="track-order"><i class="fas fa-truck"></i> Track package</button>
                        <button class="leave-review"><i class="fas fa-star"></i> Leave a review</button>
                        <button class="return-item"><i class="fas fa-undo"></i> Start a return</button>
                    </div>
                </div>
            `).join('');
            
            // Set up order actions
            setupOrderActions();
        }
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function setupOrderFilters() {
    const filterTabs = document.querySelectorAll('.filter-tabs button');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // In a real app, this would filter the orders
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            showToast(`Showing ${this.textContent.toLowerCase()} orders`);
        });
    });
}

function setupOrderActions() {
    // Buy it again
    document.querySelectorAll('.buy-again').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            addToCart(productId);
            showToast('Item added to cart');
        });
    });
    
    // View product
    document.querySelectorAll('.view-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            window.location.href = `product.html?id=${productId}`;
        });
    });
    
    // Track package
    document.querySelectorAll('.track-order').forEach(button => {
        button.addEventListener('click', function() {
            showToast('Tracking information would be displayed here');
        });
    });
    
    // Leave review
    document.querySelectorAll('.leave-review').forEach(button => {
        button.addEventListener('click', function() {
            showToast('Product review form would be displayed here');
        });
    });
    
    // Start return
    document.querySelectorAll('.return-item').forEach(button => {
        button.addEventListener('click', function() {
            showToast('Return process would be initiated here');
        });
    });
}

// Admin Functions
function loadAdminStats() {
    // In a real app, this would be an API call
    document.querySelector('.stat-card:nth-child(1) .stat-value').textContent = '1,245';
    document.querySelector('.stat-card:nth-child(2) .stat-value').textContent = '$89,245';
    document.querySelector('.stat-card:nth-child(3) .stat-value').textContent = '3,421';
    document.querySelector('.stat-card:nth-child(4) .stat-value').textContent = '12,543';
}

function setupAdminCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Sales',
                data: [12500, 19000, 15000, 18000, 22000, 25000, 28000, 26000, 30000, 32000, 0, 0],
                backgroundColor: 'rgba(0, 114, 206, 0.1)',
                borderColor: '#0072ce',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'doughnut',
        data: {
            labels: ['Electronics', 'Grocery', 'Home', 'Clothing', 'Toys', 'Other'],
            datasets: [{
                data: [35, 25, 15, 10, 8, 7],
                backgroundColor: [
                    '#0072ce',
                    '#ffc220',
                    '#76b900',
                    '#e31937',
                    '#9147ff',
                    '#777777'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function displayRecentOrders() {
    const ordersTable = document.querySelector('.orders-table tbody');
    
    if (ordersTable) {
        // Get recent orders (first 5 for demo)
        const recentOrders = orders.slice(0, 5);
        
        ordersTable.innerHTML = recentOrders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Wilson'][Math.floor(Math.random() * 5)]}</td>
                <td>${formatDate(order.date)}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                <td><button class="action-btn view">View</button></td>
            </tr>
        `).join('');
        
        // Set up view buttons
        document.querySelectorAll('.action-btn.view').forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.closest('tr').querySelector('td:first-child').textContent.slice(1);
                showToast(`Viewing order ${orderId}`);
            });
        });
    }
}

function displayTopProducts() {
    const topProductsContainer = document.querySelector('.top-products .products-grid');
    
    if (topProductsContainer) {
        // Get top products (first 5 for demo)
        const topProducts = products.slice(0, 5);
        
        topProductsContainer.innerHTML = topProducts.map((product, index) => `
            <div class="product-item">
                <div class="product-rank">${index + 1}</div>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-sales">${Math.floor(Math.random() * 2000) + 500} sold</div>
                </div>
                <div class="product-revenue">$${(product.price * (Math.floor(Math.random() * 2000) + 500)).toLocaleString()}</div>
            </div>
        `).join('');
    }
}

function setupAdminSidebarToggle() {
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    toggleBtn.className = 'admin-sidebar-toggle';
    
    document.querySelector('.admin-topbar').prepend(toggleBtn);
    
    toggleBtn.addEventListener('click', function() {
        document.querySelector('.admin-sidebar').classList.toggle('active');
    });
    
    // Hide on larger screens
    function checkScreenSize() {
        if (window.innerWidth < 768) {
            toggleBtn.style.display = 'block';
        } else {
            toggleBtn.style.display = 'none';
            document.querySelector('.admin-sidebar').classList.remove('active');
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
}

// Search Functionality
function initSearch() {
    const searchForm = document.querySelector('.search-bar');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = this.querySelector('input').value.trim();
            
            if (query) {
                // In a real app, this would redirect to search results
                showToast(`Searching for: ${query}`);
            }
        });
    }
}

// Utility Functions
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    
    // Set message and show
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function setupQuickView() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on a button
            if (!e.target.closest('button')) {
                const productId = this.querySelector('.add-to-cart')?.getAttribute('data-id');
                
                if (productId) {
                    // In a real app, this would show a quick view modal
                    showToast(`Quick view for product ${productId}`);
                }
            }
        });
    });
}

function setupCategoryNavigation() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.querySelector('span').textContent.toLowerCase();
            showToast(`Browsing ${category} category`);
        });
    });
}

// Add toast styles to the page
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .toast {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
    }
    
    .toast.show {
        opacity: 1;
    }
`;

//for video at id 3
document.addEventListener('DOMContentLoaded', function() {
  // Find product with id 3
  const product = products.find(p => p.id === 3);
  
  if (product) {
    displayProductMedia(product);
  }
});

function displayProductMedia(product) {
  const mainImage = document.getElementById('main-product-image');
  const videoElement = document.getElementById('product-video');
  const thumbnailsContainer = document.querySelector('.thumbnails');
  
  // Clear previous thumbnails
  thumbnailsContainer.innerHTML = '';
  
  // Display first image by default
  mainImage.src = product.images[0];
  mainImage.style.display = 'block';
  videoElement.style.display = 'none';
  
  // Create thumbnails
  product.images.forEach((media, index) => {
    const thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    
    if (media.endsWith('.mp4')) {
      // It's a video - create a video thumbnail
      thumbnail.innerHTML = `
        <video class="thumbnail-video" muted>
          <source src="${media}" type="video/mp4">
        </video>
        <span class="play-icon">▶</span>
      `;
    } else {
      // It's an image
      thumbnail.innerHTML = `<img src="${media}" alt="Thumbnail ${index}">`;
    }
    
    thumbnail.addEventListener('click', () => {
      if (media.endsWith('.mp4')) {
        // Show video in main display
        mainImage.style.display = 'none';
        videoElement.style.display = 'block';
        videoElement.src = media;
        videoElement.play();
      } else {
        // Show image in main display
        mainImage.style.display = 'block';
        videoElement.style.display = 'none';
        videoElement.pause();
        mainImage.src = media;
      }
    });
    
    thumbnailsContainer.appendChild(thumbnail);
  });
}
document.head.appendChild(toastStyles);
