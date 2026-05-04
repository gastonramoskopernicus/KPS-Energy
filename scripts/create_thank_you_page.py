import os
import re

def create_thank_you_page(base_dir):
    contacto_path = os.path.join(base_dir, 'contacto.html')
    gracias_path = os.path.join(base_dir, 'gracias.html')
    
    with open(contacto_path, 'r', encoding='utf-8') as f:
        contacto_content = f.read()

    # Extract header and footer to keep layout consistent
    header_match = re.search(r'(<!DOCTYPE html>.*?</header>)', contacto_content, re.DOTALL)
    if not header_match:
        print("Error: Could not find header in contacto.html")
        return
        
    header_content = header_match.group(1)
    # Inject noindex and update Title
    header_content = header_content.replace('<title>Contacto y Asesoramiento Sin Costo | KPS Energy Argentina</title>', '<title>Gracias por tu consulta | KPS Energy</title>')
    # Add noindex meta tag right before closing head
    header_content = header_content.replace('</head>', '    <meta name="robots" content="noindex">\n</head>')

    footer_content = """
    <footer id="main-footer"></footer>
    <script src="script.js"></script>
    <script>
        // Load footer
        fetch('index.html').then(res => res.text()).then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            document.getElementById('main-footer').innerHTML = doc.getElementById('main-footer').innerHTML;
        });
    </script>
</body>
</html>"""

    # Main content for Thank You Page
    main_content = """
    <main style="padding-top: 150px; padding-bottom: 120px; text-align: center;">
        <div class="container">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 50px; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid var(--divider);">
                <i class="fas fa-check-circle" style="color: var(--primary-green); font-size: 60px; margin-bottom: 20px;"></i>
                <h1 style="font-size: 2.2rem; margin-bottom: 15px;">¡Gracias por tu consulta!</h1>
                <h3 style="font-size: 1.2rem; font-weight: 500; margin-bottom: 15px; color: var(--text-main);">Nuestro equipo de KPS Energy se va a comunicar con vos a la brevedad.</h3>
                <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 1.05rem;">Estamos analizando tu solicitud para ofrecerte la mejor solución en energía solar, adaptada a tu consumo y necesidad.</p>
                
                <p style="font-size: 0.9rem; font-weight: 600; color: #27ae60; background: #e8f8f5; padding: 10px; border-radius: 8px; display: inline-block; margin-bottom: 30px;">
                    <i class="fas fa-clock" style="margin-right: 5px;"></i> Respuesta en menos de 24 hs | Asesoramiento sin costo
                </p>

                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <a href="/" class="btn btn-primary" style="padding: 15px; border-radius: 8px; font-weight: 600; font-size: 1.1rem; text-decoration: none;">Volver al inicio</a>
                    <a href="https://wa.me/5491165093050?text=Hola,%20quiero%20recibir%20asesoramiento%20sobre%20soluciones%20de%20energ%C3%ADa%20solar%20de%20KPS%20Energy." target="_blank" class="btn" style="padding: 15px; border-radius: 8px; font-weight: 600; font-size: 1.1rem; text-decoration: none; border: 2px solid #25D366; color: #25D366; background: white;"><i class="fab fa-whatsapp"></i> Hablar por WhatsApp</a>
                </div>
            </div>
        </div>
    </main>
"""

    gracias_html = header_content + "\n" + main_content + "\n" + footer_content
    
    with open(gracias_path, 'w', encoding='utf-8') as f:
        f.write(gracias_html)
    
    print("Creada la página: gracias.html")

def update_contacto_redirection(base_dir):
    contacto_path = os.path.join(base_dir, 'contacto.html')
    with open(contacto_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Locate the success block
    # original block:
    # if (response.ok && json.success) {
    #     feedbackMsg.textContent = 'A la brevedad el equipo de KPS Energy se va a comunicar con vos.';
    #     feedbackMsg.classList.add('success');
    #     feedbackMsg.style.display = 'block';
    #     form.reset();
    # } else {
    
    search_target = "if (response.ok && json.success) {"
    replacement = """if (response.ok && json.success) {
                                        window.location.href = '/gracias';"""
    
    # Let's replace specifically the block handling success
    # First we check if it is already redirected
    if "window.location.href = '/gracias'" in content:
        print("contacto.html ya tiene la redirección implementada.")
        return

    # We will replace the block from "if (response.ok && json.success) {" to "form.reset();" inside it
    # We can use regex to replace the content inside the if block safely
    pattern = r'(if\s*\(response\.ok\s*&&\s*json\.success\)\s*\{)(.*?)(?=\}\s*else\s*\{)'
    
    def replacer(match):
        return match.group(1) + """
                                        // Redireccion a Thank You Page para Google Ads Tracking
                                        window.location.href = '/gracias';
                                    """
    
    new_content = re.sub(pattern, replacer, content, flags=re.DOTALL)
    
    with open(contacto_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("Modificado contacto.html: Redirección exitosa a /gracias.")

if __name__ == '__main__':
    base_path = '/Users/gastonramos/Documents/Antigravity/KPS-Energy'
    create_thank_you_page(base_path)
    update_contacto_redirection(base_path)
