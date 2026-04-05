import json
import os
from pathlib import Path

import cv2


def encode_sift_pattern(image_path, output_json_path):
    print(f"\nLoading image for SIFT encoding: {image_path}")

    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print("Error: Could not read image.")
        return False

    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced_img = clahe.apply(img)

    sift = cv2.SIFT_create(nfeatures=2500)
    keypoints, descriptors = sift.detectAndCompute(enhanced_img, None)

    if descriptors is None:
        print("Error: No distinct features found.")
        return False

    keypoint_list = [{"x": kp.pt[0], "y": kp.pt[1]} for kp in keypoints]
    descriptor_list = descriptors.tolist()

    fingerprint_data = {
        "part_id": os.path.basename(image_path),
        "algorithm": "SIFT_RANSAC",
        "feature_count": len(keypoints),
        "keypoints": keypoint_list,
        "descriptors": descriptor_list,
    }

    with open(output_json_path, "w", encoding="utf-8") as json_file:
        json.dump(fingerprint_data, json_file)

    print(f"Successfully encoded {len(keypoints)} SIFT features.")
    print(f"Fingerprint saved to: {output_json_path}\n")
    return True


if __name__ == "__main__":
    print("=== SIFT Rotation-Invariant Encoder ===")
    raw_input_path = input("Drag and drop the BMP image here: ")
    input_image = raw_input_path.strip('"').strip("'")

    if os.path.exists(input_image):
        downloads_dir = str(Path.home() / "Downloads")
        save_folder = os.path.join(downloads_dir, "DOLP_Fingerprints")
        os.makedirs(save_folder, exist_ok=True)

        base_name = os.path.splitext(os.path.basename(input_image))[0]
        output_json = os.path.join(save_folder, f"{base_name}_fingerprint.json")

        encode_sift_pattern(input_image, output_json)
    else:
        print("Error: BMP image not found.")
