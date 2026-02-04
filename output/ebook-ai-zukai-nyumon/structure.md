# 構成設計: AI図解生成 初心者向け入門

書籍タイトル: **AIで「伝わる図解」を作る技術 ── NanoBanana Pro × 24パターンで誰でもプロ級インフォグラフィック**
想定読者: AI図解を作ってみたいが、プロンプトの書き方がわからない初心者〜中級者
読者のゴール: NanoBanana Proを使って、24種類の図解パターンをコピペで生成できるようになる

---

## ビジュアルトーン設定

- メインカラー: #2563EB（信頼感のあるブルー）
- サブカラー: #F3F4F6（ライトグレー、背景用）
- アクセントカラー: #F59E0B（注目ポイント用のアンバー）
- イラストスタイル: flat design（フラットデザイン）
- 雰囲気: professional yet friendly（プロフェッショナルだが親しみやすい）

---

## はじめに（800〜1,000字）

- この本の目的：「デザインスキルゼロでも、AIで伝わる図解が作れる」
- 読者への約束：読み終わる頃には24種類の図解を自在に生成できる
- 本書の使い方：第1〜2章で基礎を理解 → 第3章でパターンを知る → 第4章でコピペ実践 → 第5章でSNS活用

---

## 第1章: AIで図解が作れる時代がやってきた（2,500〜3,000字）

**テーマ**: AI図解の現在地を知り、NanoBanana Proを使い始める

キーポイント:
  1. なぜ今「AI図解」なのか？ ── 情報は「読む」から「見る」へ
  2. NanoBanana Proとは何か ── Geminiの画像生成が進化した理由
  3. 5分で始める初めてのAI図解 ── Geminiを開いて最初の1枚を作る

図解候補:
  - [HEADER] 明るいデスクでノートPCを開き、画面にカラフルなインフォグラフィックが表示されている。初心者が驚きと期待の表情で画面を覗き込んでいるシーン
  - [INLINE] pattern=before-after | title=図解作成の変化 | elements=Before:デザインソフトで何時間もかけて手作業,After:AIにプロンプトを入れて数秒で完成 | description=左はモノクロで疲れた表情、右はカラフルで笑顔
  - [INLINE] pattern=stairs | title=AI画像生成の進化 | elements=初期AI:文字が読めない,Nano Banana:日本語対応開始,Nano Banana Pro:高精度×4K×日本語 | description=階段を上がるごとに品質が向上するイメージ
  - [INLINE] pattern=flow-horizontal | title=最初の1枚を作る3ステップ | elements=Geminiを開く,思考モード+画像作成を選択,テーマを入力して生成 | description=各ステップにシンプルなアイコン付き
  - [INLINE] pattern=comparison-table | title=AI図解ツール比較 | elements=NanoBanana Pro:日本語◎・無料・4K,ChatGPT:英語◎・有料・HD,Canva AI:テンプレ型・有料・カスタム性△ | description=NanoBanana Proをアクセントカラーでハイライト

---

## 第2章: 図解が崩れる理由と「魔法のプロンプト構造」（2,500〜3,000字）

**テーマ**: なぜAI図解は崩れるのか？ バイリンガル・ハイブリッド記述で解決する

キーポイント:
  1. AIが図解を苦手とする理由 ── 空間認識と言語処理は別の能力
  2. バイリンガル・ハイブリッド記述とは ── 構造は英語、テキストは日本語
  3. Subject / Layout / Visuals / Style の4要素 ── プロンプトの「設計図」
  4. 文字崩れを防ぐ5つのテクニック ── ゴシック体、余白、コントラスト

