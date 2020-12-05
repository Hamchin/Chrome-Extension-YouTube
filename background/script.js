// タブ更新イベント
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete') return;
    chrome.tabs.sendMessage(tabId, { type: 'UPDATED' });
});

// メッセージイベント
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // チャットをリロードする
    if (message.type === 'RELOAD_CHAT') {
        chrome.tabs.sendMessage(sender.tab.id, message);
        return true;
    }
});
