import $ from 'jquery';


$('.mainBanner__backgrounds').slick({
  arrows: false,
  fade: true,
  asNavFor: '.mainBanner__testimonials'
});

$('.mainBanner__testimonials').slick({
  // autoplay: true,
  autoplaySpeed: 5000,
  asNavFor: '.mainBanner__backgrounds',
  infinite: true,
  arrows: false,
  dots: true
});
console.log('mainBanner');
