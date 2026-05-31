import os
import re

base_dir = 'd:/New folder/DATA SCIENCE/7musclefitness7/'
files = [f for f in os.listdir(base_dir) if f.endswith('.html')]

# We find all HTML tags and then check if they have multiple class="..."
for file_name in files:
    path = os.path.join(base_dir, file_name)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    def merge_classes(match):
        tag = match.group(0)
        # Find all class="..." inside this tag
        classes = re.findall(r'class="([^"]*)"', tag)
        if len(classes) > 1:
            # Combine them
            combined_class = ' '.join(classes)
            # Remove all class attributes from the tag
            tag_no_class = re.sub(r'\s*class="[^"]*"', '', tag)
            # Insert the combined class at the end before >
            if tag_no_class.endswith('/>'):
                return tag_no_class[:-2] + f' class="{combined_class}"/>'
            else:
                return tag_no_class[:-1] + f' class="{combined_class}">'
        return tag

    # Find all opening HTML tags
    new_content = re.sub(r'<[a-zA-Z0-9]+[^>]*>', merge_classes, content)

    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed duplicate scattered classes in {file_name}")

print("Scattered duplicate classes fix completed!")
