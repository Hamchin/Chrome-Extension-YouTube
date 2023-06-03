// キーダウンイベント: 動画ページ
const handleVideoKeyDown = (e) => {
    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;
    // 上下キーの場合 -> 音量を調節する
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        // プレーヤーにフォーカス中の場合 -> キャンセル
        const player = document.querySelector(".html5-video-player");
        if (player === null) return;
        if (document.activeElement.isEqualNode(player)) return;
        // プレーヤーにキーイベントを送信する
        const keyEvent = new KeyboardEvent("keydown", { keyCode: e.keyCode });
        player.dispatchEvent(keyEvent);
    }
    // 角括弧キーの場合 -> 動画を1秒シークする
    if (e.key === "[" || e.key === "]") {
        const video = document.querySelector("ytd-player video");
        if (video === null) return;
        const time = (e.key === "[") ? -1 : (e.key === "]") ? 1 : 0;
        video.currentTime += time;
    }
};

// キーダウンイベント: テキストエリア -> 親要素への伝播を抑止する
$(document).on("keydown", "input, textarea, ytd-commentbox", (e) => e.stopPropagation());

// 変更監視: 音量パネル -> 音量のキャッシュを削除する
const volumePanelObserver = new MutationObserver(() => localStorage.removeItem("yt-player-volume"));

// タブ更新イベント
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== "UPDATED") return;
    // 設定をリセットする
    window.removeEventListener("keydown", handleVideoKeyDown);
    volumePanelObserver.disconnect();
    // 動画ページ以外の場合 -> キャンセル
    if (location.pathname !== "/watch") return;
    // キーダウンイベントを登録する
    window.addEventListener("keydown", handleVideoKeyDown);
    // 変更監視を開始する
    const panel = document.querySelector(".ytp-volume-panel");
    if (panel === null) return;
    const options = { attributes: true };
    volumePanelObserver.observe(panel, options);
});
