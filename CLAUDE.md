# CLAUDE.md

## プロジェクト概要

オールインワンの便利ツール集。各ツールは個別ページで使用でき、`/tools/generals/integrater` でユーザーが複数ツールを一画面にレイアウトして組み合わせられる。

- SPAモード（SSR無効）

## 技術スタック

- **フレームワーク**: Nuxt 3 (SPA mode, SSR: false)
- **言語**: TypeScript
- **スタイル**: SCSS (scoped)
- **フォント**: Klee One (Google Fonts)
- **主要ライブラリ**:
  - Pinia（依存には含まれるが未使用、状態管理はlocalStorageで対応）
  - Axios（翻訳APIなどの外部API呼び出し）
  - Fabric.js（手書きメモ・簡易画像編集のキャンバス操作）
- **テスト**: Vitest + @nuxt/test-utils

## ディレクトリ構成

```
toolforus/
├── pages/                  # Nuxtファイルベースルーティング
│   └── tools/
│       ├── generals/       # 汎用ツール
│       └── designs/        # デザイン系ツール
├── components/             # アトミックデザイン
│   ├── atoms/              # 基本UI部品
│   ├── molecules/          # atomsの組み合わせ
│   ├── organisms/          # 複合セクション (Header, Footer等)
│   └── templates/          # 各ツールの完全なビュー
│       └── tools/
│           ├── generals/
│           │   └── integrater/  # カスタマイズモード・表示モードに分割
│           └── designs/
├── composables/            # 共有ロジック
│   ├── common/             # SEOメタ設定、API呼び出し、キーボードショートカット
│   └── tools/
│       ├── designs/        # デザインツール用
│       └── generals/       # 汎用ツール用
├── types/                  # TypeScript型定義
│   ├── common/             # 共通型 (color, css, position, savable等)
│   └── tools/              # ツール固有の型
├── assets/styles/          # グローバルスタイル (animation.css, util.scss)
└── public/
    ├── commons/
    │   └── icons/          # SVGアイコン群
    └── datas/              # 静的データ (color/tone.json等)
```

## 主要なパターン・規約

### ページコンポーネントパターン

`pages/` 配下はテンプレートコンポーネントへの薄いラッパー。ロジックはtemplates層に持たせる。
`pages/tools/`配下にページを新たに追加する場合、Integraterで使用できるようにコンポーネント設計を行う。


### SEO設定

全ページで `useTOUHead()` を使用する。タイトルに自動で「 - ノンクリツール」が付与される。

### データ永続化

**ユーザ復帰時に保持しておきたいデータ**はlocalStorageに保存する。
**同一セッション内でのみ保持しておきたいデータ**はPiniaで管理する。

- localStorageキー命名規則: `tou.<toolname>` (例: `tou.note`, `tou.integrater`)

### Integrater（統合ダッシュボード）

複数ツールを一画面に配置するシステム。

- グリッド: 16列 × 9行
- `TOU_COMPONENT_TYPE` enum で使用可能なツールを管理
- `TOUComponent` クラス: type + start/end の座標で配置を表現
- `TOUIntegrater` クラス: コンポーネント一覧を管理、`build()` でlocalStorageから復元

**新ツールをIntegraterに追加する場合:**
1. `types/tools/generals/integrater/component.ts` の `TOU_COMPONENT_TYPE` にenumを追加
2. `IntegraterCustom.vue` と `IntegraterView.vue` に対応するコンポーネントを追加

### 型システム

- `TOUColor`, `TOURGBColor`, `TOUHSBColor`: 色操作クラス
- `TOUPosition`: x/y 座標
- `TOUSavable`: 保存可能なオブジェクトのインターフェース
- `TOUComponent` / `TOUIntegrater`: 統合ダッシュボードのコア型

## 新ツールの追加手順

1. **型定義**: `types/tools/generals/<toolname>/` または `types/tools/designs/<toolname>/` にTypeScriptクラス/インターフェースを作成
2. **コンポーザブル**: `composables/tools/designs/generals/<toolname>/` にロジックを切り出す（必要に応じて）
3. **Templateコンポーネント**: `components/templates/tools/generals/<ToolName>.vue` に実装
4. **Pageコンポーネント**: `pages/tools/generals/<toolname>.vue` に薄いラッパーを作成（`useTOUHead`を必ず呼ぶ）
5. **Integraterへの追加（任意）**: `TOU_COMPONENT_TYPE`にenumを追加し、Integraterのカスタム/表示コンポーネントを更新

## 環境変数

| 変数名 | 説明 |
|---|---|
| `NUXT_PUBLIC_HOST` | 本番ホストURL |
| `NUXT_PUBLIC_DOMAIN` | 本番ドメイン |

ランタイムコンフィグで `useRuntimeConfig().public.host` としてアクセス可能。
