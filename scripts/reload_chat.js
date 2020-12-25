// チャットを更新する
const reloadChat = () => {
    const frame = $('ytd-live-chat-frame');
    const button = $(frame).find('#show-hide-button paper-button');
    if ($(frame).length === 0) return;
    if ($(button).length === 0) return;
    // チャットの初期状態を取得する
    const collapsed = $(frame).attr('collapsed') !== undefined;
    // チャット切替ボタンをクリックする
    $(button).click();
    // 初期状態が非表示の場合 -> キャンセル
    if (collapsed) return;
    // チャット切替ボタンをクリックする
    $(button).click();
};

// メッセージイベント -> チャットを更新する
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'RELOAD_CHAT') reloadChat();
});
