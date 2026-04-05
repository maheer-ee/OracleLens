import hashlib
from io import BytesIO

import numpy as np
from PIL import Image


def load_and_preprocess_image_from_bytes(
    image_bytes: bytes,
    target_size=(256, 256),
) -> np.ndarray:
    image = Image.open(BytesIO(image_bytes)).convert("L")
    image = image.resize(target_size, Image.BICUBIC)
    return np.array(image, dtype=np.uint8)


def build_fingerprint(image_bytes: bytes) -> dict:
    arr = load_and_preprocess_image_from_bytes(image_bytes)
    sha = hashlib.sha256(arr.tobytes()).hexdigest()

    return {
        "version": 1,
        "target_size": list(arr.shape),
        "hash_sha256": sha,
        "pixel_data": arr.flatten().tolist(),
    }


def compare_fingerprints(
    reference_fingerprint: dict,
    candidate_fingerprint: dict,
    mse_threshold: float = 50.0,
) -> dict:
    height, width = reference_fingerprint["target_size"]
    reference_arr = np.array(
        reference_fingerprint["pixel_data"],
        dtype=np.uint8,
    ).reshape((height, width))

    height, width = candidate_fingerprint["target_size"]
    candidate_arr = np.array(
        candidate_fingerprint["pixel_data"],
        dtype=np.uint8,
    ).reshape((height, width))

    diff = candidate_arr.astype(np.float32) - reference_arr.astype(np.float32)
    mse = float(np.mean(diff * diff))

    hash_match = (
        reference_fingerprint["hash_sha256"] == candidate_fingerprint["hash_sha256"]
    )
    mse_pass = mse <= mse_threshold
    similarity_score = max(0, min(100, round(100 - (mse / mse_threshold) * 100)))
    outcome = "match" if hash_match and mse_pass else "mismatch"

    return {
        "hash_match": hash_match,
        "mse_pass": mse_pass,
        "mse": mse,
        "mse_threshold": mse_threshold,
        "similarity_score": similarity_score,
        "outcome": outcome,
    }
