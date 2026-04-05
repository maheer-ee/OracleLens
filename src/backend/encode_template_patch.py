import base64
import json
import os
from pathlib import Path

import cv2


def encode_dolp_patch(image_path, output_json_path):
    print(f"\nLoading image for encoding: {image_path}")

    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print("Error: Could not read image.")
        return False

    h, w = img.shape
    patch_size = 400

    start_y = (h // 2) - (patch_size // 2)
    end_y = start_y + patch_size
    start_x = (w // 2) - (patch_size // 2)
    end_x = start_x + patch_size

    template_patch = img[start_y:end_y, start_x:end_x]

    success, encoded_image = cv2.imencode(".png", template_patch)
    if not success:
        print("Error: Failed to compress image patch.")
        return False

    b64_string = base64.b64encode(encoded_image).decode("utf-8")

    fingerprint_data = {
        "part_id": os.path.basename(image_path),
        "algorithm": "Normalized_Cross_Correlation",
        "patch_size": f"{patch_size}x{patch_size}",
        "dolp_bitmap_base64": b64_string,
    }

    with open(output_json_path, "w", encoding="utf-8") as json_file:
        json.dump(fingerprint_data, json_file, indent=4)

    print(f"Successfully encoded a {patch_size}x{patch_size} pixel DoLP patch.")
    print(f"Fingerprint saved to: {output_json_path}\n")
    return True


if __name__ == "__main__":
    print("=== DoLP Bitmap Encoder ===")
    raw_input_path = input("Drag and drop the BMP image here: ")
    input_image = raw_input_path.strip('"').strip("'")

    if os.path.exists(input_image):
        downloads_dir = str(Path.home() / "Downloads")
        save_folder = os.path.join(downloads_dir, "DOLP_Fingerprints")
        os.makedirs(save_folder, exist_ok=True)

        base_name = os.path.splitext(os.path.basename(input_image))[0]
        output_json = os.path.join(save_folder, f"{base_name}_fingerprint.json")

        encode_dolp_patch(input_image, output_json)
    else:
        print("Error: BMP image not found.")
