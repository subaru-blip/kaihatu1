---
name: manga-creator-ss
description: 原稿やテーマから漫画を一括生成する複合スキル。神話の法則でストーリー構造化 → キャラクター設計 → コマ割りCSV生成 → nanobanana-proで画像順次生成。200+コマ対応。
---

# Manga Creator - 漫画一括生成スキル

原稿/テーマ → ストーリー構造化 → キャラ設計 → CSV生成 → 画像一括生成（200+コマ対応）。

## When to Use This Skill

- 「漫画を作って」「マンガを一括生成したい」
- 「この原稿を漫画化して」
- 「漫画を大量に作りたい」「200コマの漫画」
- 「〇〇というテーマで漫画を作って」
- 「Webtoonを作りたい」「少年漫画風に」

## Do NOT Use for

- 単発の漫画パネル1枚 → `nanobanana-pro` を使用
- キャラクターシートのみ → `custom-character` を使用
- 漫画制作のガイド・相談 → `ai-manga-generator` を使用
- アニメ動画制作 → `anime-production` を使用

## 全体フロー（6フェーズ）

```
Phase 1: ヒアリング
   │  原稿/テーマ受け取り、ジャンル選択、ページ数設定
   ▼
Phase 2: ストーリー構造化（神話の法則）
   │  原稿を12ステージに分解 → フレーム単位の台本作成
   ▼
Phase 3: キャラクター設計
   │  キャラクターシート生成（正面/横/背面 896x1200px）
   │  character_database.json 作成（表情バリエーション付き）
   │  → ★ ユーザー承認 ★
   ▼
Phase 4: コマ割り設計 + CSV生成
   │  10種のテンプレートから各ページに割り当て
   │  キャラDB + シーン情報からプロンプト自動生成
   │  generation_plan.csv 出力
   │  → ★ ユーザーレビュー・編集 ★
   ▼
Phase 5: 画像一括生成
   │  CSVを読み込み、nanobanana-pro で順次生成
   │  進捗トラッキング + 中断再開対応
   ▼
Phase 6: ページ組み立て（オプション）
   │  パネル画像をテンプレートに従ってページに組み立て
   ▼
完成！
```

## 生成物の仕様

| 項目 | 内容 |
|------|------|
| ストーリー構造 | 神話の法則12ステージ |
| ページ数 | 30 / 50 / 100 / カスタム |
| パネル数 | 80〜350枚（ページ数による） |
| ジャンル | 少年漫画 / 少女漫画 / 青年漫画 / Webtoon / 4コマ |
| キャラクターシート | 各キャラ1枚（正面・横・背面 896x1200px） |
| スタイル | モノクロ / フルカラー |
| 出力形式 | 個別パネル画像 + CSV + キャラDB + オプションでページ組み立て |

## 出力先

```
output/manga-{slug}/
├── story_structure.json        # ストーリー台本（フレーム単位）
├── character_database.json     # キャラクターDB（表情バリエーション付き）
├── generation_plan.csv         # ★ ユーザー編集可能 ★
├── characters/                 # キャラクターシート
│   ├── protagonist_sheet.png
│   ├── heroine_sheet.png
│   └── ...
├── panels/                     # 個別パネル画像（200+枚）
│   ├── page_001_panel_01.png
│   ├── page_001_panel_02.png
│   └── ...
└── pages/                      # 組み立て済みページ（Phase 6・オプション）
    ├── page_001.png
    └── ...
```

---

## Phase 1: ヒアリング

### 手順

1. ユーザーにテーマと原稿を確認する
2. ジャンル・ページ数・キャラ設定を決定する
3. 設定を確認してPhase 2へ進む

### ユーザーへの質問テンプレート

```
漫画を作成します。以下を教えてください：

1. テーマ/原稿:
   - テーマだけ（例：「異世界転生ファンタジー」）
   - 原稿テキスト or ファイルパス
   - URL（参考コンテンツ）

2. ジャンル:
   a) 少年漫画（アクション・熱血・冒険）
   b) 少女漫画（恋愛・ドラマ・感情）
   c) 青年漫画（リアル・社会・ダーク）
   d) Webtoon（フルカラー・縦スクロール）
   e) 4コマ漫画

3. ページ数: 30P / 50P / 100P / その他

4. キャラクター:
   - 主人公+何名？（デフォルト: 主人公+2名）
   - キャラクターの指定があれば

5. スタイル: モノクロ / フルカラー（Webtoonはフルカラー固定）

6. 特記事項（あれば）:
```

