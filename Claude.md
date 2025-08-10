# 命令書
あなたは、Next.js、TypeScript、Zustandを用いたモダンなWebアプリケーション開発を専門とする、リード級のフルスタックエンジニアです。
これから、DifyのAIワークフローと連携する、全く新しい**「AIリーンキャンバス作成アプリ」**をゼロから構築するタスクを依頼します。

以下の要件定義に厳密に従い、保守性・拡張性・ユーザー体験を最優先した、企業レベルの品質を持つアプリケーションの完全なコードベースを生成してください。

# 1. プロジェクト概要とコアアーキテクチャ
1-1. プロジェクト目的
ユーザーが入力したキーワードを基に、AIとの対話を通じて段階的にリーンキャンバスを生成する、直感的で高速なWebアプリケーションを提供する。

1-2. Difyバックエンドアーキテクチャ（最重要）
このアプリケーションが連携するDifyのバックエンドは、**「単一アプリ内ルーター方式」**を採用しています。これは、以下のルールで動作します。

単一のAPIエンドポイント: すべてのAI生成タスクは、Difyの単一のAPIエンドポイントに対してリクエストされます。

タスクベースのルーティング: Next.jsアプリは、リクエストボディにtaskというキーを含めることで、Difyに実行してほしい処理を指示します。

task: "persona" → ペルソナ生成フローを実行

task: "businessidea" → ビジネスアイデア生成フローを実行

task: "productname" → プロダクト名生成フローを実行

task: "canvas" → リーンキャンバス生成フローを実行

ステートレスなDify: Dify側は会話の状態（stageなど）を一切管理しません。状態管理の責任はすべてNext.jsアプリケーションが担います。

# 2. 技術スタック（完全版）
**フロントエンドフレームワーク:**
- Next.js 14 (App Router) - 最新のReact Serverコンポーネント対応
- TypeScript (Strictモード) - 型安全性の最大化

**UIライブラリ & スタイリング:**
- shadcn/ui - モダンなUIコンポーネントライブラリ
- Tailwind CSS - ユーティリティファーストのCSS
- Radix UI - アクセシブルなプリミティブコンポーネント
- Lucide React - 美しいアイコンライブラリ

**状態管理 & データフェッチング:**
- Zustand - 軽量で型安全な状態管理
- React Query (TanStack Query) - サーバー状態管理とキャッシング

**アニメーション & インタラクション:**
- Framer Motion - 滑らかなアニメーションライブラリ
- CSS Transform - ホバーエフェクトとマイクロインタラクション

**開発ツール & 設定:**
- ESLint - コード品質保証
- Prettier - コードフォーマッティング
- TypeScript strict mode - 型安全性の強化

# 3. Next.jsアプリが管理すべきユーザー体験フロー
このアプリケーションは、以下のステップ・バイ・ステップ形式で進行します。Next.js側でこのフロー全体の状態を厳密に管理してください。

キーワード入力: ユーザーがビジネスアイデアに関するキーワードを入力する。

ペルソナ提案: Next.jsアプリは、{ task: "persona", keyword: "ユーザーが入力したキーワード" } というリクエストをBFFに送信。Difyが10個のペルソナ候補を生成する。

ペルソナ選択: ユーザーが10個の中から最も共感するペルソナを1つ選択。Next.jsアプリはその選択を状態として保存する。

ビジネスアイデア提案: Next.jsアプリは、{ task: "businessidea", persona: "選択されたペルソナのオブジェクト" } というリクエストをBFFに送信。Difyが10個のビジネスアイデアを生成する。

ビジネスアイデア選択: ユーザーが1つ選択。Next.jsアプリが状態を保存。

詳細入力: ユーザーが「商品・サービスのカテゴリー、特徴、ブランドイメージ」をフォームに入力。

プロダクト名提案: Next.jsアプリは、{ task: "productname", persona: "...", business_idea: "...", product_details: "..." } というリクエストをBFFに送信。Difyが10個のプロダクト名を生成する。

プロダクト名選択: ユーザーが1つ選択。Next.jsアプリが状態を保存。

リーンキャンバス生成: Next.jsアプリは、{ task: "canvas", persona: "...", business_idea: "...", product_name: "..." } というリクエストをBFFに送信。Difyが最終的なリーンキャンバスを生成する。

結果表示: 完成したリーンキャンバスが画面に表示される。

# 4. ディレクトリ構造
以下のクリーンなディレクトリ構造でプロジェクトを構築してください。

