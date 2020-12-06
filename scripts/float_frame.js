// マウスオーバーイベント: フロートフレーム -> ズームイン
$(document).on('mouseenter', '.video-float-frame', (e) => {
    const player = $(e.target).closest('.video-float-frame');
    $(player).removeClass('video-zoom-out');
});

// マウスアウトイベント: フロートフレーム -> ズームアウト
$(document).on('mouseleave', '.video-float-frame', (e) => {
    const player = $(e.target).closest('.video-float-frame');
    $(player).addClass('video-zoom-out');
});

// フロートフレームを設定する
const setVideoFloatFrame = (enabled) => {
    const player = $('.html5-video-player');
    const parent = $(player).closest('ytd-player');
    // フロートフレームを有効にする
    if (enabled) {
        $(player).addClass('video-float-frame');
        $(player).addClass('video-zoom-out');
        $(player).css('width', $(parent).css('width'));
        $(player).css('height', $(parent).css('height'));
    }
    // フロートフレームを無効にする
    else {
        $(player).removeClass('video-float-frame');
        $(player).removeClass('video-zoom-out');
        $(player).css('width', '');
        $(player).css('height', '');
    }
};

// オブザーバー -> フロートフレームを設定する
const videoFloatFrameObserver = new IntersectionObserver((entries) => {
    if (scrollState.clicked) return;
    if (entries.length === 0) return;
    setVideoFloatFrame(!entries[0].isIntersecting);
});

// タブ更新イベント -> オブザーバーを起動する
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'UPDATED') return;
    setVideoFloatFrame(false);
    videoFloatFrameObserver.disconnect();
    document.exitPictureInPicture().catch(() => {});
    if (location.pathname !== '/watch') return;
    const player = document.querySelector('ytd-player');
    if (player === null) return;
    videoFloatFrameObserver.observe(player);
});
