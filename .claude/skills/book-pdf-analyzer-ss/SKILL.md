---
name: book-pdf-analyzer-ss
description: |
  書籍PDFを完全解析するスキル。全文テキスト抽出、章構造の自動検出、
  章ごと要約、キーポイント分析、アクションプラン抽出を一括実行。
  ビジネス書・技術書・ハウツー本など全ジャンル対応。
  Use when: (1) user says「本を分析して」「書籍PDFを解析」「この本のまとめ」,
  (2) user shares a book PDF file or URL,
  (3) user mentions「章ごとの要約」「キーポイント」「本の構造」「ブックレビュー」,
  (4) user says「book-pdf-analyzer-ss」「PDF本」「ビジネス書分析」「技術書分析」.
  Do NOT use for: 一般的なPDF抽出（pdf-processingを使用）、
  電子書籍の作成（ebook-creator-ssを使用）、
  短いドキュメントの分析（5ページ以下は直接Readで対応）。
tools:
  - Read
  - Write
  - Bash
  - WebFetch
---

# Book PDF Analyzer - 書籍PDF完全解析スキル

## Overview

書籍PDF（50〜500+ページ）を6フェーズで完全解析し、全文テキスト化 + 構造分析 + 章ごと要約 + アクションプランを一括生成するスキル。

**対応ジャンル:**
- ビジネス・マーケティング書（戦略フレームワーク検出、アクションプラン）
- 技術書・ハウツー本（手順抽出、ツール・技法リスト、実践チェックリスト）
- 自己啓発・教育書（マインドセット、行動変容ポイント）
- 汎用（ジャンル不明時のデフォルト分析）

## Quick Reference

| Phase | 名前 | 内容 | 出力 |
|-------|------|------|------|
| 1 | PDF読み込み | メタデータ取得 | ページ数、タイトル、著者 |
| 2 | 全文テキスト抽出 | 20ページずつチャンク処理 | `{book}_full-text.md` |
| 3 | 構造解析 | 目次・章見出し自動検出 | 構造マップ |
| 4 | 章ごと要約 | 各章300-500字要約 + キーポイント | 章別要約 |
| 5 | 分析レポート | ジャンル別テンプレで総合分析 | `{book}_analysis.md` |
| 6 | ファイル出力 | Markdownで保存 | outputフォルダ |

## 使い方

```
# ローカルPDFを分析
「この本を分析して: C:\Users\baseb\Documents\marketing-book.pdf」

# URLのPDFを分析
「この書籍PDFを解析して: https://example.com/business-book.pdf」

# ジャンル指定
「この技術書を分析して: /path/to/manga-howto.pdf」
```

---

## Phase 1: PDF読み込み

### 手順

1. **ソース判定**: ローカルパスかURLかを判定
2. **URLの場合**: ダウンロードしてローカルに保存
   ```bash
   PYTHONIOENCODING=utf-8 curl -L -o /tmp/book_analysis.pdf "URL"
   ```
3. **メタデータ取得**: Readツールでページ数を確認
4. **ユーザーに報告**:
   ```
   書籍情報:
   - ファイル: {filename}
   - 総ページ数: {N}ページ
   - 推定処理チャンク数: {ceil(N/20)}回
   ```
5. **300ページ超の場合**: 処理に時間がかかる旨を伝えてから続行

### ジャンル自動判定

メタデータとタイトル、最初の数ページの内容から以下を推定:
- 「マーケティング」「セールス」「経営」「戦略」「売上」→ **ビジネス**
- 「作り方」「入門」「実践」「テクニック」「プログラミング」「手順」→ **技術・ハウツー**
- 「習慣」「マインド」「成功」「人生」「メンタル」→ **自己啓発**
- 判定不能 → **汎用**

---

## Phase 2: 全文テキスト抽出（チャンク処理）

### 核心ロジック: 20ページずつの順次処理

```
CHUNK_SIZE = 20  (Readツールの1回あたり上限)

総ページ数 N のPDFの場合:
  チャンク数 = ceil(N / 20)

  チャンク1: Read(pages="1-20")   → テキスト取得 → ファイルに追記
  チャンク2: Read(pages="21-40")  → テキスト取得 → ファイルに追記
  チャンク3: Read(pages="41-60")  → テキスト取得 → ファイルに追記
  ...
  最終チャンク: Read(pages="X-N") → テキスト取得 → ファイルに追記
```

### 実行手順

1. **出力ディレクトリ作成**:
   ```bash
   mkdir -p output/book-pdf-analyzer-ss/{book-slug}
   ```

