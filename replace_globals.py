import os
import glob
import re

html_files = glob.glob('e:/founder-website/*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Replace LinkedIn
    content = content.replace('#LINKEDIN_PLACEHOLDER', 'https://www.linkedin.com/in/-piyush-jadhav')
    
    # 2. Replace Email (Case insensitive replacement for placeholder@imperiondata.com)
    content = re.sub(r'(?i)placeholder@imperiondata\.com', 'info.imperiondatasystems@gmail.com', content)
    
    # 3. Comment out GA4
    content = content.replace(
        '<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>',
        '<!-- <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script> -->'
    )
    content = content.replace(
        "gtag('config', 'G-XXXXXXXXXX');",
        "// gtag('config', 'G-XXXXXXXXXX');"
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Global strings replaced.")
