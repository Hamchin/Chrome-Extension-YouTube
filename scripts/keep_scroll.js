// クリックイベント: タイムスタンプ -> スクロール位置を維持する
$(document).on('click', 'ytd-comments .yt-simple-endpoint', async () => {
    const scrollTop = $(window).scrollTop();
    $('ytd-player').prop('disabled', true);
    await new Promise(resolve => setTimeout(resolve, 100));
    $(window).scrollTop(scrollTop);
    $('ytd-player').prop('disabled', false);
});
