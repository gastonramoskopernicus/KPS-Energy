import glob

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply the opening wrapper and hamburger
    target_start = '<ul class="nav-links">'
    replacement_start = """<div class="menu-toggle" id="mobile-menu">
                    <i class="fas fa-bars"></i>
                </div>
                <div class="nav-wrapper" id="nav-wrapper">
                    <ul class="nav-links">"""
    content = content.replace(target_start, replacement_start)

    # Note: nav-cta contains HTML that could vary, so we'll do a regex or just replace the end of nav-cta
    # We find `<div class="nav-cta">...</div></nav>`
    import re
    content = re.sub(r'(<div class="nav-cta">.*?</div>\s*)</nav>', r'\1</div>\n            </nav>', content, flags=re.DOTALL)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("Updated all HTML files.")
