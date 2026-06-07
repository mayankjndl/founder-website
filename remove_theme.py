import os
import glob
import re

html_files = glob.glob('e:/founder-website/*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove flash prevention script
    content = re.sub(r'<!-- Theme flash prevention.*?<\/script>', '', content, flags=re.DOTALL)
    
    # Remove theme toggle button
    content = re.sub(r'<button class="theme-toggle".*?<\/button>', '', content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Removed from HTML files")