### ページ数別のパネル数目安

| ページ数 | パネル数(目安) | 生成時間(目安) |
|---------|---------------|---------------|
| 30P | 80-100 | 20-30分 |
| 50P | 150-180 | 35-50分 |
| 100P | 280-350 | 70-90分 |

---

## Phase 2: ストーリー構造化（神話の法則 12ステージ）

### 手順

1. 原稿/テーマを分析する
2. 神話の法則12ステージに分解する
3. 各ステージをフレーム単位の台本に変換する
4. `output/manga-{slug}/story_structure.json` に保存する

### 神話の法則 12ステージとフレーム配分

| # | ステージ | 内容 | 30P配分 | 50P配分 | 100P配分 |
|---|---------|------|---------|---------|----------|
| 1 | 日常の世界 | 主人公の普段の生活 | 3-4コマ | 6-8 | 12-15 |
| 2 | 冒険への誘い | きっかけ・事件の発生 | 2-3 | 4-5 | 8-10 |
| 3 | 誘いの拒絶 | 主人公の葛藤・躊躇 | 1-2 | 2-3 | 4-6 |
| 4 | 賢者との出会い | 導き手の登場 | 3-4 | 5-7 | 10-12 |
| 5 | 第一関門突破 | 新世界への踏み出し | 4-6 | 8-10 | 15-20 |
| 6 | 試練、仲間、敵 | メインストーリー展開 | 8-10 | 15-20 | 30-40 |
| 7 | 最も危険な場所 | クライマックスへの接近 | 5-7 | 10-12 | 18-22 |
| 8 | 最大の試練 | クライマックス・最終決戦 | 6-8 | 12-15 | 25-30 |
| 9 | 報酬 | 勝利・成長の証 | 3-4 | 6-8 | 12-15 |
| 10 | 帰路 | 日常への帰還途中 | 4-6 | 8-10 | 15-18 |
| 11 | 復活 | 最後の試練・真の成長 | 3-5 | 6-8 | 12-15 |
| 12 | 宝を持っての帰還 | エンディング・新たな日常 | 2-3 | 4-6 | 8-10 |

### 各フレームの台本項目

各フレーム（コマ）について以下を記述:

```json
{
  "frame_id": "F001",
  "stage": 1,
  "stage_name": "日常の世界",
  "page": 1,
  "panel": 1,
  "scene": "主人公が朝の通学路を歩いている",
  "characters": ["protagonist"],
  "character_expressions": {"protagonist": "neutral"},
  "action": "歩く",
  "camera_angle": "ミディアムショット・正面やや下から",
  "dialogue": "今日もいつもと同じ一日が始まる…",
  "emotion": "退屈・日常",
  "sfx": "",
  "background": "朝の住宅街、桜並木"
}
```

### story_structure.json の形式

```json
{
  "title": "作品タイトル",
  "genre": "shonen",
  "total_pages": 30,
  "total_frames": 87,
  "characters": ["protagonist", "heroine", "rival"],
  "stages": [
    {
      "stage_id": 1,
      "name": "日常の世界",
      "description": "主人公の平凡な日常を描く",
      "frame_count": 4,
      "frames": [
        {
          "frame_id": "F001",
          "page": 1,
          "panel": 1,
          "scene": "...",
          "characters": ["protagonist"],
          "character_expressions": {"protagonist": "neutral"},
          "action": "...",
          "camera_angle": "...",
          "dialogue": "...",
          "emotion": "...",
          "sfx": "",
          "background": "..."
        }
      ]
    }
  ]
}
```

---

## Phase 3: キャラクター設計

### 手順

1. ストーリーから登場キャラクターの特徴を抽出する
2. 各キャラのキャラクターシートを nanobanana-pro で生成する
3. character_database.json を作成する
4. ユーザーにキャラクターシートとDBを見せて承認を得る

### Step 1: キャラクター特徴抽出

