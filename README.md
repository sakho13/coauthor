# About

## 機能

- [ ] 小説管理
  - [x] 小説単位での CRUD
  - [ ] 小説章単位での CRUD
- [ ] 履歴機能
  - [ ] アクティビティの見える化
- [ ] 執筆アシスト機能
  - [ ] LLM との連携
- [ ] コミュニティ機能
- [ ] 公開機能

## 使用技術

- Next.js
  - Page Router
- Firebase ... 認証
- shadcn/ui ... UI フレームワーク
- jest
- AWS
- GitHub Actions

## ブランチ

- `main` ... 本番環境
- `develop` ... 次回バージョン環境(派生元:`main`, マージ先:`main`)
- `(fix | feature | refactor)/xxx` ... 修正環境(派生元:`develop`, マージ先:`develop`)
