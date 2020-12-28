// 動画フィルター情報
const videoFilterInfo = {
    type: 'video',
    title: 'Show Video Information',
    svg: '<svg viewBox="0 0 24 24"><path d="M18.4 5.6v12.8H5.6V5.6h12.8zm0-1.8H5.6a1.8 1.8 0 0 0-1.8 1.8v12.8a1.8 1.8 0 0 0 1.8 1.9h12.8a1.8 1.8 0 0 0 1.9-1.9V5.6a1.8 1.8 0 0 0-1.9-1.8z"></path><path d="M10.2 9v6.5l5-3.2-5-3.2z"></path></svg>'
};

// ライブフィルター情報
const liveFilterInfo = {
    type: 'live',
    title: 'Show Live Information',
    svg: '<svg viewBox="0 0 24 24"><path d="M16.94 6.91l-1.41 1.45c.9.94 1.46 2.22 1.46 3.64s-.56 2.71-1.46 3.64l1.41 1.45c1.27-1.31 2.05-3.11 2.05-5.09s-.78-3.79-2.05-5.09zM19.77 4l-1.41 1.45C19.98 7.13 21 9.44 21 12.01c0 2.57-1.01 4.88-2.64 6.54l1.4 1.45c2.01-2.04 3.24-4.87 3.24-7.99 0-3.13-1.23-5.96-3.23-8.01zM7.06 6.91c-1.27 1.3-2.05 3.1-2.05 5.09s.78 3.79 2.05 5.09l1.41-1.45c-.9-.94-1.46-2.22-1.46-3.64s.56-2.71 1.46-3.64L7.06 6.91zM5.64 5.45L4.24 4C2.23 6.04 1 8.87 1 11.99c0 3.13 1.23 5.96 3.23 8.01l1.41-1.45C4.02 16.87 3 14.56 3 11.99s1.01-4.88 2.64-6.54z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
};

// 動画アイテムを加工する
const editVideoItem = (item) => {
    const isFound = (query) => $(item).find(query).length > 0;
    // 配信中の場合
    if (isFound('.badge-style-type-live-now')) {
        $(item).attr('type', 'live');
    }
    // 配信予約の場合
    else if (isFound('paper-button')) {
        $(item).attr('type', 'reminder');
        // 公開予定までの残り時間を表示する
        const metadata = $(item).find('#metadata-line').text();
        const datestring = metadata.match(/\d+\/\d+\/\d+ \d+:\d+/);
        const date = datestring ? new Date(datestring) : new Date();
        const time = Math.max(date - new Date(), 0);
        const minutes = Math.floor(time / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const message = (
            days !== 0 ? `${days} 日後 に公開予定` :
            hours !== 0 ? `${hours} 時間後 に公開予定` :
            minutes !== 0 ? `${minutes} 分後 に公開予定` : 'まもなく公開予定'
        );
        $(item).find('paper-button').text(message);
    }
    // それ以外の場合
    else {
        $(item).attr('type', 'video');
    }
};

// クリックイベント: フィルターボタン
$(document).on('click', '.video-filter-btn', (e) => {
    // フィルタータイプを切り替える
    const section = $(e.currentTarget).closest('ytd-section-list-renderer');
    const sectionType = $(section).attr('type');
    const buttonType = $(e.currentTarget).attr('type');
    $(section).attr('type', sectionType === buttonType ? 'default' : buttonType);
    // サムネイルの未ロードを防ぐ
    $(window).scrollTop(1);
    $(window).scrollTop(0);
});

// フィルターボタンを設置する
const addFilterButton = (filterInfo, menu) => {
    const buttonQuery = `.video-filter-btn[type="${filterInfo.type}"]`;
    const button = $(menu).parent().find(buttonQuery);
    if ($(button).length > 0) return;
    const icon = $('<yt-icon>');
    const iconButton = $('<yt-icon-button>', {
        class: 'video-filter-btn',
        title: filterInfo.title,
        type: filterInfo.type
    });
    $(iconButton).append(icon);
    $(menu).before(iconButton);
    $(icon).html(filterInfo.svg);
};

// 変更監視: セクションリスト -> 動画アイテムを加工する
const sectionListObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((section) => {
            const videoItems = $(section).find('ytd-grid-video-renderer');
            $(videoItems).each((_, item) => editVideoItem(item));
        });
    });
});

// 変更監視: 登録チャンネルページ
const subscriptionObserver = new MutationObserver(() => {
    const browse = $('ytd-browse[page-subtype="subscriptions"]');
    const menu = $(browse).find('#title-container > #menu').first();
    const sectionList = $(browse).find('ytd-section-list-renderer > #contents');
    if ($(menu).length === 0) return;
    if ($(sectionList).length === 0) return;
    // フィルターボタンを設置する
    addFilterButton(liveFilterInfo, menu);
    addFilterButton(videoFilterInfo, menu);
    // 各動画アイテムを加工する
    const videoItems = $(sectionList).find('ytd-grid-video-renderer');
    $(videoItems).each((_, item) => editVideoItem(item));
    // セクションリストの変更監視を開始する
    const options = { childList: true };
    sectionListObserver.observe(sectionList.get(0), options);
    // 変更監視を停止する
    subscriptionObserver.disconnect();
});

// タブ更新イベント -> 変更監視を開始する
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'UPDATED') return;
    subscriptionObserver.disconnect();
    sectionListObserver.disconnect();
    if (location.pathname !== '/feed/subscriptions') return;
    const browse = document.querySelector('ytd-browse[page-subtype="subscriptions"]');
    if (browse === null) return;
    const options = { childList: true, subtree: true };
    subscriptionObserver.observe(browse, options);
});
