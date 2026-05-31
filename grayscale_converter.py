import cv2
import numpy as np
import sys

def process_image(input_path, output_path):
    # Read the image (drops alpha channel)
    img = cv2.imread(input_path)
    if img is None:
        print(f"Error: Could not read {input_path}")
        return

    # grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

    # darken
    overlay = np.zeros_like(gray)
    result = cv2.addWeighted(gray, 0.7, overlay, 0.3, 0)

    cv2.imwrite(output_path, result)
    print(f"Successfully processed and saved to {output_path}")

if __name__ == "__main__":
    if len(sys.argv) == 3:
        process_image(sys.argv[1], sys.argv[2])
    else:
        # Default behavior as requested
        img = cv2.imread("image.png")
        if img is not None:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            gray = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)
            
            overlay = np.zeros_like(gray)
            result = cv2.addWeighted(gray, 0.7, overlay, 0.3, 0)
            
            cv2.imwrite("output.png", result)
            print("Successfully processed image.png to output.png with darkening effect.")
        else:
            print("Usage: python grayscale_converter.py <input.png> <output.png>")
            print("Error: default 'image.png' not found.")