ストーリーから各キャラの以下を分析:
- 外見（髪型・髪色・目の色・体格・年齢）
- 服装（普段着・制服・戦闘服など）
- アクセサリー（眼鏡・傷跡・特徴的な小物）
- 性格・口調・役割
- 他キャラとの関係性

### Step 2: キャラクターシート生成

nanobanana-pro で各キャラのリファレンスシートを生成する。

#### ジャンル別キャラクターシートテンプレート

**少年漫画 (Shonen)**
```
* Subject: (Professional shonen manga character reference sheet. Character: {name} - {role}. {description}.)
* Layout: (Three-view sheet: front view (center), side view (left), back view (right). Full body standing pose, neutral expression. Proportional grid guidelines visible. Height markers.)
* Visuals: ({detailed character features}. Bold clean lineart. High contrast black and white ink style with screentone shading.)
* Style: (Shonen manga production character sheet, professional quality, 896x1200px, --ar 3:4.)
```

**少女漫画 (Shojo)**
```
* Subject: (Professional shojo manga character reference sheet. Character: {name} - {role}. {description}.)
* Layout: (Three-view sheet: front view (center), side view (left), back view (right). Elegant standing pose. Proportional grid guidelines.)
* Visuals: ({detailed character features}. Delicate thin lineart. Soft screentone gradients. Detailed eye design with sparkle effects.)
* Style: (Shojo manga production character sheet, professional quality, 896x1200px, --ar 3:4.)
```

**青年漫画 (Seinen)**
```
* Subject: (Professional seinen manga character reference sheet. Character: {name} - {role}. {description}.)
* Layout: (Three-view sheet: front view (center), side view (left), back view (right). Natural standing pose. Anatomical proportion guidelines.)
* Visuals: ({detailed character features}. Detailed realistic lineart. Heavy crosshatching for shadows. Realistic proportions.)
* Style: (Seinen manga production character sheet, professional quality, 896x1200px, --ar 3:4.)
```

**Webtoon**
```
* Subject: (Professional webtoon character reference sheet. Character: {name} - {role}. {description}.)
* Layout: (Three-view sheet: front view (center), side view (left), back view (right). Relaxed standing pose. Color palette swatches included.)
* Visuals: ({detailed character features}. Clean digital lineart. Vibrant full color with gradient shading. Modern proportions.)
* Style: (Webtoon production character sheet, full color digital art, 896x1200px, --ar 3:4.)
```

#### キャラクターシート生成の実行

```bash
cd /c/Users/baseb/dev/開発1/.claude/skills/nanobanana-pro

python scripts/run.py image_generator.py \
  --prompt "{キャラクターシートプロンプト}" \
  --output "../../output/manga-{slug}/characters/{character_id}_sheet.png"
```

### Step 3: character_database.json 作成

```json
{
  "genre": "shonen",
  "style": "monochrome",
  "characters": [
    {
      "id": "protagonist",
      "name": "タケシ",
      "role": "主人公",
      "base_prompt": "Japanese teen boy, spiky black hair with slight brown highlights, determined brown eyes, athletic build, dark blue school blazer with white shirt and red striped tie, sharp angular face, small scar on right cheek",
      "reference_sheet": "characters/protagonist_sheet.png",
      "expressions": {
        "neutral": "calm expression, slight confident smile",
        "happy": "bright cheerful smile, sparkling eyes, energetic pose",
        "angry": "furrowed brows, intense glare, gritted teeth, anger mark on forehead",
        "shocked": "wide eyes, open mouth, sweat drop effect",
        "sad": "downcast eyes, slight frown, shadow over eyes",
        "determined": "narrowed eyes with intense gaze, clenched fist visible",
        "scared": "trembling, wide eyes, cold sweat drops",
        "laughing": "wide open mouth laughing, closed eyes, hand on stomach"
      }
    },
    {
      "id": "heroine",
      "name": "ユイ",
      "role": "ヒロイン",
      "base_prompt": "Japanese teen girl, long straight black hair with side bangs, gentle dark brown eyes, slender build, same school uniform with plaid skirt, soft facial features, small ribbon hair accessory",
      "reference_sheet": "characters/heroine_sheet.png",
      "expressions": {
        "neutral": "gentle calm expression, soft eyes",
        "happy": "warm smile, slightly tilted head",
        "angry": "pouty expression, puffed cheeks",
        "shocked": "hands covering mouth, wide eyes",
        "sad": "teary eyes, looking down",
        "determined": "serious focused expression, fists clenched",
        "embarrassed": "blushing cheeks, looking away, hand touching hair",
        "laughing": "covering mouth while laughing, closed eyes"
      }
    }
  ]
}
```

