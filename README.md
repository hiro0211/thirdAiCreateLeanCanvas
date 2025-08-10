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
├── app/                                    # Next.js App Router
│   ├── api/dify/                          # Dify APIとの通信エンドポイント
│   │   ├── route.ts                       # Dify API統合BFFエンドポイント
│   │   └── route-original.ts              # 元のルート実装（参考用）
│   ├── layout.tsx                         # ルートレイアウト、プロバイダー設定
│   ├── page.tsx                           # メインページ、ワークフロー制御
│   └── globals.css                        # Tailwind CSSとカスタムスタイル
├── components/                            # Reactコンポーネント
│   ├── ui/                               # shadcn/ui基本コンポーネント
│   │   ├── button.tsx                     # カスタマイズされたボタンコンポーネント
│   │   ├── card.tsx                       # カードレイアウトコンポーネント
│   │   ├── input.tsx                      # フォーム入力コンポーネント
│   │   ├── label.tsx                      # フォームラベルコンポーネント
│   │   └── progress.tsx                   # プログレスバーコンポーネント
│   ├── layout/                           # レイアウト関連コンポーネント
│   │   ├── Header.tsx                     # アプリヘッダー、ナビゲーション
│   │   └── ThemeToggle.tsx                # ダークモード切り替えボタン
│   ├── tutorial/                         # チュートリアル機能
│   │   ├── TutorialGuide.tsx              # ステップガイド表示
│   │   ├── TutorialModal.tsx              # チュートリアルモーダル
│   │   └── TutorialProvider.tsx           # チュートリアル状態管理
│   └── workflow/                         # ワークフローステップコンポーネント
│       ├── WorkflowStepper.tsx            # ステップインジケーター
│       ├── StepKeywordInput.tsx           # 1. キーワード入力フォーム
│       ├── StepPersonaSelection.tsx       # 2. ペルソナ選択UI
│       ├── StepBusinessIdeaSelection.tsx  # 3. ビジネスアイデア選択UI
│       ├── StepDetailsInput.tsx           # 4. 製品詳細入力フォーム
│       ├── StepProductNameSelection.tsx   # 5. プロダクト名選択UI
│       └── StepLeanCanvasDisplay.tsx      # 6. リーンキャンバス表示
├── lib/                                  # ライブラリとユーティリティ
│   ├── config/                           # 設定管理
│   │   └── env-config.ts                  # 環境変数設定
│   ├── constants/                        # 定数定義
│   │   ├── app-constants.ts               # アプリケーション定数
│   │   ├── canvas-structure.ts            # リーンキャンバス構造定義
│   │   ├── css-classes.ts                 # CSS クラス定数
│   │   ├── index.ts                       # 定数エクスポート
│   │   ├── messages.ts                    # UIメッセージ定数
│   │   └── theme-config.ts                # テーマ設定定数
│   ├── dify/                             # Dify API統合
│   │   ├── client.ts                      # Dify APIクライアント
│   │   ├── mock-generator.ts              # モックデータ生成器
│   │   ├── normalizers.ts                 # データ正規化処理
│   │   └── task-processor.ts              # タスク処理ロジック
│   ├── utils/                            # ユーティリティ関数
│   │   ├── logger.ts                      # ログ機能
│   │   └── message-helpers.ts             # メッセージ処理ヘルパー
│   ├── types.ts                          # TypeScript型定義
│   └── utils.ts                          # shadcn/ui共通ユーティリティ
└── stores/                               # 状態管理
    └── workflow-store.ts                  # Zustandワークフロー状態管理

設定ファイル:
├── tailwind.config.js                    # Tailwind CSS設定
├── tsconfig.json                         # TypeScript設定
├── next.config.js                        # Next.js設定
├── postcss.config.js                    # PostCSS設定
├── package.json                          # プロジェクト依存関係
├── vercel.json                           # Vercelデプロイ設定
├── CLAUDE.md                             # Claude AI開発指示書
├── DifyAPIReference.md                   # Dify API仕様書
└── README.md                             # このファイル
```

## 🏗️ アーキテクチャ詳細

### コア機能とファイルの役割

#### 🎯 **ワークフロー管理**

- **`workflow-store.ts`**: Zustandによる中央状態管理
  - 現在のステップ、ユーザー選択、API レスポンスを管理
  - 非同期API呼び出しとエラーハンドリング
  - ステップ間のデータ流れを制御

#### 🔌 **Dify API統合**

- **`route.ts`**: BFF (Backend for Frontend) パターン
  - フロントエンドとDify APIの仲介
  - タスクベースルーティング (persona, businessidea, productname, canvas)
  - エラーハンドリングとレスポンス正規化
- **`client.ts`**: Dify APIクライアント
  - HTTP通信の抽象化とエラー処理
  - 認証とリクエスト形式の統一
- **`task-processor.ts`**: タスク処理エンジン
  - 各タスクタイプに対応した処理ロジック
  - データバリデーションと変換

#### 🎨 **UI/UXコンポーネント**

- **`page.tsx`**: メインページコントローラー
  - ワークフロー状態に基づくコンポーネント制御
  - ステップ間の遷移管理
- **ワークフローステップコンポーネント**:
  - 各ステップ専用のUI (入力フォーム、選択インターフェース)
  - Framer Motionアニメーション統合
  - レスポンシブデザイン対応

#### 📊 **データフロー**

1. **フロントエンド** → `workflow-store.ts` → API呼び出し
2. **API Route** (`route.ts`) → データ検証 → Dify API
3. **Dify Response** → 正規化 (`normalizers.ts`) → フロントエンド
4. **UI更新** → 次ステップへ遷移

#### 🛠️ **開発支援機能**

- **型安全性**: `types.ts`による厳密な型定義
- **モックデータ**: `mock-generator.ts`による開発時データ生成
- **ログ機能**: `logger.ts`によるデバッグ支援
- **定数管理**: `constants/`ディレクトリによる設定の一元化

## 🚀 開始方法

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env.local`を作成し、以下の環境変数を設定してください：

