// javascript code 

// Get all star elements
const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('selected-rating');

let currentRating = 0;

// Add click event listeners to all stars
stars.forEach(star => {
    star.addEventListener('mouseover', () => {
        const hoverValue = parseInt(star.getAttribute('data-value'));
        
        // Highlight stars up to the hovered star
        stars.forEach(s => {
            if (parseInt(s.getAttribute('data-value')) <= hoverValue) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });

    star.addEventListener('click', () => {
        currentRating = parseInt(star.getAttribute('data-value'));

        // Highlight selected stars permanently
        stars.forEach(s => {
            if (parseInt(s.getAttribute('data-value')) <= currentRating) {
                s.classList.add('selected');
            } else {
                s.classList.remove('selected');
            }
        });

        // Update rating value display
        ratingValue.textContent = currentRating;
    });

    star.addEventListener('mouseout', () => {
        // Remove temporary hover effect when mouse moves out
        stars.forEach(s => {
            s.classList.remove('active');
        });

        // Restore selected stars
        stars.forEach(s => {
            if (parseInt(s.getAttribute('data-value')) <= currentRating) {
                s.classList.add('selected');
            } else {
                s.classList.remove('selected');
            }
        });
    });
});

// Function to handle rating submission (you can modify this according to your needs)
function submitRating() {
    if (currentRating === 0) {
        alert('Please select a rating!');
    } else {
        alert(`Thank you for rating! You rated this website ${currentRating} stars.`);
        
        // Reset currentRating and clear selected stars
        currentRating = 0;
        stars.forEach(s => {
            s.classList.remove('selected');
        });
        
        // Update rating value display
        ratingValue.textContent = currentRating;
    }
}