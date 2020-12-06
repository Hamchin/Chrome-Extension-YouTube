// スクロール状態
const scrollState = { scrollTop: 0, clicked: false };

// マウスダウンイベント: タイムスタンプ -> スクロール位置を保持する
$(document).on('mousedown', 'ytd-comments .yt-simple-endpoint', () => {
    scrollState.scrollTop = $(window).scrollTop();
});

// クリックイベント: タイムスタンプ -> 元のスクロール位置へ戻る
$(document).on('click', 'ytd-comments .yt-simple-endpoint', async () => {
    scrollState.clicked = true;
    await new Promise(resolve => setTimeout(resolve, 100));
    $(window).scrollTop(scrollState.scrollTop);
    scrollState.clicked = false
});
