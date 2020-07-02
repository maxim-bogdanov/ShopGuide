"use strict"
$(function(){


  $(window).on('resize orientationchange load',function() {
    let $headerInner = $('.header-inner');
    if ( $(window).width() + scrollbarWidth() > 1196 ) {
      let bottomPadding = 70;
      $headerInner.css({'height' : $(window).height() - bottomPadding});
      return;
    }
    if ( $(window).width() + scrollbarWidth() > 750 || $(window).height() < 580) {
      $headerInner.css({'height' : $(window).height()});
      return;
    }
    $headerInner.css({'height' : '50vh'});
  });
  
  $('a').on('click', function(e){
    e.preventDefault();
  })

  // обмен элементами в массиве arr
  function swap(arr, x, y) {
    let b = arr[x];
    arr[x] = arr[y];
    arr[y] = b;
    return arr;
  }

  $('.partners__slider').slick({
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 1,
    swipeToSlide: true,
    prevArrow: '<div class="slider__arrows slider__arrows-left"></div>',
    nextArrow: '<div class="slider__arrows slider__arrows-right"></div>',
    responsive: [
      {
        breakpoint: 1341,
        settings: {
          slidesToShow: 5
        }
      },
      {
        breakpoint: 1148,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 939,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 744,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 545,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  });

  let $account__slider = $('.account__slider').slick({
    infinite: true,
    fade: true,
    slidesToShow: 1,
    swipeToSlide: true,
    slidesToScroll: 1,
  });
  

  $('.account__slider .slick-arrow').css({'display':'none'});


  let tabWidth = $('.tab-item[data-indexitem="4"]').width();
  let rightMargin = 366;
  let leftMargin = 63;
  let distance = tabWidth + rightMargin + leftMargin; //расстояние между 4 и 0 табом
  $('.account__descr').css({'margin-left' : distance});

  
  let activeEvent = false;
  let activeSwipe = false;
  
  let fourItemLeft = 0;
  let difference = 0;
  let fourItemLeftNew = 0;
  let arr = [0, 1, 2, 3, 4];
  let arrSlides = [];



  function animateSlider(active){

    if ($(active).hasClass('item--active-opacity') || activeEvent || activeSwipe) return false;

    $account__slider.slick("slickSetOption", "accessibility", false);
    $account__slider.slick("slickSetOption", "draggable", false);
    $account__slider.slick("slickSetOption", "swipe", false);
    $account__slider.slick("slickSetOption", "touchMove", false);

    activeEvent = true;
    activeSwipe = true;

    let index = parseInt($(active).attr("data-indexitem"));
    $account__slider.slick( 'slickGoTo', index );

    $('.item--active-opacity').toggleClass('item--active-opacity item--active-border');
    $('.account__descr').css({'padding-top':'4px'});
    $(active).toggleClass('item--active-opacity');

    // на сколько должен сдвинуться заголовок, чтобы стать нулевым
    let globalWidth = 0; 

    // разница между нулевым блоком и четвертым, учитывая предыдущую разницу
    difference = $('.tab-item[data-indexitem="4"]').width() - $('.tab-item[data-indexitem="0"]').width() + fourItemLeft;
    $('.account__descr-text--active').fadeOut(950);

    // если выбрали 4 блок
    if (index == 4) {

      globalWidth = $(active).width() + parseInt($(active).css('margin-right').slice(0, -2));

      $(active).animate({'bottom' : '40'}, 500);

      $(active).animate({'left' : globalWidth + fourItemLeft}, 900);
      fourItemLeft = difference;

      fourItemLeftNew = fourItemLeft;
      if ($('.tab-item[data-special=true]').attr('data-indexitem') == 0) {
        fourItemLeftNew = -64;
      };


      setTimeout(function() {
        $('.tab-item').each(function(){
          let leftValue = $(this).attr('data-indexitem') == 0 
          ? -globalWidth + fourItemLeftNew 
          : fourItemLeft
          $(this).animate({'left' : leftValue}, 900);
        });
      }, 500);


      $(active).animate({'bottom' : '0'}, 500);

      setTimeout(function() {
        $('.account__descr-text--active').toggleClass('account__descr-text--active');
        $('.account__descr-text[data-indexitem=' + arr[index] + ']').toggleClass('account__descr-text--active').css({'display':'none'});
        $('.account__descr-text--active').fadeIn(950);
      }, 950);


      setTimeout(function() {

        $('.account__descr').css({'padding-top':'0'});
        $('.item--active-opacity').toggleClass('item--active-border');

        let newZeroItem = $('.tab-item[data-indexitem=0]');
        $('.account__tabs').prepend(newZeroItem);

        swap(arr, 4, 0);


        $('.tab-item').each(function(key){

          if (key == 0) {
            $(this).attr('data-indexitem', 4).css({'left' : fourItemLeftNew});
          } else if (key == 1) {
            $(this).attr('data-indexitem', 0).css({'left' : fourItemLeft});
          } else {
            return false;
          }

        });

        // меняем местами слайды

        $('.account__slide').each(function () {
          arrSlides.push(this.outerHTML);
        });

        for (let i = 3; i >= 0; i--) {
          $account__slider.slick('slickRemove', i);
        }

        $account__slider.find('.slick-arrow').attr('style','display: none;');

        for (let i = 1; i < 4; i++) {
          $('.account__slider').slick('slickAdd', arrSlides[i]);
        } 
        $account__slider.slick('slickAdd', arrSlides[0]);
        $account__slider.find('.slick-arrow').attr('style','display: none;');

        arrSlides.length = 0;

        $account__slider.slick("slickSetOption", "accessibility", true);
        $account__slider.slick("slickSetOption", "draggable", true);
        $account__slider.slick("slickSetOption", "swipe", true);
        $account__slider.slick("slickSetOption", "touchMove", true);
        activeEvent = false;
        activeSwipe = false;
      }, 1900);

    }

    // если кликнули не на четвертый таб
    else {

      $('.tab-item').each(function() {
        if ($(this).attr('data-indexitem') == 4) {return;}
        if ($(this).attr('data-indexitem') < index){
          globalWidth += $(this).width() + parseInt($(this).css('margin-right').slice(0, -2));
        } else {
          return false;
        }
        
      });

      $(active).animate({'bottom' : '40'}, 500);
    
      $(active).animate({'left' : -globalWidth + fourItemLeft }, 900);

      let activeWidth =  $(active).width() + parseInt($(active).css('margin-right').slice(0, -2));

      setTimeout(function() {
        $('.tab-item').each(function(){
          if ($(this).attr('data-indexitem') == 4) return;

          let leftValue = $(this).attr('data-indexitem') < index
          ? activeWidth + fourItemLeft
          : fourItemLeft;

          $(this).animate({'left' : leftValue }, 900);
        });
      }, 500);

      $(active).animate({'bottom' : '0'}, 500);

      setTimeout(function() {
        $('.account__descr-text--active').toggleClass('account__descr-text--active');
        $('.account__descr-text[data-indexitem=' + arr[index] + ']').toggleClass('account__descr-text--active').css({'display':'none'});
        $('.account__descr-text--active').fadeIn(950);
      }, 950);

      setTimeout(function() {
        $('.account__descr').css({'padding-top':'0'});
        $('.item--active-opacity').toggleClass('item--active-border');

        let newZeroItem = $('.tab-item[data-indexitem=' + index + ']');
        $('.account__tabs').prepend(newZeroItem);
        let newFourItem = $('.tab-item[data-indexitem=' + 4 + ']');
        $('.account__tabs').prepend(newFourItem);

        $('.tab-item[data-indexitem=' + index + ']').css({'left':-fourItemLeft});

        $('.tab-item').each(function(key){
          if (key != 0) {
            arr[key-1] = +$(this).attr('data-indexid');
            $(this).css({'left':fourItemLeft});
            $(this).attr('data-indexitem', key-1);
          }
        });



        $('.account__slide').each(function () {
          arrSlides.push(this.outerHTML);
        });


        let i = 4;
        for (let i = 4; i >= 0; i--){
          if (i != index) {
            $account__slider.slick('slickRemove', i);
          }
        };

        for (let i = 0; i < 5; i++) {
          if (i != index){
            $('.account__slider').slick('slickAdd', arrSlides[i]);
          }
        }

        $account__slider.find('.slick-arrow').attr('style','display: none;');

        arrSlides.length = 0;
        
        $account__slider.slick("slickSetOption", "accessibility", true);
        $account__slider.slick("slickSetOption", "draggable", true);
        $account__slider.slick("slickSetOption", "swipe", true);
        $account__slider.slick("slickSetOption", "touchMove", true);
        activeEvent = false;
        activeSwipe = false;
      }, 1900);
    }

  }


  $('.tab-item').on('click', function(){
    animateSlider(this);
  });

  $account__slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
    let active = '.tab-item[data-indexitem=' + nextSlide + ']';
    animateSlider(active);
  });

  $(".scroll-down").on('click',function () {
    let elementClick = $(this).attr("href")
    let destination = $(elementClick).offset().top + $(this).height() + 25;
    $("*").animate({scrollTop: destination}, 1000);
  });
  
  function scrollbarWidth() {
    var documentWidth = parseInt(document.documentElement.clientWidth);
    var windowsWidth = parseInt(window.innerWidth);
    var scrollbarWidth = windowsWidth - documentWidth;
    return scrollbarWidth;
  }
 });
