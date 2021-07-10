// ウィンドウを再スクロールする
const rescrollWindow = () => {
    const scrollTop = $(window).scrollTop();
    $(window).scrollTop(scrollTop + 1);
    $(window).scrollTop(scrollTop);
};

// 変更監視: コメント欄
const commentBoxObserver = new MutationObserver(() => {
    // コメント欄をボックス化する
    const comments = document.querySelector('ytd-comments');
    if (comments === null) return;
    comments.classList.add('comment-box');
    $('#secondary-inner').prepend(comments);
    comments.addEventListener('scroll', rescrollWindow);
    // コメント表示ボタンを設置する
    const icon = $('<yt-icon>');
    const button = $('<yt-icon-button>', { class: 'comment-show-btn', title: 'Show Comment Box' });
    $(button).append(icon);
    $('ytd-masthead #end').prepend(button);
    $(icon).html('<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>');
    // コメント欄の表示設定を初期化する
    const app = document.querySelector('ytd-app');
    const frame = document.querySelector('ytd-live-chat-frame');
    if (frame === null) app.setAttribute('comments', '');
    commentBoxObserver.disconnect();
});

// クリックイベント: コメント表示ボタン -> コメント欄の表示を切り替える
$(document).on('click', '.comment-show-btn', () => {
    const app = document.querySelector('ytd-app');
    app.toggleAttribute('comments');
    rescrollWindow();
});

// タブ更新イベント
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'UPDATED') return;
    // 設定をリセットする
    commentBoxObserver.disconnect();
    $('.comment-show-btn').remove();
    $('ytd-app').removeAttr('comments');
    // 動画ページ以外の場合 -> キャンセル
    if (location.pathname !== '/watch') return;
    // 変更監視を開始する
    const options = { childList: true, subtree: true };
    commentBoxObserver.observe(document, options);
});