```
/src
|-- /app
|   |-- /api/dify/route.ts      # (バックエンド) Dify APIと通信するBFF
|   |-- page.tsx              # (フロントエンド) メインページ
|   |-- layout.tsx
|   `-- globals.css
|
|-- /components
|   |-- /ui                   # shadcn/uiによって自動生成されるコンポーネント
|   |-- /layout               # ヘッダー、テーマ切り替えなど
|   |   |-- Header.tsx
|   |   `-- ThemeToggle.tsx
|   `-- /workflow             # 各ステップのUIコンポーネント
|       |-- WorkflowStepper.tsx
|       |-- StepKeywordInput.tsx
|       |-- StepPersonaSelection.tsx
|       |-- StepBusinessIdeaSelection.tsx
|       |-- StepDetailsInput.tsx
|       |-- StepProductNameSelection.tsx
|       `-- StepLeanCanvasDisplay.tsx
|
|-- /hooks
|   `-- useWorkflow.ts        # Zustandストアを利用したUIロジックフック
|
|-- /lib
|   |-- types.ts              # TypeScript型定義
|   `-- utils.ts              # shadcn/ui用のヘルパー関数
|
`-- /stores
    `-- workflow-store.ts       # Zustandストアの定義
```

# 5. デザイン & UX要件（強化版）

## 5-1. モダンデザインシステム
**カラーパレット:**
- プライマリ: グラデーション基調（青紫〜ピンク系）
- セカンダリ: ニュートラルグレー
- アクセント: 鮮やかなブルー・グリーン系
- ダークモード: 深い黒と柔らかなグレー

**タイポグラフィ:**
- ヘッドライン: 大胆で読みやすいフォント
- ボディテキスト: 可読性重視
- フォントサイズ: レスポンシブ対応

## 5-2. リッチなインタラクティブ要素
**ボタンデザイン:**
- グラデーション背景
- ホバー時: 軽やかな浮き上がりエフェクト（transform: translateY(-2px)）
- ホバー時: シャドウの強化（shadow-lg → shadow-xl）
- ホバー時: 色の濃度変化
- クリック時: 軽い押し込みアニメーション
- 境界線の微細な光る効果

**カードコンポーネント:**
- 選択可能なカードは常に微細なシャドウ
- ホバー時: カード全体が3D的に浮き上がる
- 選択時: アクセントカラーのボーダーとグロー効果
- 未選択時: 半透明のオーバーレイで視覚的階層を作成

**マイクロインタラクション:**
- ページローディング: 洗練されたスケルトンアニメーション
- ステップ遷移: スムーズなフェードイン・フェードアウト
- フォーム入力: リアルタイムバリデーションフィードバック
- 成功時: 心地よい完了アニメーション

## 5-3. レスポンシブデザイン
**ブレークポイント:**
- モバイル: 320px - 768px
- タブレット: 768px - 1024px
- デスクトップ: 1024px+

**適応的レイアウト:**
- グリッドシステム: CSS Grid + Flexboxのハイブリッド
- カードレイアウト: 画面サイズに応じて1〜4列
- ナビゲーション: モバイルではハンバーガーメニュー

# 6. 具体的な実装タスク
6-1. 型定義 (src/lib/types.ts)
Dify APIから返されるJSONの型を厳密に定義してください。これにより、JSONパースエラーのリスクをなくし、コードの安全性を確保します。

```typescript
// 型定義は src/lib/types.ts で一元管理されています
// 以下のような型が定義されています：
// - Persona, BusinessIdea, ProductName, LeanCanvasData
// - DifyPersonaResponse, DifyBusinessIdeaResponse, DifyProductNameResponse
// - その他のAPI関連の型定義
```

6-2. 状態管理 (Zustand - src/stores/workflow-store.ts)
アプリケーションの状態を一元管理するZustandストアを設計してください。

```typescript
interface WorkflowState {
  currentStep: number;
  isLoading: boolean;
  error: string | null;
  
  // 各ステップのデータ
  keyword: string;
  personas: Persona[];
  selectedPersona: Persona | null;
  businessIdeas: BusinessIdea[];
  selectedBusinessIdea: BusinessIdea | null;
  productDetails: { category: string; feature: string; brandImage: string; };
  productNames: ProductName[];
  selectedProductName: ProductName | null;
  leanCanvasData: LeanCanvasData | null;

  // アクション
  setKeyword: (keyword: string) => void;
  generatePersonas: () => Promise<void>;
  selectPersona: (persona: Persona) => void;
  generateBusinessIdeas: () => Promise<void>;
  // ...
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}
```

6-3. BFF (API Proxy - src/app/api/dify/route.ts)
フロントエンドとDifyを仲介するバックエンドロジックを、ルーター方式で実装してください。

リクエストボディからtaskとその他のデータ（keyword, personaなど）を受け取ります。

taskの値に応じてswitch文で処理を分岐させます。

task: 'persona'の場合、Difyの入力変数keywordに、受け取ったkeywordを渡してください。

task: 'businessidea'の場合、Difyの入力変数personaに、受け取ったpersonaオブジェクトを渡してください。

