// フロートフレームの状態
const floatFrameState = { switched: false, disabled: false };

// マウスオーバーイベント: フロートフレーム -> ズームイン
$(document).on('mouseenter', '.float-frame', (e) => {
    if (floatFrameState.switched) return;
    $(e.currentTarget).removeClass('zoom-out');
});

// マウスアウトイベント: フロートフレーム -> ズームアウト
$(document).on('mouseleave', '.float-frame', (e) => {
    $(e.currentTarget).addClass('zoom-out');
});

// クリックイベント: タイムスタンプ -> スクロール位置を維持する
$(document).on('click', 'ytd-comments .yt-simple-endpoint', async () => {
    const scrollTop = $(window).scrollTop();
    floatFrameState.disabled = true;
    await new Promise(resolve => setTimeout(resolve, 100));
    $(window).scrollTop(scrollTop);
    floatFrameState.disabled = false;
});

// フロートフレームを設定する
const setFloatFrame = (enabled) => {
    const player = $('.html5-video-player');
    const parent = $(player).closest('ytd-player');
    // フロートフレームを有効にする
    if (enabled) {
        $(player).addClass('float-frame');
        $(player).addClass('zoom-out');
        $(player).css('width', $(parent).css('width'));
        $(player).css('height', $(parent).css('height'));
    }
    // フロートフレームを無効にする
    else {
        $(player).removeClass('float-frame');
        $(player).removeClass('zoom-out');
        $(player).css('width', '');
        $(player).css('height', '');
    }
    // 切り替わった瞬間を記録する
    floatFrameState.switched = true;
    setTimeout(() => floatFrameState.switched = false, 100);
};

// 交差監視: プレーヤー -> フロートフレームを設定する
const playerObserver = new IntersectionObserver((entries) => {
    if (entries.length === 0) return;
    if (floatFrameState.disabled) return;
    setFloatFrame(!entries[0].isIntersecting);
});

// タブ更新イベント -> 交差監視を開始する
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'UPDATED') return;
    setFloatFrame(false);
    playerObserver.disconnect();
    document.exitPictureInPicture().catch(() => {});
    if (location.pathname !== '/watch') return;
    const player = document.querySelector('ytd-player');
    if (player === null) return;
    playerObserver.observe(player);
});
