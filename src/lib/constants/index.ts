// 設定ファイルのエクスポート用インデックス

// アプリケーション定数
export * from './app-constants';

// テーマ設定
export * from './theme-config';

// メッセージ・テキスト
export * from './messages';

// 環境設定（re-export）
export * from '../config/env-config';

// 使いやすさのためのエイリアス
export { getBlockTheme as getCanvasBlockTheme } from './theme-config';
export { ERROR_MESSAGES as ERRORS } from './messages';
export { SUCCESS_MESSAGES as SUCCESS } from './messages';
export { UI_LABELS as LABELS } from './messages';