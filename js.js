// Button animation & Countdown

$(function() {
    var pointsA = [], pointsB = [], $canvas = null, canvas = null, context = null;
    var points = 8, viscosity = 20, mouseDist = 70, damping = 0.05;
    var mouseX = 0, mouseY = 0, relMouseX = 0, relMouseY = 0;
    var mouseLastX = 0, mouseLastY = 0, mouseDirectionX = 0, mouseDirectionY = 0;
    var mouseSpeedX = 0, mouseSpeedY = 0;
    let countdownInterval;

    function mouseDirection(e) {
        mouseDirectionX = (mouseX < e.pageX) ? 1 : (mouseX > e.pageX) ? -1 : 0;
        mouseDirectionY = (mouseY < e.pageY) ? 1 : (mouseY > e.pageY) ? -1 : 0;
        mouseX = e.pageX; mouseY = e.pageY;
        relMouseX = (mouseX - $canvas.offset().left);
        relMouseY = (mouseY - $canvas.offset().top);
    }
    $(document).on('mousemove', mouseDirection);

    function mouseSpeed() {
        mouseSpeedX = mouseX - mouseLastX;
        mouseSpeedY = mouseY - mouseLastY;
        mouseLastX = mouseX; mouseLastY = mouseY;
        setTimeout(mouseSpeed, 50);
    }
    mouseSpeed();

    function initButton() {
        var button = $('.btn-launch');
        var buttonWidth = button.width(), buttonHeight = button.height();

        $canvas = $('<canvas></canvas>');
        button.append($canvas);
        canvas = $canvas.get(0);
        canvas.width = buttonWidth + 100;
        canvas.height = buttonHeight + 100;
        context = canvas.getContext('2d');

        var x = buttonHeight / 2;
        for (var j = 1; j < points; j++) addPoints((x + ((buttonWidth - buttonHeight) / points) * j), 0);
        addPoints(buttonWidth - buttonHeight / 5, 0);
        addPoints(buttonWidth + buttonHeight / 10, buttonHeight / 2);
        addPoints(buttonWidth - buttonHeight / 5, buttonHeight);
        for (var j = points - 1; j > 0; j--) addPoints((x + ((buttonWidth - buttonHeight) / points) * j), buttonHeight);
        addPoints(buttonHeight / 5, buttonHeight);
        addPoints(-buttonHeight / 10, buttonHeight / 2);
        addPoints(buttonHeight / 5, 0);

        renderCanvas();
    }

    function addPoints(x, y) {
        pointsA.push(new Point(x, y, 1));
        pointsB.push(new Point(x, y, 2));
    }

    function Point(x, y, level) {
        this.x = this.ix = 50 + x;
        this.y = this.iy = 50 + y;
        this.vx = 0; this.vy = 0;
        this.cx1 = 0; this.cy1 = 0;
        this.cx2 = 0; this.cy2 = 0;
        this.level = level;
    }

    Point.prototype.move = function() {
        this.vx += (this.ix - this.x) / (viscosity * this.level);
        this.vy += (this.iy - this.y) / (viscosity * this.level);
        var dx = this.ix - relMouseX, dy = this.iy - relMouseY;
        var relDist = (1 - Math.sqrt((dx * dx) + (dy * dy)) / mouseDist);
        if (relDist > 0 && relDist < 1) {
            if ((mouseDirectionX > 0 && relMouseX > this.x) || (mouseDirectionX < 0 && relMouseX < this.x)) this.vx = (mouseSpeedX / 4) * relDist;
            if ((mouseDirectionY > 0 && relMouseY > this.y) || (mouseDirectionY < 0 && relMouseY < this.y)) this.vy = (mouseSpeedY / 4) * relDist;
        }
        this.vx *= (1 - damping);
        this.x += this.vx;
        this.vy *= (1 - damping);
        this.y += this.vy;
    };

    function renderCanvas() {
        requestAnimationFrame(renderCanvas);
        context.clearRect(0, 0, $canvas.width(), $canvas.height());
        context.fillStyle = '#000';
        context.fillRect(0, 0, $canvas.width(), $canvas.height());

        for (var i = 0; i <= pointsA.length - 1; i++) pointsA[i].move(), pointsB[i].move();

        var groups = [pointsA, pointsB];
        for (var j = 0; j <= 1; j++) {
            var points = groups[j];
            context.fillStyle = '#FFC107';
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            for (var i = 0; i < points.length; i++) {
                var p = points[i], nextP = points[i + 1];
                if (nextP) {
                    p.cx1 = p.cx2 = (p.x + nextP.x) / 2;
                    p.cy1 = p.cy2 = (p.y + nextP.y) / 2;
                    context.bezierCurveTo(p.x, p.y, p.cx1, p.cy1, p.cx1, p.cy1);
                }
            }
            context.fill();
        }
    }

    initButton();

    // Countdown functionality
    $(".button-container").on('click touchend', function(e) {
        e.preventDefault();
        
        // Check if the countdown is already active
        if ($(this).data('countdown-active')) {
            return; // Prevent further clicks if already active
        }

        // Set the countdown active state
        $(this).data('countdown-active', true);

        // Hide the button with fade out
        $(this).fadeOut("slow", function() {
            // Append countdown text after the button has faded out
            $(this).after('<div class="countdown-text">Until launch. Stay tuned!</div>');
            startCountdown();
        });
    });

    function startCountdown() {
        // Clear any existing countdown interval
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        // Set the countdown timer logic
        var countdownDate = new Date();
        countdownDate.setUTCHours(22, 0, 0); // Set to 10 PM UTC
        countdownDate.setUTCDate(countdownDate.getUTCDate() + 2); // Add 2 days (48 hours)

        var now = new Date().getTime();
        var timeLeft = countdownDate - now;

        countdownInterval = setInterval(function() {
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                $(".countdown-text").html("Launch!");
                return;
            }

            var hours = Math.floor(timeLeft / (1000 * 60 * 60));
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            $(".countdown-text").html(hours + "h " + minutes + "m " + seconds + "s until Launch. Stay tuned!");
            timeLeft -= 1000;
        }, 1000);
    }
}); // Closing the main $(function() { block


