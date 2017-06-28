function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function menuMobileSets() {

    var menuMobileHeight = $('.menu-mobile__inner').innerHeight();
    var headerHeight = $('.header').height();
    var windowHeight = $(window).height();
    var totalHeight = menuMobileHeight + headerHeight;
    var stickemStart = menuMobileHeight - windowHeight;

    if ($('.js-burger').hasClass('active')) {
        $('.menu-mobile').css('height', menuMobileHeight);
    } else {
        $('.menu-mobile').css('height', 0);

    }

    if ($(window).height() < totalHeight) {
        $('.main-controls--mobile').addClass('stickem');
        console.log("true");
        $('.container').stickem({
            start: stickemStart
        });
    } else {
        $('.main-controls--mobile').removeClass('stickem');
        console.log("false");
    }
}

$(document).ready(function() {

    $('html').addClass(platform.name.toLowerCase()).addClass(platform.os.family.toLowerCase());


    var CallControl = $('.js-call-control'),
        mainControlsSectionBlock = $('.main-controls-section-block');

    CallControl.click(function(e) {

        e.stopPropagation();

        $(this).next(mainControlsSectionBlock).toggleClass('opened');
        $(this).toggleClass('active');

        $('.js-call-control').not(this).next(mainControlsSectionBlock).each(function () {
            $(this).removeClass('opened');
            $(this).prev(CallControl).removeClass('active');
        });

    });

    $('.js-call-search').click(function(e) {
        $('.form-search input').focus();
    });

    $(document).click(function() {
        CallControl.next(mainControlsSectionBlock).removeClass('opened');
        CallControl.removeClass('active');
    });


    $('.js-burger').click(function () {

        $(this).toggleClass("active");
        $('.menu-mobile').toggleClass("opened");

        menuMobileSets();

    });


    var resizeFn = debounce(function() {
        $('.container').stickem().destroy();
        menuMobileSets();
    }, 100);
// 100 это собственно таймер дебаунса, то есть функция будет срабатывать только тогда, когда после последнего её вызова прошло минимум 100ms
// прикрепляем функцию к обработчику события
    $(window).on("resize", resizeFn);

});

