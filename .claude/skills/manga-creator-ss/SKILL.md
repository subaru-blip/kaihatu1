---
name: manga-creator-ss
description: 原稿やテーマから漫画を一括生成する複合スキル。神話の法則でストーリー構造化 → キャラクター設計 → コマ割りプロンプト生成 → nanobanana-proで画像順次生成。書籍の長さに合わせたコマ数に対応。
---

# Manga Creator - 漫画一括生成スキル

原稿/テーマ → ストーリー構造化 → キャラ設計画 → ページ別プロンプト生成 → 画像一括生成。

## When to Use This Skill

- 「漫画を作って」「マンガを一括生成したい」
- 「この原稿を漫画化して」
- 「漫画を大量に作りたい」
- 「〇〇というテーマで漫画を作って」
- 「Webtoonを作りたい」

## Do NOT Use for

- 単発の漫画パネル1枚 → `nanobanana-pro` を使用
- キャラクターシートのみ → `custom-character` を使用
- 漫画制作のガイド・相談 → `ai-manga-generator` を使用
- アニメ動画制作 → `anime-production` を使用

## 参考フォルダ

テンプレート画像やリファレンス画像は以下に格納:

```
.claude/skills/manga-creator-ss/templates/
├── template_1.png    # テンプレ1: ページ全体を使った1コマ
├── template_2.png    # テンプレ2: 上下2分割（上段→下段）
├── template_3.png    # テンプレ3: 上下2分割（上段小→下段大）
├── template_4.png    # テンプレ4: 上下2分割（上段大→下段小）
├── template_5.png    # テンプレ5: 上・中・下の3段構成
├── template_6.png    # テンプレ6: 上段1コマ+下段左右2コマ
├── template_7.png    # テンプレ7: 上段左右2コマ+下段1コマ
├── template_8.png    # テンプレ8: 上段横長+中段左右+下段横長
├── template_9.png    # テンプレ9: 上段横長+下段右縦長+左上下分割
├── template_10.png   # テンプレ10: 上段横長+下段左縦長+右上下分割
└── (ユーザーが画像を入れる)
```

## 全体フロー（3ステップ + 画像生成）

```
Step 1: ストーリー構成案の作成
   │  ユーザーから原稿/文章を受け取る（必須）
   │  神話の法則で感情曲線設計
   │  書籍の長さに合わせたコマ数で細かいカット割り台本作成
   │  → 確認なしで即Step 2へ
   ▼
Step 2: キャラクター設計画
   │  2回以上登場する全キャラの設計画プロンプトを作成
   │  全キャラを1枚に並べた画像を nanobanana-pro で生成
   │  各キャラの外見プロンプトテキストをDBとして保存（後のStep 3で毎回使用）
   │  → 確認なしで即Step 3へ
   ▼
Step 3: ページ別プロンプト生成
   │  各ページのNanoBanana用プロンプトを英語で作成（セリフ部分のみ日本語）
   │  ★ 毎回キャラの外見詳細テキストを埋め込む（一貫性確保）
   │  全ページ分を一括出力
   │  → 確認なしで画像一括生成へ
   ▼
画像一括生成:
   │  nanobanana-pro で全ページ順次生成
   │  生成後 896x1200px にリサイズ
   │  進捗トラッキング + 中断再開対応
   ▼
完成！
```

### キャラクター一貫性の確保方法

**2つの方法を併用して一貫性を最大化する:**

#### 1. テキスト埋め込み（必須）
- Step 2で各キャラの外見プロンプト（英語テキスト）を定義する
- Step 3の英語プロンプト（Part B）で、登場キャラの外見テキストを毎回埋め込む
- 「Character name & details」フィールドに毎回同じ外見定義を記述する

#### 2. キャラクターシート画像の添付（`--attach-image`）
- nanobanana-pro の `--attach-image` を使い、キャラクターシート画像をGeminiチャットに添付する
- テキストだけでは回を重ねるうちにキャラの外見がブレるため、画像参照で補強する
- Step 2で生成した `all_characters.png` を毎回添付する

**注意:** `--reference-image` はスタイル抽出用（YAML分析→メタプロンプト生成）であり、キャラクター一貫性には使えない。`--attach-image` を使うこと。

