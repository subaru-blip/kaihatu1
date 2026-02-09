# manga-creator-ss 詳細分析レポート

## 概要

`manga-creator-ss` は、原稿やテーマから漫画を一括生成する複合スキル。
4つのスキルを連携させ、**3ステップ + 画像生成**のパイプラインで200+コマの漫画を自動生成する。

---

## 全体アーキテクチャ

```
原稿/テーマ（入力）
    │
    ▼
┌─────────────────────────────────┐
│  Step 1: ストーリー構成案       │  ← 神話の法則で感情曲線設計
│  （story_structure.md）         │     コマ分割テクニック適用
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│  Step 2: キャラクター設計画     │  ← nanobanana-pro で生成
│  （character_prompts.md）       │     全キャラ1枚のシート画像
│  （all_characters.png）         │     + 外見プロンプトDB
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│  Step 3: ページ別プロンプト生成 │  ← 英語プロンプト（セリフのみ日本語）
│  （page_prompts.md）            │     キャラ外見テキスト毎回埋め込み
└─────────────────┬───────────────┘
                  ▼
┌─────────────────────────────────┐
│  画像一括生成                   │  ← nanobanana-pro で順次生成
│  （page_001.png 〜 page_NNN.png）│    --attach-image でキャラシート添付
│  896x1200px にリサイズ          │     10枚ごと進捗報告
└─────────────────────────────────┘
```

---

## Step 1: ストーリー構成 — 仕組みの詳細

### 入力
- ユーザーから原稿テキストまたはファイルを受け取る（必須）

### 構成ルール

| ルール | 内容 |
|--------|------|
| **神話の法則** | 読者の感情を揺さぶるストーリー構成（英雄の旅路パターン） |
| **コマ数設計** | 短い原稿→100コマ程度、長い原稿→200+コマ。増える分にはOK |
| **細かいカット割り** | 「1シーン＝1ページ」ではなく、飽きさせない構成 |
| **コマ間のつながり** | すべてのコマが自然に接続するよう詳細記述 |
| **専門用語のかみ砕き** | 「〜というんだ。」のように説明を混ぜる |

### コマ分割テクニック（重要）

これが漫画の「テンポ」を決める核心部分:

- **会話の1往復**（Aが話す→Bが話す）でページを分ける
- **3行以上の長ゼリフ**は文節・句読点で分割
- **「驚き」「沈黙」「強調」**のリアクション単体で1ページ
- 場面転換・時間経過・視点変化でもページを分ける

### 出力形式

`story_structure.md` に以下の構造で保存:

```
# 漫画ストーリー構成案（全Nコマ）
タイトル：{タイトル}

## シーン1：{シーンタイトル}（コマ1〜N）
場所：{場所}
登場人物：{キャラ名一覧}

コマ1：{場面の詳細な描写}
コマ2：{前コマからの自然なつながり}
コマ3：{キャラ名}「{セリフ原文}」{動作・表情}
コマ4：{リアクション}「{セリフ}」
```

---

## Step 2: キャラクター設計 — 仕組みの詳細

### 目的
2回以上登場する全キャラクターについて「ビジュアルの定義」を確定する。

### 2つの成果物

#### 1. キャラクターシート画像（all_characters.png）
全キャラを1枚の横長画像（1600x900px, 16:9）に並べた設計画。

**プロンプト構造:**
```
(best quality, masterpiece:1.2), anime style, webtoon style, character sheet,
{N} people standing side by side, white background, full body, flat color, clean lines,
with text labels in katakana below each character identifying them,
({キャラ1カタカナ名}): {外見詳細を英語で}, text label below feet reads "{カタカナ名}",
({キャラ2カタカナ名}): {外見詳細を英語で}, text label below feet reads "{カタカナ名}",
...
--ar 16:9
```

**ポイント:**
- `--ar 16:9` で横長にし、全キャラが余裕を持って並ぶ
- Geminiがキャラの特徴を読み取りやすくする
- カタカナ名のラベルで識別を補助

#### 2. キャラクター外見プロンプトDB（character_prompts.md）
各キャラの外見テキスト（英語）をマスターデータとして保存。
**Step 3の全ページプロンプトに毎回埋め込まれる**。

