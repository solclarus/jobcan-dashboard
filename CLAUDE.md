# Jobcan Dashboard

## 概要
ジョブカンの月次CSVから勤怠データを読み込み、グラフで可視化するダッシュボード。

## 技術スタック
- Bun + Vite + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Zustand (状態管理)
- Recharts
- next-themes
- oxlint + oxfmt

## 命名規則
- ファイル/フォルダ: `kebab-case`
- 変数/関数: `camelCase`
- 型/コンポーネント: `PascalCase`

## ディレクトリ
```
src/
├── components/
│   ├── charts/      # グラフコンポーネント
│   ├── filters/     # 月選択
│   ├── stats/       # 統計カード
│   ├── layout/      # ヘッダー等
│   └── ui/          # shadcn/ui
├── lib/             # ユーティリティ
├── stores/          # Zustand
├── types/           # 型定義
└── hooks/           # カスタムフック
```

## データフロー
1. `public/data/index.txt` → ファイルID一覧取得
2. ユーザーが月選択
3. CSV読み込み → パース → `WorkRecord[]`
4. Zustand管理 → Recharts描画

## 主要型
```typescript
interface WorkRecord {
  date: Date;
  holidayType: string;
  shiftStart: string;
  shiftEnd: string;
  startTime: string;
  endTime: string;
  workTime: string;
  overtimeHours: string;
  status: string;
}

interface DayData {
  day: number;
  dayOfWeek: number;
  dayOfWeekLabel: string;
  workHours: number;
  overtimeHours: number;
  startMinutes: number | null;
  endMinutes: number | null;
  isWeekend: boolean;
  dayType: DayType;
  hasWork: boolean;
}
```

## コマンド
```bash
bun dev          # 開発サーバー
bun run build    # ビルド
bun run lint     # リント (oxlint)
bun run format   # フォーマット (oxfmt)
```

## パスエイリアス
`@/*` → `src/*`

## 重要事項
- CSV読み込み専用（編集不可）
- ダークモード対応
- GitHub Pages: 環境変数`BASE_URL`で設定
- index.txt: 1行1IDのシンプルなテキストファイル
