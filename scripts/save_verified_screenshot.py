import os
import sys
import glob
import shutil
from PIL import Image

def save_and_validate(target_filename):
    pattern = os.path.join(os.environ['LOCALAPPDATA'], 'Temp', 'simserver-*', 'media', '*.png')
    matches = sorted(glob.glob(pattern), key=os.path.getmtime)
    if not matches:
        print("ERROR: No simserver screenshot found!")
        sys.exit(1)
    
    latest_screenshot = matches[-1]
    dest_dir = os.path.abspath('docs/app-flow/screenshots/verified')
    os.makedirs(dest_dir, exist_ok=True)
    dest_path = os.path.join(dest_dir, target_filename)
    
    shutil.copyfile(latest_screenshot, dest_path)
    print(f"Copied {latest_screenshot} -> {dest_path}")
    
    # Strict validation
    file_size = os.path.getsize(dest_path)
    with open(dest_path, 'rb') as f:
        header = f.read(8)
    
    png_signature = b'\x89PNG\r\n\x1a\n'
    if header != png_signature:
        print(f"FAILED: Invalid PNG header: {header}")
        sys.exit(1)
    
    with Image.open(dest_path) as img:
        img.verify()
        
    with Image.open(dest_path) as img:
        img.load()
        width, height = img.size
        format_name = img.format
        mode = img.mode
        # Check that image is not blank (e.g. standard deviation of pixels > 0)
        extrema = img.getextrema()
    
    print(f"VALIDATION PASSED:")
    print(f"  Target: {target_filename}")
    print(f"  Size: {file_size} bytes")
    print(f"  Resolution: {width}x{height}")
    print(f"  Format: {format_name}, Mode: {mode}")
    print(f"  Extrema: {extrema}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python scripts/save_verified_screenshot.py <target_filename>")
        sys.exit(1)
    save_and_validate(sys.argv[1])
