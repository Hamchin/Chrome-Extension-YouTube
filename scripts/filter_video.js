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

// クリックイベント: フィルターボタン
$(document).on('click', '.video-filter-btn', (e) => {
    // フィルタータイプを切り替える
    const section = $(e.target).closest('ytd-section-list-renderer');
    const sectionType = $(section).attr('type');
    const button = $(e.target).closest('.video-filter-btn');
    const buttonType = $(button).attr('type');
    $(section).attr('type', sectionType === buttonType ? 'default' : buttonType);
    if (sectionType === buttonType) return;
    // 各動画をカテゴライズする
    $(section).find('ytd-grid-video-renderer').each((_, item) => {
        const isFound = (query) => $(item).find(query).length > 0;
        // 配信中の場合
        if (isFound('.badge-style-type-live-now')) {
            $(item).attr('type', 'live');
        }
        // 配信予約の場合
        else if (isFound('paper-button')) {
            $(item).attr('type', 'live');
        }
        // それ以外の場合
        else {
            $(item).attr('type', 'video');
        }
    });
    // サムネイルの未ロードを防ぐ
    $('ytd-topbar-menu-button-renderer').first().click();
    $('ytd-topbar-menu-button-renderer').first().click();
});

// フィルターボタンを設置する
const addFilterButton = (filterInfo) => {
    if ($(`.video-filter-btn[type="${filterInfo.type}"]`).length > 0) return;
    const menu = $('#title-container #menu');
    if ($(menu).length === 0) return;
    const icon = $('<yt-icon>');
    const iconButton = $('<yt-icon-button>', {
        class: 'video-filter-btn',
        title: filterInfo.title,
        type: filterInfo.type
    });
    $(iconButton).append(icon);
    $(menu).first().before(iconButton);
    $(icon).html(filterInfo.svg);
};

// インターバルオブジェクト -> フィルターボタンを設置する
const addFilterButtonInterval = {
    id: null,
    execute: function () {
        addFilterButton(liveFilterInfo);
        addFilterButton(videoFilterInfo);
    },
    start: function () {
        this.execute();
        this.id = setInterval(this.execute, 1000);
    },
    stop: function () {
        if (this.id === null) return;
        clearInterval(this.id);
        this.id = null;
    }
};

// タブ更新イベント -> フィルターボタンを設置する
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'UPDATED') return;
    addFilterButtonInterval.stop();
    if (location.pathname !== '/feed/subscriptions') return;
    addFilterButtonInterval.start();
});
