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
    
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navWrapper = document.getElementById('nav-wrapper');
    
    if (mobileMenuBtn && navWrapper) {
        mobileMenuBtn.addEventListener('click', () => {
            navWrapper.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
});