**DB例:**
```markdown
## ユイ（主人公）
1girl, Japanese, late 20s, shoulder-length dark brown hair with slight wave,
warm brown eyes, round soft face, petite build, wearing white blouse with
navy cardigan and gray pencil skirt, small pearl earrings, friendly approachable

## センセイ（先輩）
1boy, Japanese, 30s, short neat black hair styled to the side, sharp intelligent
dark brown eyes, tall lean build, wearing navy blue blazer with white shirt no tie,
round black-framed glasses, warm confident smile, professional yet approachable
```

### 画像生成コマンド
```bash
cd "開発1/.claude/skills/nanobanana-pro"
PYTHONIOENCODING=utf-8 PYTHONUTF8=1 python scripts/run.py image_generator.py \
  --prompt "{キャラクターシートプロンプト}, --ar 16:9" \
  --output "../../../output/manga-{slug}/characters/all_characters.png" \
  --timeout 240
```

---

## Step 3: ページ別プロンプト生成 — 仕組みの詳細

### これが「プロンプトの出来が良い」最大の理由

Step 3のプロンプトは、**構造化されたテンプレート**に基づいて各ページを記述する。
単純な1行プロンプトではなく、**多次元の情報を網羅したフルスペック指示書**になっている。

### プロンプトテンプレート（1ページ分）

```markdown
### Page {N}

**Page layout**
{ページ全体のシーン・感情の流れを英語で表現}
Template: {テンプレ1〜10から選択}

**Panel1**
**Description** {シーンの説明を英語で}
**panel shape and size** {horizontal-large / vertical-medium / square-small 等}
**Character name & details** {キャラ名} — {★DB外見テキストをそのまま埋め込み}, (refer to attached character sheet)
**Character expression** {表情を英語で}
**Character facing** {facing left / facing right / front}
**Character pose** {ポーズを英語で}
**Background** {背景を英語で}
**speech bubble** 「{日本語セリフそのまま}」
**camera angle** {eye-level / top-down / low-angle / side view}
**art style** anime-style, modern manga illustration, soft light and smooth shading, delicate linework, expressive eyes, clean and bright overall tone, --ar 3:4
**color theme** {配色を英語で}
```

### プロンプトが優れている理由（9つの次元）

| # | 次元 | 説明 | なぜ効果的か |
|---|------|------|-------------|
| 1 | **Page layout** | ページ全体の感情の流れ | Geminiにコンテキストを与え、コマ間の一貫性を確保 |
| 2 | **Template指定** | 10種類のコマ割りテンプレから選択 | レイアウトの多様性と読みやすさを両立 |
| 3 | **Description** | シーンの英語説明 | Geminiが最も理解しやすい言語で指示 |
| 4 | **Character details** | DB外見テキストを毎回埋め込み | キャラの外見ブレを防止（最重要） |
| 5 | **Expression** | 表情の指定 | 感情表現の精度向上 |
| 6 | **Facing/Pose** | 向き・ポーズ | 構図のコントロール |
| 7 | **Background** | 背景の詳細指定 | 30+種類のパターンから選択可能 |
| 8 | **Camera angle** | アングル指定 | 映像的な演出効果 |
| 9 | **Art style** | スタイル+アスペクト比 | 一貫した画風とサイズ |

### キャラクター一貫性の確保方法（二重保証）

これが最も技術的に重要なポイント:

#### 方法1: テキスト埋め込み（必須）
- Step 2のDBから外見テキストを**毎回**プロンプトに埋め込む
- 「Character name & details」フィールドに毎回同じ外見定義を記述
- テキストレベルでの一貫性を確保

#### 方法2: キャラクターシート画像の添付（--attach-image）
- `--attach-image` でキャラクターシート画像をGeminiチャットに**毎回**添付
- テキストだけではコマ数が増えると外見がブレるため、**画像参照で補強**
- `--reference-image`（スタイル抽出用）とは違い、直接添付して参照させる

