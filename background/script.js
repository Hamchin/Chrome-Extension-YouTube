// タブ更新イベント
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete') return;
    chrome.tabs.sendMessage(tabId, { type: 'UPDATED' });
});
