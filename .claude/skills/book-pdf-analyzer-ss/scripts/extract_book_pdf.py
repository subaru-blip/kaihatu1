#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Book PDF Extractor - 書籍PDF用テキスト抽出ヘルパー

Usage:
  python extract_book_pdf.py <pdf_path_or_url> [options]

Options:
  --pages START-END    ページ範囲指定（例: --pages 1-20）
  --method METHOD      抽出方法: auto/pdfplumber/pypdf (default: auto)
  --detect-chapters    章見出しを検出してJSON出力
  --metadata           メタデータをJSON出力
  --output FILE        出力ファイルパス
  --output-dir DIR     チャンク分割出力先ディレクトリ
  --chunk-size N       チャンクサイズ（default: 20）

Examples:
  python extract_book_pdf.py book.pdf
  python extract_book_pdf.py book.pdf --pages 1-20 --output chunk1.txt
  python extract_book_pdf.py book.pdf --detect-chapters
  python extract_book_pdf.py book.pdf --metadata
  python extract_book_pdf.py https://example.com/book.pdf --output book.txt
"""

import sys
import os
import re
import json
import argparse
import ssl
import math
from pathlib import Path
from urllib.request import urlretrieve, Request
from urllib.request import urlopen

# --- 依存ライブラリの自動インストール ---
def ensure_dependencies():
    """必要なライブラリがなければインストール"""
    missing = []
    try:
        import pypdf
    except ImportError:
        missing.append("pypdf")
    try:
        import pdfplumber
    except ImportError:
        missing.append("pdfplumber")

    if missing:
        print(f"[INFO] Installing missing dependencies: {', '.join(missing)}", file=sys.stderr)
        import subprocess
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "--quiet"] + missing
        )

ensure_dependencies()

import pypdf
import pdfplumber


# --- 章見出しパターン ---
CHAPTER_PATTERNS = [
    # 日本語
    (r'^第[一二三四五六七八九十百千\d０-９]+章', 'chapter'),
    (r'^第[一二三四五六七八九十百千\d０-９]+節', 'section'),
    (r'^第[一二三四五六七八九十百千\d０-９]+部', 'part'),
    (r'^(はじめに|まえがき|序章|序文|プロローグ)', 'intro'),
    (r'^(おわりに|あとがき|終章|エピローグ)', 'outro'),
    # 英語
    (r'^Chapter\s+\d+', 'chapter'),
    (r'^CHAPTER\s+\d+', 'chapter'),
    (r'^Part\s+[IVX\d]+', 'part'),
    (r'^(Introduction|Preface|Prologue)', 'intro'),
    (r'^(Conclusion|Epilogue|Afterword)', 'outro'),
]


def download_pdf(url, output_path="/tmp/book_analysis.pdf"):
    """URLからPDFをダウンロード"""
    print(f"[INFO] Downloading: {url}", file=sys.stderr)
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(req, context=ctx) as response:
        with open(output_path, "wb") as f:
            f.write(response.read())
    print(f"[INFO] Saved to: {output_path}", file=sys.stderr)
    return output_path


def get_metadata(pdf_path):
    """PDFメタデータをdict形式で返す"""
    result = {
        "file": str(pdf_path),
        "pages": 0,
        "title": "",
        "author": "",
        "subject": "",
        "creator": "",
    }

    try:
        reader = pypdf.PdfReader(pdf_path)
        result["pages"] = len(reader.pages)
        meta = reader.metadata
        if meta:
            result["title"] = str(meta.get("/Title", "") or "")
            result["author"] = str(meta.get("/Author", "") or "")
            result["subject"] = str(meta.get("/Subject", "") or "")
            result["creator"] = str(meta.get("/Creator", "") or "")
    except Exception as e:
        print(f"[WARN] pypdf metadata failed: {e}", file=sys.stderr)

    return result


def extract_text_pdfplumber(pdf_path, start_page=None, end_page=None):
    """pdfplumberでテキスト抽出（日本語に強い）"""
    texts = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            total = len(pdf.pages)
            s = (start_page or 1) - 1
            e = min((end_page or total), total)

            for i in range(s, e):
                page = pdf.pages[i]
                text = page.extract_text()
                if text:
                    texts.append(f"--- Page {i + 1} ---\n{text}")
                else:
                    texts.append(f"--- Page {i + 1} ---\n[テキスト抽出不可]")
    except Exception as e:
        print(f"[WARN] pdfplumber failed: {e}", file=sys.stderr)
        return None

    return "\n\n".join(texts) if texts else None


def extract_text_pypdf(pdf_path, start_page=None, end_page=None):
    """pypdfでテキスト抽出（フォールバック）"""
    texts = []
    try:
        reader = pypdf.PdfReader(pdf_path)
        total = len(reader.pages)
        s = (start_page or 1) - 1
        e = min((end_page or total), total)

        for i in range(s, e):
            text = reader.pages[i].extract_text()
            if text:
                texts.append(f"--- Page {i + 1} ---\n{text}")
            else:
                texts.append(f"--- Page {i + 1} ---\n[テキスト抽出不可]")
    except Exception as e:
        print(f"[WARN] pypdf failed: {e}", file=sys.stderr)
        return None

    return "\n\n".join(texts) if texts else None


def extract_text(pdf_path, method="auto", start_page=None, end_page=None):
    """テキスト抽出（フォールバックチェーン）"""
    if method == "pdfplumber":
        return extract_text_pdfplumber(pdf_path, start_page, end_page)
    elif method == "pypdf":
        return extract_text_pypdf(pdf_path, start_page, end_page)
    else:
        # auto: pdfplumber優先 → pypdfフォールバック
        text = extract_text_pdfplumber(pdf_path, start_page, end_page)
        if text and "[テキスト抽出不可]" not in text:
            return text
        text2 = extract_text_pypdf(pdf_path, start_page, end_page)
        if text2:
            return text2
        return text  # pdfplumberの結果を返す（部分的でも）


def detect_chapters(pdf_path):
    """書籍の章見出しを検出してリスト化"""
    text = extract_text(pdf_path)
    if not text:
        return []

    chapters = []
    current_page = 0

    for line in text.split("\n"):
        # ページマーカーからページ番号を追跡
        page_match = re.match(r'^--- Page (\d+) ---$', line)
        if page_match:
            current_page = int(page_match.group(1))
            continue

        stripped = line.strip()
        if not stripped:
            continue

        for pattern, heading_type in CHAPTER_PATTERNS:
            if re.match(pattern, stripped):
                chapters.append({
                    "title": stripped,
                    "page": current_page,
                    "type": heading_type,
                })
                break

    return chapters


def extract_chunks(pdf_path, output_dir, chunk_size=20, method="auto"):
    """チャンク分割して出力ディレクトリに保存"""
    meta = get_metadata(pdf_path)
    total_pages = meta["pages"]
    total_chunks = math.ceil(total_pages / chunk_size)

    os.makedirs(output_dir, exist_ok=True)

    for i in range(total_chunks):
        start = i * chunk_size + 1
        end = min((i + 1) * chunk_size, total_pages)
        chunk_file = os.path.join(output_dir, f"chunk_{i+1:03d}_p{start}-{end}.txt")

        print(f"[INFO] Extracting pages {start}-{end} ({i+1}/{total_chunks})", file=sys.stderr)
        text = extract_text(pdf_path, method, start, end)

        with open(chunk_file, "w", encoding="utf-8") as f:
            f.write(text or "[抽出失敗]")

    print(f"[INFO] All {total_chunks} chunks saved to {output_dir}", file=sys.stderr)
    return total_chunks


def main():
    parser = argparse.ArgumentParser(description="Book PDF Extractor")
    parser.add_argument("pdf_path", help="PDF file path or URL")
    parser.add_argument("--pages", help="Page range (e.g., 1-20)")
    parser.add_argument("--method", default="auto", choices=["auto", "pdfplumber", "pypdf"])
    parser.add_argument("--detect-chapters", action="store_true", help="Detect chapter headings")
    parser.add_argument("--metadata", action="store_true", help="Output metadata as JSON")
    parser.add_argument("--output", help="Output file path")
    parser.add_argument("--output-dir", help="Output directory for chunked extraction")
    parser.add_argument("--chunk-size", type=int, default=20, help="Chunk size in pages")

    args = parser.parse_args()

    # URLの場合はダウンロード
    pdf_path = args.pdf_path
    if pdf_path.startswith("http://") or pdf_path.startswith("https://"):
        pdf_path = download_pdf(pdf_path)

    # メタデータ出力
    if args.metadata:
        meta = get_metadata(pdf_path)
        print(json.dumps(meta, ensure_ascii=False, indent=2))
        return

    # 章検出
    if args.detect_chapters:
        chapters = detect_chapters(pdf_path)
        print(json.dumps(chapters, ensure_ascii=False, indent=2))
        return

    # チャンク分割出力
    if args.output_dir:
        extract_chunks(pdf_path, args.output_dir, args.chunk_size, args.method)
        return

    # ページ範囲指定
    start_page = None
    end_page = None
    if args.pages:
        parts = args.pages.split("-")
        start_page = int(parts[0])
        end_page = int(parts[1]) if len(parts) > 1 else start_page

    # テキスト抽出
    text = extract_text(pdf_path, args.method, start_page, end_page)

    if text:
        if args.output:
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(text)
            print(f"[INFO] Saved to {args.output}", file=sys.stderr)
        else:
            print(text)
    else:
        print("[ERROR] Failed to extract text from PDF", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
