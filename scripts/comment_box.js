// ウィンドウを再スクロールする
const rescrollWindow = () => {
    const scrollTop = $(window).scrollTop();
    $(window).scrollTop(scrollTop + 1);
    $(window).scrollTop(scrollTop);
};

// 変更監視: コメント欄 -> コメント欄をボックス化する
const commentBoxObserver = new MutationObserver(() => {
    const comments = document.querySelector('ytd-comments');
    if (comments === null) return;
    comments.classList.add('comment-box');
    $('#secondary-inner').prepend(comments);
    comments.addEventListener('scroll', rescrollWindow);
    const frame = document.querySelector('ytd-live-chat-frame');
    if (frame !== null) comments.classList.add('hidden');
    else comments.classList.remove('hidden');
    commentBoxObserver.disconnect();
});

// タブ更新イベント -> 変更監視を開始する
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'UPDATED') return;
    commentBoxObserver.disconnect();
    if (location.pathname !== '/watch') return;
    const options = { childList: true, subtree: true };
    commentBoxObserver.observe(document, options);
});

// クリックイベント: チャット切替ボタン -> コメント欄の表示を切り替える
$(document).on('click', 'ytd-live-chat-frame > #show-hide-button', () => {
    const comments = document.querySelector('ytd-comments');
    comments.classList.toggle('hidden');
    rescrollWindow();
});
