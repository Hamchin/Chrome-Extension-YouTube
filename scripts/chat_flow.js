// キーダウンイベント: ドキュメント
$(document).on('keydown', (e) => {
    if (location.pathname !== '/watch') return;
    if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;
    // ライブチャットフローの表示を切り替える
    if (e.key === '=') {
        if (location.pathname !== '/watch') return;
        // コントロールボタンをクリックする
        const button = $('.ylcf-control-button');
        if ($(button).length === 0) return;
        $(button).click();
        $(button).data('timestamp', performance.now());
        // プレーヤーのバーを表示する
        const player = $('.html5-video-player');
        $(player).removeClass('ytp-autohide');
        // プレーヤーのバーを数秒後に非表示にする
        setTimeout(() => {
            const before = $(button).data('timestamp');
            const after = performance.now();
            if (after - before < 2000) return;
            $(player).addClass('ytp-autohide');
        }, 2000);
    }
});