```
テキスト埋め込み（Character details） + 画像添付（--attach-image）
     ↓                                    ↓
   言語レベルの定義                     視覚レベルの参照
     ↓                                    ↓
     └──────────── 二重保証 ────────────────┘
                      ↓
              キャラクター一貫性の最大化
```

---

## コマ割りテンプレートシステム

10種類のコマ割りパターンを用意し、シーンに応じて選択:

| テンプレ | コマ数 | 構成 | 用途 |
|---------|--------|------|------|
| 1 | 1コマ | ページ全体 | 見開き・クライマックス・タイトル |
| 2 | 2コマ | 上下均等分割 | 会話・対比 |
| 3 | 2コマ | 上段小+下段大 | 導入→メイン |
| 4 | 2コマ | 上段大+下段小 | メイン→リアクション |
| 5 | 3コマ | 上中下3段 | テンポのよい展開 |
| 6 | 3コマ | 上1+下左右2 | 展開→分岐 |
| 7 | 3コマ | 上左右2+下1 | 並列→結論 |
| 8 | 4コマ | 上横+中左右+下横 | 複雑な展開 |
| 9 | 4コマ | 上横+下段右縦長+左分割 | ダイナミック構図 |
| 10 | 4コマ | 上横+下段左縦長+右分割 | ダイナミック構図（逆） |

**読み順**: 日本の漫画形式（右上→左下）

---

## 画像生成の仕組み

### 使用ツール: nanobanana-pro

Google Gemini NanoBanana をPlaywrightブラウザ自動化で操作する画像生成スキル。

**技術スタック:**
- Playwright（ブラウザ自動化）
- Google Gemini（NanoBanana Pro画像生成AI）
- Python（スクリプト実行）
- PIL/Pillow（リサイズ処理）

### 生成フロー

```
1. Geminiにアクセス（認証済みブラウザプロファイル使用）
2. 「ツール」→「画像を作成」でNanoBananaモードを有効化
3. --attach-image でキャラクターシート画像を添付
4. 英語プロンプト全文を送信（セリフ部分のみ日本語）
5. 画像生成完了を待機（タイムアウト240秒）
6. 生成画像をダウンロード
7. 896x1200px にリサイズ（PIL使用）
8. 次のページへ（10枚ごとに進捗報告）
```

### 重要パラメータ

| パラメータ | 値 | 理由 |
|-----------|-----|------|
| `--attach-image` | キャラシート画像 | キャラの外見一貫性（直接添付） |
| `--timeout` | 240秒 | 漫画パネルは複雑なため余裕をもたせる |
| `--ar 3:4` | 縦長アスペクト比 | 漫画ページとして最適 |
| 出力サイズ | 896x1200px | 電子書籍・Webtoon向け標準サイズ |
| キャラシート | 1600x900px (16:9) | Geminiが特徴を読み取りやすい横長 |

### --reference-image vs --attach-image の違い

| | --reference-image | --attach-image |
|---|---|---|
| **用途** | スタイル抽出 | キャラクター一貫性 |
| **動作** | 画像→YAML分析→メタプロンプト生成 | 画像をGeminiチャットに直接添付 |
| **漫画での使用** | 使わない | 毎回使う（キャラシート添付） |

---

## nanobanana-prompts スキルのプロンプト最適化ルール

manga-creator-ss のプロンプト品質を支える基盤知識:

### 4つの黄金ルール

1. **編集を優先** — 80%完成した画像には新規生成ではなく具体的な編集指示
2. **自然言語を使用** — キーワード羅列ではなく完全な文で記述
3. **具体的で詳細に** — 曖昧な表現を排除し、具体的な属性を記述
4. **文脈・目的を提供** — 用途や背景を明示する

### プロンプト構造の最適化（100-200語）

```
[主題 30-40語] + [技術仕様 20-30語] + [スタイル/雰囲気 20-30語] + [制約/必須条件 30-50語]
```

### 強調テクニック
- **ALL CAPS** で必須指示 (`MUST`, `NEVER`)
- **Markdown リスト** で複数指示を構造化
- **HEXコード** で正確な色指定
- **カメラ・レンズ名** で品質向上
- **品質キーワード** (`award-winning`, `magazine quality`)

