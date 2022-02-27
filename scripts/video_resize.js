// 変更監視: ブラウザフィットボタン
const fitButtonObserver = new MutationObserver(() => {
    const sizeButton = $('ytd-player .ytp-size-button');
    if ($(sizeButton).length === 0) return;
    const fitButton = $('<button>', { class: 'ytp-fit-button ytp-button', title: 'Fit to Browser' });
    fitButton.html(`<svg width="44" height="48" viewBox="0 0 40 20"><path class="ytp-svg-fill" d="M14 10l3 3V7l-3 3zM27 10l-3-3v6l3-3z"></path><path class="ytp-svg-fill" d="M29 4v12H12V4h17m2-2H10v16h21V2z"></path></svg>`);
    $(sizeButton).after(fitButton);
    fitButtonObserver.disconnect();
});

// クリックイベント: ブラウザフィットボタン
$(document).on('click', '.ytp-fit-button', () => {
    const player = $('.html5-video-player');
    const parent = $(player).closest('ytd-player');
    // 動画サイズをブラウザにフィットする
    if ($(player).hasClass('browser-fit') === false) {
        $(player).addClass('browser-fit');
        $(player).css('width', $(parent).css('width'));
        $(player).css('height', $(parent).css('height'));
        const widthScale = window.innerWidth / $(parent).width();
        const heightScale = window.innerHeight / $(parent).height();
        const scale = Math.min(widthScale, heightScale);
        $(player).css('transform', `scale(${scale})`);
        $('<div>', { class: 'browser-fit-mask' }).prependTo('body');
    }
    // 動画サイズを元に戻す
    else {
        $(player).removeClass('browser-fit');
        $(player).css('width', '');
        $(player).css('height', '');
        $(player).css('transform', '');
        $('.browser-fit-mask').remove();
    }
});

// タブ更新イベント
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'UPDATED') return;
    // 設定をリセットする
    fitButtonObserver.disconnect();
    $('.ytp-fit-button').remove();
    // 動画ページ以外の場合 -> キャンセル
    if (location.pathname !== '/watch') return;
    // 変更監視を開始する
    const options = { childList: true, subtree: true };
    fitButtonObserver.observe(document, options);
});
