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



function resetStikemSets() {
    $('.container').stickem().destroy();
    menuMobileSets();
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

        //просто ужасно, из-за отрицательного отступа 18px у menu-mobile
        var h = windowHeight - headerNotificationsHeight - headerControlsHeight - headerCopyrightHeight + 18;

        var block = $('.menu-mobile__panels');


        $(this).toggleClass("active");
        $('.menu-mobile__panels__block').removeClass("active");

        var name = $(this).data("name");
        console.log(name);
        $('.' + name).addClass('active');


        $('.js-mobile-menu').not(this).each(function () {
            $(this).removeClass('active');

        });

        console.log(headerHeight, windowHeight);



        if ($('.js-mobile-menu').hasClass('active')) {

            if (headerHeight >= windowHeight) {


                block.css('height', h);


                resetStikemSets();



            } else {
                block.css('height', headerMenuListHeight);
                // console.log(block.css('height', headerMenuListHeight));

            }

            // if (1 < (windowHeight/headerHeight) < 2) {
            //     block.css('height', 300);
            // }

            $('.menu-mobile__list').addClass('hide');
            block.removeClass('hide');

        } else {
            $('.menu-mobile__list').removeClass('hide');
            block.addClass('hide');
            resetStikemSets();
        }

        if (headerHeight >= windowHeight) {
            resetStikemSets();
        }


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
            // $('.container').stickem().destroy();
            // menuMobileSets();
            $('.menu-mobile').css('height', 'auto');

        } else {
            notifs.css('height', 0);
        }

        resetStikemSets();
        //
        // $('.container').stickem().destroy();
        // // menuMobileSets();



    });



    $('.form--mobile-search').on("input", function() {
        if( $(this).val().length > 0 ) {
            $('.js-clear-search').addClass('show');
        } else $('.js-clear-search').removeClass('show');

    });

    $('.js-clear-search').click(function() {
        $('.form--mobile-search').val('');
        $(this).removeClass('show');

    });




    var resizeFn = debounce(function() {
        $('.container').stickem().destroy();
        menuMobileSets();
    }, 100);

    $(window).on("resize", resizeFn);

});

