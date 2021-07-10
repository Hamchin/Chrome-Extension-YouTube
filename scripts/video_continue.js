// 変更監視: ドキュメント -> 動画の一時停止を防ぐ
const observer = new MutationObserver(() => {
    const dialog = document.querySelector('yt-confirm-dialog-renderer');
    if (dialog === null) return;
    if (dialog.offsetParent === null) return;
    const button = dialog.querySelector('#confirm-button');
    if (button === null) return;
    const string = dialog.querySelector('tp-yt-paper-dialog-scrollable yt-formatted-string');
    if (string === null) return;
    const text = string.textContent;
    if (text === '動画が一時停止されました。続きを視聴しますか？') button.click();
});

// 変更監視を開始する
observer.observe(document.body, { childList: true });
