import os

base_dir = 'd:/New folder/DATA SCIENCE/7musclefitness7/'
files = [f for f in os.listdir(base_dir) if f.endswith('.html')]

# Old texts that might exist
old_text_1 = "Elevate Your Fitness. 2024 Premium Memberships Now Open."
old_text_2 = "Elevate Your Fitness. 7 Muscle Premium Memberships Now Open."

# New text the user seems to want, removing "2024" and adding "7 Muscle"
new_text = "Elevate Your Fitness. 7 Muscle Premium Memberships Now Open."

for file_name in files:
    path = os.path.join(base_dir, file_name)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if old_text_1 in content:
        content = content.replace(old_text_1, new_text)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file_name}")

print("Urgency bar text updated globally!")
