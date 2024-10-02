// Carousel 

let items = document.querySelectorAll('.carousel .card'); // Using your existing card class
let next = document.querySelector('.carousel-button.right'); // Right button
let prev = document.querySelector('.carousel-button.left'); // Left button

let active = 0; // Start at the first card

function loadShow() {
    let stt = 0;
    
    items.forEach((item, index) => {
        item.style.transition = 'transform 0.5s, opacity 0.5s'; // Smooth transitions
        if (index === active) {
            item.style.transform = `none`;
            item.style.zIndex = 1; // Bring active to front
            item.style.filter = 'none';
            item.style.opacity = 1; // Full opacity
        } else {
            // Calculate position and style for non-active items
            const offset = index > active ? (index - active) : (active - index);
            const direction = index > active ? 1 : -1; // Determine direction for translation
            item.style.transform = `translateX(${direction * (120 * offset)}px) scale(${1 - 0.1 * offset})`;
            item.style.zIndex = -offset; // Stack items behind active
            item.style.filter = 'blur(5px)'; // Blur non-active items
            item.style.opacity = offset > 2 ? 0 : 0.6; // Fade out further items
        }
    });
}

// Initial call to display items
loadShow();

// Next button click event
next.onclick = function() {
    active = (active + 1) % items.length; // Cycle through items
    loadShow();
};

// Previous button click event
prev.onclick = function() {
    active = (active - 1 + items.length) % items.length; // Cycle backwards
    loadShow();
};


// Bottom Cards 

document.addEventListener("DOMContentLoaded", function() {
    const bigCard = document.querySelector('.big-card');
    const smallCards = document.querySelectorAll('.small-card');

    function checkVisibility() {
        const windowHeight = window.innerHeight;

        // Check if the big card is in view
        const bigCardRect = bigCard.getBoundingClientRect();
        if (bigCardRect.top <= windowHeight && bigCardRect.bottom >= 0) {
            bigCard.classList.remove('hidden');
            bigCard.classList.add('animate-top');
        } else {
            // Reset classes if it's out of view
            bigCard.classList.add('hidden');
            bigCard.classList.remove('animate-top');
        }

        // Check if the first small card is in view
        const firstSmallCardRect = smallCards[0].getBoundingClientRect();
        if (firstSmallCardRect.top <= windowHeight && firstSmallCardRect.bottom >= 0) {
            smallCards[0].classList.remove('hidden');
            smallCards[0].classList.add('animate-left');
        } else {
            // Reset classes if it's out of view
            smallCards[0].classList.add('hidden');
            smallCards[0].classList.remove('animate-left');
        }

        // Check if the second small card is in view
        const secondSmallCardRect = smallCards[1].getBoundingClientRect();
        if (secondSmallCardRect.top <= windowHeight && secondSmallCardRect.bottom >= 0) {
            smallCards[1].classList.remove('hidden');
            smallCards[1].classList.add('animate-right');
        } else {
            // Reset classes if it's out of view
            smallCards[1].classList.add('hidden');
            smallCards[1].classList.remove('animate-right');
        }
    }

    // Initially hide the cards
    bigCard.classList.add('hidden');
    smallCards[0].classList.add('hidden');
    smallCards[1].classList.add('hidden');

    // Check visibility on scroll
    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Initial check
});
