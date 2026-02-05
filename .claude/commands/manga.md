---
description: 漫画一括生成 - 原稿/テーマから200+コマの漫画を一括作成
---

# 漫画一括生成

manga-creator-ss スキルを使って、原稿やテーマから漫画を一括生成する。

## 実行手順

1. manga-creator-ss スキル（`.claude/skills/manga-creator-ss/SKILL.md`）を読み込む
2. ユーザーが指定したテーマで Phase 1（ヒアリング）を開始する
3. テーマが指定されていない場合は「どんなテーマの漫画を作りますか？」と聞く

テーマ: $ARGUMENTS
