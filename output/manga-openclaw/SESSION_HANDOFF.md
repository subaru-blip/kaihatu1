# OpenClaw漫画 セッション引き継ぎ

## 進捗状況

| 範囲 | ページ | 状態 |
|------|--------|------|
| Ch1-2 | Pages 1-20 | 完了 (過去セッション) |
| Ch3-4 | Pages 21-44 | 完了 (過去セッション) |
| Ch5-6 | Pages 45-62 | 完了 (今セッション) |
| Ch7 | Pages 63-67 | 完了 (今セッション) |
| Ch7 | **Page 68** | **完了（例外処理: キャラシートなし+スマートクロップ）** |
| Ch7 | Pages 69-72 | **未生成 ← 次はここから** |
| Ch8-10+おわりに | Pages 73-103 | 未生成 |

## 残りページ数: 35枚 (69-103)

## 生成コマンドパターン（通常）

```bash
cd "C:\Users\baseb\dev\開発1\.claude\skills\nanobanana-pro" && PYTHONUTF8=1 PYTHONIOENCODING=utf-8 python scripts/run.py image_generator.py \
  --prompt "{プロンプト}" \
  --attach-image "../../../output/manga-openclaw/characters/all_characters.png" \
  --output "../../../output/manga-openclaw/panels/page_NNN.png" \
  --timeout 240
```

## リサイズコマンド

```bash
cd "C:\Users\baseb\dev\開発1\output\manga-openclaw\panels" && PYTHONUTF8=1 PYTHONIOENCODING=utf-8 "../../../.claude/skills/nanobanana-pro/.venv/Scripts/python.exe" -c "from PIL import Image; Image.open('page_NNN.png').resize((896,1200),Image.LANCZOS).save('page_NNN.png'); print('done')"
```

## 重要な問題と対策

### Page 68 横長問題
- キャラシート（1600x900, 16:9）を添付するとGeminiが出力アスペクト比を横長に合わせることがある
- Page 68はデータ表示・グラフ内容のプロンプトで毎回1024x585（横長）になった
- **対策**: キャラシートなしで生成（1024x1024）→ 3:4にスマートクロップ → 896x1200にリサイズ
- 他のページでも横長が出た場合は同じ対策を適用

### スマートクロップコード
```python
from PIL import Image
img = Image.open('page_NNN.png')
w, h = img.size
if w == h:  # 正方形 → 3:4にクロップ
    target_w = int(h * 3 / 4)
    left = (w - target_w) // 2
    img = img.crop((left, 0, left + target_w, h))
img = img.resize((896, 1200), Image.LANCZOS)
img.save('page_NNN.png')
```

### テンプレート画像について
- `manga-creator-ss/templates/テンプレ1〜10.jpg` が存在（全て1405x2000、縦長）
- 今までの69枚はテンプレ画像なし（キャラシートのみ添付）で生成
- テンプレ添付すれば縦長が安定する可能性あるが、`--attach-image`は1枚しか対応していない
- 今後対応する場合: 2枚を1枚に結合するか、スクリプトを複数画像対応に拡張が必要

### Gemini使いすぎ問題
- 連続生成でGeminiの品質低下（アスペクト比無視、文字化け等）が発生
- 時間を置いてから再開すること
- アカウント切り替え手順: `auth_manager.py clear` → `auth_manager.py setup`

## プロンプトファイル

| ファイル | 対象ページ |
|---------|-----------|
| `prompts_ch05_07.md` | Pages 45-72 (残りPages 69-72) |
| `prompts_ch08_end.md` | Pages 73-103 (未読) |

## キャラクターシート
- `characters/all_characters.png` (1600x900, 16:9)
- 3キャラ: ハルカ、テック先輩、クロー先生

## 次のセッションでやること
1. Pages 69-72 を生成（Ch7の残り）
2. Pages 73-103 を生成（Ch8-10+おわりに、prompts_ch08_end.md）
3. 全103ページ完了確認
