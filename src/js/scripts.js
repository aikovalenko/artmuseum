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

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// устанавливает cookie с именем name и значением value
// options - объект с свойствами cookie (expires, path, domain, secure)
function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

// удаляет cookie с именем name
function deleteCookie(name) {
    setCookie(name, "", {
        expires: -1
    })
}





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
        var block = $(this),
            btnFirst = $(this).find('.btn-first');

        $(this).find('.js-content-control-btn').click(function (e) {

            //если ссылка пуста
            if($(this).attr('href') == '') {
                e.preventDefault();
            }

            $(this).addClass('active');
            block.find('.js-content-control-btn').not(this).each(function () {
                $(this).removeClass('active');

                //на странице с афишей фильтр доступен всегда
                if(!$('body').hasClass('afisha-page')) {
                    $('.section--afisha__filter').removeClass('opened');
                }

                //для ситуации двух ul меню, сборс active
                $(this).parent().removeClass('active');
            });
            checkIfFirstIsActive();
        });

        function checkIfFirstIsActive() {
            if (!btnFirst.hasClass('active') && $(window).width() < 1024) {
                btnFirst.addClass('btn--np');
            } else btnFirst.removeClass('btn--np');
        }
        checkIfFirstIsActive();
    });
    $('.js-call-filter').click(function(e) {
        e.preventDefault();
        $('.section--afisha__filter').addClass('opened');
    });

    //кнопки категорий в секции афиша
    $('.js-categories-control-btn').click(function () {
        // e.preventDefault();
        if (!$(this).hasClass('btn--unavailable')){
            $(this).toggleClass('active');
        }
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
    function videoLoad() {
        $('video').mediaelementplayer({
            features: ['']
        });
    }
    videoLoad();

    $.get('content.html', function(data) {
        $(".test").html(data);
        call();
    });

    function call() {
        $('.click').click(function() {
            $(this).addClass('opened');
        });
    }


    $('[data-toggle="tab"]').click(function(e) {
        e.preventDefault();
        var $this = $(this);

        if (!$this.hasClass('loaded')) {

            var loadUrl = $this.attr('href'),
                target = $this.attr('data-target'),
                preloader = $this.closest('.section--tabs').find('.preloader--content');

            console.log(preloader);

            preloader.css('display', 'block');

            callAjaxContent(loadUrl,target,preloader);
            $this.addClass('loaded');
        }


        $this.tab('show');
    });


    function callAjaxContent(loadUrl,target,preloader) {
        $.get(loadUrl, function(data) {


            $(target).html(data);
            accordion();
            videoLoad();



        }).done(function() {
            $(preloader).css('display', 'none');
        }).fail(function() {
            $(target).html('Что-то пошло не так...');
        }).always(function() {

        });

    }


    $(function() {
        $('.section--tabs').each(function () {
        var $this = $(this).find('[data-toggle="tab"].active'),
            loadUrl = $this.attr('href'),
            target = $this.attr('data-target'),
            preloader = $this.closest('.section--tabs').find('.preloader--content');


            callAjaxContent(loadUrl, target, preloader);
            $this.addClass('loaded');
        });
    });


    $(".js-select").select2({
        minimumResultsForSearch: Infinity
    });


    //подменю у главного меню
    $(function() {
        var menu = $('.js-main-menu-hover'),
            under = $('.main-menu-under'),
            dropdown = $('.js-dropdown'),
            hoverInner = $('.hover--inner'),
            dropdownInner = $('.dropdown--inner'),
            headerControls = $('.header__controls');

        function reset() {
            under.removeClass('visible');
            dropdown.removeClass('visible');
            dropdownInner.removeClass('visible');
        }

        menu.on("mouseenter", function() {
            var $this = $(this),
                 num  = $this.attr('data-dropdown');

            if (num != undefined) {
                var width = $this.offset(),
                    id = $('#' + num);

                dropdown.removeClass('visible');

                id.addClass('visible').css('left', width.left);
                under.addClass('visible');
                under.css('height', id.height());
            } else {
                reset();
            }
        });
        hoverInner.on("mouseenter", function() {
            $(this).next(dropdownInner).addClass('visible');
            hoverInner.not(this).each(function () {
                $(this).next(dropdownInner).removeClass('visible');
            });
        });
        under.on("mouseleave", function() {
            reset();
        });

        headerControls.on("mouseenter", function() {
            reset();
        });
    });

    var $grid = $('.grid').masonry({
        // options

        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer'
    });


    $(function() {
        var html = $("html"),
            body = $("body"),
            img = $("img"),

            contrast = $(".js-contrast-version"),
            normal = $(".js-normal-version"),
            font = $(".js-font"),

            contrastCookie = getCookie("contrast"),
            fontCookie = getCookie("font");


        contrast.on('click', function () {
            html.addClass('contrast');
            $(this).addClass('active');
            normal.removeClass('active');
            img.hide();
            setCookie("contrast", "on");

            $grid.masonry();
        });
        normal.on('click', function () {
            html.removeClass('contrast');
            $(this).addClass('active');
            contrast.removeClass('active');
            img.show();
            setCookie("contrast", "off");

            $grid.masonry();
        });
        font.on('click', function (e) {
            e.preventDefault();
            if ($(this).hasClass('active')) {
                setCookie("font", "normal");
            }
            html.toggleClass('big-font');
            font.toggleClass('active');
            setCookie("font", "big");


        });



        if (contrastCookie == 'on') {
            contrast.addClass('active');
            normal.removeClass('active');
            html.addClass('contrast');
            img.hide();
        } else {
            contrast.removeClass('active');
            normal.addClass('active');
            html.removeClass('contrast');
            img.show();
        }


    });


    //правильный пересчет функций на ресайз
    var resizeFn = debounce(function() {
        accordion();
        afishaSliderSettings();
    }, 300);

    $(window).on("resize", resizeFn);

});

