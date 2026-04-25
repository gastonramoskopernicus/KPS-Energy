import os

def update_script_js():
    filepath = '/Users/gastonramos/Documents/Antigravity/KPS-Energy/script.js'
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Si ya tiene el tag, no lo insertamos dos veces
    if 'AW-18118830571' in content:
        print("El tag ya está en script.js")
        return

    gtag_injection = """

// Google Ads Tag Injection (Global)
document.addEventListener('DOMContentLoaded', () => {
    const gtagId = 'AW-18118830571';
    
    // Evitar duplicaciones
    if (document.querySelector(`script[src*="${gtagId}"]`)) {
        return;
    }

    // Script asíncrono principal
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
    document.head.appendChild(script);

    // Initializer local y preparación para conversiones
    const scriptInit = document.createElement('script');
    scriptInit.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        
        // Configuracion principal
        gtag('config', '${gtagId}');
        
        /* Preparado para futuros eventos de conversión:
           - envío de formulario: gtag('event', 'conversion', { 'send_to': '${gtagId}/form_submit' });
           - click en WhatsApp: gtag('event', 'conversion', { 'send_to': '${gtagId}/whatsapp_click' });
           - click en solicitar cotización: gtag('event', 'conversion', { 'send_to': '${gtagId}/quote_request' });
           - click en contactar especialista: gtag('event', 'conversion', { 'send_to': '${gtagId}/contact_specialist' });
        */
    `;
    document.head.appendChild(scriptInit);
    
    console.log('Google Ads Tag initialized globally via script.js.');
});
"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content + gtag_injection)
    print("Inyectado globalmente en script.js")

if __name__ == '__main__':
    update_script_js()
