# Supabase Edge Functions

## 概要

| Function名 | 説明 |
|---|---|
| `remove-background` | remove.bg API を使って画像の背景を透過する。APIキーをサーバーサイドに隠蔽するためのプロキシ。 |

---

## 前提条件

- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) がインストールされていること
- [Docker](https://www.docker.com/) が起動していること（ローカル実行時）
- [Deno](https://deno.land/) がインストールされていること（任意：型チェック等に使用）

```bash
# Supabase CLI のインストール（未インストールの場合）
npm install -g supabase
```

---

## ローカル起動

### 1. 環境変数ファイルの作成

`supabase/.env.local` を作成し、remove.bg の APIキーを記載する。

```bash
# supabase/.env.local
REMOVE_BG_API_KEY=your_remove_bg_api_key_here
```

### 2. Function の起動

Supabase のフル環境（DB等）は不要なため、`functions serve` のみで起動できる。

```bash
supabase functions serve --env-file ./supabase/.env.local
```

起動すると以下の URL で Function が利用可能になる。

```
http://localhost:54321/functions/v1/remove-background
```

### 3. フロントエンドのローカル向け設定

`.env` または `.env.local` に以下を設定してフロントから接続する。

```env
NUXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0NiK7urOoD9bje4iLvrfyDGp_Z9G5845KIyPC8Y
```

> ローカル Supabase の anon キーは上記の固定値を使用する（開発用の公開済みデフォルト値）。

### 4. 動作確認（curl）

```bash
curl -X POST http://localhost:54321/functions/v1/remove-background \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRFA0NiK7urOoD9bje4iLvrfyDGp_Z9G5845KIyPC8Y" \
  -H "Content-Type: application/json" \
  -d '{"image_base64": "<base64文字列>"}'
```

---

## 本番デプロイ

### 1. Supabase プロジェクトとリンク（初回のみ）

```bash
supabase login
supabase link --project-ref <your-project-ref>
```

> `<your-project-ref>` は Supabase ダッシュボードの URL（`https://supabase.com/dashboard/project/<ref>`）から確認できる。

### 2. APIキーを Secrets に登録（初回のみ）

```bash
supabase secrets set REMOVE_BG_API_KEY=your_remove_bg_api_key_here
```

登録済み Secrets の確認：

```bash
supabase secrets list
```

### 3. Function をデプロイ

```bash
supabase functions deploy remove-background
```

デプロイ後の Function URL：

```
https://<your-project-ref>.supabase.co/functions/v1/remove-background
```

### 4. フロントエンドの本番向け設定

Supabase ダッシュボードの **Project Settings → API** から以下を取得して環境変数に設定する。

```env
NUXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=<Project API Keys の anon / public>
```

---

## ディレクトリ構成

```
supabase/
├── functions/
│   ├── README.md               # このファイル
│   └── remove-background/
│       └── index.ts            # Edge Function 本体
└── .env.local                  # ローカル用 Secrets（gitignore 推奨）
```
