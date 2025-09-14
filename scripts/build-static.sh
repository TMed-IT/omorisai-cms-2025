#!/bin/sh

set -e

DEPLOY_ID=$1
if [ -z "$DEPLOY_ID" ]; then
    echo "デプロイIDが必要です"
    exit 1
fi

echo "デプロイID: $DEPLOY_ID でビルドを開始します..."

# アプリコンテナ内で実行する前提（開発サーバーと並走するため、別ディレクトリでビルド）
export NODE_ENV=production
# no special env flags required for static bundling
APP_DIR="$(pwd)"
TMP_DIR="/home/node/tmp-build-${DEPLOY_ID:-temp}"

echo "一時ディレクトリ: $TMP_DIR を作成してソースを同期します..."
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"
# node_modules / .next / out は除外してコピー
tar -cf - --exclude node_modules --exclude .next --exclude out --exclude .git . | tar -xf - -C "$TMP_DIR"

cd "$TMP_DIR"
echo '依存関係をインストール中...'
pnpm install --prefer-frozen-lockfile || pnpm install

# コンテンツ数が0の動的ルートを静的出力対象から除外
echo 'コンテンツ数が0の動的ルートを検査し、必要なら除外します...'
pnpm exec tsx scripts/prune-dynamic-routes.ts || echo '動的ルートの事前除外はスキップされました'

# Exclude admin（(payload)配下）と API/preview などの動的ルートを静的出力から除外
if [ -d "src/app/(payload)" ]; then
  echo '静的エクスポート対象から (payload) を除外します...'
  rm -rf "src/app/(payload)"
fi
if [ -d "src/app/(frontend)/next" ]; then
  echo '静的エクスポート対象から (frontend)/next を除外します...'
  rm -rf "src/app/(frontend)/next"
fi
if [ -d "src/app/api" ]; then
  echo '静的エクスポート対象から /api を除外します...'
  rm -rf "src/app/api"
fi
# sitemaps は route handler を静的化（dynamic=force-static）して出力するため残す

# Enable static export only in the temp workspace by injecting output: 'export'
echo '一時的に next.config.js に output: export を付与します...'
cp next.config.js next.config.backup.js
cat > inject-export.cjs <<'EOF'
const fs = require('fs')
let s = fs.readFileSync('next.config.backup.js', 'utf8')
// Normalize any existing output to 'export'
s = s.replace(/output:\s*['\"][^'\"]+['\"]/g, "output: 'export'")
// If output property is still missing, inject it
if (!/output:\s*'export'/.test(s)) {
  s = s.replace(/(const\s+nextConfig\s*=\s*\{)/, "$1\n  output: 'export',")
}
fs.writeFileSync('next.config.js', s)
EOF
node inject-export.cjs
rm -f inject-export.cjs

echo 'ビルドを実行中...'
# 静的エクスポート判定用のフラグ（クライアント/サーバー双方のビルド時に展開）
export NEXT_PUBLIC_STATIC_EXPORT=true
pnpm build

echo '静的サイトをエクスポート中...（build に内包）'

# Determine export output directory (Next.js 15 writes to out/ by default in export mode)
OUT_SRC="out"
if [ ! -d "$OUT_SRC" ]; then
  if [ -d ".next/export" ]; then
    OUT_SRC=".next/export"
  fi
fi

if [ ! -d "$OUT_SRC" ]; then
  echo 'エラー: 静的出力ディレクトリが見つかりません（out または .next/export）'
  mv -f next.config.backup.js next.config.js 2>/dev/null || true
  exit 2
fi

echo 'out をアプリディレクトリへ反映します...'
rm -rf "$APP_DIR/out"
mkdir -p "$APP_DIR/out"
cp -r "$TMP_DIR/$OUT_SRC/." "$APP_DIR/out/"

echo 'ビルド完了！出力サマリ:'

# Validate that HTML files exist and are non-empty
HTML_COUNT=$(find "$APP_DIR/out" -type f -name '*.html' | wc -l | tr -d ' ')
if [ "$HTML_COUNT" = "0" ]; then
  echo 'エラー: HTML が生成されていません（out/*.html が空）'
  mv -f next.config.backup.js next.config.js 2>/dev/null || true
  exit 2
fi

EMPTY_FILES=$(find "$APP_DIR/out" -type f -empty | wc -l | tr -d ' ')
if [ "$EMPTY_FILES" != "0" ]; then
  echo "警告: 空ファイルが ${EMPTY_FILES} 件見つかりました"
fi

find "$APP_DIR/out" -type f | wc -l | xargs echo 'ファイル数:'
du -sh "$APP_DIR/out" | awk '{print "容量:", $1}'

# Post-export: rewrite media URLs and bundle files into out/media
echo 'メディアのURLを書き換え、out/media に同梱します...'
(cd "$APP_DIR" && node scripts/staticize-media.mjs) || echo 'post-export メディア同梱に失敗しました（スキップ）'

# Generate redirect files for static export
echo 'リダイレクトファイルを生成中...'
(cd "$APP_DIR" && pnpm exec tsx scripts/generate-redirects.ts) || echo 'リダイレクトファイル生成に失敗しました（スキップ）'

# restore original next.config.js in temp workspace (best-effort)
mv -f next.config.backup.js next.config.js 2>/dev/null || true

echo "ビルドが完了しました。静的ファイルは ./out ディレクトリに出力されています。"
