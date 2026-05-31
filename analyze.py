import sys
import re

files = ['programs.html', 'membership.html', 'booking.html', 'dashboard.html', 'admin.html']
for f in files:
    try:
        with open('d:/New folder/DATA SCIENCE/7musclefitness7/' + f, 'r', encoding='utf-8') as file:
            content = file.read()
            print(f'--- {f} ---')
            print(f'Has luxury.css: {"luxury.css" in content}')
            print(f'Has old urgency bar: {"urgency-bar" in content and "Premium Memberships Now Open" not in content}')
            print(f'Has LUXURY FOOTER: {"<!-- LUXURY FOOTER -->" in content}')
            print(f'Has inline styles (count): {content.count("style=")}')
    except FileNotFoundError:
        print(f'--- {f} --- NOT FOUND')