```bash
DIFY_API_KEY="YOUR_DIFY_API_KEY_HERE"
NEXT_PUBLIC_DIFY_API_URL="https://api.dify.ai/v1"
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 📦 Vercelデプロイ

### 1. Vercelプロジェクト作成

```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# プロジェクトをデプロイ
vercel
```

### 2. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：

- `DIFY_API_KEY`: あなたのDify APIキー
- `NEXT_PUBLIC_DIFY_API_URL`: `https://api.dify.ai/v1`

### 3. プロダクションビルド

```bash
npm run build:production
```

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

## 📝 コーディング規約・命名規則

このプロジェクトでは以下の命名規則を採用しています：

### 🔤 **命名規則 (Naming Conventions)**

#### **PascalCase** - パスカルケース

- **使用箇所**: React コンポーネント、TypeScript 型/インターフェース、クラス
- **例**:

  ```typescript
  // コンポーネント
  export function WorkflowStepper() {}
  export function StepKeywordInput() {}

  // 型定義
  interface PersonaData {}
  interface BusinessIdea {}
  type WorkflowStep = "keyword" | "persona-selection";

  // クラス
  export class TaskProcessor {}
  export class DifyApiClient {}
  ```

#### **camelCase** - キャメルケース

- **使用箇所**: 変数、関数、オブジェクトプロパティ（TypeScript内部）
- **例**:

  ```typescript
  // 変数・関数
  const currentStep = 1;
  const selectedPersona = null;
  function generatePersonas() {}

  // オブジェクトプロパティ（TypeScript内部）
  interface LeanCanvasData {
    keyMetrics: string[];
    uniqueValueProposition: string[];
    unfairAdvantage: string[];
    customerSegments: string[];
    costStructure: string[];
    revenueStreams: string[];
  }
  ```

#### **snake_case** - スネークケース

- **使用箇所**: JSON API フィールド、Dify API との通信データ
- **例**:

  ```typescript
  // Dify API リクエスト/レスポンス
  interface BusinessIdea {
    idea_text: string;      // Dify APIのフィールド名
    osborn_hint: string;    // Dify APIのフィールド名
  }

  interface DifyResponse {
    business_ideas: BusinessIdea[];  // Dify APIのレスポンス
    product_names: ProductName[];    // Dify APIのレスポンス
  }

  // HTTP APIフィールド
  {
    "response_mode": "blocking",
    "conversation_id": "",
    "business_idea": {...},
    "product_details": {...}
  }
  ```

#### **UPPER_SNAKE_CASE** - アッパースネークケース

- **使用箇所**: 定数、設定値、エラーメッセージ
- **例**:

  ```typescript
  // 定数定義
  export const ERROR_MESSAGES = {
    KEYWORD_REQUIRED: "キーワードを入力してください",
    PERSONA_GENERATION_FAILED: "ペルソナ生成に失敗しました",
    REQUIRED_INFO_MISSING: "必要な情報が不足しています"
  };

  export const ANIMATION_CONFIG = {
    DURATION: 0.3,
    EASING: "ease-in-out"
  };

  export const API_CONFIG = {
    DEFAULT_TIMEOUT: 60000,
    STATUS_CODES: {...}
  };
  ```

#### **kebab-case** - ケバブケース

- **使用箇所**: ファイル名（一部）、CSS クラス名、ステップ識別子
- **例**:

  ```typescript
  // ワークフローステップ識別子
  type WorkflowStep =
    | "keyword"
    | "persona-selection" // kebab-case
    | "business-idea-selection" // kebab-case
    | "details-input"
    | "product-name-selection"
    | "canvas-display";

  // CSS クラス名（Tailwind）
  className = "flex-col md:flex-row justify-center items-center";
  ```

### 🎯 **規則の適用理由**

1. **外部API連携**: Dify API が snake_case を使用するため、API層では snake_case を採用
2. **TypeScript慣習**: TypeScript/React エコシステムの標準に従い camelCase/PascalCase を採用
3. **設定管理**: 定数は変更されない値として UPPER_SNAKE_CASE で明確化
4. **一貫性**: 各層で一貫した命名規則を適用し、コードの可読性を向上

### 📋 **ファイル命名規則**

```
📁 コンポーネントファイル: PascalCase.tsx
   └── WorkflowStepper.tsx, StepKeywordInput.tsx

📁 ユーティリティファイル: kebab-case.ts
   └── workflow-store.ts, message-helpers.ts

📁 設定ファイル: kebab-case.ts
   └── env-config.ts, app-constants.ts

📁 型定義ファイル: camelCase.ts
   └── types.ts, utils.ts
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
