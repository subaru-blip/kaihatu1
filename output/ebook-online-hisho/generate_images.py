#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
電子書籍用画像一括生成スクリプト
"""

import subprocess
import os
import sys
import io

# Windows環境でのUTF-8出力設定
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 画像生成リスト（プロンプトと出力ファイル名）
images = [
    {
        "name": "ch1_header.png",
        "prompt": """* Subject: (Professional infographic overview for e-book chapter. Horizontal flow showing three key features of online secretary work with Japanese text.)
* Layout: (Wide landscape 16:9. Three connected sections flowing left to right, each with icon and title area.)
* Visuals: (Flat vector design, modern business presentation style, clean Japanese typography, bold sans-serif fonts. Section 1 with location pin icon and text reads "場所の自由" in #FF6B9D pink, Section 2 with clock icon and text reads "時間の自由" in #4A90E2 blue, Section 3 with coins icon and text reads "収入の可能性" in #FFD700 gold. White background, connecting arrows between sections, professional quality, 4k.)
* Style: (Clean infographic, consistent diagram style, professional e-book quality, high resolution 4k.)"""
    },
    {
        "name": "ch1_img1.png",
        "prompt": """* Subject: (Before and After comparison infographic with Japanese text showing career transformation.)
* Layout: (Split-screen. Left "Before" shows: "時給900円パート・週4勤務・月8万円・通勤2時間", Right "After" shows: "在宅・週3勤務・年収2.8億円・通勤0分". Large arrow pointing right between them. Title: "働き方を変えた10年の変化".)
* Visuals: (Left: Dull gray tones with tired figure icon and negative elements. Right: Bright #FF6B9D pink and #FFD700 gold tones with smiling figure icon and success elements. High contrast. Bold Japanese text. Arrow emphasized.)
* Style: (Bold typography, high-impact visuals, flat design, professional Japanese font, 4k.)"""
    },
    {
        "name": "ch1_img2.png",
        "prompt": """* Subject: (Comparison chart with Japanese text contrasting traditional secretary vs online secretary.)
* Layout: (Grid comparing two types across 3 features: "場所", "時間", "収入". Left column: traditional secretary (gray), Right column: online secretary (highlighted in #FF6B9D pink). Title: "従来の秘書 vs オンライン秘書".)
* Visuals: (Clean table design. Left: "会社オフィス", "社長のスケジュール", "固定給" in neutral gray. Right: "どこでもOK", "自分で調整", "組み合わせ自由" in bright #FF6B9D with checkmarks. Bold border around right column.)
* Style: (Corporate style, clean lines, easy-to-read Japanese, professional, 4k.)"""
    },
    {
        "name": "ch1_img3.png",
        "prompt": """* Subject: (Scale comparison infographic showing supply-demand gap with Japanese text.)
* Layout: (Two circles of different sizes side-by-side. Large circle labeled "需要（経営者が求める人数）" in #4A90E2 blue. Small circle labeled "供給（実際に働ける人数）" in gray. Gap arrow between them. Title: "需要と供給のギャップ".)
* Visuals: (Vibrant colors. Large circle much bigger than small circle to emphasize gap. Numerical labels or percentages inside circles in Japanese. Arrow with "チャンス！" text.)
* Style: (Impactful, bold, high-resolution vector, clear contrast, 4k.)"""
    },
    {
        "name": "ch2_header.png",
        "prompt": """* Subject: (Professional infographic of a Honeycomb structure showing online secretary tasks with Japanese text.)
* Layout: (Cluster of 6 interlocking hexagons. Center hexagon: "オンライン秘書", surrounding hexagons: "LINE返信", "Instagram投稿", "資料作成", "ブログ加工", "スケジュール管理", "メール対応". Title: "オンライン秘書の業務マップ".)
* Visuals: (Modern icons inside each hexagon. Gradient colors using #FF6B9D pink and #4A90E2 blue. Clean connecting points. Center hexagon highlighted in #FFD700 gold.)
* Style: (Tech-oriented, geometric, minimalist, high-quality Japanese typography, 4k.)"""
    },
    {
        "name": "ch2_img1.png",
        "prompt": """* Subject: (Math equation style infographic showing income calculation with Japanese text.)
* Layout: (Horizontal equation: "1人で対応" + "3日に1回投稿" + "月10回" = "月5万円". Bold "+" and "=" symbols. Title: "LINE返信業務の収入例".)
* Visuals: (Each element in a stylized box/circle with icon. First three elements in #4A90E2 blue. Final result "月5万円" in large #FFD700 gold with glow effect.)
* Style: (Iconic, minimalist, bold fonts, clear Japanese typography, 4k.)"""
    },
    {
        "name": "ch2_img2.png",
        "prompt": """* Subject: (Horizontal Flow Chart showing Instagram posting process with Japanese text.)
* Layout: (Linear progression left to right. 4 steps connected by bold arrows: "①写真・文章を受け取る", "②アプリで加工（30分）", "③投稿完了を報告", "④報酬GET". Title: "Instagram投稿代行の流れ".)
* Visuals: (Chevron-shaped boxes for each step. Cohesive color palette #FF6B9D pink. High-quality icons above each step - envelope, smartphone, checkmark, money.)
* Style: (Professional, sleek, flat design, white background, Japanese font, 4k.)"""
    },
    {
        "name": "ch2_img3.png",
        "prompt": """* Subject: (Stylized vertical list design showing main tasks and compensation with Japanese text.)
* Layout: (Vertical list with 5 items. Title: "主な業務と報酬例". Items: "LINE返信:月3〜15万円", "Instagram投稿:月5万円", "ブログ加工:1件1000円", "資料作成:月6万円", "メイン秘書（総合）:月46万円".)
* Visuals: (Modern checkmark icons in #4A90E2 blue. Alternating light/white backgrounds for rows. Compensation amounts in bold #FFD700 gold. High-contrast labels.)
* Style: (Clean UI design, professional sans-serif, easy-to-read layout, 4k.)"""
    },
    {
        "name": "ch2_img4.png",
        "prompt": """* Subject: (Staircase Step Diagram showing income progression with Japanese text.)
* Layout: (Rising steps labeled: "ステップ1:月3〜5万円", "ステップ2:月10万円", "ステップ3:月20万円", "ステップ4:月40万円", "ステップ5:月70万円". Character icon at top celebrating. Title: "収入の段階的成長". Small text under each step showing timeframe.)
* Visuals: (Isometric 3D perspective steps. Color intensity increases with height from light #4A90E2 to bright #FFD700. Clear bold Japanese labels. Success star at peak.)
* Style: (Achievement-oriented, motivational style, high-quality vector, 4k.)"""
    },
    {
        "name": "ch3_header.png",
        "prompt": """* Subject: (Radial/Mind-map style infographic showing mom's strengths with Japanese text.)
* Layout: (Central circle containing "ママの強み". Lines radiating outward to 5 circles: "気配り力", "コミュニケーション力", "タスク管理力", "先回り力", "丁寧さ". Title: "ママが持つ強みの放射図".)
* Visuals: (Vibrant colors for each branch using #FF6B9D pink, #4A90E2 blue gradients. Thin, curved connecting lines. Professional icons next to each element - heart, chat bubble, checklist, lightbulb, star.)
* Style: (Modern tech style, clean layout, high definition, Japanese typography, 4k.)"""
    },
    {
        "name": "ch3_img1.png",
        "prompt": """* Subject: (Venn Diagram with overlapping circles and Japanese text showing skill compatibility.)
* Layout: (Two large circles overlapping. Left circle labeled "ママの日常スキル" contains "気配り・先回り・タスク管理". Right circle labeled "オンライン秘書に必要なスキル" contains "丁寧さ・情報整理・期限管理". Center overlap highlighted with text "完全一致！". Title: "ママのスキルとオンライン秘書の相性".)
* Visuals: (Left circle in #FF6B9D pink, right circle in #4A90E2 blue. Overlapping area creates purple gradient with glow effect. Soft drop shadows. Exclamation mark in overlap.)
* Style: (Elegant, clean design, professional Japanese sans-serif font, white background, 4k.)"""
    },
    {
        "name": "ch3_img2.png",
        "prompt": """* Subject: (Horizontal Flow Chart showing AI-powered document creation process with Japanese text.)
* Layout: (Linear progression left to right. 4 steps connected by bold arrows: "①内容を箇条書き", "②NotebookLMにアップロード", "③ワンクリック", "④完成！". Title: "AI活用で資料作成". Step 3 button emphasized.)
* Visuals: (Chevron-shaped boxes. Steps 1-2 in neutral gray, Step 3 in bright #FFD700 gold with click effect, Step 4 in #4A90E2 blue with celebration. Icons: pencil, upload, cursor, checkmark.)
* Style: (Professional, sleek, flat design, white background, Japanese font, 4k.)"""
    },
    {
        "name": "ch3_img3.png",
        "prompt": """* Subject: (Comparison of scale using circles showing income difference with Japanese text.)
* Layout: (Two circles of different sizes side-by-side. Large circle: "AI活用者:月4.6万円". Small circle: "未使用者:月2.5万円". Title: "AI活用による収入差". Text "1.84倍！" prominently displayed.)
* Visuals: (Large circle in #FFD700 gold, small circle in gray. Numerical values inside circles in Japanese. Multiplier "1.84倍" in large bold text with emphasis effect.)
* Style: (Impactful, bold, high-resolution vector, clear contrast, 4k.)"""
    },
    {
        "name": "ch3_img4.png",
        "prompt": """* Subject: (Before and After comparison infographic about mindset transformation with Japanese text.)
* Layout: (Split-screen. Left "Before": "100点目指して何時間も悩む→疲弊" with stressed figure. Right "After": "60点でいいから早く出す→感謝される" with smiling figure. Large arrow pointing right. Title: "働き方マインドの転換".)
* Visuals: (Left: Dark gray tones, tired face icon, heavy atmosphere. Right: Bright #FF6B9D pink and #FFD700 gold, happy face icon, light atmosphere. High contrast.)
* Style: (Bold typography, high-impact visuals, flat design, professional Japanese font, 4k.)"""
    },
    {
        "name": "ch4_header.png",
        "prompt": """* Subject: (Vertical Flow Chart showing online secretary start process with Japanese text.)
* Layout: (Top-to-bottom progression. 5 boxes connected by downward arrows: "①準備（ツール・環境）", "②プロフィール作成", "③案件探し", "④応募・面談", "⑤契約・業務開始". Title: "オンライン秘書スタートの流れ".)
* Visuals: (Numbered bullets next to each box. Gradient from #4A90E2 blue (top) to #FFD700 gold (bottom). Detailed sub-text in smaller Japanese font inside boxes. Icons for each step.)
* Style: (Clean UI design, professional, white background, high resolution, 4k.)"""
    },
    {
        "name": "ch4_img1.png",
        "prompt": """* Subject: (Stylized vertical list design showing preparation items with Japanese text.)
* Layout: (Vertical list with 3 sections. Title: "最初に揃えるもの". Section 1: "必須:スマホ・ネット環境・LINE", Section 2: "推奨:パソコン・Googleアカウント", Section 3: "無料ツール:ChatGPT・NotebookLM・Canva".)
* Visuals: (Modern checkmark icons in #4A90E2 blue. Section 1 with double-circle emphasis. Clean card design. High-contrast labels. Icons for smartphone, computer, AI.)
* Style: (Clean UI design, professional sans-serif, easy-to-read layout, 4k.)"""
    },
    {
        "name": "ch4_img2.png",
        "prompt": """* Subject: (Comparison chart of crowdsourcing platforms with Japanese text.)
* Layout: (Grid comparing two platforms across features. Columns: "クラウドワークス" (highlighted), "ランサーズ". Rows show: 案件数, 手数料, 初心者向け度. Title: "クラウドソーシング比較". Left column with recommendation badge.)
* Visuals: (Bright checkmarks for recommended platform in #FFD700 gold. Left column highlighted with bold border in #FF6B9D pink. Clean comparison icons. Star ratings for beginner-friendliness.)
* Style: (Corporate style, clean lines, easy-to-read Japanese, professional, 4k.)"""
    },
    {
        "name": "ch4_img3.png",
        "prompt": """* Subject: (Staircase Step Diagram showing journey to first client and 200k income with Japanese text.)
* Layout: (Rising steps labeled: "①初案件獲得（月3万）", "②継続依頼（月5万）", "③複数クライアント（月10万）", "④紹介の連鎖（月20万）", "⑤さらなる拡大（月40万〜）". Character icon climbing stairs. Title: "初案件から月20万円までの道のり". Timeframe notes under each step.)
* Visuals: (Isometric 3D perspective steps. Gradient from #4A90E2 blue (bottom) to #FFD700 gold (top). Clear bold Japanese labels. Celebration elements at peak.)
* Style: (Achievement-oriented, motivational style, high-quality vector, 4k.)"""
    },
    {
        "name": "ch5_header.png",
        "prompt": """* Subject: (Circular Cycle Diagram showing continuous improvement loop with Japanese text.)
* Layout: (Continuous circular arrow loop. 5 segments clockwise: "丁寧な対応", "期限厳守", "クライアント満足", "追加依頼", "紹介が生まれる". Center contains "信頼" in large text. Title: "継続案件獲得のサイクル".)
* Visuals: (Gradient colors along the circle using #FF6B9D pink to #4A90E2 blue to #FFD700 gold. Smooth arrows showing clockwise movement. Bold Japanese text in segments. Center "信頼" with glow effect.)
* Style: (Modern vector, professional look, high resolution, white background, 4k.)"""
    },
    {
        "name": "ch5_img1.png",
        "prompt": """* Subject: (Stylized vertical list showing 5 trust-building points with Japanese text.)
* Layout: (Vertical list with 5 items. Title: "信頼を勝ち取る5つのポイント". Items: "①納期厳守", "②報連相の徹底", "③すぐに質問", "④プラスアルファの気配り", "⑤感謝の気持ち".)
* Visuals: (Modern checkmark icons in #4A90E2 blue. Numbered circles 1-5. Alternating light backgrounds. Key points in #FF6B9D pink highlight. Icons: calendar, communication, question mark, plus sign, heart.)
* Style: (Clean UI design, professional sans-serif, easy-to-read layout, bright and positive tone, 4k.)"""
    },
    {
        "name": "ch5_img2.png",
        "prompt": """* Subject: (Timeline/Gantt chart showing daily schedule with Japanese text.)
* Layout: (Horizontal timeline from morning to night. Time blocks showing: "朝:子どもの支度", "午前:スマホで返信", "昼:子ども昼寝中に作業", "午後:家事", "夜:寝かしつけ後に作業". Title: "1日のスケジュール例". Work time blocks highlighted.)
* Visuals: (Color-coded bars - work time in #FF6B9D pink, family time in soft gray. Work blocks emphasized with icons (smartphone, laptop). Time axis clear with hour markers. Gap time blocks highlighted.)
* Style: (Modern business project visual, professional, clean layout, 4k.)"""
    },
    {
        "name": "ch5_img3.png",
        "prompt": """* Subject: (Complex Correlation Map showing referral network with Japanese text.)
* Layout: (Central node "あなた" with directional arrows connecting to surrounding nodes: "クライアントA", "クライアントB", "クライアントC", "クライアントD". Arrows labeled "紹介". Title: "紹介の連鎖イメージ".)
* Visuals: (Center node in #FFD700 gold with glow. Surrounding nodes in #4A90E2 blue. Different arrow thicknesses showing strength. Small icons representing different clients. Network pattern radiating outward.)
* Style: (Clear logical flow, professional business diagram, white background, 4k.)"""
    },
    {
        "name": "ch5_img4.png",
        "prompt": """* Subject: (Timeline/Gantt chart showing 6-month roadmap with Japanese text.)
* Layout: (Horizontal timeline showing 6 months. Each month has milestone bar: "1ヶ月目:準備・初案件", "2ヶ月目:実績作り", "3ヶ月目:複数契約", "4ヶ月目:紹介スタート", "5ヶ月目:月20万達成", "6ヶ月目:パート卒業". Title: "6ヶ月逆算ロードマップ". Final milestone emphasized.)
* Visuals: (Color-coded bars by stage - early months in #4A90E2 blue, later months in #FF6B9D pink, final in #FFD700 gold. Milestone star markers. Income growth curve overlay. Clear month labels in Japanese.)
* Style: (Modern business project visual, professional, clean layout, inspiring tone, 4k.)"""
    }
]

# nanobanana-proスキルのパス
skill_path = "C:/Users/baseb/dev/開発1/.claude/skills/nanobanana-pro"
output_dir = "C:/Users/baseb/dev/開発1/output/ebook-online-hisho/images"

os.makedirs(output_dir, exist_ok=True)

print(f"[IMAGE GENERATION] 電子書籍用画像を{len(images)}枚生成します\n")

for i, img in enumerate(images, 1):
    print(f"\n{'='*60}")
    print(f"[{i}/{len(images)}] {img['name']} を生成中...")
    print(f"{'='*60}")

    output_path = os.path.join(output_dir, img['name'])

    # コマンド構築
    cmd = [
        "python",
        "scripts/run.py",
        "image_generator.py",
        "--prompt", img['prompt'],
        "--output", output_path
    ]

    try:
        # 実行
        result = subprocess.run(
            cmd,
            cwd=skill_path,
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=300
        )

        if result.returncode == 0:
            print(f"[OK] {img['name']} 生成完了")
        else:
            print(f"[ERROR] {img['name']} 生成失敗")
            print(f"エラー: {result.stderr}")

    except subprocess.TimeoutExpired:
        print(f"[TIMEOUT] {img['name']} タイムアウト（5分超過）")
    except Exception as e:
        print(f"[ERROR] {img['name']} エラー: {e}")

print(f"\n{'='*60}")
print("[COMPLETE] すべての画像生成が完了しました")
print(f"{'='*60}")
