import hashlib
import json
from datetime import datetime
from pathlib import Path

import numpy as np
from PIL import Image


def load_and_preprocess_image(
    image_path: str,
    target_size=(256, 256),
) -> np.ndarray:
    """Load a BMP image, convert to grayscale, resize, and return a uint8 array."""
    img = Image.open(image_path).convert("L")
    img = img.resize(target_size, Image.BICUBIC)
    return np.array(img, dtype=np.uint8)


def compute_sha256(arr: np.ndarray) -> str:
    """Compute the SHA-256 hash of the processed image array."""
    return hashlib.sha256(arr.tobytes()).hexdigest()


def get_downloads_folder() -> Path:
    """Return the current user's Downloads folder."""
    return Path.home() / "Downloads"


def create_reference_fingerprint(image_path: str, target_size=(256, 256)):
    """Process a BMP and save the fingerprint JSON in the Downloads folder."""
    arr = load_and_preprocess_image(image_path, target_size)
    sha = compute_sha256(arr)

    fingerprint_data = {
        "version": 1,
        "description": "Dendritic pattern fingerprint (DOLP camera)",
        "target_size": list(arr.shape),
        "hash_sha256": sha,
        "pixel_data": arr.flatten().tolist(),
    }

    downloads = get_downloads_folder()
    downloads.mkdir(exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = downloads / f"dendrite_fingerprint_{timestamp}.json"

    with open(output_file, "w", encoding="utf-8") as file_handle:
        json.dump(fingerprint_data, file_handle, indent=2)

    print("\n=======================================")
    print(" Fingerprint JSON successfully created!")
    print("=======================================\n")
    print(f"Input BMP:       {image_path}")
    print(f"Output JSON:     {output_file}")
    print(f"SHA-256 Hash:    {sha}\n")
    print("File is now stored in your Downloads folder.\n")


def main():
    print("\n=== DENDRITIC PATTERN ENCODER ===\n")
    image_path = input("Enter the full path to the BMP file: ").strip()

    if not Path(image_path).exists():
        print("\nERROR: File does not exist. Please check the path and try again.\n")
        return

    create_reference_fingerprint(image_path)


if __name__ == "__main__":
    main()
