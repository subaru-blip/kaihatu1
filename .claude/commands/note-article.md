---
description: note記事一発生成 - 記事本文（7,000〜15,000字）+ 画像を一括作成
---

# note記事一発生成

note-article-creator-ss スキルを使って、note記事の本文と全イメージ画像を一括生成する。

## 実行手順

1. note-article-creator-ss スキル（`.claude/skills/note-article-creator-ss/SKILL.md`）を読み込む
2. ユーザーが指定したテーマで Phase 1（ヒアリング）を開始する
3. テーマが指定されていない場合は「どんなテーマのnote記事を作りますか？」と聞く

テーマ: $ARGUMENTS
