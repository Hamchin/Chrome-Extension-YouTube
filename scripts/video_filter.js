// 配信フィルター情報
const liveFilterInfo = {
    type: 'live',
    title: 'Show Live Information',
    svg: '<svg viewBox="0 0 24 24"><path d="M14,12c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2S14,10.9,14,12z M8.48,8.45L7.77,7.75C6.68,8.83,6,10.34,6,12 s0.68,3.17,1.77,4.25l0.71-0.71C7.57,14.64,7,13.39,7,12S7.57,9.36,8.48,8.45z M16.23,7.75l-0.71,0.71C16.43,9.36,17,10.61,17,12 s-0.57,2.64-1.48,3.55l0.71,0.71C17.32,15.17,18,13.66,18,12S17.32,8.83,16.23,7.75z M5.65,5.63L4.95,4.92C3.13,6.73,2,9.24,2,12 s1.13,5.27,2.95,7.08l0.71-0.71C4.02,16.74,3,14.49,3,12S4.02,7.26,5.65,5.63z M19.05,4.92l-0.71,0.71C19.98,7.26,21,9.51,21,12 s-1.02,4.74-2.65,6.37l0.71,0.71C20.87,17.27,22,14.76,22,12S20.87,6.73,19.05,4.92z"></path></svg>'
};

// 動画フィルター情報
const videoFilterInfo = {
    type: 'video',
    title: 'Show Video Information',
    svg: '<svg viewBox="0 0 24 24"><path d="M10,8l6,4l-6,4V8L10,8z M21,3v18H3V3H21z M20,4H4v16h16V4z"></path></svg>'
};

// アーカイブフィルター情報
const archiveFilterInfo = {
    type: 'archive',
    title: 'Show Archive Information',
    svg: '<svg viewBox="0 0 24 24"><path d="M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M22,12c0,5.51-4.49,10-10,10S2,17.51,2,12h1c0,4.96,4.04,9,9,9 s9-4.04,9-9s-4.04-9-9-9C8.81,3,5.92,4.64,4.28,7.38C4.17,7.56,4.06,7.75,3.97,7.94C3.96,7.96,3.95,7.98,3.94,8H8v1H1.96V3h1v4.74 C3,7.65,3.03,7.57,3.07,7.49C3.18,7.27,3.3,7.07,3.42,6.86C5.22,3.86,8.51,2,12,2C17.51,2,22,6.49,22,12z"></path></svg>'
};

// 動画アイテムを加工する
const editVideoItem = (item) => {
    const isFound = (query) => $(item).find(query).length > 0;
    // 配信中の場合
    if (isFound('.badge-style-type-live-now, .badge-style-type-live-now-alternate')) {
        $(item).attr('type', 'live');
    }
    // 配信予約の場合
    else if (isFound('ytd-toggle-button-renderer')) {
        $(item).attr('type', 'live');
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
        $(item).find('.yt-core-attributed-string--white-space-no-wrap').text(message);
    }
    // アーカイブの場合
    else if ($(item).find('#metadata-line').text().includes('配信済み')) {
        $(item).attr('type', 'archive');
    }
    // 動画の場合
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
    const button = $('ytd-topbar-menu-button-renderer').first();
    $(button).click() && $(button).click();
});

// フィルターボタンを設置する
const setFilterButton = (filterInfo, menu) => {
    const selector = `.video-filter-btn[type="${filterInfo.type}"]`;
    const button = $(menu).parent().find(selector);
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
    setFilterButton(liveFilterInfo, menu);
    setFilterButton(videoFilterInfo, menu);
    setFilterButton(archiveFilterInfo, menu);
    // デフォルトを配信表示モードにする
    $('.video-filter-btn[type="live"]').click();
    // 各動画アイテムを加工する
    const videoItems = $(sectionList).find('ytd-grid-video-renderer');
    $(videoItems).each((_, item) => editVideoItem(item));
    // セクションリストの変更監視を開始する
    const options = { childList: true };
    sectionListObserver.observe(sectionList.get(0), options);
    // 変更監視を停止する
    subscriptionObserver.disconnect();
});

// タブ更新イベント
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'UPDATED') return;
    // 設定をリセットする
    subscriptionObserver.disconnect();
    sectionListObserver.disconnect();
    // 登録チャンネルページ以外の場合 -> キャンセル
    if (location.pathname !== '/feed/subscriptions') return;
    // 変更監視を開始する
    const options = { childList: true, subtree: true };
    subscriptionObserver.observe(document, options);
});
