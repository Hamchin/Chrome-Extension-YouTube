// マウスオーバーイベント: フロートフレーム -> ズームイン
$(document).on('mouseenter', '.float-frame', (e) => {
    $(e.currentTarget).removeClass('zoom-out');
});

// マウスアウトイベント: フロートフレーム -> ズームアウト
$(document).on('mouseleave', '.float-frame', (e) => {
    $(e.currentTarget).addClass('zoom-out');
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
};

// 交差監視: プレーヤー -> フロートフレームを設定する
const playerObserver = new IntersectionObserver((entries) => {
    if (entries.length === 0) return;
    const lastEntry = entries[entries.length - 1];
    setFloatFrame(!lastEntry.isIntersecting);
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