**表情は各キャラ最低6種類**:
- neutral（通常）
- happy（喜び）
- angry（怒り）
- shocked（驚き）
- sad（悲しみ）
- determined（決意）

ストーリーに応じて追加（scared, embarrassed, laughing, etc.）

→ ★ ユーザーにキャラクターシートとDBを提示し、承認を得る ★

---

## Phase 4: コマ割り設計 + CSV生成

### 手順

1. story_structure.json の各フレームにコマ割りテンプレートを割り当てる
2. character_database.json と組み合わせてプロンプトを自動生成する
3. generation_plan.csv を出力する
4. ユーザーにCSVを確認・編集してもらう

### 10種のコマ割りテンプレート

| テンプレートID | コマ数 | レイアウト | 推奨場面 |
|---------------|--------|-----------|---------|
| `template_1panel` | 1 | フルページ1コマ | 見開き・クライマックス・見せ場・タイトルページ |
| `template_2panel_vertical` | 2 | 上下分割 | 会話シーン・対比・リアクション |
| `template_2panel_horizontal` | 2 | 左右分割 | ビフォーアフター・時間経過 |
| `template_3panel_top1_bottom2` | 3 | 上1+下2 | ワイドショット+リアクション2つ |
| `template_3panel_left1_right2` | 3 | 左1+右2 | メインキャラ+サブ展開 |
| `template_3panel_equal` | 3 | 均等3段 | テンポのよい展開・連続動作 |
| `template_4panel_grid` | 4 | 2×2グリッド | バランスのよい日常シーン |
| `template_4panel_dynamic` | 4 | 不規則配置 | アクション・バトル・スピード感 |
| `template_4panel_diagonal` | 4 | 斜め分割 | ドラマチック・緊迫感・衝撃 |
| `template_4panel_focus` | 4 | 1大+3小 | 1コマ強調+補足・反応 |

### テンプレート自動割り当てロジック

シーンの内容から自動でテンプレートを割り当てる:

```
見せ場・クライマックス・初登場 → template_1panel
バトル・アクション・追跡 → template_4panel_dynamic
会話・日常対話 → template_2panel_vertical / template_3panel_equal
日常・説明 → template_4panel_grid
感情的転換点・衝撃展開 → template_4panel_focus
背景紹介・状況説明 → template_3panel_top1_bottom2
対比・ビフォーアフター → template_2panel_horizontal
緊迫・追い詰められる → template_4panel_diagonal
メインキャラ登場＋反応 → template_3panel_left1_right2
連続動作・テンポ → template_3panel_equal
```

### テンプレートのビジュアルレイアウト

各テンプレートの配置仕様（ページ組み立て時に使用）:

**template_1panel**
```
┌───────────────────┐
│                   │
│     panel_01      │  (100% x 100%)
│                   │
└───────────────────┘
```

**template_2panel_vertical**
```
┌───────────────────┐
│     panel_01      │  (100% x 50%)
├───────────────────┤
│     panel_02      │  (100% x 50%)
└───────────────────┘
```

**template_2panel_horizontal**
```
┌─────────┬─────────┐
│         │         │
│ panel_01│ panel_02│  (50% x 100% each)
│         │         │
└─────────┴─────────┘
```

**template_3panel_top1_bottom2**
```
┌───────────────────┐
│     panel_01      │  (100% x 40%)
├─────────┬─────────┤
│ panel_02│ panel_03│  (50% x 60% each)
└─────────┴─────────┘
```

**template_3panel_left1_right2**
```
┌─────────┬─────────┐
│         │ panel_02│  (right: 50% x 50%)
│ panel_01├─────────┤
│         │ panel_03│  (right: 50% x 50%)
└─────────┴─────────┘  (left: 50% x 100%)
```

