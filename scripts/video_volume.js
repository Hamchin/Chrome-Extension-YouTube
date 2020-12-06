// キーダウンイベント: ドキュメント
$(document).on('keydown', (e) => {
    if (location.pathname !== '/watch') return;
    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;
    // 音量を調節する
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        // 既にプレーヤーにフォーカス中の場合 -> キャンセル
        const player = document.querySelector('.html5-video-player');
        if (document.activeElement.isEqualNode(player)) return;
        // プレーヤーにキーイベントを送信する
        const keyEvent = new KeyboardEvent('keydown', { keyCode: e.keyCode });
        player.dispatchEvent(keyEvent);
    }
});

// キーダウンイベント: テキストエリア
$(document).on('keydown', 'input, textarea, ytd-commentbox', (e) => e.stopPropagation());

// オブザーバー -> 音量のキャッシュを削除する
const volumeResetObserver = new MutationObserver(() => localStorage.removeItem('yt-player-volume'));

// タブ更新イベント -> オブザーバーを起動する
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'UPDATED') return;
    volumeResetObserver.disconnect();
    if (location.pathname !== '/watch') return;
    const panel = document.querySelector('.ytp-volume-panel');
    if (panel === null) return;
    const options = { attributes: true };
    volumeResetObserver.observe(panel, options);
});