2. **book-slugの生成**: タイトルからスラッグを生成
   - 英数字・日本語はそのまま
   - スペース → ハイフン
   - 50文字以内に切り詰め

3. **チャンク処理ループ**:
   各チャンクで以下を実行:
   - `Read` ツールでPDFの該当ページ範囲を読み取り
   - 取得したテキストを以下の形式で `_full-text.md` に追記:
     ```markdown
     ---
     ## ページ {start}-{end}
     ---

     {抽出テキスト}

     ```
   - 進捗報告: `「ページ {start}-{end} / {N} 抽出完了（{percentage}%）」`

4. **空テキスト検出**: チャンクのテキストが空の場合
   - スキャンPDFの可能性あり → Pythonスクリプトでのフォールバックを試行
   - `PYTHONIOENCODING=utf-8 python scripts/extract_book_pdf.py {path} --pages {start}-{end}`

5. **全チャンク完了後**: `_full-text.md` の先頭にヘッダーを追加:
   ```markdown
   # {書籍タイトル} - 全文テキスト

   - 著者: {author}
   - ページ数: {N}
   - 抽出日: {date}
   - 抽出方法: Claude Read Tool (20ページチャンク)

   ---
   ```

### フォールバック: Pythonスクリプト

Readツールでテキストが取得できない場合:

```bash
# 依存ライブラリのインストール（初回のみ）
PYTHONIOENCODING=utf-8 pip install pypdf pdfplumber

# テキスト抽出
PYTHONIOENCODING=utf-8 python .claude/skills/book-pdf-analyzer-ss/scripts/extract_book_pdf.py \
  "{pdf_path}" --pages 1-20 --output /tmp/chunk1.txt
```

---

## Phase 3: 構造解析

### 章・セクション検出

抽出した全文テキストから以下のパターンで章を検出:

**日本語の章パターン:**
- `第一章`, `第1章`, `第１章` など（漢数字・アラビア数字・全角数字）
- `はじめに`, `おわりに`, `まえがき`, `あとがき`, `序章`, `終章`
- `CHAPTER 1`, `Chapter 1`（英語混在書籍）

**セクションパターン:**
- `1.1`, `1-1`, `第1節` など
- 数字始まりの行（`1.`, `2.`, `3.`）

**検出手順:**
1. `_full-text.md` をGrepツールで章パターン検索
2. 各章の開始ページを特定
3. 章が検出されない場合 → 30ページごとに「Part 1, Part 2...」として分割

### 構造マップ出力形式

```markdown
## 書籍構造マップ

### メタデータ
| 項目 | 内容 |
|------|------|
| タイトル | {title} |
| 著者 | {author} |
| 総ページ数 | {pages} |
| 検出ジャンル | {genre} |
| 章数 | {N}章 |

### 目次
1. はじめに (p.1-8)
2. 第1章: {タイトル} (p.9-42)
3. 第2章: {タイトル} (p.43-78)
...
N. おわりに (p.XXX-XXX)
```

---

## Phase 4: 章ごと要約

### 各章の分析テンプレート

Phase 3で検出した各章について、該当ページのテキストを読み、以下を生成:

```markdown
### 第N章: {章タイトル}

**ページ**: p.XX - p.XX | **推定文字数**: 約X,XXX字

#### 要約（300-500字）
{この章が何について書かれているかの要約}

#### キーポイント
1. {key point 1}
2. {key point 2}
3. {key point 3}
（最大5つ）

#### 重要フレーズ・引用
- 「{印象的なフレーズ}」(p.XX付近)

#### この章のアクションアイテム
- [ ] {読者が実行すべきこと 1}
- [ ] {読者が実行すべきこと 2}
```

### 長い章の処理（40ページ超）

章が40ページを超える場合:
1. 前半・後半に分けて要約を生成
2. 両方の要約を統合して最終要約にする

---

## Phase 5: 分析レポート

### ジャンル別分析

ジャンルに応じて `references/analysis-frameworks.md` のテンプレートを適用。

#### ビジネス・マーケティング書の場合

```markdown
## ビジネスフレームワーク分析

### 検出されたフレームワーク
{書籍内で使われている/言及されているフレームワーク}
（例: 4P, STP, AIDMA, ファネル, ポジショニングマップ等）

### マーケティング戦略の整理
| 戦略領域 | 著者の主張 | 該当章 |
|----------|-----------|--------|
| ターゲット | {details} | 第X章 |
| ポジショニング | {details} | 第X章 |
| 差別化 | {details} | 第X章 |
| 集客 | {details} | 第X章 |
| セールス | {details} | 第X章 |

### 著者独自のメソッド
{著者が提唱するオリジナルの手法・理論}

### 数字・実績データ
{書籍内で引用されている具体的な数値}
```

