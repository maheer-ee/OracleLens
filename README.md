# Oracle Lens

Frontend for Oracle Lens.

## Local project layout

- `frontend/` runs the Vite React application.
- `../backend/` runs the FastAPI image encoding and comparison service.

## Running locally

From this folder:

```sh
npm run dev
```

From `../backend`:

```sh
uvicorn api:app --reload
```

## Notes

- Built with Vite, React, TypeScript, and Tailwind CSS
- Camera access is currently mocked; backend workflow calls use the local FastAPI service at `http://127.0.0.1:8000`
