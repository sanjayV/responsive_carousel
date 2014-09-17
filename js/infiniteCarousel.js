var InfiniteCarousel = function(options) {
    this.baseClass = options.baseClass;//'.infinite-carousel',
    this.slideCount = 1;
    this.contentWidth = '';
    this.totalContent = '';
    this.slidePos = 0;
    this.slidePosTemp = 0;
    this.carouselUlWidth = 0;

    if (typeof options.moveImage != 'undefined')
        this.moveImage = options.moveImage;

    //init code
    this.setCarouselWidth();
    this.getSlideCount();
    this.addEvent();
    this.resizeEvent();

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )
        this.mobileSlide();
};

InfiniteCarousel.prototype = {
    setCarouselWidth: function() {
        var _this = this;



        /*if (typeof _this.moveImage != 'undefined' && _this.moveImage) {
            _this.contentWidth = parseInt($(_this.baseClass).outerWidth(true));
            $(_this.baseClass).find('ul.carousel-ul li.carousel-li').width(_this.contentWidth); //set li width dynamically
        } else {*/
            _this.contentWidth = parseInt($(_this.baseClass).find('ul.carousel-ul li.carousel-li').outerWidth(true));
        /*}*/

        _this.totalContent = $(_this.baseClass).find('ul.carousel-ul li.carousel-li').length;
        _this.carouselUlWidth = _this.contentWidth * _this.totalContent;
        $(_this.baseClass).find('ul.carousel-ul').width(_this.carouselUlWidth);
    },
    getSlideCount: function() {
        var _this = this;
        var windowWidth = $(window).width(); //retrieve current window width

        if (typeof _this.moveImage != 'undefined' && _this.moveImage > 0) {
            /*for home page instagram carousel*/
            if (typeof _this.isHomeInstagram != 'undefined') {
                _this.slideCount = 1;
                if ($(window).width() < 768) {
                    _this.slideCount = 0.25;
                }
            } else {
                _this.slideCount = _this.moveImage;
            }
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
    addEvent: function() {
        var _this = this;

        //next link click        
        $(document).on('click', _this.baseClass + ' .next', function(e) {
            e.preventDefault();
            _this.slideCarousel('next');
        });

        //prev link click
        $(document).on('click', _this.baseClass + ' .prev', function(e) {
            //$(_this.baseClass).find('.prev').unbind('click').bind('click', function(e) {
            e.preventDefault();
            _this.slideCarousel('prev')
        });
    },
    slideCarousel: function(direction) {
        var _this = this;

        if (_this.contentWidth != '') {
            //var slidePos = -1*_this.contentWidth*_this.slideCount;
            var movePos = 0;
            if (direction == 'next') {
                _this.slidePosTemp += _this.contentWidth * _this.slideCount;

                if (parseInt(_this.slidePosTemp) >= _this.carouselUlWidth || _this.slidePosTemp == 0) {
                    _this.slidePos = 0;
                    _this.slidePosTemp = 0;
                } else if (_this.carouselUlWidth - (_this.slidePosTemp) < _this.contentWidth * _this.slideCount) {
                    _this.slidePos += _this.carouselUlWidth - _this.slidePosTemp;
                } else {
                    _this.slidePos = _this.slidePosTemp;
                }

                movePos = -1 * _this.slidePos
            } else {


                if (_this.slidePos < _this.contentWidth * _this.slideCount && _this.slidePos > 0) {
                    _this.slidePosTemp = 0;
                } else {
                    _this.slidePosTemp -= _this.contentWidth * _this.slideCount;
                }

                if (parseInt(_this.slidePosTemp) < 0) {
                    _this.slidePos = (_this.carouselUlWidth - (_this.contentWidth * _this.slideCount));
                    _this.slidePosTemp = (_this.carouselUlWidth - (_this.contentWidth * _this.slideCount));
                } else if (_this.slidePos < _this.contentWidth * _this.slideCount) {
                    _this.slidePos = 0;
                } else {
                    _this.slidePos = _this.slidePosTemp;
                }

                movePos = -1 * _this.slidePos
            }

            $(_this.baseClass).find('ul.carousel-ul').animate({
                'margin-left': movePos
            }, 500);
        }
    },
    resizeEvent: function() {
        var _this = this;
        $(window).resize(function() {
            _this.setCarouselWidth();
            _this.getSlideCount();

            $(_this.baseClass).find('ul.carousel-ul').css('margin-left', 0);
            _this.slidePosTemp = 0;
        });
    },
    mobileSlide: function() {
        _this = this;

        var baseClasses = [];
        baseClasses.push(_this.baseClass);
        var x1 = 0;
        //var x2 = 0;
        var endCoords = {};

        $(_this.baseClass).bind('touchstart', function(event) {
            //alert(baseClasses);
            endCoords = event.originalEvent.targetTouches[0];
            x1 = endCoords.pageX;
        });

        $(_this.baseClass).bind('touchend', function(event) {
            //var endCoords2 = event.originalEvent.targetTouches[0];
            var x2 = endCoords.pageX;
            //alert(x1)
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
    
    var infiniteCarousel = new InfiniteCarousel({baseClass: '.infinite-carousel'});
    var infiniteCarousel1 = new InfiniteCarousel({baseClass: '.infinite-carousel1', moveImage: 1});

    //var twitterCarousel = new InfiniteCarousel({baseClass: '.twitterCarousel', moveImage: 1});
    //var storyInstagramCarousel = new InfiniteCarousel({baseClass: '.storyInstagramCarousel', moveImage: 1});

    //var homeInstagrameCarousel = new InfiniteCarousel({baseClass: '.homeInstagrameCarousel', moveImage: 1});
       
    //var accordianMobileSlider = new InfiniteCarousel({baseClass: '.accordianMobileSlider', moveImage: 1});
});