---

## 演出・表現の引き出し

### オノマトペ（20+種類）
ぱぁっ / パァァ / ビクッ / ギクッ / キュン / イライラ / じーっ / ガーン / むすっ / テクテク / ダダダダ / ガチャ / チラッ / カタカタ / シーン / ドキドキ / ザワザワ / キラキラ / パチパチ / ゴゴゴ

### 背景パターン（30+種類）
水玉模様 / 半円 / ドット模様 / フラッシュエフェクト / ストライプ / グラデーション / 幾何学模様 / 集中線 / 放射線 / 斜線ハッチング / 花びら散り / 泡エフェクト / 暗転 / 白飛び / ぼかし背景 / 都市風景 / 室内 / 自然風景 / ハートパターン / 星パターン / 雷エフェクト / 炎エフェクト / パステルグラデーション / モノクロ反転 / セピア調 / 夕焼け色 / 雨粒エフェクト / 雪結晶 / 桜吹雪 / 紅葉 / デジタルエフェクト / 回路パターン / 光の粒子

### キャラクター表情パターン
| 表情 | プロンプト |
|------|----------|
| 通常 | neutral expression, calm face |
| 笑顔 | happy smile, bright eyes, cheerful |
| 驚き | shocked expression, wide eyes, open mouth |
| 悲しみ | sad expression, downcast eyes, teary |
| 怒り | angry expression, furrowed brows |
| 決意 | determined look, confident eyes |
| 困惑 | confused expression, tilted head |
| 照れ | embarrassed, blushing cheeks |

---

## 絶対遵守ルール

| # | ルール | 理由 |
|---|--------|------|
| 1 | セリフ完全維持（一文字も変更しない） | 原稿の意図を守る |
| 2 | 896x1200px サイズ固定 | 電子書籍・Webtoon標準 |
| 3 | 必ずフルカラー（白黒禁止） | Webtoon形式の要件 |
| 4 | （）内の言葉は吹き出しに記載しない | ト書き・心理描写の分離 |
| 5 | 同じ言葉を二回以上吹き出しに記載しない | 冗長さの排除 |

---

## 関連スキルの連携図

```
┌─────────────────────┐
│  manga-creator-ss   │ ← メインオーケストレーター
│  (SKILL.md)         │
└───────┬─────────────┘
        │
        ├──→ nanobanana-pro       (画像生成エンジン)
        │     ├── Playwright ブラウザ自動化
        │     ├── Google Gemini NanoBanana API
        │     ├── --attach-image（キャラ一貫性）
        │     └── --reference-image（スタイル抽出）
        │
        ├──→ nanobanana-prompts   (プロンプト最適化知識)
        │     ├── 4つの黄金ルール
        │     ├── 100-200語プロンプト構造
        │     ├── 強調テクニック (ALL CAPS, HEX, etc.)
        │     └── カテゴリ別テンプレート集
        │
        └──→ custom-character     (キャラクター設計パターン)
              ├── 表情バリエーション
              ├── ポーズバリエーション
              ├── 背景パターン
              └── 一貫性維持テクニック
```

---

## まとめ: なぜプロンプトの出来が良いのか

1. **構造化されたテンプレート** — 9つの次元（Description, Character details, Expression, Facing, Pose, Background, Camera, Art style, Color theme）を網羅
2. **キャラクター一貫性の二重保証** — テキスト埋め込み + 画像添付（--attach-image）
3. **神話の法則によるストーリー設計** — 感情曲線が計算されている
4. **細かいコマ分割テクニック** — 漫画のテンポ感を維持する分割ルール
5. **10種類のコマ割りテンプレート** — シーンに応じた最適レイアウト選択
6. **英語ベース+セリフのみ日本語** — Geminiが最も理解しやすい言語構成
7. **nanobanana-promptsの黄金ルール** — 自然言語・具体性・文脈提供・強調テクニック
8. **豊富な演出引き出し** — 20+オノマトペ、30+背景パターン、8+表情パターン
9. **確認なしの一気通貫フロー** — Step 1→2→3→生成まで途切れずに実行
