//дебаунс для правильного ресайза
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

//туггл для функций
jQuery.fn.clickToggle = function(a,b) {
    function cb(){ [b,a][this._tog^=1].call(this); }
    return this.on("click", cb);
};





$(document).ready(function() {

    //определим девайс и ОС и добавим класс к <html/>
    $('html').addClass(platform.name.toLowerCase()).addClass(platform.os.family.toLowerCase());


    //десктоп панель настроек
    var callControl = $('.js-call-control'),
        mainControlsSectionBlock = $('.main-controls-section-block');

    callControl.click(function(e) {

        e.stopPropagation();

        $(this).find(mainControlsSectionBlock).toggleClass('opened');
        $(this).find(".main-controls__button").toggleClass('active');

        callControl.not(this).each(function () {
            $(this).find(mainControlsSectionBlock).removeClass('opened');
            $(this).find(".main-controls__button").removeClass('active');
        });


    });
    $('.js-call-search').click(function(e) {
        $('.form-search input').focus();
    });
    mainControlsSectionBlock.click(function(e){
        e.stopPropagation();
    });
    $(document).click(function() {
        callControl.find(mainControlsSectionBlock).removeClass('opened');
        callControl.find(".main-controls__button").removeClass('active');
    });


    //меню-бургер
    var burger = $('.js-burger'),
        menu = $('.menu-mobile'),
        close = $('.js-notifs-close'),
        notifsTop = $('.header__notifications__inner');

    burger.click(function () {
        notifsTop.toggleClass('hidden');
        burger.toggleClass("active");
        menu.toggleClass("opened");
    });
    close.click(function() {
        notifsTop.addClass('closed');
    });


    //мобильная версия панели-настроек
    var mobileMenu = $('.js-mobile-menu');
    mobileMenu.click(function() {
        var panels = $('.menu-mobile__panels'),
            list = $('.menu-mobile__list'),
            panelsBlock = $('.menu-mobile__panels__block'),
            copyright = $('.menu-mobile__copyright');

        $(this).toggleClass("active");
        panelsBlock.removeClass("active");

        var name = $(this).data("name");

        $('.' + name).addClass('active');
        mobileMenu.not(this).each(function () {
            $(this).removeClass('active');
        });
        if (mobileMenu.hasClass('active')) {
            list.addClass('hide');
            panels.removeClass('hide');
            copyright.addClass("absolute");

        } else {
            list.removeClass('hide');
            panels.addClass('hide');
            copyright.removeClass("absolute");
        }
    });


    //пункт Внимание в мобильной версии /можно заменить на аккордион/
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


    //закрывашка для мобильного поиска
    $('.form--mobile-search').on("input", function() {
        if( $(this).val().length > 0 ) {
            $('.js-clear-search').addClass('show');
        } else $('.js-clear-search').removeClass('show');

    });
    $('.js-clear-search').click(function() {
        $('.form--mobile-search').val('');
        $(this).removeClass('show');
    });


    //слайдер на главной странице
    /*
    у ссылки в слайдере на событие есть data-ticket, который тянется к кнопке Купить под слайдером
     */
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


    //кнопки переключеня контентом в секции, и в афише кнопка фильтра
    $('.js-content-control').each(function () {
        var block = $(this);

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


    //трансформация списка в аккордион в мобиле
    function accordion() {
        var content = $('.accordion--mobile .accordion-content');

        if ($(window).width() < 1024) {
            $('.js-accordion--mobile').accordion({
                "transitionSpeed": 400
            });
            content.removeClass('maxHeight');
        }
        else {
            content.addClass('maxHeight');
        }
        $('.js-accordion').accordion({
            "transitionSpeed": 400
        });
    }
    accordion();


    //переключения между двумя списками кнопок управления контентом
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


    //слайдер афиша с адаптивом
    var afishaSliderSets = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        variableWidth: true,
        dots: false,
        arrows: true
    },
        afishaSlider = $('.js-multiple-items-slider').slick(afishaSliderSets);

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


    //для видео
    $('video').mediaelementplayer({
        features: ['']
    });


    //правильный пересчет функций на ресайз
    var resizeFn = debounce(function() {
        accordion();
        afishaSliderSettings();
    }, 300);

    $(window).on("resize", resizeFn);

});

