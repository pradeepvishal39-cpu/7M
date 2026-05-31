from PIL import Image, ImageEnhance
import sys
import os

def process_image(input_path, output_path):
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    # Open the image
    img = Image.open(input_path)

    # Convert to grayscale ("L") and back to "RGB"
    # Note: If the image is RGBA (transparent), converting directly to L/RGB 
    # typically drops the alpha channel and renders transparent areas as black.
    gray = img.convert("L").convert("RGB")

    # Darken slightly (70% brightness)
    gray = ImageEnhance.Brightness(gray).enhance(0.7)

    # Save the output
    gray.save(output_path)
    print(f"Successfully processed and saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) == 3:
        process_image(sys.argv[1], sys.argv[2])
    else:
        # Default behavior as requested
        if os.path.exists("image.png"):
            img = Image.open("image.png")
            gray = img.convert("L").convert("RGB")
            gray = ImageEnhance.Brightness(gray).enhance(0.7)
            gray.save("output.png")
            print("Successfully processed image.png to output.png with PIL.")
        else:
            print("Usage: python grayscale_converter_pil.py <input.png> <output.png>")
            print("Error: default 'image.png' not found.")