**template_3panel_equal**
```
┌───────────────────┐
│     panel_01      │  (100% x 33%)
├───────────────────┤
│     panel_02      │  (100% x 34%)
├───────────────────┤
│     panel_03      │  (100% x 33%)
└───────────────────┘
```

**template_4panel_grid**
```
┌─────────┬─────────┐
│ panel_01│ panel_02│  (50% x 50%)
├─────────┼─────────┤
│ panel_03│ panel_04│  (50% x 50%)
└─────────┴─────────┘
```

**template_4panel_dynamic**
```
┌──────────┬────────┐
│ panel_01 │panel_02│  (60% x 40%, 40% x 40%)
├────┬─────┴────────┤
│p_03│   panel_04   │  (30% x 60%, 70% x 60%)
└────┴──────────────┘
```

**template_4panel_diagonal**
```
┌────────────┬──────┐
│  panel_01  │ p_02 │  (対角線的に大→小)
├──────┬─────┴──────┤
│ p_03 │  panel_04  │
└──────┴────────────┘
```

**template_4panel_focus**
```
┌───────────┬───────┐
│           │ p_02  │  (small: 33% x 33%)
│  panel_01 ├───────┤
│           │ p_03  │
│  (大コマ)  ├───────┤
│           │ p_04  │
└───────────┴───────┘  (large: 67% x 100%)
```

### CSV形式

```csv
page,template,panel,frame_id,character,expression,scene,camera_angle,dialogue,prompt,output_file,status
1,template_3panel_top1_bottom2,1,F001,,,"朝の街並み・通学路","ロングショット・俯瞰","","* Subject: (Shonen manga panel...) ...","page_001_panel_01.png",pending
1,template_3panel_top1_bottom2,2,F002,protagonist,neutral,"主人公が歩いている","ミディアムショット","今日もいつもと同じ一日が始まる…","* Subject: ...","page_001_panel_02.png",pending
1,template_3panel_top1_bottom2,3,F003,protagonist,shocked,"何かに気づいてふり返る","アップ・やや下から","えっ…！？","* Subject: ...","page_001_panel_03.png",pending
```

**カラム説明:**

| カラム | 説明 | 例 |
|--------|------|-----|
| `page` | ページ番号 | 1 |
| `template` | コマ割りテンプレートID | template_3panel_top1_bottom2 |
| `panel` | ページ内のパネル番号 | 1, 2, 3 |
| `frame_id` | 通し番号 | F001 |
| `character` | キャラID（複数はセミコロン区切り） | protagonist;heroine |
| `expression` | 表情キー | neutral, happy, angry |
| `scene` | シーン説明（日本語） | 主人公が歩いている |
| `camera_angle` | カメラアングル | ミディアムショット |
| `dialogue` | セリフ（参考情報・画像には含まない） | 今日もいい天気だ |
| `prompt` | NanoBanana用プロンプト（自動生成） | * Subject: ... |
| `output_file` | 出力ファイル名 | page_001_panel_01.png |
| `status` | 生成状態 | pending / completed / failed |

### プロンプト自動生成ルール

各パネルのプロンプトは以下の要素を組み合わせて自動生成する:

```
* Subject: ({Genre} manga panel. Scene: {scene を英訳}.)
* Layout: ({camera_angle を英訳}. {テンプレート内の位置に基づく構図指示}.)
* Visuals: ({character base_prompt from DB}. {expression from DB}. {シーン固有の視覚要素}. {ジャンル固有のエフェクト}.)
* Style: ({ジャンル別スタイル指示}, --ar {テンプレートから算出したアスペクト比}.)
```

**鉄則:**
- 構造（Layout）と視覚（Visuals）は**英語**で記述
- セリフ（dialogue）は**画像には含めない**（後工程で吹き出し追加する想定）
- キャラクターの外見描写は `character_database.json` の `base_prompt` をそのまま使用
- 表情は `expressions` から対応するキーの値を使用
- 1プロンプトに含めるキャラは最大2名（それ以上はコマを分割）

---

## ジャンル別プロンプトテンプレート

### 少年漫画 (Shonen)

