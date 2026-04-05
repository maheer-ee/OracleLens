import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image


def load_and_preprocess_image(
    image_path: str,
    target_size=(256, 256),
) -> np.ndarray:
    """Load BMP, convert to grayscale, resize, and return a numpy array."""
    img = Image.open(image_path).convert("L")
    img = img.resize(target_size, Image.BICUBIC)
    return np.array(img, dtype=np.uint8)


def compute_sha256(arr: np.ndarray) -> str:
    """Compute the SHA-256 hash of the image array."""
    return hashlib.sha256(arr.tobytes()).hexdigest()


def load_reference_fingerprint(reference_json: str):
    """Load a fingerprint JSON file and reconstruct the stored array."""
    with open(reference_json, "r", encoding="utf-8") as file_handle:
        ref = json.load(file_handle)

    height, width = ref["target_size"]
    ref_arr = np.array(ref["pixel_data"], dtype=np.uint8).reshape((height, width))
    return ref_arr, ref["hash_sha256"]


def verify_image(
    new_bmp_path: str,
    reference_json_path: str,
    target_size=(256, 256),
    mse_threshold=50.0,
):
    """Compare a new BMP against a stored JSON fingerprint."""
    ref_arr, ref_hash = load_reference_fingerprint(reference_json_path)

    new_arr = load_and_preprocess_image(new_bmp_path, target_size)
    new_hash = compute_sha256(new_arr)

    hash_match = new_hash == ref_hash

    diff = new_arr.astype(np.float32) - ref_arr.astype(np.float32)
    mse = float(np.mean(diff * diff))
    mse_pass = mse <= mse_threshold

    return hash_match, mse_pass, mse, ref_hash, new_hash


def main():
    print("\n=== DENDRITIC PATTERN VERIFIER ===\n")

    reference_json = input(
        "Enter the path to the reference fingerprint JSON file: ",
    ).strip()
    if not Path(reference_json).exists():
        print("\nERROR: JSON file not found.\n")
        return

    new_bmp = input("Enter the path to the newly captured BMP file: ").strip()
    if not Path(new_bmp).exists():
        print("\nERROR: BMP file not found.\n")
        return

    print("\nVerifying...\n")

    hash_match, mse_pass, mse, ref_hash, new_hash = verify_image(
        new_bmp_path=new_bmp,
        reference_json_path=reference_json,
    )

    print("====================================")
    print("            VERIFICATION            ")
    print("====================================\n")

    print(f"Reference SHA-256: {ref_hash}")
    print(f"New Image SHA-256: {new_hash}\n")

    print(f"Hash Match:        {hash_match}")
    print(f"MSE Value:         {mse:.2f}")
    print(f"MSE Threshold OK:  {mse_pass}\n")

    if hash_match or mse_pass:
        print("RESULT: MATCH - The part is AUTHENTIC.\n")
    else:
        print("RESULT: NO MATCH - The part may be COUNTERFEIT.\n")


if __name__ == "__main__":
    main()
