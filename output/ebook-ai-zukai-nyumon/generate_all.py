"""Batch image generation script for ebook."""
import json
import subprocess
import sys
import os
import time

SKILL_DIR = r"C:\Users\baseb\dev\taisun_agent\.claude\skills\nanobanana-pro"
OUTPUT_BASE = r"C:\Users\baseb\dev\taisun_agent\output\ebook-ai-zukai-nyumon"
PROMPTS_FILE = os.path.join(OUTPUT_BASE, "prompts.json")

def generate_image(prompt_text: str, output_path: str, image_id: str) -> bool:
    """Generate a single image using nanobanana-pro."""
    full_output = os.path.join(OUTPUT_BASE, output_path)

    # Skip if already generated
    if os.path.exists(full_output) and os.path.getsize(full_output) > 1000:
        print(f"  SKIP {image_id} (already exists: {output_path})")
        return True

    print(f"  GENERATING {image_id} -> {output_path}")

    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    env["PYTHONUTF8"] = "1"

    cmd = [
        sys.executable if sys.executable else "python",
        os.path.join(SKILL_DIR, "scripts", "run.py"),
        "image_generator.py",
        "--prompt", prompt_text,
        "--output", full_output,
        "--timeout", "180"
    ]

    try:
        result = subprocess.run(
            cmd,
            cwd=SKILL_DIR,
            capture_output=True,
            text=True,
            timeout=240,
            env=env
        )

        if result.returncode == 0 and os.path.exists(full_output):
            size = os.path.getsize(full_output)
            print(f"  OK {image_id} ({size:,} bytes)")
            return True
        else:
            print(f"  FAIL {image_id}: exit={result.returncode}")
            if result.stderr:
                # Print last 3 lines of stderr
                lines = result.stderr.strip().split('\n')
                for line in lines[-3:]:
                    print(f"    {line}")
            return False
    except subprocess.TimeoutExpired:
        print(f"  TIMEOUT {image_id}")
        return False
    except Exception as e:
        print(f"  ERROR {image_id}: {e}")
        return False


def main():
    with open(PROMPTS_FILE, "r", encoding="utf-8") as f:
        prompts = json.load(f)

    total = len(prompts)
    success = 0
    failed = []

    # Allow starting from a specific index
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 0

    print(f"=== Generating {total} images (starting from #{start}) ===\n")

    for i, item in enumerate(prompts):
        if i < start:
            continue

        image_id = item["id"]
        output_path = item["output"]
        prompt_text = item["prompt"]

        print(f"\n[{i+1}/{total}] {image_id}")

        ok = generate_image(prompt_text, output_path, image_id)
        if ok:
            success += 1
        else:
            failed.append(image_id)

        # Brief pause between generations to avoid rate limiting
        if i < total - 1:
            time.sleep(3)

    print(f"\n=== DONE: {success}/{total} succeeded ===")
    if failed:
        print(f"Failed: {', '.join(failed)}")

    return 0 if not failed else 1


if __name__ == "__main__":
    main()