```
* Subject: (Shonen manga panel. Scene: {scene in English}.)
* Layout: ({camera_angle in English}. {composition based on template position}.)
* Visuals: ({character base_prompt}. {expression}. Speed lines, impact effects, high contrast shadows, screentone textures. {scene-specific elements}.)
* Style: (Shonen manga style, bold G-pen linework, dramatic shading, black and white ink style with screentones, professional quality, --ar 2:3.)
```

**少年漫画のエフェクト表現:**
- アクション → `speed lines radiating from center, impact burst effects`
- 衝撃 → `dramatic zoom lines, shattered background effect`
- 感情高揚 → `sparkle effects, radiant light beams behind character`
- 怒り → `dark aura, cracking ground effect, anger veins`
- 緊迫 → `heavy crosshatching shadows, cold sweat drops`

### 少女漫画 (Shojo)

```
* Subject: (Shojo manga panel. Scene: {scene in English}.)
* Layout: ({camera_angle in English}. {composition}. Soft flowing panel border.)
* Visuals: ({character base_prompt}. {expression}. Sparkle effects, flower decorations, soft screentone gradients. {scene-specific elements}.)
* Style: (Shojo manga style, delicate thin linework, dreamy atmosphere, black and white with soft tones, --ar 2:3.)
```

**少女漫画のエフェクト表現:**
- ときめき → `heart sparkles, rose petals floating`
- 悲しみ → `rain drops, fading background into white`
- 幸せ → `flower bouquet frame, sparkle effects, soft light`
- 緊張 → `diagonal screen tone, dramatic eye closeup`
- 回想 → `soft vignette edges, dreamy blur effect`

### 青年漫画 (Seinen)

```
* Subject: (Seinen manga panel. Scene: {scene in English}.)
* Layout: ({camera_angle in English}. {composition}. Realistic perspective.)
* Visuals: ({character base_prompt}. {expression}. Detailed backgrounds, realistic proportions, cinematic shadows. {scene-specific elements}.)
* Style: (Seinen manga style, detailed realistic linework, heavy crosshatching, black and white, mature visual tone, --ar 2:3.)
```

**青年漫画のエフェクト表現:**
- 緊迫 → `film noir lighting, deep shadows, high contrast`
- アクション → `motion blur, realistic impact, debris particles`
- 心理描写 → `distorted perspective, fragmented panel overlay`
- 日常 → `detailed architectural backgrounds, natural lighting`

### Webtoon（フルカラー縦スクロール）

```
* Subject: (Webtoon-style panel. Scene: {scene in English}.)
* Layout: (Vertical composition optimized for mobile reading. {camera_angle}. {composition}.)
* Visuals: ({character base_prompt}. {expression}. Vibrant full color, clean digital linework, gradient backgrounds. {scene-specific elements}.)
* Style: (Modern webtoon style, full color digital art, smooth gradient shading, --ar 9:16.)
```

**Webtoonのエフェクト表現:**
- 感情表現 → `color shift to warm/cool tones, glowing aura`
- アクション → `dynamic perspective, color burst effects`
- コメディ → `chibi deformation, exaggerated expressions`
- ロマンス → `soft pink tones, bokeh light effects`

### 4コマ漫画

4コマの場合は `template_4panel_grid` を全ページで固定使用:

```
* Subject: (4-koma manga panel. Scene: {scene in English}. Panel {N} of 4: {起承転結の該当パート}.)
* Layout: (Single panel composition, simple clean background. {camera_angle}.)
* Visuals: ({character base_prompt}. {expression}. Simple clean lineart, minimal background. {scene-specific elements}.)
* Style: (4-koma manga style, clean simple linework, comedic proportions, black and white, --ar 1:1.)
```

---

## Phase 5: 画像一括生成

### 手順

1. `generation_plan.csv` を読み込む
2. `status` が `pending` の行を順に処理する
3. nanobanana-pro で1枚ずつ画像を生成する
4. 生成後にCSVの `status` を更新する
5. 10枚ごとに進捗を報告する

### 生成ループ

nanobanana-pro の `image_generator.py` を順次呼び出す:

