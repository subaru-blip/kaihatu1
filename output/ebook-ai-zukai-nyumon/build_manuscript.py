"""Replace image tags in manuscript_raw.md with actual image paths to create manuscript.md"""
import re
import os

BASE = r"C:\Users\baseb\dev\taisun_agent\output\ebook-ai-zukai-nyumon"
RAW = os.path.join(BASE, "manuscript_raw.md")
OUT = os.path.join(BASE, "manuscript.md")
IMAGES_DIR = os.path.join(BASE, "images")

# Image mapping: track which chapter/image we're on
chapter_num = 0
inline_counts = {}  # ch_num -> count

def get_next_inline(ch):
    if ch not in inline_counts:
        inline_counts[ch] = 0
    inline_counts[ch] += 1
    return inline_counts[ch]

with open(RAW, "r", encoding="utf-8") as f:
    content = f.read()

lines = content.split("\n")
output_lines = []

for line in lines:
    # Track chapter numbers
    ch_match = re.match(r"^## 第(\d+)章", line)
    if ch_match:
        chapter_num = int(ch_match.group(1))
        inline_counts[chapter_num] = 0

    # Replace HEADER_IMAGE
    header_match = re.search(r"<!-- \[HEADER_IMAGE: (.+?)\] -->", line)
    if header_match:
        desc = header_match.group(1)[:50]
        img_file = f"images/ch{chapter_num}_header.png"
        img_path = os.path.join(BASE, img_file)
        if os.path.exists(img_path):
            output_lines.append(f"![第{chapter_num}章ヘッダー]({img_file})")
        else:
            output_lines.append(line)  # Keep tag if image missing
        continue

    # Replace INLINE_IMAGE
    inline_match = re.search(r"<!-- \[INLINE_IMAGE: .+?\] -->", line)
    if inline_match:
        img_num = get_next_inline(chapter_num)
        img_file = f"images/ch{chapter_num}_img{img_num}.png"
        img_path = os.path.join(BASE, img_file)

        # Try to extract title
        title_match = re.search(r"title=([^|]+)", line)
        title = title_match.group(1).strip() if title_match else f"図解{img_num}"

        if os.path.exists(img_path):
            output_lines.append(f"![{title}]({img_file})")
        else:
            output_lines.append(line)  # Keep tag if image missing
        continue

    output_lines.append(line)

# Add cover image at the very beginning
cover_path = os.path.join(IMAGES_DIR, "cover.png")
if os.path.exists(cover_path):
    output_lines.insert(0, "![表紙](images/cover.png)\n")

result = "\n".join(output_lines)

with open(OUT, "w", encoding="utf-8") as f:
    f.write(result)

# Count replacements
img_refs = re.findall(r"!\[.+?\]\(images/.+?\)", result)
remaining_tags = re.findall(r"<!-- \[(HEADER|INLINE)_IMAGE", result)

print(f"Done: {OUT}")
print(f"  Image references: {len(img_refs)}")
print(f"  Remaining tags: {len(remaining_tags)}")