他のタスクも同様に、Difyの「開始」ブロックで定義された入力変数に正しくデータをマッピングしてください。

Dify APIキーはサーバーサイドの環境変数（process.env.DIFY_API_KEY）から読み込み、リクエストヘッダーに含めてください。

6-4. UIコンポーネント (src/components/workflow/*.tsx)
WorkflowStepper.tsx: 現在のステップを視覚的に表示するプログレスバー付きのステッパーを実装してください。

StepKeywordInput.tsx: ユーザーが最初のキーワードを入力するためのUIです。

StepPersonaSelection.tsxなど: Difyから返された候補リスト（10個）をグリッドレイアウトで表示し、ユーザーが一つ選択できるようにしてください。

選択されたカードは視覚的にハイライトされるようにします。

Framer Motionを使用して、カードのホバー時や表示時に心地よいアニメーションを加えてください。

StepLeanCanvasDisplay.tsx: 最終的に生成されたリーンキャンバスを、9つのブロックを持つグリッドレイアウトで美しく表示してください。

6-5. メインページ (src/app/page.tsx)
Zustandストアから状態とアクションを取得します。

currentStepの状態に応じて、適切なStep***.tsxコンポーネントを動的にレンダリングしてください。

HeaderやWorkflowStepperなどのレイアウトコンポーネントを配置します。

# 7. プレミアムUI/UX要件

## 7-1. ボタンインタラクション（詳細仕様）
**プライマリボタン:**
```css
/* 基本状態 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* ホバー状態 */
transform: translateY(-2px) scale(1.02);
box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);

/* アクティブ状態 */
transform: translateY(0px) scale(0.98);
```

**セカンダリボタン:**
```css
border: 2px solid transparent;
background: linear-gradient(white, white) padding-box,
           linear-gradient(135deg, #667eea, #764ba2) border-box;

/* ホバー時 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
```

## 7-2. カードデザイン仕様
**選択可能カード:**
- 基本: 白背景、軽いシャドウ、角丸12px
- ホバー: Y軸-4px移動、シャドウ強化、ボーダーのサブトルグロー
- 選択時: アクセントカラーボーダー、内部グロー効果
- アニメーション: 0.3s ease-out

**レイアウトグリッド:**
- デスクトップ: 3-4列グリッド
- タブレット: 2列グリッド  
- モバイル: 1列スタック

## 7-3. 高級感のある色彩設計
**ライトモード:**
- 背景: 微細なグラデーション（#fafafa → #f4f4f5）
- カード: 純白 + サブトルシャドウ
- テキスト: 深いチャコール（#1f2937）
- アクセント: 鮮やかなブルー系グラデーション

**ダークモード:**
- 背景: リッチダーク（#0f172a → #1e293b）
- カード: 深いグレー（#1e293b） + 柔らかなシャドウ
- テキスト: ウォームホワイト（#f8fafc）
- アクセント: ネオンブルー・パープル系

## 7-4. アニメーション仕様
**ページ遷移:**
- Framer Motion の `motion.div` でラップ
- `initial={{ opacity: 0, y: 20 }}`
- `animate={{ opacity: 1, y: 0 }}`
- `transition={{ duration: 0.5, ease: "easeOut" }}`

**ローディング状態:**
- Skeleton コンポーネント使用
- パルスアニメーション
- グラデーションスイープ効果

**成功フィードバック:**
- チェックマークアニメーション
- 段階的要素の表示
- 心地よいバウンス効果

# 8. パフォーマンス要件
- First Contentful Paint: 1.5秒以下
- Largest Contentful Paint: 2.5秒以下
- Cumulative Layout Shift: 0.1以下
- Time to Interactive: 3秒以下

## 8-1. 最適化手法
- Next.js の Image コンポーネント使用
- 動的インポートでコード分割
- レイジーローディング実装
- リソースプリロード

# 9. 環境変数 (.env.local)
以下の環境変数を設定してください。

```
DIFY_API_KEY="YOUR_DIFY_API_KEY_HERE"
NEXT_PUBLIC_DIFY_API_URL="https://api.dify.ai/v1"
```

# 10. アクセシビリティ要件
- WCAG 2.1 AA準拠
- キーボードナビゲーション完全対応
- スクリーンリーダー対応
- 色のコントラスト比 4.5:1以上
- フォーカス表示の明確化

# 出力形式
上記で定義した各ファイルのパスをコメントとして明記し、ファイルごとにコードブロックを分けて、新しいプロジェクト全体の完全なコードを生成してください。

**特に重要:** 
- すべてのインタラクティブ要素にホバーエフェクトを実装
- グラデーションと3Dエフェクトを駆使したプレミアムデザイン
- 滑らかなアニメーションで最高のユーザー体験を提供
- TypeScriptによる型安全性の徹底

最高のアーキテクチャとクリーンなコードを期待しています。よろしくお願いします。


