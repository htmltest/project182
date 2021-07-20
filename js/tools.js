SmoothScroll({
    animationTime    : 800,
    stepSize         : 75,

    accelerationDelta : 30,
    accelerationMax   : 2,

    keyboardSupport   : true,

    arrowScroll       : 50,

    pulseAlgorithm   : true,
    pulseScale       : 4,
    pulseNormalize   : 1,

    touchpadSupport   : true,
});

$(document).ready(function() {

    $.validator.addMethod('phoneRU',
        function(phone_number, element) {
            return this.optional(element) || phone_number.match(/^\+7 \(\d{3}\) \d{3}\-\d{2}\-\d{2}$/);
        },
        'Ошибка заполнения'
    );

    $('body').on('focus', '.form-input input, .form-input textarea', function() {
        $(this).parents().filter('.form-input').addClass('focus');
    });

    $('body').on('blur', '.form-input input, .form-input textarea', function() {
        $(this).parents().filter('.form-input').removeClass('focus');
        if ($(this).val() != '') {
            $(this).parents().filter('.form-input').addClass('full');
        } else {
            $(this).parents().filter('.form-input').removeClass('full');
        }
    });

    $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        if (curName != '') {
            curField.addClass('full');
            curField.find('span em').html(curName);
        } else {
            curField.removeClass('full');
            curField.find('span em').html(curField.find('span').attr('data-placeholder'));
        }
    });

    $('body').on('click', '.form-file-remove', function(e) {
        var curField = $(this).parents().filter('.form-file');
        curField.find('input').val('').trigger('change');
        e.preventDefault();
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('.menu-link').click(function(e) {
        $('html').addClass('menu-open');
        e.preventDefault();
    });

    $('.menu-close').click(function(e) {
        $('html').removeClass('menu-open');
        e.preventDefault();
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.menu').length == 0 && !$(e.target).hasClass('menu') && !$(e.target).hasClass('menu-link') && $(e.target).parents().filter('.menu-link').length == 0) {
            $('html').removeClass('menu-open');
        }
    });

    $('body').on('click', '.project-item-inner', function(e) {
        var curLink = $(this);
        var curItem = curLink;
        var curGallery = $('body');
        var curIndex = curGallery.find('.project-item-inner').index(curItem);

        var curPadding = $('.wrapper').width();
        var curWidth = $(window).width();
        if (curWidth < 480) {
            curWidth = 480;
        }
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-photo-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        var windowHTML =    '<div class="window-photo">';

        windowHTML +=           '<div class="window-photo-preview">' +
                                    '<div class="window-photo-preview-inner">' +
                                        '<div class="window-photo-preview-list">';

        var galleryLength = curGallery.find('.project-item-inner').length;
        for (var i = 0; i < galleryLength; i++) {
            var curTitle = '';
            var curGalleryItem = curGallery.find('.project-item-inner').eq(i);
            windowHTML +=                   '<div class="window-photo-preview-list-item"><a href="#" style="' + curGalleryItem.attr('style') + '"></a></div>';
        }
        windowHTML +=                   '</div>' +
                                    '</div>' +
                                '</div>';

        windowHTML +=           '<a href="#" class="window-photo-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#icon-menu-close"></use></svg></a>';

        windowHTML +=           '<div class="window-photo-slider">' +
                                    '<div class="window-photo-slider-list">';

        for (var i = 0; i < galleryLength; i++) {
            var curGalleryItem = curGallery.find('.project-item-inner').eq(i);
            windowHTML +=               '<div class="window-photo-slider-list-item">' +
                                            '<div class="window-photo-slider-list-item-inner"><img src="' + pathTemplate + 'images/loading.gif" data-src="' + curGalleryItem.attr('href') + '" alt="" /></div>' +
                                        '</div>';
        }
        windowHTML +=               '</div>' +
                                '</div>';

        windowHTML +=       '</div>';

        $('.window-photo').remove();
        $('body').append(windowHTML);

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
        $('meta[name="viewport"]').attr('content', 'width=' + curWidth);

        $('.window-photo').each(function() {
            var marginPhoto = 0;
            if ($(window).width() < 1260) {
                marginPhoto = 260;
            }
            if ($(window).width() < 768) {
                marginPhoto = 230;
            }
            var newHeight = marginPhoto;
            $('.window-photo-slider-list-item-inner').css({'height': 'calc(100vh - ' + newHeight + 'px)', 'line-height': 'calc(100vh - ' + newHeight + 'px)'});
        });

        if ($(window).width() > 1199) {
            $('.window-photo-preview-inner').mCustomScrollbar({
                axis: 'y',
                scrollButtons: {
                    enable: true
                }
            });
        } else {
            $('.window-photo-preview-inner').mCustomScrollbar({
                axis: 'x',
                scrollButtons: {
                    enable: true
                }
            });
        }

        $('.window-photo-slider-list').slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-prev"></use></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-next"></use></svg></button>',
            dots: false,
            speed: 250,
            initialSlide: curIndex,
            responsive: [
                {
                    breakpoint: 1259,
                    settings: {
                        arrows: false
                    }
                }
            ]
        }).on('setPosition', function(event, slick) {
            var currentSlide = $('.window-photo-slider-list').slick('slickCurrentSlide');
            $('.window-photo-preview-list-item.active').removeClass('active');
            $('.window-photo-preview-list-item').eq(currentSlide).addClass('active');
            $('.window-photo-preview-inner').mCustomScrollbar('scrollTo', $('.window-photo-preview-list-item').eq(currentSlide));
            var curIMG = $('.window-photo-slider-list-item').eq(currentSlide).find('img');
            if (curIMG.attr('src') !== curIMG.attr('data-src')) {
                var newIMG = $('<img src="" alt="" style="position:fixed; left:-9999px; top:-9999px" />');
                $('body').append(newIMG);
                newIMG.one('load', function(e) {
                    curIMG.attr('src', curIMG.attr('data-src'));
                    newIMG.remove();
                });
                newIMG.attr('src', curIMG.attr('data-src'));
                window.setTimeout(function() {
                    curIMG.attr('src', curIMG.attr('data-src'));
                    if (newIMG) {
                        newIMG.remove();
                    }
                }, 3000);
            }
        });

        e.preventDefault();
    });

    $('body').on('click', '.window-photo-preview-list-item a', function(e) {
        var curIndex = $('.window-photo-preview-list-item').index($(this).parent());
        $('.window-photo-slider-list').slick('slickGoTo', curIndex);
        e.preventDefault();
    });

    $('body').on('click', '.window-photo-close', function(e) {
        $('.window-photo').remove();
        $('html').removeClass('window-photo-open');
        $('meta[name="viewport"]').attr('content', 'width=device-width');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            if ($('.window-photo').length > 0) {
                $('.window-photo-close').trigger('click');
            }
        }
    });

    $('.services-item').each(function() {
        var curItem = $(this).parent();
        curItem.find('.services-item-detail-mobile').html( curItem.find('.services-item-content').html());
    });

    $('.services-item').click(function(e) {
        var curLink = $(this);
        curLink.toggleClass('open');
        curLink.find('.services-item-detail').slideToggle();
        e.preventDefault();
    });

    $('.furnishings-item-slider').slick({
        infinite: false,
        slidesToShow: 2,
        slidesToScroll: 1,
        prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#slick-prev"></use></svg></button>',
        nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#slick-next"></use></svg></button>',
        dots: false,
        responsive: [
            {
                breakpoint: 1259,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                    dots: true
                }
            }
        ]
    });

    $('.furnishings-all-menu ul li a').click(function(e) {
        var curLink = $(this);
        var curAll = curLink.parents().filter('.furnishings-all');
        if (curLink.attr('data-letter') == '') {
            curAll.find('.furnishings-all-menu ul li a.disabled').removeClass('disabled');
            curAll.find('.furnishings-all-list a.disabled').removeClass('disabled');
        } else {
            curAll.find('.furnishings-all-menu ul li a').addClass('disabled');
            curLink.removeClass('disabled');
            curAll.find('.furnishings-all-list a').addClass('disabled');
            var curLetter = curLink.attr('data-letter').toLowerCase();
            curAll.find('.furnishings-all-list a').each(function() {
                var thisLink = $(this);
                var thisLetter = thisLink.text()[0].toLowerCase();
                if (thisLetter == curLetter) {
                    thisLink.removeClass('disabled');
                }
            });
        }
        e.preventDefault();
    });

    $('.furnishings-how-scheme-item').on('mouseenter', function() {
        $('.furnishings-how-scheme-info').html($(this).find('.furnishings-how-scheme-item-info').html());
        $('.furnishings-how-scheme-info').addClass('visible');
        $('.scheme-sectors-fake-path').attr('d', $(this).attr('data-d'));
    });

    $('.furnishings-how-scheme-item').on('mouseleave', function() {
        $('.furnishings-how-scheme-info').removeClass('visible');
        $('.scheme-sectors-fake-path').attr('d', '');
    });

    $('.furnishings-item-title, .furnishings-item-slider-item-inner').click(function(e) {
        var curGallery = $(this).parents().filter('.furnishings-item');

        var curIndex = 0;
        if ($(this).hasClass('furnishings-item-slider-item-inner')) {
            curIndex = curGallery.find('.furnishings-item-slider-item-inner').index($(this));
        }

        var curPadding = $('.wrapper').width();
        var curWidth = $(window).width();
        if (curWidth < 480) {
            curWidth = 480;
        }
        var curScroll = $(window).scrollTop();
        $('html').addClass('window-furnishings-open');
        curPadding = $('.wrapper').width() - curPadding;
        $('body').css({'margin-right': curPadding + 'px'});

        var windowHTML =    '<div class="window-furnishings">';

        windowHTML +=           '<a href="#" class="window-furnishings-close"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#icon-menu-close"></use></svg></a>';

        windowHTML +=           '<div class="window-furnishings-slider">' +
                                    '<div class="window-furnishings-slider-list">';

        var galleryLength = curGallery.find('.furnishings-item-slider-item-inner').length;
        for (var i = 0; i < galleryLength; i++) {
            var curGalleryItem = curGallery.find('.furnishings-item-slider-item-inner').eq(i);
            windowHTML +=               '<div class="window-furnishings-slider-list-item">' +
                                            '<img src="' + curGalleryItem.attr('href') + '" alt="" />' +
                                        '</div>';
        }
        windowHTML +=               '</div>' +
                                '</div>';

        windowHTML +=           '<div class="window-furnishings-title">' + curGallery.find('.furnishings-item-title').html() + '</div>';

        windowHTML +=       '</div>';

        $('.window-furnishings').remove();
        $('body').append(windowHTML);

        $('.wrapper').css({'top': -curScroll});
        $('.wrapper').data('curScroll', curScroll);
        $('meta[name="viewport"]').attr('content', 'width=' + curWidth);

        $('.window-furnishings-slider-list').slick({
            infinite: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            prevArrow: '<button type="button" class="slick-prev"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-prev"></use></svg></button>',
            nextArrow: '<button type="button" class="slick-next"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#gallery-next"></use></svg></button>',
            dots: false,
            variableWidth: true,
            initialSlide: curIndex,
            responsive: [
                {
                    breakpoint: 1259,
                    settings: {
                        arrows: false
                    }
                },
                {
                    breakpoint: 767,
                    settings: {
                        variableWidth: false,
                        arrows: true
                    }
                }
            ]
        });

        e.preventDefault();
    });

    $('body').on('click', '.window-furnishings-close', function(e) {
        $('.window-furnishings').remove();
        $('html').removeClass('window-furnishings-open');
        $('meta[name="viewport"]').attr('content', 'width=device-width');
        $('body').css({'margin-right': 0});
        $('.wrapper').css({'top': 0});
        $(window).scrollTop($('.wrapper').data('curScroll'));
        e.preventDefault();
    });

    $('body').on('keyup', function(e) {
        if (e.keyCode == 27) {
            if ($('.window-furnishings').length > 0) {
                $('.window-furnishings-close').trigger('click');
            }
        }
    });

    $('.furnishings-best-menu ul li a').click(function(e) {
        var curLink = $(this);
        if (!curLink.hasClass('btn-white')) {
            $('.furnishings-best-menu ul li a.btn-white').removeClass('btn-white');
            curLink.addClass('btn-white');
            var curIndex = $('.furnishings-best-menu ul li a').index(curLink);
            $('.furnishings-tab.active').removeClass('active');
            $('.furnishings-tab').eq(curIndex).addClass('active');
        }
        e.preventDefault();
    });

    $('.portfolio-ajax-link').click(function(e) {
        if (!$('.portfolio-ajax-link').hasClass('loading')) {
            $('.portfolio-ajax-link').addClass('loading')
            $.ajax({
                type: 'POST',
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                $('.portfolio').append(html);
                $('.portfolio-ajax-link').remove();
            });
        }
        e.preventDefault();
    });

});

