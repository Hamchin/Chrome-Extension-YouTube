// 変更監視: チャンネルページ -> チャンネル動画を停止する
const channelObserver = new MutationObserver(() => {
    const video = document.querySelector('ytd-channel-video-player-renderer video');
    if (video === null || video.paused) return;
    video.pause();
    channelObserver.disconnect();
});

// タブ更新イベント -> 変更監視を開始する
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'UPDATED') return;
    channelObserver.disconnect();
    const pathList = location.pathname.split('/').filter(path => path !== '');
    const firstPath = pathList.length ? pathList[0] : '';
    const channelPaths = ['c', 'channel', 'user'];
    if (channelPaths.includes(firstPath) === false) return;
    const options = { childList: true, subtree: true };
    channelObserver.observe(document, options);
});
