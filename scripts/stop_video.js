// オブザーバー -> チャンネル動画を停止する
const videoStopObserver = new MutationObserver(() => {
    const video = document.querySelector('ytd-channel-video-player-renderer video');
    if (video === null || video.paused) return;
    video.pause();
    videoStopObserver.disconnect();
});

// タブ更新イベント -> オブザーバーを起動する
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'UPDATED') return;
    videoStopObserver.disconnect();
    const pathList = location.pathname.split('/').filter(path => path !== '');
    const firstPath = pathList.length ? pathList[0] : '';
    const channelPaths = ['c', 'channel', 'user'];
    if (channelPaths.includes(firstPath) === false) return;
    const options = { childList: true, subtree: true };
    videoStopObserver.observe(document, options);
});
