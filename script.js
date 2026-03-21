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

// WhatsApp Widget Injection
document.addEventListener('DOMContentLoaded', () => {
    const waWidgetHTML = `
        <div class="wa-widget">
            <div class="wa-panel" id="wa-panel">
                <div class="wa-header">
                    <i class="fab fa-whatsapp"></i>
                    <div class="wa-header-info">
                        <h4>KPS Energy</h4>
                        <p>En línea</p>
                    </div>
                    <i class="fas fa-times wa-close-btn" id="wa-close-btn"></i>
                </div>
                <div class="wa-body">
                    <div class="wa-message">
                        Hola, ¿querés asesoramiento sobre energía solar, baterías o soluciones para tu hogar o empresa?
                    </div>
                    <a href="https://wa.me/5491165093050?text=Hola,%20quiero%20recibir%20asesoramiento%20sobre%20soluciones%20de%20energ%C3%ADa%20solar%20de%20KPS%20Energy." target="_blank" class="wa-cta">
                        Hablar por WhatsApp
                    </a>
                </div>
            </div>
            <div class="wa-button" id="wa-button">
                <i class="fab fa-whatsapp"></i>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', waWidgetHTML);

    const waButton = document.getElementById('wa-button');
    const waPanel = document.getElementById('wa-panel');
    const waCloseBtn = document.getElementById('wa-close-btn');

    if (waButton && waPanel) {
        waButton.addEventListener('click', () => {
            waPanel.classList.toggle('active');
        });
        
        if (waCloseBtn) {
            waCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                waPanel.classList.remove('active');
            });
        }
    }
});
