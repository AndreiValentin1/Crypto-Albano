let currentIndex = 0;

function moveCarousel(direction) {
    const carousel = document.querySelector('.carousel');
    const cards = document.querySelectorAll('.card');
    const totalCards = cards.length;

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = totalCards - 1; // Loop to the last card
    } else if (currentIndex >= totalCards) {
        currentIndex = 0; // Loop to the first card
    }

    const offset = -currentIndex * 35; // Calculate offset in percentage (25% width + margin)
    carousel.style.transform = `translateX(${offset}%)`; // Move the carousel
}