function initForm(curForm) {
    curForm.find('.form-input input').attr('autocomplete', 'off');

    curForm.find('.form-input input, .form-input textarea').each(function() {
        if ($(this).val() != '') {
            $(this).parents().filter('.form-input').addClass('full');
        }
    });

    curForm.find('input.phoneRU').mask('+7 (000) 000-00-00');

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            var curForm = $(form);
            if (curForm.hasClass('ajax-form')) {
                curForm.addClass('loading');
                var formData = new FormData(form);

                $.ajax({
                    type: 'POST',
                    url: curForm.attr('action'),
                    processData: false,
                    contentType: false,
                    dataType: 'json',
                    data: formData,
                    cache: false
                }).done(function(data) {
                    curForm.find('.message').remove();
                    if (data.status) {
                        curForm.find('.form-input input, .form-input textarea').each(function() {
                            $(this).val('').trigger('change blur').removeClass('error valid');
                            $(this).parent().removeClass('focus full');
                        });
                        curForm.find('.form-ctrl-message').append('<div class="message">' + data.message + '</div>')
                        window.setTimeout(function() {
                            curForm.find('.form-ctrl-message .message').fadeOut(function() {
                                curForm.find('.form-message').html('');
                            });
                        }, 5000);
                    } else {
                        curForm.find('.form-ctrl-message').append('<div class="message">' + data.message + '</div>')
                    }
                    curForm.removeClass('loading');
                });
            } else {
                form.submit();
            }
        }
    });
}

