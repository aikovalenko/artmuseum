$(document).ready(function() {
    $('html').addClass(platform.name.toLowerCase()).addClass(platform.os.family.toLowerCase());

    $('.js-call-search').on('click', function (e) {
        e.stopPropagation();
        $('.search-block').addClass('opened');
    });
    $(document).on('click', function (e) {
        // Do whatever you want; the event that'd fire if the "special" element has been clicked on has been cancelled.
    });
});