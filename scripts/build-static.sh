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

echo 'ビルドを実行中...'
pnpm build

echo '静的サイトをエクスポート中...'
node node_modules/.bin/next export -o out

echo 'out をアプリディレクトリへ反映します...'
rm -rf "$APP_DIR/out"
mkdir -p "$APP_DIR/out"
cp -r "$TMP_DIR/out/." "$APP_DIR/out/"

echo 'ビルド完了！出力サマリ:'
if [ ! -f "$APP_DIR/out/index.html" ]; then
  echo 'index.html が見つかりません'
  exit 2
fi
find "$APP_DIR/out" -type f | wc -l | xargs echo 'ファイル数:'
du -sh "$APP_DIR/out" | awk '{print "容量:", $1}'
echo 'index.html のハッシュ:'
if command -v shasum >/dev/null 2>&1; then shasum -a 256 "$APP_DIR/out/index.html" | cut -d' ' -f1; else sha256sum "$APP_DIR/out/index.html" | cut -d' ' -f1; fi

echo "ビルドが完了しました。静的ファイルは ./out ディレクトリに出力されています。"
