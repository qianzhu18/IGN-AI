#!/usr/bin/env python3

import argparse
import base64
import mimetypes
import os
from pathlib import Path

import requests


DEFAULT_URL = (
    "https://www.sophnet.com/api/open-apis/projects/easyllms/imagegenerator/"
    "google/models/gemini-3-pro-image-preview:generateContent"
)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Generate an image with Sophnet Gemini image preview.",
    )
    parser.add_argument("--prompt", required=True, help="Prompt text.")
    parser.add_argument("--output", required=True, help="Output image path.")
    parser.add_argument(
        "--api-key-env",
        default="SOPHNET_API_KEY",
        help="Environment variable that stores the API key.",
    )
    parser.add_argument(
        "--url",
        default=DEFAULT_URL,
        help="Override the API endpoint if needed.",
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=120,
        help="Request timeout in seconds.",
    )
    return parser


def infer_output_path(path: Path, mime_type: str | None) -> Path:
    if path.suffix:
        return path

    extension = mimetypes.guess_extension(mime_type or "") or ".png"
    if extension == ".jpe":
        extension = ".jpg"
    return path.with_suffix(extension)


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    api_key = os.getenv(args.api_key_env, "").strip().strip("{}")
    if not api_key:
        raise SystemExit(
            f"Please set the {args.api_key_env} environment variable before running.",
        )

    response = requests.post(
        args.url,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        json={
            "contents": [
                {
                    "parts": [
                        {
                            "text": args.prompt,
                        },
                    ],
                },
            ],
        },
        timeout=args.timeout,
    )

    print(f"Status code: {response.status_code}")
    data = response.json()

    if response.status_code != 200:
        raise SystemExit(data)

    inline_data = data["candidates"][0]["content"]["parts"][0]["inlineData"]
    output_path = infer_output_path(Path(args.output), inline_data.get("mimeType"))
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(base64.b64decode(inline_data["data"]))

    print(f"Saved image to {output_path}")


if __name__ == "__main__":
    main()
