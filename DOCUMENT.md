# アプリ初期案

## アプリ概要

小説管理/執筆支援アプリ

## 機能

1. 小説管理 = manage
  a. 小説マスタの登録
  b. 小説マスタの編集
  c. 小説マスタの削除
  d. ストーリーの登録
  e. ストーリーの編集
  f. ストーリーの削除
2. 小説執筆 = writ
  a. ストーリー執筆(プレーンテキスト)
  b. ストーリー執筆(特定単語のハイライト)
  c. ストーリー執筆(特定単語の意味表示)
3. 執筆アシスト = assist
  a. LLMとの連携
  b. 執筆履歴(アクティビティ)
4. ユーザ管理機能 = user
  a. ユーザ登録
  b. ユーザ編集
  c. ユーザ削除
  d. ユーザ権限設定
5. ユーザコミュニティ
  a. フォロー機能
  b. メッセージ機能

### 優先度

高: 1-a,b,c,d,e,f, 2-a
中: 4-a,b,c,d, 2-b,c
低: 3-a,b, 5-a,b

### データ構造

* 小説マスタ novel
  * 小説ID novel_id
  * 小説名 title
  * 小説区分 novel_type (小説/短編/エッセイ/詩/その他)
* ストーリー story
  * 小説ID novel_id
  * ストーリーID story_id
  * 順序 order
* ストーリーメイン story_main
  * 小説ID novel_id
  * ストーリーID story_id
  * メインテキスト main_text (可能な限り多い文字数DBの型に準拠。本文を格納)
* 小説辞書 novel_dict
  * 小説ID novel_id
  * 単語ID word_id
  * 単語 word
  * 単語意味 word_meaning
  * 単語区分 word_type (名詞/動詞/形容詞/副詞/その他)
  * 単語カテゴリ word_category (人名/地名/固有名詞/その他)