---

## Step 1: ストーリー構成案の作成

### 最初に必ずやること

**ユーザーに原稿/文章の添付を求める。**

```
漫画を作成します。まず原稿（テキストまたはファイル）を添付してください。
添付された文章に沿って、漫画のストーリーを構成します。
```

### ストーリー構成ルール

1. **神話の法則に則る**: 読者の感情を揺さぶるストーリー構成にする
2. **コマ数は書籍の長さに合わせる**: 短い原稿なら100コマ程度、長い原稿なら200+コマ。ストーリーに合わせて適切なコマ数にする。増える分には構わない
3. **細かいカット割り**: 「1シーン＝1ページ」ではなく、視聴者を飽きさせない構成
4. **コマ間のつながり**: すべてのコマが自然につながるよう、切り替わりも事細かに記載
5. **専門用語**: 「〜というんだ。」のように説明を入れつつ、かみ砕いて説明

### コマ分割テクニック（必須遵守）

- **会話の1往復**（Aが話す→Bが話す）でページを分ける
- **3行以上の長ゼリフ**は、文節や句読点でページを分割する
- **「驚き」「沈黙」「強調」**などのリアクション単体で1ページ使う
- 場面転換、時間経過、視点変化でもページを分ける

### 出力形式

`output/manga-{slug}/story_structure.md` に保存:

```markdown
# 漫画ストーリー構成案（全{N}コマ）

タイトル：{タイトル}

## シーン1：{シーンタイトル}（コマ1〜{N}）

場所：{場所}
登場人物：{キャラ名一覧}

コマ1：{場面の詳細な描写。キャラの行動、表情、背景を具体的に記述。}
コマ2：{次のコマ。前のコマからの自然なつながりを明記。}
コマ3：{キャラ名}「{セリフ原文}」{キャラの動作や表情の補足}
コマ4：{リアクション。驚きの表情のアップなど。}「{セリフ}」
...

## シーン2：{シーンタイトル}（コマ{N+1}〜{M}）
...

（最後のコマまで全て記述）
```

---

## Step 2: キャラクター設計画

### 概要

2回以上登場する**全キャラクター**について:
1. 全員を1枚に並べたキャラクターシート画像を生成する
2. 各キャラの外見プロンプトテキスト（英語）をDBとして保存する（Step 3で使用）

### キャラクターシート画像プロンプト

全キャラを1枚に横並びにした設計画:

```
(best quality, masterpiece:1.2), anime style, webtoon style, character sheet,
{N} people standing side by side, white background, full body, flat color, clean lines,
with text labels in katakana below each character identifying them,
({キャラ1カタカナ名}): {キャラ1の外見詳細を英語で}, text label below feet reads "{キャラ1カタカナ名}",
({キャラ2カタカナ名}): {キャラ2の外見詳細を英語で}, text label below feet reads "{キャラ2カタカナ名}",
...
```

### キャラクター外見プロンプトDB

各キャラの外見テキスト（英語）を `character_prompts.md` に保存する。
これがStep 3で毎回プロンプトに埋め込まれるマスターデータになる。

```markdown
# キャラクター外見プロンプトDB

## ユイ（主人公）
1girl, Japanese, late 20s, shoulder-length dark brown hair with slight wave, warm brown eyes, round soft face, petite build, wearing white blouse with navy cardigan and gray pencil skirt, small pearl earrings, friendly approachable appearance

## センセイ（先輩）
1boy, Japanese, 30s, short neat black hair styled to the side, sharp intelligent dark brown eyes, tall lean build, wearing navy blue blazer with white shirt no tie, round black-framed glasses, warm confident smile, professional yet approachable

## クロー（マスコット）
cute cartoon lobster mascot, bright red-orange body, big round blue eyes, small friendly smile, wearing silver headset with microphone, two large front claws, short antennae, round chibi proportions, kawaii style
```

### キャラクターシートプロンプトのルール

プロンプトの末尾に `--ar 16:9` を入れて横長で生成する。
横長にすることで全キャラが余裕を持って並び、Geminiがキャラの特徴を読み取りやすくなる。

