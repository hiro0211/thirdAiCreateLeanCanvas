# AI Lean Canvas Creator

DifyのAIワークフローと連携するリーンキャンバス作成アプリケーションです。

## 🚀 特徴

- **AIによるステップバイステップ生成**: キーワードから段階的にリーンキャンバスを作成
- **モダンなUI/UX**: Framer Motionによる滑らかなアニメーション
- **レスポンシブデザイン**: デスクトップ・タブレット・モバイル対応
- **ダークモード対応**: ライトモード・ダークモードの切り替え
- **型安全**: TypeScriptによる完全な型安全性

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 14, TypeScript, React
- **UI**: shadcn/ui, Tailwind CSS, Radix UI
- **状態管理**: Zustand
- **アニメーション**: Framer Motion
- **AIバックエンド**: Dify API

## 📁 ディレクトリ構造

```
src/
├── app/
│   ├── api/dify/           # Dify APIとの通信
│   ├── layout.tsx          # アプリケーションレイアウト
│   ├── page.tsx           # メインページ
│   └── globals.css        # グローバルスタイル
├── components/
│   ├── ui/                # 基本UIコンポーネント
│   ├── layout/            # レイアウトコンポーネント
│   └── workflow/          # ワークフローコンポーネント
├── lib/
│   ├── types.ts          # TypeScript型定義
│   └── utils.ts          # ユーティリティ関数
└── stores/
    └── workflow-store.ts  # Zustand状態管理
```

## 🚀 開始方法

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example`をコピーして`.env.local`を作成し、以下の環境変数を設定してください：

```bash
DIFY_API_KEY="YOUR_DIFY_API_KEY_HERE"
NEXT_PUBLIC_DIFY_API_URL="https://api.dify.ai/v1"
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 🔄 ワークフロー

1. **キーワード入力**: ビジネスアイデアに関するキーワードを入力
2. **ペルソナ選択**: AI生成された10個のペルソナから1つを選択
3. **ビジネスアイデア選択**: ペルソナに基づいた10個のアイデアから1つを選択
4. **詳細入力**: 商品・サービスの詳細情報を入力
5. **プロダクト名選択**: AI生成された10個の名前から1つを選択
6. **リーンキャンバス表示**: 完成したリーンキャンバスを表示

## 🔧 Dify設定

このアプリケーションはDify APIの以下のタスクと連携します：

- `persona`: ペルソナ生成
- `businessidea`: ビジネスアイデア生成
- `productname`: プロダクト名生成
- `canvas`: リーンキャンバス生成

各タスクに対応するDifyワークフローを作成し、適切な入力変数を設定してください。

## 📝 開発・デプロイ

### ビルド

```bash
npm run build
```

### 型チェック

```bash
npx tsc --noEmit
```

### リント

```bash
npm run lint
```

## 🎨 カスタマイズ

- **テーマ**: `src/app/globals.css`でカラーテーマをカスタマイズ
- **アニメーション**: 各コンポーネントでFramer Motionアニメーションを調整
- **スタイル**: Tailwind CSSクラスでデザインを変更

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。

---

Made with ❤️ for entrepreneurs