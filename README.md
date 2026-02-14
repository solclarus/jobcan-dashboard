# Jobcan Dashboard

[![CI](https://github.com/solclarus/jobcan-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/solclarus/jobcan-dashboard/actions/workflows/ci.yml)
[![Deploy](https://github.com/solclarus/jobcan-dashboard/actions/workflows/deploy.yml/badge.svg)](https://github.com/solclarus/jobcan-dashboard/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ジョブカンの勤怠データをグラフで可視化するダッシュボード。

**[Demo](https://solclarus.github.io/jobcan-dashboard/)**

## Features

- 月別CSVファイルの読み込み
- 出退勤時刻・労働時間の複合チャート
- 曜日ラベル表示、休日・祝日の色分け
- レスポンシブ対応（Y軸固定、横スクロール）
- 統計カード（勤務日数、労働時間、残業時間、平均出退勤）
- ダークモード対応

## Tech Stack

- Bun + Vite + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Recharts
- Zustand

## Setup

```bash
bun install
bun dev
```

## データの追加

### 1. CSVファイルの配置

`public/data/` にCSVファイルを配置:

```
public/data/2026-01.csv
public/data/2026-02.csv
```

### 2. index.txtの更新

`public/data/index.txt` にファイルIDを追加（1行1ID）:

```
2026-01
2026-02
```

### CSV形式

ジョブカンからエクスポートしたCSVをそのまま使用可能。

必要なカラム:
- 日付、休日区分
- シフト開始 / シフト終了
- 出勤時刻 / 退勤時刻
- 労働時間、残業時間
- 勤怠状況

## GitHub Pagesで公開

### 1. リポジトリをフォーク

### 2. GitHub Pagesを有効化

Settings → Pages → Source: `GitHub Actions`

### 3. CSVデータを追加

```bash
git clone https://github.com/<your-username>/jobcan-dashboard.git
cd jobcan-dashboard

# CSVファイルを配置
cp ~/Downloads/2026-01.csv public/data/

# index.txtにIDを追加
echo "2026-01" >> public/data/index.txt

# プッシュ
git add public/data/
git commit -m "add: attendance data"
git push
```

`https://<your-username>.github.io/jobcan-dashboard/` でアクセス可能。

## License

MIT
