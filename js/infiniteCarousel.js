var InfiniteCarousel = function(options) {
    //Default values
    this.baseClass = "";
    this.slideSpeed = 500;
    this.slideCount = 1;
    this.contentWidth = '';
    this.totalContent = '';
    this.slidePosTemp = 0;
    this.carouselUlWidth = 0;
    this.flag = true;
    this.moveImage = 0;

    //Extend options
    $.extend(this, options);
    
    //init code
    this.setCarouselWidth();
    this.getSlideCount();
    this.setDefaultPosition();
    this.addEvent();
    this.resizeEvent();

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
        this.mobileSlide();
};

InfiniteCarousel.prototype = {
    setCarouselWidth: function() {
        var _this = this;

        _this.contentWidth = parseInt($(_this.baseClass).find('ul.carousel-ul li.carousel-li').outerWidth(true));

        _this.totalContent = $(_this.baseClass).find('ul.carousel-ul li.carousel-li').length;
        _this.carouselUlWidth = _this.contentWidth * _this.totalContent;
        $(_this.baseClass).find('ul.carousel-ul').width(_this.carouselUlWidth);
    },

    getSlideCount: function() {
        var _this = this;
        var windowWidth = $(window).width(); //retrieve current window width

        if (typeof _this.moveImage != 'undefined' && _this.moveImage > 0) {
            _this.slideCount = _this.moveImage;
        } else {
            if (windowWidth >= 960) {
                _this.slideCount = 4;
            } else if (windowWidth >= 768) {
                _this.slideCount = 3;
            } else if (windowWidth > 600) {
                _this.slideCount = 2;
            } else {
                _this.slideCount = 1;
            }
        }
    },

    setDefaultPosition: function() {
        var _this = this;
        _this.slidePosTemp = -1*(_this.contentWidth * _this.slideCount);

        for (var i=0; i<_this.slideCount; i++) {
            var movedSlide = $(_this.baseClass).find('ul.carousel-ul').find('li.carousel-li:last');
            $(_this.baseClass).find('ul.carousel-ul li.carousel-li:first').before(movedSlide);
        }

        $(_this.baseClass).find('ul.carousel-ul').css('margin-left', _this.slidePosTemp);
    },

    addEvent: function() {
        var _this = this;

        //next link click
        $(document).on('click', _this.baseClass + ' .next', function(e) {
            e.preventDefault();

            if (_this.flag) {
                _this.flag = false;
                _this.slideCarousel('next');
            }
        });

        //prev link click
        $(document).on('click', _this.baseClass + ' .prev', function(e) {
            e.preventDefault();

            if (_this.flag) {
                _this.flag = false;
                _this.slideCarousel('prev')
            }
        });
    },

    slideCarousel: function(direction) {
        var _this = this;

        if (_this.contentWidth != '') {
            var defaultPos = _this.slidePosTemp,
                moveLeftPos = (_this.contentWidth * _this.slideCount);

            if (direction == 'next') {
                moveLeftPos = -1 * moveLeftPos;
            }

            moveLeftPos = _this.slidePosTemp + (moveLeftPos)

            $(_this.baseClass).find('ul.carousel-ul').animate({
                'margin-left': moveLeftPos
            }, _this.slideSpeed, function() {
                if (direction == 'next') {
                    for (var i=0; i<_this.slideCount; i++) {
                        var movedSlide = $(_this.baseClass).find('ul.carousel-ul').find('li.carousel-li:first');
                        $(_this.baseClass).find('ul.carousel-ul li.carousel-li:last').after(movedSlide);
                    }
                }

                if (direction == 'prev') {
                    for (var i=0; i<_this.slideCount; i++) {
                        var movedSlide = $(_this.baseClass).find('ul.carousel-ul').find('li.carousel-li:last');
                        $(_this.baseClass).find('ul.carousel-ul li.carousel-li:first').before(movedSlide);
                    }
                }

                $(_this.baseClass).find('ul.carousel-ul').css('margin-left', defaultPos);
                _this.flag = true;
            });
        }
    },

    resizeEvent: function() {
        var _this = this;
        $(window).resize(function() {
            _this.setCarouselWidth();
            _this.getSlideCount();

            _this.slidePosTemp = -1*(_this.contentWidth * _this.slideCount);
            $(_this.baseClass).find('ul.carousel-ul').css('margin-left', _this.slidePosTemp);
        });
    },

    mobileSlide: function() {
        _this = this;

        var baseClasses = [];
        baseClasses.push(_this.baseClass);
        var x1 = 0;
        var endCoords = {};

        $(_this.baseClass).bind('touchstart', function(event) {
            endCoords = event.originalEvent.targetTouches[0];
            x1 = endCoords.pageX;
        });

        $(_this.baseClass).bind('touchend', function(event) {
            var x2 = endCoords.pageX;
            var diff = parseInt(x2) - parseInt(x1);

            if (diff > 0 && diff > 70) {
                $(baseClasses + " .sliderButtons .prev").trigger('click');
            } else if (diff < 0 && diff < -70) {
                $(baseClasses + " .sliderButtons .next").trigger('click');
            }
        });
    }
};

$(function() {
    var infiniteCarousel = new InfiniteCarousel({
        baseClass: '.infinite-carousel'
    });
    var infiniteCarousel1 = new InfiniteCarousel({
        baseClass: '.infinite-carousel1',
        moveImage: 3,
        slideSpeed: 1000
    });
});
