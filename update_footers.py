import os
import glob
import re

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace the legal links area.
    # Typically it looks like:
    # <div class="footer-legal">
    #   <a href="#">Privacy Policy</a>
    #   <a href="contact.html">Contact</a>
    # </div>
    
    # Or minified versions.
    # Let's just do a regex replace for the contents of <div class="footer-legal">...</div>
    
    new_content = re.sub(
        r'<div class="footer-legal">.*?</div>',
        '<div class="footer-legal">\n          <a href="privacy.html">Privacy Policy</a>\n          <a href="terms.html">Terms &amp; Conditions</a>\n        </div>',
        content,
        flags=re.DOTALL
    )
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
