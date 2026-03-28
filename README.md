# ノンクリツール

オールインワンの便利ツール集。各ツールは個別ページで使用でき、統合ダッシュボード（Integrater）で複数ツールを一画面にレイアウトして組み合わせられます。

## 技術スタック

- **フレームワーク**: Nuxt 3（SPAモード、SSR無効）
- **言語**: TypeScript
- **スタイル**: SCSS（scoped）
- **主要ライブラリ**: Fabric.js・Pinia・Axios
- **テスト**: Vitest + @nuxt/test-utils

## セットアップ

```bash
npm install
```

### 環境変数

`.env.local` を作成し、以下を設定してください。

```env
NUXT_PUBLIC_HOST=http://localhost:3000
NUXT_PUBLIC_DOMAIN=localhost:3000
NUXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NUXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 開発

```bash
npm run dev
```

## ビルド・デプロイ

```bash
# 静的ファイルを生成（.env.production を使用）
npm run generate
```

## 型チェック・テスト

```bash
npm run check   # 型チェック
npm test        # テスト実行
```

---

## 背景透過機能のセットアップ（remove.bg）

画像処理ツールの背景透過機能は [remove.bg](https://www.remove.bg/) APIを Supabase Edge Function 経由で呼び出します。APIキーをフロントエンドに露出させないためのプロキシ構成です。

### 1. 前提条件

- [Supabase](https://supabase.com/) アカウントとプロジェクト
- [remove.bg](https://www.remove.bg/dashboard#api-key) のAPIキー
- [Supabase CLI](https://supabase.com/docs/guides/cli) のインストール

```bash
npm install -g supabase
```

### 2. Supabase プロジェクトとリンク

```bash
supabase init
supabase link --project-ref <your-project-ref>
```

`<your-project-ref>` は Supabase ダッシュボードの「Project Settings > General」で確認できます。

### 3. remove.bg APIキーを Supabase Secrets に登録

```bash
supabase secrets set REMOVE_BG_API_KEY=<your-remove-bg-api-key>
```

### 4. Edge Function をデプロイ

```bash
supabase functions deploy remove-background
```

### 5. フロントエンドの環境変数を設定

`.env.local` に Supabase のプロジェクトURLと anon キーを追加します。

```env
NUXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

どちらも Supabase ダッシュボードの「Project Settings > API」で確認できます。

### ローカルでの動作確認

ローカルで Supabase エミュレータを使って Edge Function を実行できます。

**1. `supabase/.env.local` にAPIキーを設定**

```env
REMOVE_BG_API_KEY=your_remove_bg_api_key
```

**2. Edge Function をローカル起動**

```bash
npm run functions:dev
```

`http://localhost:54321/functions/v1/remove-background` でエンドポイントが立ち上がります。

**3. フロントエンドからローカルエミュレータを向ける**

`.env.local` の Supabase URL をローカルエミュレータのURLに変更します。

```env
NUXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NUXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
```

ローカルの anon キーは `supabase start` 実行後に表示される `anon key` を使用してください。
