from io import BytesIO

import cv2
import numpy as np
from PIL import Image


def load_grayscale_image_from_bytes(image_bytes: bytes) -> np.ndarray:
    image = Image.open(BytesIO(image_bytes)).convert("L")
    return np.array(image, dtype=np.uint8)


def build_fingerprint(image_bytes: bytes, part_id: str | None = None) -> dict:
    image = load_grayscale_image_from_bytes(image_bytes)

    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced_image = clahe.apply(image)

    sift = cv2.SIFT_create(nfeatures=2500)
    keypoints, descriptors = sift.detectAndCompute(enhanced_image, None)

    if descriptors is None or not keypoints:
        raise ValueError("No distinct SIFT features were found in the BMP image.")

    return {
        "part_id": part_id or "unknown_part",
        "algorithm": "SIFT_RANSAC",
        "feature_count": len(keypoints),
        "image_shape": list(image.shape),
        "keypoints": [{"x": kp.pt[0], "y": kp.pt[1]} for kp in keypoints],
        "descriptors": descriptors.tolist(),
    }


def compare_fingerprints(
    reference_fingerprint: dict,
    candidate_fingerprint: dict,
    match_threshold: int = 25,
) -> dict:
    ref_descriptors = np.array(
        reference_fingerprint["descriptors"],
        dtype=np.float32,
    )
    candidate_descriptors = np.array(
        candidate_fingerprint["descriptors"],
        dtype=np.float32,
    )

    if ref_descriptors.size == 0 or candidate_descriptors.size == 0:
        raise ValueError("Missing SIFT descriptors in one or both fingerprint files.")

    ref_keypoints = [
        cv2.KeyPoint(x=point["x"], y=point["y"], size=1)
        for point in reference_fingerprint["keypoints"]
    ]
    candidate_keypoints = [
        cv2.KeyPoint(x=point["x"], y=point["y"], size=1)
        for point in candidate_fingerprint["keypoints"]
    ]

    index_params = dict(algorithm=1, trees=5)
    search_params = dict(checks=50)
    flann = cv2.FlannBasedMatcher(index_params, search_params)

    matches = flann.knnMatch(ref_descriptors, candidate_descriptors, k=2)

    good_matches: list[cv2.DMatch] = []
    for first_match, second_match in matches:
        if first_match.distance < 0.75 * second_match.distance:
            good_matches.append(first_match)

    geometric_inliers = 0
    if len(good_matches) >= 10:
        src_points = np.float32(
            [ref_keypoints[match.queryIdx].pt for match in good_matches],
        ).reshape(-1, 1, 2)
        dst_points = np.float32(
            [candidate_keypoints[match.trainIdx].pt for match in good_matches],
        ).reshape(-1, 1, 2)

        _, mask = cv2.findHomography(src_points, dst_points, cv2.RANSAC, 5.0)
        if mask is not None:
            geometric_inliers = int(np.sum(mask))

    verified = geometric_inliers >= match_threshold
    similarity_score = max(
        0,
        min(100, round((geometric_inliers / match_threshold) * 100)),
    )

    return {
        "algorithm": "SIFT_RANSAC",
        "raw_matches": len(good_matches),
        "geometric_inliers": geometric_inliers,
        "match_threshold": match_threshold,
        "similarity_score": similarity_score,
        "outcome": "match" if verified else "mismatch",
        "verified": verified,
    }
