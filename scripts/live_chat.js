// アイコンボタンを追加する
const addIconButton = (attr, svg) => {
    const refIconButton = $('yt-live-chat-header-renderer > yt-icon-button');
    if ($(refIconButton).length === 0) return;
    const icon = $('<yt-icon>');
    const iconButton = $('<yt-icon-button>', attr);
    $(iconButton).append(icon);
    $(refIconButton).first().before(iconButton);
    $(icon).html(svg);
};

// チャットフレームを取得する
const getChatFrame = () => $(parent.document).find('ytd-live-chat-frame');

// チャットのフィルタータイプを設定する
const setChatType = (type) => {
    $('yt-live-chat-renderer').attr('type', type);
    const frame = getChatFrame();
    if ($(frame).length === 0) return;
    $(frame).attr('type', type);
};

// ロードイベント
$(document).ready(() => {
    // チャットリロードボタン
    const chatReloadAttr = { class: 'chat-reload-btn', title: 'Reload Live Chat' };
    const chatReloadSvg = '<svg viewBox="0 0 24 24"><path d="M20.944 12.979c-.489 4.509-4.306 8.021-8.944 8.021-2.698 0-5.112-1.194-6.763-3.075l1.245-1.633c1.283 1.645 3.276 2.708 5.518 2.708 3.526 0 6.444-2.624 6.923-6.021h-2.923l4-5.25 4 5.25h-3.056zm-15.864-1.979c.487-3.387 3.4-6 6.92-6 2.237 0 4.228 1.059 5.51 2.698l1.244-1.632c-1.65-1.876-4.061-3.066-6.754-3.066-4.632 0-8.443 3.501-8.941 8h-3.059l4 5.25 4-5.25h-2.92z"></path></svg>';
    addIconButton(chatReloadAttr, chatReloadSvg);
    // チャットフィルターボタン
    const chatFilterAttr = { class: 'chat-filter-btn', title: 'Filter Live Chat' };
    const chatFilterSvg = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path></svg>';
    addIconButton(chatFilterAttr, chatFilterSvg);
    // チャットのフィルタータイプを設定する
    const frame = getChatFrame();
    const type = $(frame).attr('type') || 'default';
    setChatType(type);
});

// クリックイベント: チャットフィルターボタン (デフォルト)
$(document).on('click', 'yt-live-chat-renderer[type="default"] .chat-filter-btn', () => setChatType('member'));

// クリックイベント: チャットフィルターボタン (メンバー限定)
$(document).on('click', 'yt-live-chat-renderer[type="member"] .chat-filter-btn', () => setChatType('hidden'));

// クリックイベント: チャットフィルターボタン (非表示)
$(document).on('click', 'yt-live-chat-renderer[type="hidden"] .chat-filter-btn', () => setChatType('default'));

// クリックイベント: チャットリロードボタン
$(document).on('click', '.chat-reload-btn', () => chrome.runtime.sendMessage({ type: 'RELOAD_CHAT' }));
