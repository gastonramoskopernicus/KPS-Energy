import os
import glob
import re

def remove_gtag_from_html():
    base_dir = '/Users/gastonramos/Documents/Antigravity/KPS-Energy'
    
    # Recursively find html files
    html_files = []
    for root, dirs, files in os.walk(base_dir):
        if 'node_modules' in dirs:
            dirs.remove('node_modules')
        if 'kps-admin' in dirs:
            dirs.remove('kps-admin')
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    # Regex to match the inserted gtag block
    gtag_pattern = re.compile(
        r'\s*<!-- Inicio Google tag \(gtag\.js\) - Google Ads -->.*?<!-- Fin Google tag -->',
        re.DOTALL
    )

    removed_count = 0
    for filepath in html_files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content, count = gtag_pattern.subn('', content)
        
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Removed gtag from {filepath}")
            removed_count += 1
            
    print(f"Total files reverted: {removed_count}")

if __name__ == '__main__':
    remove_gtag_from_html()
