# オンライン秘書電子書籍プロジェクト

## 📚 現在の状況

### ✅ 完成しているファイル

- **manuscript_raw.md** - 原稿完成版（約18,500字）
  - はじめに + 5章 + おわりに
  - LINE誘導3箇所配置済み
  - 図解タグ15枚挿入済み

- **research.md** - リサーチ結果まとめ
  - 市場調査、競合分析、主婦のニーズ、AIツール動向

- **structure.md** - 書籍構成設計書

- **image_prompts.md** - 画像生成プロンプト集（15枚分）
  - Geminiに直接コピペして使用可能

### ⚠️ 未完了の作業

- **画像生成**: nanobanana-proスクリプトのブラウザ問題により自動生成失敗
- **表紙作成**: 画像生成後に実施予定
- **DOCX変換**: 画像生成後に実施予定

---

## 🔧 画像生成の対処方法

### 方法A: 手動生成（推奨・最速）

`image_prompts.md`に15枚分のプロンプトを用意済み。

**手順:**
1. https://gemini.google.com/ を開く
2. 右下のモードを「思考」に切り替え
3. 「ツール」→「画像を作成」をクリック
4. `image_prompts.md`からプロンプトをコピー＆ペースト
5. 生成された画像を右クリック→「名前を付けて保存」
6. `output/ebook-online-hisho/images/` に指定のファイル名で保存

所要時間: 約20〜30分（1枚1〜2分）

### 方法B: ブラウザプロファイル修正後に自動生成

**手順:**
1. Chromeをすべて終了
2. `C:\Users\baseb\dev\開発1\.claude\skills\nanobanana-pro\data\browser_profile` フォルダを削除
3. `python scripts/run.py auth_manager.py setup` で再認証
4. `python generate_images.py` で自動生成

---

## 📝 次のステップ

### Phase 5.5: 表紙作成

画像生成完了後、表紙を作成します。

**表紙の要件:**
- マンガ風帯付き表紙
- タイトル: 「普通の主婦が月20万円稼ぐオンライン秘書入門」
- サブタイトル: 「SNS・顔出し不要、スキマ時間で始める新しい働き方」
- キャラクター: 明るい笑顔のビジネスウーマン
- 帯のキャッチコピー: 「2026年、最も需要が高い在宅ワークはこれだ！」
- 背景カラー: ピンク×ブルー×ゴールド

### Phase 6: DOCX変換

画像・表紙完成後、Pandocで変換します。

```bash
cd /c/Users/baseb/dev/開発1/output/ebook-online-hisho

pandoc manuscript.md \
  -o manuscript.docx \
  --from markdown \
  --to docx \
  --resource-path=. \
  --standalone \
  --dpi=150
```

---

## 📊 ファイル構成

```
output/ebook-online-hisho/
├── manuscript_raw.md          # 原稿（画像タグ付き）
├── manuscript.md              # 最終原稿（画像リンク）※未作成
├── manuscript.docx            # Word版 ※未作成
├── research.md                # リサーチ結果
├── structure.md               # 構成設計書
├── image_prompts.md           # 画像プロンプト集
├── generate_images.py         # 画像一括生成スクリプト
├── prompts.txt                # テスト用
├── README.md                  # このファイル
└── images/                    # 画像フォルダ ※未作成
    ├── ch1_header.png
    ├── ch1_img1.png
    ├── ...
    └── ch5_img4.png
```

---

## 🎯 推奨アクション

**今すぐできること:**
1. `image_prompts.md`を開く
2. Geminiで手動生成を開始（20〜30分で完了）
3. 画像が揃ったら、`manuscript.md`を作成（タグを画像パスに置換）
4. Pandocで DOCX変換
5. 完成🎉

**または:**
- ブラウザプロファイル問題を解決してから自動生成を再試行

どちらで進めますか？
