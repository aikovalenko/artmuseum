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
        // console.log("true");
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

        // $('.menu-mobile__list').removeClass('hide');
        // $('.menu-mobile__panels').addClass('hide');
        // $('.js-mobile-menu').removeClass("active");

    });

    $('.js-mobile-menu').click(function() {

        var headerHeight = $('.header').height();
        var headerNotificationsHeight = $('.header__notifications').height();
        var headerCopyrightHeight = $('.menu-mobile__copyright').innerHeight();
        var headerControlsHeight = $('.header__controls').outerHeight(true);
        var headerMenuListHeight = $('.menu-mobile__list').outerHeight(true);

        var windowHeight = $(window).height();

        $(this).toggleClass("active");
        $('.js-mobile-menu').not(this).each(function () {
            $(this).removeClass('active');
        });



        if ($('.js-mobile-menu').hasClass('active')) {
            //просто ужасно, из-за отрицательного отступа -18 у menu-mobile
            if (headerHeight > windowHeight) {
                $('.menu-mobile__panels').css('height', windowHeight - headerNotificationsHeight - headerControlsHeight - headerCopyrightHeight + 18);


                $('.container').stickem().destroy();
                menuMobileSets();


            }  else {
                $('.menu-mobile__panels').css('height', headerMenuListHeight);
                $('.container').stickem().destroy();
                menuMobileSets();

            }

            $('.menu-mobile__list').addClass('hide');
            $('.menu-mobile__panels').removeClass('hide');
        } else {
            $('.menu-mobile__panels').css('height', 'auto');
            $('.menu-mobile__list').removeClass('hide');
            $('.menu-mobile__panels').addClass('hide');
        }


        $('.container').stickem().destroy();
        menuMobileSets();




    });



    $('.js-call-notifs').click(function(e) {
        e.preventDefault();
        var notifs = $('.mobile-notifs'),
            notifsList = $('.mobile-notifs-list'),
            notifsListHeight = notifsList.innerHeight();

        $(this).toggleClass('active');
        notifs.toggleClass('opened');

        if (notifs.hasClass('opened')) {
            notifs.css('height', notifsListHeight);
        } else {
            notifs.css('height', 0);
        }

        $('.container').stickem().destroy();
        menuMobileSets();
    });



    $('.mobile-search').on("input", function() {
        if( $(this).val().length > 0 ) {
            $('.js-clear-search').addClass('show');
        } else $('.js-clear-search').removeClass('show');

    });

    $('.js-clear-search').click(function() {
        $('.mobile-search').val('');
        $(this).removeClass('show');

    });




    var resizeFn = debounce(function() {
        $('.container').stickem().destroy();
        menuMobileSets();
    }, 100);

    $(window).on("resize", resizeFn);

});

