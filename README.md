# Jobcan Dashboard

[![CI](https://github.com/solclarus/jobcan-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/solclarus/jobcan-dashboard/actions/workflows/ci.yml)
[![Deploy](https://github.com/solclarus/jobcan-dashboard/actions/workflows/deploy.yml/badge.svg)](https://github.com/solclarus/jobcan-dashboard/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

ジョブカンの勤怠データをグラフで可視化するダッシュボード。

**[Demo](https://solclarus.github.io/jobcan-dashboard/)**

## Features

### 統計カード
- 勤務日数（前月比）
- 総労働時間・平均労働時間
- 残業時間（前月比）
- 平均出退勤時刻

### 出退勤チャート
- 出勤・退勤時刻の折れ線グラフ
- 労働時間の棒グラフ
- 曜日ラベル・休日/祝日の色分け
- 勤怠状況ラベル（有給・半休・遅刻・早退など）

### 月別統計チャート
- 総労働時間の推移（棒グラフ）
- 残業時間の推移（線グラフ）
- 勤務日数の推移（線グラフ）

### その他
- ダークモード対応
- レスポンシブ対応（横スクロール）
- 月選択（ドロップダウン・矢印ナビゲーション）

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Charts**: Recharts
- **State**: Zustand

## Getting Started

```bash
# インストール
bun install

# 開発サーバー起動
bun dev

# ビルド
bun run build
```

## データの追加

### 1. CSVファイルの配置

`public/data/` にジョブカンからエクスポートしたCSVを配置:

```
public/data/2025-01.csv
public/data/2025-02.csv
```

### 2. index.txtの更新

`public/data/index.txt` にファイルIDを追加（1行1ID、昇順）:

```
2025-01
2025-02
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
cp ~/Downloads/2025-01.csv public/data/

# index.txtにIDを追加
echo "2025-01" >> public/data/index.txt

# プッシュ
git add public/data/
git commit -m "add: attendance data"
git push
```

`https://<your-username>.github.io/jobcan-dashboard/` でアクセス可能。

## License

MIT
