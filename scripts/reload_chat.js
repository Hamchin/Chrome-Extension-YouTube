// チャットを更新する
const reloadChat = () => {
    const button = $('#show-hide-button paper-button');
    Promise.resolve()
    .then(() => new Promise((resolve) => {
        // チャット非表示ボタンをクリックする
        if ($(button).length === 0) return;
        $(button).click();
        resolve();
    }))
    .then(() => new Promise(() => {
        // チャット表示ボタンをクリックする
        if ($(button).length === 0) return;
        $(button).click();
    }));
};

// メッセージイベント -> チャットを更新する
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'RELOAD_CHAT') return;
    if (location.pathname !== '/watch') return;
    reloadChat();
});
