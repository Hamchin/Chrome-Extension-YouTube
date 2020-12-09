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

// コンテキストメニュー: チャットをリロードする
chrome.contextMenus.create({
    id: 'RELOAD_CHAT',
    title: 'チャットをリロードする',
    documentUrlPatterns: [
        'https://www.youtube.com/watch*'
    ]
}, () => chrome.runtime.lastError);

// コンテキストメニュークリックイベント
chrome.contextMenus.onClicked.addListener((info, tab) => {
    // チャットをリロードする
    if (info.menuItemId === 'RELOAD_CHAT') {
        const message = { type: info.menuItemId }
        chrome.tabs.sendMessage(tab.id, message);
        return true;
    }
});
