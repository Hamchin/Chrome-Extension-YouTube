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

// キーダウンイベント: テキストエリア -> 親要素への伝播を抑止する
$(document).on('keydown', 'input, textarea, ytd-commentbox', (e) => e.stopPropagation());

// 変更監視: 音量パネル -> 音量のキャッシュを削除する
const volumePanelObserver = new MutationObserver(() => localStorage.removeItem('yt-player-volume'));

// タブ更新イベント -> 変更監視を開始する
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'UPDATED') return;
    volumePanelObserver.disconnect();
    if (location.pathname !== '/watch') return;
    const panel = document.querySelector('.ytp-volume-panel');
    if (panel === null) return;
    const options = { attributes: true };
    volumePanelObserver.observe(panel, options);
});
