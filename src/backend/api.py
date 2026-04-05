from datetime import datetime

from fastapi import FastAPI, File, Form, UploadFile
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from .fingerprint_api import build_fingerprint, compare_fingerprints
except ImportError:
    from fingerprint_api import build_fingerprint, compare_fingerprints


class CompareRequest(BaseModel):
    referenceFingerprint: dict
    candidateFingerprint: dict


app = FastAPI(title="Oracle Lens Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/encode")
async def encode_image(slotId: str = Form(...), file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        fingerprint = build_fingerprint(image_bytes)
        timestamp = datetime.utcnow().isoformat()
        stem = file.filename.rsplit(".", 1)[0] if file.filename else slotId

        return {
            "slotId": slotId,
            "jsonFileName": f"{stem}_fingerprint.json",
            "encodedAt": timestamp,
            "fingerprint": fingerprint,
        }
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/compare")
def compare_outputs(payload: CompareRequest):
    try:
        result = compare_fingerprints(
            payload.referenceFingerprint,
            payload.candidateFingerprint,
        )
        compared_at = datetime.utcnow().isoformat()

        return {
            "comparisonState": "complete",
            "summary": (
                f"Hash match: {result['hash_match']}. "
                f"MSE pass: {result['mse_pass']}. "
                f"MSE: {result['mse']:.2f} / {result['mse_threshold']:.2f}."
            ),
            "comparedAt": compared_at,
            "similarityScore": result["similarity_score"],
            "outcome": result["outcome"],
            "hashMatch": result["hash_match"],
            "msePass": result["mse_pass"],
            "mse": result["mse"],
            "mseThreshold": result["mse_threshold"],
        }
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
