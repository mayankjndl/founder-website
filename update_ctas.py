import os
import glob
import re

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace any Book a Call variations
    content = re.sub(r'>\s*Book a Call\s*<', '>Book a Consultation<', content)
    content = re.sub(r'>\s*Book a Discovery Call\s*<', '>Get an Automation Audit<', content)
    content = re.sub(r'>\s*Book a Consultation\s*<', '>Get an Automation Audit<', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("CTAs updated")
