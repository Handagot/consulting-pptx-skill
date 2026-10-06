#!/bin/bash
# PowerPoint 本体で PPTX を PDF に書き出す（Mac）。行送り・折り返し・図形の描画を実物どおりに確かめるため（slide-rules §8.7）。
#   scripts/render_pptx.sh out.pptx out.pdf
#   swift scripts/pdf2png.swift out.pdf pngdir 1600     # 1 ページずつ PNG にして目で見る
#
# 守ること:
#   - 開く前に check_deck.py --xml-only を通す（このスクリプトが先に実行する）。不正なファイルを開かせると、
#     ユーザーの PowerPoint に修復のダイアログが残り、以後の操作（ユーザー自身の作業も）を止める
#   - ユーザーが開いているプレゼンテーションには触れない（開く・閉じるのは確認用の写しだけ）
#   - 失敗したら繰り返さない。-9074 は「PowerPoint がいまファイルを開けない」（ダイアログが出ている・作業中）。
#     ユーザーに PowerPoint を確かめてもらう
#
# 写しを Office の共有コンテナに置くのは、サンドボックスの「アクセスを許可」ダイアログを出さないため。
set -u
if [ $# -lt 2 ]; then echo "usage: render_pptx.sh in.pptx out.pdf" >&2; exit 2; fi
SRC="$1"; OUT="$2"
NAME="deck_check_$$.pptx"
DIR="$HOME/Library/Group Containers/UBF8T346G9.Office/deck-render"
HERE="$(cd "$(dirname "$0")" && pwd)"

if [ ! -f "$SRC" ]; then echo "render_pptx: ファイルが無い: $SRC" >&2; exit 2; fi
if ! python3 "$HERE/check_deck.py" "$SRC" --xml-only >/dev/null 2>&1; then
  echo "render_pptx: 開く前の検査で不正が見つかったので PowerPoint には渡さない。python3 scripts/check_deck.py \"$SRC\" --xml-only を見る" >&2
  exit 2
fi

mkdir -p "$DIR"; cp "$SRC" "$DIR/$NAME"
ERR="$(perl -e 'alarm 300; exec @ARGV' /usr/bin/osascript 2>&1 <<OSA
with timeout of 280 seconds
  tell application "Microsoft PowerPoint"
    open POSIX file "$DIR/$NAME"
    delay 2
    set pres to presentation "$NAME"
    save pres in (POSIX file "$DIR/${NAME%.pptx}.pdf") as save as PDF
    delay 1
    close pres saving no
  end tell
end timeout
OSA
)"
CODE=0
if [ -f "$DIR/${NAME%.pptx}.pdf" ]; then
  cp "$DIR/${NAME%.pptx}.pdf" "$OUT"
  echo "render_pptx: $OUT"
else
  CODE=1
  echo "render_pptx: PDF が出なかった。${ERR:-（PowerPoint はエラーを返さなかった）}" >&2
  case "$ERR" in *-9074*) echo "render_pptx: -9074 は PowerPoint がいまファイルを開けない状態（ダイアログが出ている・作業中）。繰り返さず、ユーザーに PowerPoint を確かめてもらう" >&2 ;; esac
fi
rm -rf "$DIR"
exit $CODE
