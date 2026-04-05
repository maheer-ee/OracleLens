import json
import os

import cv2
import numpy as np


def verify_part_geometry(new_image_path, reference_json_path):
    print(f"\nVerifying scan: '{os.path.basename(new_image_path)}'")

    new_img = cv2.imread(new_image_path, cv2.IMREAD_GRAYSCALE)
    if new_img is None:
        return "Error: Could not read the new scan image."

    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced_new_img = clahe.apply(new_img)

    sift = cv2.SIFT_create(nfeatures=2500)
    scan_keypoints, scan_descriptors = sift.detectAndCompute(enhanced_new_img, None)

    try:
        with open(reference_json_path, "r", encoding="utf-8") as json_file:
            ref_data = json.load(json_file)

        ref_descriptors = np.array(ref_data["descriptors"], dtype=np.float32)
        ref_keypoints = [
            cv2.KeyPoint(x=pt["x"], y=pt["y"], size=1)
            for pt in ref_data["keypoints"]
        ]
    except Exception as exc:
        return f"Error loading JSON: {exc}"

    index_params = dict(algorithm=1, trees=5)
    search_params = dict(checks=50)
    flann = cv2.FlannBasedMatcher(index_params, search_params)

    matches = flann.knnMatch(ref_descriptors, scan_descriptors, k=2)

    good_matches = []
    for first_match, second_match in matches:
        if first_match.distance < 0.75 * second_match.distance:
            good_matches.append(first_match)

    geometric_inliers = 0
    if len(good_matches) >= 10:
        src_pts = np.float32(
            [ref_keypoints[match.queryIdx].pt for match in good_matches],
        ).reshape(-1, 1, 2)
        dst_pts = np.float32(
            [scan_keypoints[match.trainIdx].pt for match in good_matches],
        ).reshape(-1, 1, 2)

        _, mask = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)

        if mask is not None:
            geometric_inliers = int(np.sum(mask))

    match_threshold = 25
    is_authentic = geometric_inliers >= match_threshold

    print("\n--- Verification Results ---")
    print(f"Raw initial matches found: {len(good_matches)}")
    print(
        f"Geometrically verified points: {geometric_inliers} "
        f"(Need {match_threshold} to pass)",
    )

    print("\n--- FINAL DECISION ---")
    if is_authentic:
        print("VERIFIED: The geometry aligns perfectly. This is the authentic part.")
    else:
        print("FAILED: Geometric alignment failed. This is a different part or bad scan.")


if __name__ == "__main__":
    print("=== SIFT + Geometry Verifier ===")

    raw_json_path = input("1. Drag and drop the reference JSON file here: ")
    reference_json = raw_json_path.strip('"').strip("'")

    if os.path.exists(reference_json):
        raw_image_path = input("2. Drag and drop the new scan BMP image here: ")
        new_scan_image = raw_image_path.strip('"').strip("'")

        if os.path.exists(new_scan_image):
            verify_part_geometry(new_scan_image, reference_json)
        else:
            print("Error: BMP image not found.")
    else:
        print("Error: Reference JSON file not found.")
