import os
import glob

html_files = glob.glob('e:/founder-website/*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove style="background-color: var(--clr-surface-alt);"
    content = content.replace(' style="background-color: var(--clr-surface-alt);"', '')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Removed from HTML files")
