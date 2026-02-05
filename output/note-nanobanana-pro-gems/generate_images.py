#!/usr/bin/env python3
"""
Temporary script to generate note article images via Gemini native image generation.
Uses the same browser profile as nanobanana-pro but skips the NanoBanana Gem button.
"""

import json
import time
import base64
import sys
import csv
from pathlib import Path

# Add nanobanana-pro scripts to path for imports
SKILL_ROOT = Path(r"C:\Users\baseb\dev\開発1\.claude\skills\nanobanana-pro")
sys.path.insert(0, str(SKILL_ROOT / "scripts"))

from patchright.sync_api import sync_playwright
from config import BROWSER_PROFILE_DIR, STATE_FILE, BROWSER_ARGS, USER_AGENT


def generate_single(page, prompt, output_path, timeout=180):
    """Generate a single image using Gemini's native image generation."""
    print(f"\n{'='*60}")
    print(f"Generating: {Path(output_path).name}")
    print(f"{'='*60}")

    # Navigate to fresh chat
    page.goto("https://gemini.google.com/app", wait_until="domcontentloaded", timeout=30000)
    page.wait_for_timeout(4000)

    # Find input field
    inp = None
    for sel in ['div[contenteditable="true"]', 'textarea']:
        try:
            loc = page.locator(sel)
            if loc.count() > 0 and loc.first.is_visible():
                inp = loc.first
                break
        except:
            continue

    if not inp:
        print("  ERROR: Input field not found")
        return False

    # Type prompt directly (Gemini can generate images natively)
    inp.click()
    time.sleep(0.5)
    inp.fill(prompt)
    page.wait_for_timeout(500)

    # Send
    sent = False
    for sel in ['button[aria-label*="送信"]', 'button[aria-label*="Send"]']:
        try:
            loc = page.locator(sel)
            for i in range(loc.count()):
                btn = loc.nth(i)
                if btn.is_visible():
                    btn.click()
                    sent = True
                    break
            if sent:
                break
        except:
            continue

    if not sent:
        inp.press("Enter")

    print("  Waiting for image generation...")

    # Wait for image
    start = time.time()
    while time.time() - start < timeout:
        elapsed = int(time.time() - start)
        if elapsed % 30 == 0 and elapsed > 0:
            print(f"    {elapsed}s elapsed...")

        for sel in ['img[src*="googleusercontent"]', 'img[src*="lh3.google"]']:
            try:
                loc = page.locator(sel)
                for i in range(loc.count()):
                    img = loc.nth(i)
                    if img.is_visible():
                        bbox = img.bounding_box()
                        if bbox and bbox['width'] > 200 and bbox['height'] > 200:
                            # Found generated image
                            src = img.get_attribute('src') or ''
                            if 'googleusercontent' in src:
                                print("  Image found! Downloading...")
                                if src.startswith('data:'):
                                    data = base64.b64decode(src.split(',')[1])
                                    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
                                    Path(output_path).write_bytes(data)
                                elif src.startswith('http'):
                                    resp = page.request.get(src)
                                    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
                                    Path(output_path).write_bytes(resp.body())
                                else:
                                    img.screenshot(path=output_path)
                                print(f"  SAVED: {output_path}")
                                return True
            except:
                continue

        # Check for errors
        for err_text in ["画像を生成できません", "生成できませんでした", "I cannot help"]:
            try:
                if page.locator(f'text="{err_text}"').count() > 0:
                    print(f"  ERROR: Gemini declined ({err_text})")
                    return False
            except:
                pass

        page.wait_for_timeout(2000)

    print(f"  TIMEOUT after {timeout}s")
    return False


def main():
    # Load prompts from CSV
    csv_path = Path(r"C:\Users\baseb\dev\開発1\output\note-nanobanana-pro-gems\image_prompts.csv")
    images_dir = Path(r"C:\Users\baseb\dev\開発1\output\note-nanobanana-pro-gems\images")
    images_dir.mkdir(parents=True, exist_ok=True)

    prompts = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            output_file = images_dir / row['filename']
            if output_file.exists():
                print(f"SKIP (exists): {row['filename']}")
                continue
            prompts.append({
                'id': row['id'],
                'filename': row['filename'],
                'prompt': row['prompt'],
                'output': str(output_file)
            })

    if not prompts:
        print("All images already exist!")
        return 0

    print(f"\nWill generate {len(prompts)} images")
    print(f"Already done: {16 - len(prompts)}")

    # Launch browser
    pw = sync_playwright().start()
    ctx = pw.chromium.launch_persistent_context(
        user_data_dir=str(BROWSER_PROFILE_DIR),
        channel="chrome",
        headless=False,
        no_viewport=True,
        ignore_default_args=["--enable-automation"],
        user_agent=USER_AGENT,
        args=BROWSER_ARGS
    )

    # Inject cookies
    if STATE_FILE.exists():
        with open(STATE_FILE, 'r') as f:
            state = json.load(f)
        if 'cookies' in state:
            ctx.add_cookies(state['cookies'])
            print(f"Restored {len(state['cookies'])} cookies")

    page = ctx.pages[0] if ctx.pages else ctx.new_page()

    # Generate each image
    success = 0
    failed = 0
    for i, p in enumerate(prompts):
        print(f"\n[{i+1}/{len(prompts)}] {p['filename']}")
        if generate_single(page, p['prompt'], p['output']):
            success += 1
        else:
            failed += 1
        # Brief pause between generations
        time.sleep(2)

    ctx.close()
    pw.stop()

    print(f"\n{'='*60}")
    print(f"DONE: {success} success, {failed} failed")
    print(f"{'='*60}")

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