$(window).on('load resize', function() {

    $('.furnishings-how-scheme').each(function() {
        var curScheme = $(this);
        var startImgWidth = Number(curScheme.find('.furnishings-how-scheme-img img').attr('data-width'));
        var startImgHeight = Number(curScheme.find('.furnishings-how-scheme-img img').attr('data-height'));
        var curImgWidth = Number(curScheme.find('.furnishings-how-scheme-img img').width());
        var curImgHeight = Number(curScheme.find('.furnishings-how-scheme-img img').height());
        var diffWidth = curImgWidth / startImgWidth;
        var diffHeight = curImgHeight / startImgHeight;

        curScheme.find('.furnishings-how-scheme-item').each(function() {
            var curItem = $(this);
            curItem.css({'left': Number(curItem.attr('data-left')) * diffWidth + 'px', 'top': Number(curItem.attr('data-top')) * diffWidth + 'px'});
        });
    });

});

$(window).on('load resize scroll', function() {
    var windowScroll = $(this).scrollTop();

    $('body').append('<div id="body-test-height" style="position:fixed; left:0; top:0; right:0; bottom:0; z-index:-1"></div>');
    var windowHeight = $('#body-test-height').height();
    $('#body-test-height').remove();

    $('.title-row').each(function() {
        var curRow = $(this);

        var curPosition = windowScroll + windowHeight - windowHeight * 1/4;

        var curStart = curRow.offset().top - windowHeight * 1/4;
        var curStop = curRow.offset().top - windowHeight * 2/4;
        var curPersent = (curPosition - curStart) / (curStart - curStop);

        if (curPersent >= 0) {
            if (curPersent <= 1) {
                curRow.css({'transform': 'translate(' + (-40 + 40 * curPersent) + 'px, ' + (30 - 30 * curPersent) + 'px)', 'opacity': curPersent});
            } else {
                curRow.css({'transform': 'translate(0px, 0px)', 'opacity': 1});
            }
        } else {
            curRow.css({'transform': 'translate(-40px, 30px)', 'opacity': 0});
        }
    });

    $('.title-row svg').each(function() {
        var curRow = $(this);

        var curPosition = windowScroll + windowHeight - windowHeight * 1/4 - windowHeight * 1/8;

        var curStart = curRow.offset().top - windowHeight * 1/4 - windowHeight * 1/8;
        var curStop = curRow.offset().top - windowHeight * 2/4 - windowHeight * 1/8;
        var curPersent = (curPosition - curStart) / (curStart - curStop);

        if (curPersent >= 0) {
            if (curPersent <= 1) {
                curRow.css({'transform': 'translate(' + (-40 + 40 * curPersent) + 'px, 0px)', 'opacity': curPersent});
            } else {
                curRow.css({'transform': 'translate(0px, 0px)', 'opacity': 1});
            }
        } else {
            curRow.css({'transform': 'translate(-40px, 0px)', 'opacity': 0});
        }
    });

    $('.main-item-photo-content, .portfolio-item-preview-inner, .project-item-photo').each(function() {
        var curRow = $(this);
        var curParent = $(this).parent();

        var curPosition = windowScroll + windowHeight;

        var curStart = curParent.offset().top;
        var curStop = curParent.offset().top + curParent.height() + windowHeight;
        var curPersent = -(curPosition - curStart) / (curStart - curStop);

        if (curPersent >= 0) {
            if (curPersent <= 1) {
                curRow.css({'transform': 'translateY(' + (-100 * curPersent) + 'px)'});
            } else {
                curRow.css({'transform': 'translateY(-100px)'});
            }
        } else {
            curRow.css({'transform': 'translateY(-100px)'});
        }
    });

});