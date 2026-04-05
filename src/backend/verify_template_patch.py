import base64
import json
import os

import cv2
import numpy as np


def verify_part(new_image_path, reference_json_path):
    print(f"\nVerifying scan: '{os.path.basename(new_image_path)}'")

    new_img = cv2.imread(new_image_path, cv2.IMREAD_GRAYSCALE)
    if new_img is None:
        return "Error: Could not read the new scan image."

    try:
        with open(reference_json_path, "r", encoding="utf-8") as json_file:
            ref_data = json.load(json_file)

        img_bytes = base64.b64decode(ref_data["dolp_bitmap_base64"])
        nparr = np.frombuffer(img_bytes, np.uint8)
        reference_patch = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    except Exception as exc:
        return f"Error loading JSON or decoding image: {exc}"

    result = cv2.matchTemplate(new_img, reference_patch, cv2.TM_CCOEFF_NORMED)
    _, max_val, _, _ = cv2.minMaxLoc(result)

    correlation_score = max_val
    match_threshold = 0.70
    is_authentic = correlation_score >= match_threshold

    print("\n--- Verification Results ---")
    print("Algorithm: Normalized Cross-Correlation (DoLP Bitmap)")
    print(f"Confidence Score: {correlation_score:.4f} (Max 1.0)")
    print(f"Required to Pass: {match_threshold:.4f}")

    print("\n--- FINAL DECISION ---")
    if is_authentic:
        print("VERIFIED: Excellent match. This is the authentic part.")
    else:
        print("FAILED: The patterns do not match. This is a different part.")


if __name__ == "__main__":
    print("=== DoLP Bitmap Verifier ===")

    raw_json_path = input("1. Drag and drop the reference JSON file here: ")
    reference_json = raw_json_path.strip('"').strip("'")

    if os.path.exists(reference_json):
        raw_image_path = input("2. Drag and drop the new scan BMP image here: ")
        new_scan_image = raw_image_path.strip('"').strip("'")

        if os.path.exists(new_scan_image):
            verify_part(new_scan_image, reference_json)
        else:
            print("Error: BMP image not found.")
    else:
        print("Error: Reference JSON file not found.")
