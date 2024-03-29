// フロートフレームを設定する
const setFloatFrame = (enabled) => {
    const player = $(".html5-video-player");
    const parent = $(player).closest("ytd-player");
    // フロートフレームを有効にする
    if (enabled) {
        $(player).addClass("float-frame");
        $(player).addClass("zoom-out");
        $(player).css("width", $(parent).css("width"));
        $(player).css("height", $(parent).css("height"));
    }
    // フロートフレームを無効にする
    else {
        $(player).removeClass("float-frame");
        $(player).removeClass("zoom-out");
        $(player).css("width", "");
        $(player).css("height", "");
    }
};

// 交差監視: プレーヤー -> フロートフレームを設定する
const playerObserver = new IntersectionObserver((entries) => {
    if (entries.length === 0) return;
    const lastEntry = entries[entries.length - 1];
    setFloatFrame(!lastEntry.isIntersecting);
});

// タブ更新イベント
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== "UPDATED") return;
    // 設定をリセットする
    setFloatFrame(false);
    playerObserver.disconnect();
    document.exitPictureInPicture().catch(() => {});
    // 動画ページ以外の場合 -> キャンセル
    if (location.pathname !== "/watch") return;
    // 交差監視を開始する
    const player = document.querySelector("ytd-player");
    if (player === null) return;
    playerObserver.observe(player);
});
