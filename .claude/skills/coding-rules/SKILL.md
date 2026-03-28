# コーディング規約

このプロジェクトで適用されるコーディング規約の一覧です。

## 1. インポート

- インポートパスは必ず `@/` エイリアスを使用すること。相対パス（`./`, `../`）は使用しない。

## 2. プロジェクト構造・配置

- **ページコンポーネント**（`pages/`）: テンプレートコンポーネントへの薄いラッパーであること。SEOのために `useTOUHead()` を必ず呼ぶこと。
- **テンプレートコンポーネント**（`components/templates/tools/`）: ツール固有のロジックをすべてここに持つこと。
- **アトミックデザイン**: atoms → molecules → organisms → templates の階層を守ること。
- **コンポーザブル**: ロジックの再利用は `composables/tools/`（designs または generals）に切り出すこと。
- **TypeScript型**: ツール固有の型は `types/tools/`、共通型は `types/common/` に配置すること。

## 3. 命名・プレフィックス

- `TOU` プレフィックスは、一般的なJS/TS名と衝突リスクがある共有クラス・型のみに付ける（例: `TOUColor` は妥当、`TOUNote` は不要）。
- localStorageキーは `tou.<toolname>` 形式に従うこと（例: `tou.note`, `tou.integrater`）。
- コンポーネント名はPascalCaseで、アトミック層とドメインを反映すること。
- Fabricオブジェクトへのカスタムプロパティは `__` プレフィックスなし・`TOU` プレフィックスなし・camelCaseで命名すること（例: `layerId`, `customName`）。`__tou_id` のような形式はNG。

## 4. データ永続化

- ページリロード後も保持すべきデータ → localStorage（`tou.<toolname>` キー）。
- セッション限りのデータ → Pinia（未活用だがどちらでも許容）。

## 5. Integrater連携

新ツールをIntegraterに追加する場合：
1. `types/tools/generals/integrater/component.ts` の `TOU_COMPONENT_TYPE` enum に追加
2. `IntegraterCustom.vue` と `IntegraterView.vue` に対応コンポーネントを追加
3. `TOUComponent`（type + start/end座標）による16×9グリッドシステムを使用

## 6. TypeScript品質

- 明示的な理由なく `any` を使用しない。
- 既存の共通型（`TOUColor`, `TOURGBColor`, `TOUHSBColor`, `TOUPosition`, `TOUSavable`, `TOUComponent`, `TOUIntegrater`）を適切に活用する。
- 永続化データを表すクラス・インターフェースは `TOUSavable` を実装すること。

## 7. Vue / Nuxt 3

- Composition API（`<script setup lang="ts">`）を一貫して使用する。
- `ref`/`computed`/`watch` を正しく使用し、リアクティブオブジェクトの直接ミューテーションを避ける。
- コンポーネント内SCSSは `scoped` にすること（意図的にグローバルにする場合を除く）。
- SSR固有のコードを書かない（プロジェクトは `ssr: false` のSPA）。
- 外部APIコールは `composables/common/` のコンポーザブルを通すこと。

## 8. コード品質

- **DRY**: 複数のテンプレートで同じ処理が点在している場合はコンポーザブルへの集約を検討する。
- **コンポーザブル設計**: コールバック関数の引数はできるだけ最小化する。コンポーザブル内部で解決できるロジックは内部に閉じ込め、呼び出し側に委ねない。
- **コメントスタイル**: コメントは関数・処理の**上ではなく行末（右側）**に記載すること（例: `const x = ref(0); // 初期値`）。
- 変数名・関数名は自己説明的にする。
- 非同期処理（AxiosやSupabase経由）はエラーを適切に処理する。

## 9. セキュリティ

- フロントエンドコードにシークレットやAPIキーを含めない。Supabase anonキーは公開設計のため許容。
- 秘密キーが必要な外部APIコールはSupabase Edge Functionsを経由させる。
