import os
import glob

def update_html_files():
    # Directory paths
    base_dir = '/Users/gastonramos/Documents/Antigravity/KPS-Energy'
    
    # HTML files in base dir
    html_files = glob.glob(os.path.join(base_dir, '*.html'))
    
    gtag_snippet = """
    <!-- Inicio Google tag (gtag.js) - Google Ads -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18118830571"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-18118830571');
      // Preparado para futuras conversiones/eventos
    </script>
    <!-- Fin Google tag -->"""

    for filepath in html_files:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # Check for duplication
        if 'AW-18118830571' in content or 'googletagmanager' in content:
            print(f"Skipping {filepath} - gtag already exists.")
            continue
            
        # Inject snippet right before </head>
        if '</head>' in content:
            new_content = content.replace('</head>', gtag_snippet + '\n</head>', 1)
            
            with open(filepath, 'w', encoding='utf-8') as file:
                file.write(new_content)
            print(f"Successfully integrated gtag in {os.path.basename(filepath)}")
        else:
            print(f"WARNING: </head> not found in {os.path.basename(filepath)}. Cannot integrate automatically.")

if __name__ == '__main__':
    update_html_files()