#### 技術書・ハウツー本の場合

```markdown
## テクニック・手順分析

### 必要なツール・スキル
| ツール/スキル | レベル | 該当章 |
|-------------|--------|--------|
| {tool/skill} | 初級/中級/上級 | 第X章 |

### ステップバイステップ手順（書籍全体）
1. {大きなステップ 1} (第X章)
2. {大きなステップ 2} (第X章)
3. ...

### テクニック一覧
| No. | テクニック名 | 概要 | 難易度 |
|-----|-------------|------|--------|
| 1 | {name} | {summary} | {level} |

### 実践チェックリスト
- [ ] {practice item 1}
- [ ] {practice item 2}
```

#### 汎用の場合

```markdown
## 総合分析

### 著者の主要メッセージ
{本全体を通じて著者が最も伝えたいこと}

### 論の構造
{問題提起 → 分析 → 解決策 → 結論 の流れ}

### 対象読者
{この本が最も役立つ人}
```

### 共通セクション（全ジャンル共通）

```markdown
# {書籍タイトル} 分析レポート

## 書籍情報
| 項目 | 内容 |
|------|------|
| タイトル | {title} |
| 著者 | {author} |
| ページ数 | {pages} |
| 分析日 | {date} |
| ジャンル | {genre} |

## エグゼクティブサマリー（500字以内）
{この本のエッセンスを凝縮した要約}

## 書籍構造マップ
{Phase 3の構造マップ}

## 章別要約
{Phase 4の全章要約}

## {ジャンル別分析セクション}
{上記のジャンル別分析}

## 全体キーポイント TOP 10
1. {最重要インサイト}
2. ...
10. ...

## アクションプラン

### 今すぐ実行（今日）
1. {immediate action}
2. {immediate action}

### 短期（1-2週間）
1. {short-term action}
2. {short-term action}

### 中長期（1-3ヶ月）
1. {long-term action}
2. {long-term action}

## この本の評価
| 観点 | 評価 | コメント |
|------|------|---------|
| 実用性 | ★★★★☆ | {comment} |
| 読みやすさ | ★★★★☆ | {comment} |
| 独自性 | ★★★☆☆ | {comment} |
| 再読価値 | ★★★★☆ | {comment} |

## 関連・次に読むべき本
- {recommendation 1} - {理由}
- {recommendation 2} - {理由}
```

---

## Phase 6: ファイル出力

### 出力先

```
output/book-pdf-analyzer-ss/{book-slug}/
├── {book-slug}_full-text.md    # Phase 2: 全文テキスト（ページ番号付き）
└── {book-slug}_analysis.md     # Phase 3-5: 分析レポート（構造+要約+分析+アクション）
```

### 完了報告

```
書籍PDF分析が完了しました:

- 書籍: {タイトル}
- ページ数: {N}ページ
- 検出した章: {M}章
- ジャンル: {genre}

出力ファイル:
  1. {book-slug}_full-text.md  ({X} KB) - 全文テキスト
  2. {book-slug}_analysis.md   ({Y} KB) - 分析レポート

出力先: output/book-pdf-analyzer-ss/{book-slug}/
```

---

## エラーハンドリング

| 問題 | 対処法 |
|------|--------|
| テキストが空 | スキャンPDFの可能性 → Python OCRフォールバック |
| 文字化け | pdfplumber → pypdf → pdftotext の順で再試行 |
| 章が検出できない | 30ページごとに自動分割 |
| ページ数が500超 | 処理継続するか確認してから実行 |
| URL PDFダウンロード失敗 | User-Agentヘッダー付きでリトライ |
| Python未インストール | `pip install pypdf pdfplumber` を自動実行 |

## トラブルシューティング

### Readツールでテキストが取れない場合
```bash
# Pythonフォールバックを使用
PYTHONIOENCODING=utf-8 pip install pypdf pdfplumber
PYTHONIOENCODING=utf-8 python .claude/skills/book-pdf-analyzer-ss/scripts/extract_book_pdf.py \
  "{pdf_path}" --output output.txt
```

### 日本語が文字化けする場合
```bash
# pdfplumberを優先使用（日本語対応が良い）
PYTHONIOENCODING=utf-8 python .claude/skills/book-pdf-analyzer-ss/scripts/extract_book_pdf.py \
  "{pdf_path}" --method pdfplumber --output output.txt
```
