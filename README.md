# Jobcan Dashboard

ジョブカンの勤怠データをグラフで可視化するダッシュボード。

## Features

- 月別CSVファイルの読み込み
- 日別労働時間・残業時間のグラフ表示
- 出退勤時刻の推移
- 曜日別平均労働時間
- 月次比較
- ダークモード対応

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4 + shadcn/ui
- Recharts
- Zustand

## Setup

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build
bun run build
```

## データの追加

### 1. CSVファイルの配置

`public/data/` にCSVファイルを配置:

```
public/data/2026-01.csv
public/data/2026-02.csv
...
```

### 2. index.jsonの更新

`public/data/index.json` にファイル情報を追加:

```json
{
  "files": [
    {
      "id": "2026-01",
      "name": "2026年1月",
      "path": "data/2026-01.csv",
      "year": 2026,
      "month": 1
    }
  ]
}
```

### CSV形式

ジョブカンからエクスポートしたCSVをそのまま使用可能。

必要なカラム:
- 日付
- 休日区分
- シフト開始 / シフト終了
- 出勤時刻 / 退勤時刻
- 勤務時間
- 残業時間
- 勤怠状況

## GitHub Pagesで公開

### 1. リポジトリをフォーク

このリポジトリをフォークして自分のアカウントにコピー。

### 2. GitHub Pagesを有効化

1. フォークしたリポジトリの **Settings** → **Pages**
2. **Source** で `GitHub Actions` を選択

### 3. CSVデータを追加

```bash
# リポジトリをクローン
git clone https://github.com/<your-username>/jobcan-dashboard.git
cd jobcan-dashboard

# CSVファイルを配置
cp ~/Downloads/2026-01.csv public/data/

# index.jsonを編集してファイル情報を追加
```

`public/data/index.json`:
```json
{
  "files": [
    {
      "id": "2026-01",
      "name": "2026年1月",
      "path": "data/2026-01.csv",
      "year": 2026,
      "month": 1
    }
  ]
}
```

### 4. プッシュしてデプロイ

```bash
git add public/data/
git commit -m "add: attendance data"
git push
```

プッシュ後、GitHub Actionsが自動でビルド・デプロイ。
`https://<your-username>.github.io/jobcan-dashboard/` でアクセス可能。

## License

MIT
