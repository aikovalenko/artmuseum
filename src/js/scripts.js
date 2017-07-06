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

jQuery.fn.clickToggle = function(a,b) {
    function cb(){ [b,a][this._tog^=1].call(this); }
    return this.on("click", cb);
};



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


    var burger = $('.js-burger'),
        menu = $('.menu-mobile'),
        close = $('.js-notifs-close'),
        notifsTop = $('.header__notifications__inner');

    burger.click(function () {

        notifsTop.toggleClass('hidden');
        burger.toggleClass("active");
        menu.toggleClass("opened");


        // $('html').toggleClass('overflowHidden');





    });

    close.click(function() {
        notifsTop.addClass('closed');
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





    $('.js-content-control').each(function () {

        var block =  $(this);

        $(this).find('.js-content-control-btn').click(function (e) {

            e.preventDefault();
            $(this).addClass('active');


            block.find('.js-content-control-btn').not(this).each(function () {
                $(this).removeClass('active');
                $('.section--afisha__filter').removeClass('opened');
            });
        });
    });

    $('.js-call-filter').click(function() {
        $('.section--afisha__filter').addClass('opened');
    });



    $('.accordion-title').click(function(e) {
        e.preventDefault();
        if ($(window).width() < 1024) {

            var $this = $(this),
                time = 500;

            if ($this.next().hasClass('show')) {
                $this.next().removeClass('show');
                $this.next().slideUp(time);
            } else {
                $this.parent().parent().find('.accordion-content').removeClass('show');
                $this.parent().parent().find('.accordion-content').slideUp(time);
                $this.next().toggleClass('show');
                $this.next().slideToggle(time);
            }
        }
    });

    function resetAccordion() {
        if ($(window).width() >= 1024) {
            $('.accordion-content').show();
        }
    }


    function headerControl() {

        $('.section__header__controls').each(function () {

            var first = $(this).find('.first'),
                second = $(this).find('.second'),
                firstWidth = first.width(),
                secondWidth = second.width();

            $(this).find('.js-control-menu').clickToggle(function() {
                first.css('width', firstWidth);
                setTimeout(function () {
                    first.css('width', 0);
                    second.addClass('full-width');
                    setTimeout(function () {
                        second.css('width', secondWidth);
                    }, 100);
                }, 100);
            }, function() {
                first.css('width', firstWidth);
                setTimeout(function () {
                    second.css('width', 0);
                    second.addClass('null-width');
                }, 100);
            });
        });
    }

    headerControl();


    var afishaSliderSets = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        variableWidth: true,
        dots: false,
        arrows: true
    };

    var afishaSlider = $('.js-multiple-items-slider').slick(afishaSliderSets);

    function afishaSliderSettings() {

        function unwrap() {
            afishaSlider.slick('unslick');
            $('.js-multiple-items-slider .slide .item').unwrap();
            $('.js-multiple-items-slider .slide').remove();
        }

        function reset(num) {
            unwrap();
            var divs = $(".item");
            for(var i = 0; i < divs.length; i += num) {
                divs.slice(i, i + num).wrapAll("<div class='slide'></div>");
            }
        }

        if ($(window).width() < 1280) {
            reset(3);
            afishaSlider.slick(afishaSliderSets);

        }
        if ($(window).width() >= 1280) {
            reset(4);
            afishaSlider.slick(afishaSliderSets);
        }
        if ($(window).width() < 1024) {
            unwrap();
        }
    }

    afishaSliderSettings();


    var resizeFn = debounce(function() {
        resetAccordion();
        afishaSliderSettings();
    }, 300);

    $(window).on("resize", resizeFn);

});

