import os
import glob
import re

html_files = glob.glob('*.html')

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. CTAs
    content = content.replace(">Book a Call<", ">Book a Consultation<")
    content = content.replace(">Send a Message<", ">Let's Connect<")
    content = content.replace(">View All Projects<", ">View Case Studies<")
    
    # 2. Performance - Lazy load images
    # Avoid adding if already there
    # Only adding to <img ... > that don't have loading=
    # This regex looks for <img without loading=
    def lazy_load_replacer(match):
        img_tag = match.group(0)
        if 'loading=' not in img_tag:
            return img_tag.replace('<img ', '<img loading="lazy" ')
        return img_tag

    content = re.sub(r'<img [^>]*>', lazy_load_replacer, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("CTAs and Lazy Loading updated successfully.")