### 画像生成

**重要：相対パスは `../../../` で開発フォルダのルートに戻ること。**
nanobanana-proは `開発1/.claude/skills/nanobanana-pro/` にあるので、`../../` だと `.claude/` で止まる。`../../../` で正しく `開発1/` に到達する。

```bash
cd "C:\Users\baseb\dev\開発1\.claude\skills\nanobanana-pro"

PYTHONIOENCODING=utf-8 PYTHONUTF8=1 python scripts/run.py image_generator.py \
  --prompt "{キャラクターシートプロンプト}, --ar 16:9" \
  --output "../../../output/manga-{slug}/characters/all_characters.png" \
  --timeout 240
```

### リサイズ（生成後必須）

リサイズはファイルのある場所にcdしてから実行する（日本語パスの文字化け回避）。

```bash
cd "{開発フォルダ}/output/manga-{slug}/characters"

PYTHONUTF8=1 PYTHONIOENCODING=utf-8 \
  "../../../.claude/skills/nanobanana-pro/.venv/Scripts/python.exe" -c "
from PIL import Image
img = Image.open('all_characters.png')
img = img.resize((1600, 900), Image.LANCZOS)
img.save('all_characters.png')
"
```

---

## Step 3: ページ別プロンプト生成

### 概要

Step 1のストーリーを元に、各ページのNanoBanana用プロンプトを作成する。
プロンプトは**英語**で記述し、**セリフ・文字入れ部分のみ日本語**を含める。
**★ キャラの外見テキストはStep 2のDBから毎回同じものを埋め込む（一貫性確保の要）。**

全ページ分を `output/manga-{slug}/page_prompts.md` に一括出力する。

### プロンプトテンプレート

```markdown
### Page {N}

**Page layout**
{ページ全体のシーン・感情の流れを英語で自然な文章で表現。
各コマがどのように展開・対比・連続しているかを簡潔かつ詳細にまとめる。}
Template: {テンプレ1〜10から選択}

**Panel1**
**Description** {シーンの説明を英語で}
**panel shape and size** {horizontal-large / vertical-medium / square-small 等}
**Character name & details** {キャラ名} — {★Step 2のDBの外見テキストをそのまま埋め込む}, (refer to attached character sheet)
**Character expression** {表情を英語で}
**Character facing** {facing left / facing right / front}
**Character pose** {ポーズを英語で}
**Background** {背景を英語で}
**speech bubble** 「{日本語セリフそのまま}」
**camera angle** {eye-level / top-down / low-angle / side view}
**art style** anime-style, modern manga illustration, soft light and smooth shading, delicate linework, expressive eyes, clean and bright overall tone, --ar 3:4
**color theme** {配色を英語で}

**Panel2**
...
```

**注意:** 各ページのプロンプト末尾（最後のPanelのart style）に `--ar 3:4` を含めること。これにより縦長画像が生成される。

### コマ割りテンプレート選択ルール

**1コマ:**
- テンプレ1: ページ全体を使った1コマ（見開き・クライマックス・タイトル）

**2コマ:**
- テンプレ2: 上下2分割（上段→下段）（会話・対比）
- テンプレ3: 上下2分割（上段小→下段大）（導入→メイン）
- テンプレ4: 上下2分割（上段大→下段小）（メイン→リアクション）

**3コマ:**
- テンプレ5: 上・中・下の3段構成（テンポのよい展開）
- テンプレ6: 上段1コマ+下段左右2コマ → 1(上) → 2(下段右) → 3(下段左)
- テンプレ7: 上段左右2コマ+下段1コマ → 1(上段右) → 2(上段左) → 3(下段)

**4コマ:**
- テンプレ8: 上段横長+中段左右+下段横長 → 1(上) → 2(中段右) → 3(中段左) → 4(下)
- テンプレ9: 上段横長+下段右縦長+左上下分割 → 1(上) → 2(下段右) → 3(下段左上) → 4(下段左下)
- テンプレ10: 上段横長+下段左縦長+右上下分割 → 1(上) → 2(下段右上) → 3(下段右下) → 4(下段左)

### 読み順ルール

