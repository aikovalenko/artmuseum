$(document).ready(function() {
    $('html').addClass(platform.name.toLowerCase()).addClass(platform.os.family.toLowerCase());

    $('.js-call-search').on('click', function () {
        $('.search-block').addClass('opened');
        $(this).toggleClass('active');
    });
    $('.js-call-notifications').on('click', function () {
        $('.notifications-block').toggleClass('opened');
        $(this).toggleClass('active');
    });


});