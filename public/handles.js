const button = document.getElementById('divi');

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Optional: 'auto' for instant scroll
    });
}

let clickTimeout;

// Handle single click (tap)
button.addEventListener('click', () => {
  // If a double-click occurs, this timeout will be cleared
  clickTimeout = setTimeout(() => {
    console.log('Button tapped once');
    scrollToTop();
  }, 350); // Delay to differentiate single vs double tap
});

// Handle double-click (double tap)
button.addEventListener('dblclick', () => {
  clearTimeout(clickTimeout); // Prevent single click action
  console.log('Button tapped twice');
  window.location.reload();
});