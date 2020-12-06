// マウスオーバーイベント: フロートフレーム -> ズームイン
$(document).on('mouseenter', '.float-frame', (e) => {
    const player = $(e.target).closest('.float-frame');
    if ($(player).prop('switched')) return;
    $(player).removeClass('zoom-out');
});

// マウスアウトイベント: フロートフレーム -> ズームアウト
$(document).on('mouseleave', '.float-frame', (e) => {
    const player = $(e.target).closest('.float-frame');
    $(player).addClass('zoom-out');
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
    $(player).prop('switched', true);
    setTimeout(() => $(player).prop('switched', false), 100);
};

// オブザーバー -> フロートフレームを設定する
const floatFrameObserver = new IntersectionObserver((entries) => {
    if (entries.length === 0) return;
    const entry = entries[0];
    if (entry.target.disabled) return;
    setFloatFrame(!entry.isIntersecting);
});

// タブ更新イベント -> オブザーバーを起動する
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'UPDATED') return;
    setFloatFrame(false);
    floatFrameObserver.disconnect();
    document.exitPictureInPicture().catch(() => {});
    if (location.pathname !== '/watch') return;
    const player = document.querySelector('ytd-player');
    if (player === null) return;
    floatFrameObserver.observe(player);
});
