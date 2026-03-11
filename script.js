window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Navigation logic and interactions
document.addEventListener('DOMContentLoaded', () => {
    console.log('KPS Energy website initialized.');
});
