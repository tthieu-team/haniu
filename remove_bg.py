import os
import sys
import subprocess

def setup_dependencies():
    """Ensure rembg and pillow are installed."""
    try:
        from rembg import remove
        from PIL import Image
        print("Required libraries are already installed.")
    except ImportError:
        print("Missing required libraries. Attempting to install 'rembg' and 'pillow'...")
        try:
            # Install rembg and pillow
            subprocess.check_call([sys.executable, "-m", "pip", "install", "rembg", "pillow"])
            print("Successfully installed rembg and pillow!")
        except Exception as e:
            print(f"Error installing libraries: {e}")
            print("Please run: pip install rembg pillow")
            sys.exit(1)

setup_dependencies()

from rembg import remove
from PIL import Image

def process_images(target_dir):
    if not os.path.exists(target_dir):
        print(f"Target directory does not exist: {target_dir}")
        return

    print(f"Scanning directory: {target_dir}")
    
    # Collect all png files to process (excluding already processed ones)
    png_files = []
    for root, dirs, files in os.walk(target_dir):
        for file in files:
            if file.lower().endswith('.png') and not file.endswith('_nobg.png') and not file.endswith('_original.png'):
                png_files.append(os.path.join(root, file))
                
    total_files = len(png_files)
    print(f"Found {total_files} images to process.")

    if total_files == 0:
        print("No new images to process.")
        return

    for idx, file_path in enumerate(png_files, 1):
        try:
            print(f"[{idx}/{total_files}] Processing: {os.path.basename(file_path)}")
            
            # Read image data
            with open(file_path, 'rb') as f:
                input_data = f.read()
            
            # Remove background using rembg
            output_data = remove(input_data)
            
            # Create new filenames
            dir_name = os.path.dirname(file_path)
            base_name = os.path.basename(file_path)
            name_part, ext = os.path.splitext(base_name)
            
            original_backup_path = os.path.join(dir_name, f"{name_part}_original{ext}")
            nobg_output_path = os.path.join(dir_name, f"{name_part}_nobg{ext}")
            
            # Save the background-removed image
            with open(nobg_output_path, 'wb') as f_out:
                f_out.write(output_data)
                
            # Rename the original file to _original.png as requested to distinguish it
            os.rename(file_path, original_backup_path)
            
            print(f" -> Done! Removed background saved to: {os.path.basename(nobg_output_path)}")
            print(f" -> Original renamed to: {os.path.basename(original_backup_path)}")
            
        except Exception as e:
            print(f"Error processing {os.path.basename(file_path)}: {e}")

if __name__ == '__main__':
    target_folder = r"d:\FullStack\haniu\front-haniu\public\photobooth"
    process_images(target_folder)
