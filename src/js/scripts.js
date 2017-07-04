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

        $('html').toggleClass('overflowHidden');

        $('.header__notifications__inner').toggleClass('hidden');



    });

    $('.js-notifs-close').click(function() {
        $('.header__notifications__inner').addClass('closed');
    });

    $('.js-mobile-menu').click(function() {



        var block = $('.menu-mobile__panels');


        $(this).toggleClass("active");
        $('.menu-mobile__panels__block').removeClass("active");

        var name = $(this).data("name");
        console.log(name);
        $('.' + name).addClass('active');


        $('.js-mobile-menu').not(this).each(function () {
            $(this).removeClass('active');

        });


        if ($('.js-mobile-menu').hasClass('active')) {


            $('.menu-mobile__list').addClass('hide');
            block.removeClass('hide');
            $('.menu-mobile__copyright').addClass("absolute");

        } else {
            $('.menu-mobile__list').removeClass('hide');
            block.addClass('hide');
            $('.menu-mobile__copyright').removeClass("absolute");
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

        } else {
            notifs.css('height', 0);
        }

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



    var mainSlider = $('.js-main-slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        variableWidth: true,
        dots: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 848,
                settings: {
                    variableWidth: false,
                    centerMode: true,
                    centerPadding: '0px'
                }
            }
        ]
    }).on('afterChange', function(event, slick, currentSlide, nextSlide){
        var link = $(slick.$slides.get(currentSlide)).data('ticket');
        $('.slider-btn-buy').attr('href', link);
    });
    var link = $('.slick-slide.slick-current.slick-active').data('ticket');
    $('.slider-btn-buy').attr('href', link);


    var announceSlider = $('.js-multiple-items-slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        // centerPadding: '12px',
        variableWidth: true,
        dots: false,
        arrows: true
        // responsive: [
        //     {
        //         breakpoint: 848,
        //         settings: {
        //             variableWidth: false,
        //             centerMode: true,
        //             centerPadding: '0px'
        //         }
        //     }
        // ]
    });


    $('.js-content-control').each(function () {

        var block =  $(this);

        $(this).find('.js-content-control-btn').click(function (e) {

            e.preventDefault();
            $(this).toggleClass('active');


            block.find('.js-content-control-btn').not(this).each(function () {
                $(this).removeClass('active');
            });
        });
    });



    var resizeFn = debounce(function() {

    }, 100);

    $(window).on("resize", resizeFn);

});