```bash
cd /c/Users/baseb/dev/開発1/.claude/skills/nanobanana-pro

# パネル1: セッション起動（初回は〜30秒）
python scripts/run.py image_generator.py \
  --prompt "{CSV row 1 の prompt カラム}" \
  --output "../../output/manga-{slug}/panels/page_001_panel_01.png"

# パネル2以降: セッション再利用（〜10-15秒/枚）
python scripts/run.py image_generator.py \
  --prompt "{CSV row 2 の prompt カラム}" \
  --output "../../output/manga-{slug}/panels/page_001_panel_02.png"

# ... CSV の全行を処理するまで繰り返し
```

### 進捗トラッキング

各画像の生成後にCSVの `status` カラムを更新する:

| status | 意味 |
|--------|------|
| `pending` | 未生成（これから処理する） |
| `completed` | 生成成功 |
| `failed` | 生成失敗（エラー情報をログに記録） |

10パネルごとに進捗報告:
```
Progress: 50/200 (25.0%) - Elapsed: 12min - ETA: 36min
Failed: 2 panels (logged in generation_plan.csv)
```

### 中断・再開

- **中断**: 任意のタイミングでCtrl+Cで中断可能
- **再開**: CSVの `status=pending` の行から再開（completedはスキップ）
- **失敗リトライ**: `status=failed` の行のプロンプトを編集してから再実行

再開時の手順:
```
1. generation_plan.csv を確認
2. failed の行があればプロンプトを修正
3. Phase 5 を再実行（pending と failed のみ処理される）
```

### エラー対応

| エラー | 対応 |
|--------|------|
| タイムアウト（300秒） | 1回自動リトライ、2回目失敗でfailedにしてスキップ |
| プロンプトフィルター | failedにして次へ（ユーザーがCSV編集で修正） |
| セッション切断 | 再認証してから続行 |
| ブラウザエラー | スクリーンショットをログに記録、次へ |

---

## Phase 6: ページ組み立て（オプション）

### 概要

Phase 5 で生成した個別パネル画像を、テンプレートに従って1ページに組み立てる。
このフェーズはオプション。個別パネルのまま使用する場合はスキップ可能。

### 手順

1. CSV からページごとにパネルをグループ化する
2. テンプレートの配置仕様に従って画像を配置する
3. 白い枠線（3px）で各パネルを区切る
4. 右→左の読み順（日本漫画）で番号付け
5. `pages/page_NNN.png` として出力する

### ページサイズ

| ジャンル | ページサイズ | 備考 |
|---------|------------|------|
| 漫画（一般） | 1200x1800px | 2:3 縦型 |
| Webtoon | 800x2400px | 1:3 縦長 |
| 4コマ | 1200x1600px | 3:4 |

### 組み立て例

`template_3panel_top1_bottom2` のページ（1200x1800px）:

```python
# PIL/Pillow での組み立て例
from PIL import Image

page = Image.new('RGB', (1200, 1800), 'white')

# panel_01: 上部全幅（1200 x 720px）
panel_01 = Image.open('panels/page_001_panel_01.png').resize((1194, 714))
page.paste(panel_01, (3, 3))

# panel_02: 左下（600 x 1080px）
panel_02 = Image.open('panels/page_001_panel_02.png').resize((594, 1074))
page.paste(panel_02, (3, 723))

# panel_03: 右下（600 x 1080px）
panel_03 = Image.open('panels/page_001_panel_03.png').resize((594, 1074))
page.paste(panel_03, (603, 723))

page.save('pages/page_001.png')
```

### 注意事項

- パネル間の枠線は白（3px）
- 日本漫画は**右→左読み**（Webtoonは上→下）
- パネル画像のアスペクト比がテンプレートと合わない場合は中央トリミング
- 組み立て後のページが大きすぎる場合はリサイズ

---

## 関連スキル

| スキル | 用途 | Phase |
|--------|------|-------|
| `nanobanana-pro` | Gemini NanoBanana で画像生成 | Phase 3, 5 |
| `custom-character` | キャラクター設計パターン参考 | Phase 3 |
| `ai-manga-generator` | ジャンル別テンプレート・スタイル参考 | Phase 1, 2 |
| `nanobanana-prompts` | 画像プロンプト最適化の黄金ルール | Phase 4 |

## 使用例

```
/manga 異世界転生ファンタジー
/manga この原稿を漫画化して（30ページ・少年漫画風）
/manga 恋愛Webtoonを50ページで
/manga 副業AI活用術を4コマ漫画で
```