// Copy to clipboard button

// Copy to clipboard function with tooltip
$(".btn-contract").on("click", function (e) {
    e.preventDefault();
    
    // Create a temporary input element to copy the text
    const tempInput = document.createElement("input");
    tempInput.value = $(this).text();
    document.body.appendChild(tempInput);
    tempInput.select();
    
    try {
        document.execCommand("copy");
        showTooltip("Copied!", e.pageX, e.pageY); // Show tooltip on success
    } catch (err) {
        showTooltip("Failed to copy!", e.pageX, e.pageY); // Show tooltip on failure
    }

    document.body.removeChild(tempInput);
});

// Function to show tooltip
function showTooltip(message, x, y) {
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.innerText = message;
    document.body.appendChild(tooltip);
    
    // Position the tooltip
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    
    // Remove tooltip after a delay
    setTimeout(() => {
        document.body.removeChild(tooltip);
    }, 1500); // Adjust time as needed
}




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
            bigCard.classList.add('hidden');
            bigCard.classList.remove('animate-top');
        }

        // Check if the first small card is in view
        const firstSmallCardRect = smallCards[0].getBoundingClientRect();
        if (firstSmallCardRect.top <= windowHeight && firstSmallCardRect.bottom >= 0) {
            smallCards[0].classList.remove('hidden');
            smallCards[0].classList.add('animate-left');
        } else {
            smallCards[0].classList.add('hidden');
            smallCards[0].classList.remove('animate-left');
        }

        // Check if the second small card is in view
        const secondSmallCardRect = smallCards[1].getBoundingClientRect();
        if (secondSmallCardRect.top <= windowHeight && secondSmallCardRect.bottom >= 0) {
            smallCards[1].classList.remove('hidden');
            smallCards[1].classList.add('animate-right');
        } else {
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


// FAQ Section

document.querySelectorAll('.faq-question').forEach(item => {
    item.addEventListener('click', () => {
        const answer = item.nextElementSibling;
        item.classList.toggle('active');
        answer.classList.toggle('active');
    });
});