- **日本の漫画形式**: 右上から左下へ
- **横並びのコマ**: 必ず「右側」が先、「左側」が後

### 絶対遵守ルール

1. **セリフ完全維持**: 原稿のセリフは一文字も要約・省略・変更しない
2. **サイズ**: 896x1200px
3. **必ずフルカラー**: 白黒漫画は絶対に禁止
4. **（）の中の言葉**は吹き出しに記載しない
5. **同じ言葉を二回以上**吹き出しに記載しない

### オノマトペ（活用する）

ぱぁっ / パァァ / ビクッ / ギクッ / キュン / イライラ / じーっ / ガーン / むすっ / テクテク / ダダダダ / ガチャ / チラッ / カタカタ / シーン / ドキドキ / ザワザワ / キラキラ / パチパチ / ゴゴゴ

### 背景パターン（30+種類から選択）

水玉模様 / 半円 / ドット模様 / フラッシュエフェクト / ストライプ / グラデーション / 幾何学模様 / 集中線 / 放射線 / 斜線ハッチング / 花びら散り / 泡エフェクト / 暗転 / 白飛び / ぼかし背景 / 都市風景 / 室内 / 自然風景 / ハートパターン / 星パターン / 雷エフェクト / 炎エフェクト / パステルグラデーション / モノクロ反転 / セピア調 / 夕焼け色 / 雨粒エフェクト / 雪結晶 / 桜吹雪 / 紅葉 / デジタルエフェクト / 回路パターン / 光の粒子

---

## 画像一括生成

### 生成方法

各ページの英語プロンプト（Part B）全体を1つのテキストとしてnanobanana-proに送信する。

**重要：相対パスは `../../../` でプロジェクトルートに戻ること。**

```bash
cd "C:\Users\baseb\dev\開発1\.claude\skills\nanobanana-pro"

PYTHONIOENCODING=utf-8 PYTHONUTF8=1 python scripts/run.py image_generator.py \
  --prompt "{ページNの英語プロンプト全文。末尾に --ar 3:4 を含む}" \
  --attach-image "../../../output/manga-{slug}/characters/all_characters.png" \
  --output "../../../output/manga-{slug}/panels/page_NNN.png" \
  --timeout 240
```

`--attach-image` でキャラクターシート画像を毎回Geminiに添付することで、キャラの外見一貫性を確保する。

### リサイズ（生成後必須）

リサイズはファイルのある場所にcdしてから実行する（日本語パスの文字化け回避）。

```bash
cd "{開発フォルダ}/output/manga-{slug}/panels"

PYTHONUTF8=1 PYTHONIOENCODING=utf-8 \
  "../../../.claude/skills/nanobanana-pro/.venv/Scripts/python.exe" -c "
from PIL import Image
img = Image.open('page_NNN.png')
img = img.resize((896, 1200), Image.LANCZOS)
img.save('page_NNN.png')
"
```

### 出力ファイル名

- `panels/page_001.png`, `panels/page_002.png`, ... `panels/page_NNN.png`

### バッチ生成

全ページを順次生成。10枚ごとに進捗報告。
中断後はまだ生成されていないページから再開可能。

---

## 出力先

```
output/manga-{slug}/
├── story_structure.md          # ストーリー構成案（全コマ詳細）
├── character_prompts.md        # キャラクター外見プロンプトDB
├── page_prompts.md             # 全ページのプロンプト（英語、セリフ部分のみ日本語）
├── characters/
│   └── all_characters.png      # 全キャラ並んだ設計画（1600x900px, 16:9横長）
├── panels/                     # 各ページ画像（896x1200px）
│   ├── page_001.png
│   ├── page_002.png
│   └── ...
└── generate_panels.py          # バッチ生成スクリプト（オプション）
```

---

## 関連スキル

| スキル | 用途 |
|--------|------|
| `nanobanana-pro` | Gemini NanoBanana で画像生成 |
| `custom-character` | キャラクター設計パターン参考 |
| `nanobanana-prompts` | 画像プロンプト最適化の黄金ルール |

## 使用例

```
/manga この原稿を漫画にして
/manga 副業AI活用術を漫画で
/manga この電子書籍を漫画化して
```
