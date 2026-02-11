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
public/data/2025-01.csv
public/data/2025-02.csv
...
```

### 2. index.jsonの更新

`public/data/index.json` にファイル情報を追加:

```json
{
  "files": [
    {
      "id": "2025-01",
      "name": "2025年1月",
      "path": "data/2025-01.csv",
      "year": 2025,
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

## License

MIT
