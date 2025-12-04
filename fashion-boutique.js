/* ===========================================================
   LUXE LINE BOUTIQUE — INTERACTIVITY
   Author: Chyenne Battle
   Description: Handles filters, wishlist, quiz, newsletter, and navigation
=========================================================== */

/* -------------------------
   ELEMENT SELECTORS
------------------------- */

// Filter controls
const categorySelect = document.getElementById("filter-category");
const priceSelect = document.getElementById("filter-price");
const occasionSelect = document.getElementById("filter-occasion");

// Products
const productCards = document.querySelectorAll(".product-card");

// Hero button
const shopNowBtn = document.getElementById("shop-now-btn");
const newInSection = document.getElementById("new-in");

// Best Sellers button
const bestSellersBtn = document.getElementById("best-sellers-btn");
const bestSellersSection = document.getElementById("best-sellers");

// Style quiz
const quizForm = document.getElementById("style-quiz-form");
const quizResult = document.getElementById("quiz-result");

// Wishlist
const wishlistButtons = document.querySelectorAll(".wishlist-btn");
const wishlistCount = document.getElementById("wishlist-count");
let wishlistTotal = 0;

// Wishlist indicator + modal
const wishlistIndicator = document.querySelector(".wishlist-indicator");
const wishlistModal = document.getElementById("wishlist-modal");
const wishlistItemsList = document.getElementById("wishlist-items");
const wishlistEmpty = document.querySelector(".wishlist-empty");
const wishlistCloseBtn = document.querySelector(".wishlist-close");

//Store wishlist items (keyed by product name)
const wishlistItems = new Map();

// Navigation highlight
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");

// Newsletter
const newsletterForm = document.getElementById("newsletter-form");
const newsletterEmail = document.getElementById("newsletter-email");
const newsletterMessage = document.getElementById("newsletter-message");

// Footer year
document.getElementById("current-year").textContent = new Date().getFullYear();

/* -----------------------------------------------------------
   PRODUCT FILTERING
----------------------------------------------------------- */

function filterProducts() {
  const selectedCategory = categorySelect.value;
  const selectedPrice = priceSelect.value;
  const selectedOccasion = occasionSelect.value;

  productCards.forEach((card) => {
    const cardCategory = card.dataset.category;
    const cardPrice = card.dataset.price;
    const cardOccasion = card.dataset.occasion;

    const categoryMatch =
      selectedCategory === "all" || selectedCategory === cardCategory;

    const priceMatch = selectedPrice === "all" || selectedPrice === cardPrice;

    const occasionMatch =
      selectedOccasion === "all" || selectedOccasion === cardOccasion;

    if (categoryMatch && priceMatch && occasionMatch) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

// Event listeners for filtering
categorySelect.addEventListener("change", filterProducts);
priceSelect.addEventListener("change", filterProducts);
occasionSelect.addEventListener("change", filterProducts);

/* -----------------------------------------------------------
   SMOOTH SCROLL — HERO BUTTON
----------------------------------------------------------- */

if (shopNowBtn && newInSection) {
shopNowBtn.addEventListener("click", () => {
  newInSection.scrollIntoView({ behavior: "smooth" });
});
}

if (bestSellersBtn && bestSellersSection) {
    bestSellersBtn.addEventListener("click", () => {
        bestSellersSection.scrollIntoView({ behavior: "smooth"});
    });
}

/* -----------------------------------------------------------
   STYLE QUIZ LOGIC
----------------------------------------------------------- */

quizForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = quizForm.name.value.trim();
  const vibe = quizForm.vibe.value;

  if (!name || !vibe) {
    quizResult.textContent = "Please enter your name and choose a style vibe.";
    quizResult.style.color = "tomato";
    return;
  }

  const messages = {
    Minimal:
      "Clean lines, neutrals, and effortless silhouettes are your signature. Opt for structured blazers and monochrome sets.",
    Romantic:
      "Soft fabrics, flowy shapes, and gentle details flatter your vibe. Try lace blouses, midi skirts, and pastel palettes.",
    Edgy:
      "Bold shapes, leather textures, and striking contrast define your look. Focus on moto jackets, chunky boots, and black-on-black.",
    Streetwear:
      "Sporty layers and oversized silhouettes match you perfectly. Go for graphic tees, wide-leg cargos, and chunky sneakers.",
  };

  quizResult.textContent = `${name}, your style vibe is ${vibe}. ${messages[vibe]}`;
  quizResult.style.color = "#333";

  quizForm.reset();
});

/* -----------------------------------------------------------
   WISHLIST LOGIC
----------------------------------------------------------- */

function updateWishlistModal() {
    //Clear list
    wishlistItemsList.innerHTML =" ";

    if (wishlistItems.size === 0) {
        wishlistEmpty.classList.remove("hidden");
        return;
    }

    wishlistEmpty.classList.add("hidden");

    wishlistItems.forEach(({name, price}) => {
        const li = document.createElement("li");
        li.className = "wishlist-item";

        li.innerHTML = `<span class="wishlist-item-name">${name}</span>
        <span class="wishlist-item-price">${price}</span>;`

        wishlistItemsList.appendChild(li);
    });
}

wishlistButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    const name = card.querySelector(".product-name").textContent.trim();
    const price = card.querySelector(".product-price").textContent.trim();

    const isAdded = btn.classList.toggle("in-wishlist");

    if (isAdded) {
      wishlistTotal++;
      wishlistItems.set(name, {name,price});
      btn.textContent = "❤️ Added to wishlist";
    } else {
      wishlistTotal--;
      wishlistItems.delete(name);
      btn.textContent = "♡ Add to wishlist";
    }

    wishlistCount.textContent = wishlistTotal;
    updateWishlistModal();
  });
});

/*-----------------------------------------------------------
    WISHLIST MODAL OPEN/CLOSE
-----------------------------------------------------------*/

function openWishlist() {
    updateWishlistModal();
    wishlistModal.classList.remove("hidden");
}

function closeWishlist() {
    wishlistModal.classList.add("hidden");
}

// Open wishlist modal
if (wishlistIndicator) {
    wishlistIndicator.addEventListener("click", openWishlist);
}

// Close with X button
if(wishlistCloseBtn) {
    wishlistCloseBtn.addEventListener("click", closeWishlist);
}

// Close when clicking outside the panel
if (wishlistModal) {
    wishlistModal.addEventListener("click", (e) => {
        if (e.target === wishlistModal) {
            closeWishlist();
        }
    });
}


// Optional: close on Escape key
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeWishlist();
    }
});

/* -----------------------------------------------------------
   ACTIVE NAV HIGHLIGHT ON SCROLL
----------------------------------------------------------- */

function updateActiveNav() {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) current = section.getAttribute("id");
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateActiveNav);

/* -----------------------------------------------------------
   NEWSLETTER VALIDATION
----------------------------------------------------------- */

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = newsletterEmail.value.trim();

  if (!email || !email.includes("@") || !email.includes(".")) {
    newsletterMessage.textContent = "Please enter a valid email address.";
    newsletterMessage.style.color = "tomato";
    return;
  }

  newsletterMessage.textContent = "Thank you for subscribing!";
  newsletterMessage.style.color = "green";

  newsletterForm.reset();
});