図解候補:
  - [HEADER] AIが図解を生成しようとして混乱している様子。左脳（論理・言語）と右脳（空間・ビジュアル）が分かれて描かれ、両方を使う必要があることを示唆
  - [INLINE] pattern=formula | title=バイリンガル・ハイブリッドの原理 | elements=英語（構造指示）,日本語（表示テキスト）,高品質な図解 | description=A+B=Cの形式で「なぜ混ぜると良いのか」を直感的に
  - [INLINE] pattern=tree | title=プロンプト4要素の構造 | elements=Subject:何を描くか,Layout:空間配置,Visuals:色・アイコン,Style:デザインスタイル | description=NanobananaPro形式の全体像をツリーで表示
  - [INLINE] pattern=before-after | title=プロンプト改善の効果 | elements=Before:「フロー図を作って」→文字化け・崩れ,After:4要素プロンプト→整った図解 | description=悪い例と良い例を対比
  - [INLINE] pattern=list-vertical | title=文字崩れを防ぐ5つのテクニック | elements=ゴシック体・太字フォント指定,十分な余白を確保,高コントラスト配色,情報量を絞る（1図5要素以内）,英語で配置→日本語に差し替え | description=チェックマーク付きの実践リスト
  - [INLINE] pattern=flow-vertical | title=良いプロンプトの書き方4ステップ | elements=Subject:全体概要を1文で,Layout:配置を英語で具体的に,Visuals:色・アイコンを指定,Style:統一トーンを宣言 | description=上から順に書く手順

---

## 第3章: 24種の図解パターンを使いこなす（2,500〜3,000字）

**テーマ**: どの場面でどのパターンを使うか、判断できるようになる

キーポイント:
  1. 5つのカテゴリで24パターンを整理 ── 構造、流れ、比較、関係、リスト
  2. 「いつ・どれを使うか」判断フローチャート ── 3つの質問で最適パターンが決まる
  3. 最頻出パターンBEST5を詳しく解説 ── フロー図・ピラミッド・比較表・ビフォーアフター・リスト

図解候補:
  - [HEADER] 24種類の図解パターンがモザイク状にタイル配置されたカラフルなコレクション。まるでデザインパレットのように整然と並んでいるシーン
  - [INLINE] pattern=group-large | title=24パターン×5カテゴリ | elements=構造・分類:ツリー/ピラミッド/レイヤー/ハニカム/グループ,流れ・変化:フロー横/フロー縦/サイクル/階段/ガント,比較・分析:ビフォーアフター/マトリクス/比較表/規模比較/同心円/ベン,関係・論理:相関/放射/トライアングル/数式/マップ,簡易・リスト:縦/横/羅列/イラスト | description=5カテゴリに色分けしたグリッド一覧
  - [INLINE] pattern=flow-vertical | title=図解パターン判断フローチャート | elements=Q1:伝えたいのは「手順」？→Yes:フロー系,Q2:伝えたいのは「違い」？→Yes:比較系,Q3:伝えたいのは「構造」？→Yes:構造系,それ以外→関係系orリスト系 | description=3つの質問で分岐するフローチャート
  - [INLINE] pattern=radial | title=最頻出パターンBEST5 | elements=フロー図（横型）,ピラミッド図,比較表,ビフォーアフター,リスト（縦型） | description=中心に「よく使うBEST5」、各パターンが放射状に配置
  - [INLINE] pattern=pyramid | title=パターン選びの優先度 | elements=まずフロー系（手順・流れ）,次に比較系（違い・変化）,そして構造系（分類・階層）,最後に関係系（つながり） | description=使用頻度の高い順にピラミッド配置
  - [INLINE] pattern=matrix | title=パターン選定マトリクス | elements=情報量:少↔多,時間軸:なし↔あり,左上:リスト系,右上:ガント/フロー,左下:比較/構造系,右下:ネットワーク/放射 | description=2軸で最適パターンを絞り込める

---

## 第4章: コピペで使える！実践プロンプトテンプレート集（2,500〜3,000字）

**テーマ**: 実際のプロンプトをコピペして、すぐに図解を生成する

キーポイント:
  1. テンプレートの使い方 ── {タイトル}と{要素}を差し替えるだけ
  2. 代表8パターンの完全プロンプト ── フロー横・ピラミッド・ビフォーアフター・比較表・サイクル・ツリー・リスト・イラスト
  3. カスタマイズのコツ ── 色変更、要素の増減、雰囲気の調整

図解候補:
  - [HEADER] テンプレートカードが整然と並んだデスク。各カードにはプロンプトの構造が書かれ、ユーザーが1枚を手に取っている。実践的で手を動かすイメージ
  - [INLINE] pattern=flow-horizontal | title=テンプレートの使い方3ステップ | elements=パターンを選ぶ,{タイトル}と{要素}を差し替える,Geminiに貼り付けて生成 | description=シンプルな3ステップで「これだけでOK」感を出す
  - [INLINE] pattern=comparison-table | title=代表8パターン早見表 | elements=フロー横:手順説明に最適,ピラミッド:階層構造に,ビフォーアフター:変化を見せる,比較表:複数項目の対比,サイクル:繰り返しプロセス,ツリー:分類・グルーピング,リスト:情報の一覧,イラスト:概念・雰囲気 | description=8パターンの用途を一目で把握
  - [INLINE] pattern=before-after | title=カスタマイズ例 | elements=Before:テンプレートそのまま（青系・基本構成）,After:色をピンクに変更＋要素を5つに増やした応用版 | description=テンプレートから自分好みにアレンジする流れ
  - [INLINE] pattern=list-vertical | title=カスタマイズ3つのコツ | elements=色の変更:HEXコードを書き換えるだけ,要素の増減:カンマ区切りで追加・削除,雰囲気の調整:Styleの形容詞を変える | description=実践的なTIPSリスト
  - [INLINE] pattern=cycle | title=図解の品質を上げるPDCAサイクル | elements=生成する,確認する,プロンプトを調整する,再生成する | description=1回で完璧にならなくてOK、繰り返しで品質向上

---

## 第5章: AI図解をSNSとビジネスで活用する（2,500〜3,000字）

**テーマ**: 作った図解をInstagram・TikTok・ビジネスで効果的に使う

キーポイント:
  1. Instagram「読むリール」× AI図解 ── 静止画スライドショーで情報発信
  2. TikTok「フォトモード」× AI図解 ── 動画スキル不要で参入できる
  3. ビジネス活用 ── プレゼン資料・社内共有・ブログ記事への挿入
  4. Canvaでの後編集テクニック ── AI生成画像を更に磨き上げる

図解候補:
  - [HEADER] スマートフォンの画面にInstagramとTikTokの図解投稿が表示され、いいねやコメントの通知が飛び交っている。活気あるSNS活用シーン
  - [INLINE] pattern=flow-horizontal | title=「読むリール」の作り方 | elements=AI図解を5〜7枚生成,Canvaでサイズ調整（9:16）,Instagram Reelsに投稿 | description=図解からリールまでの簡単3ステップ
  - [INLINE] pattern=comparison-table | title=SNSプラットフォーム別・図解活用法 | elements=Instagram:読むリール・カルーセル投稿,TikTok:フォトモード・スライドショー,X（Twitter）:1枚図解ツイート,note:記事内の説明図解 | description=各プラットフォームでの最適な使い方
  - [INLINE] pattern=scale-circles | title=リール広告の効果 | elements=フィード広告:エンゲージメント率1倍,リール広告:エンゲージメント率2.5倍 | description=円の大きさでリールの優位性を直感的に表現
  - [INLINE] pattern=stairs | title=AI図解でビジネスを加速する4段階 | elements=Step1:社内資料の図解化,Step2:ブログ・noteへの挿入,Step3:SNSでの情報発信,Step4:電子書籍・コンテンツ販売 | description=身近な活用から収益化まで段階的に
  - [INLINE] pattern=flow-vertical | title=Canvaでの後編集5ステップ | elements=AI図解をCanvaにアップロード,テキストの微調整（フォント・サイズ）,ブランドカラーに合わせて色調整,ロゴ・透かしを追加,SNS用サイズにリサイズして書き出し | description=AI生成物をプロ品質に仕上げる手順

---

## おわりに（800〜1,000字）

- まとめ：AI図解の本質は「伝えたいことを、見える形にする力」
- 読者への次のステップ：24パターンを1日1つ試す「24日間チャレンジ」の提案
- 応援メッセージ：デザインスキルがなくても、伝えたい想いがあれば図解は作れる
