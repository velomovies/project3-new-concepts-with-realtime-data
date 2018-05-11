'use strict';

(function () {

  var shapes = document.querySelector('.st6');
  var infoBoxes = document.querySelectorAll('.st7');

  // tl.staggerFromTo(shapes, 1, {drawSVG:"100%"}, {drawSVG:"50% 50%"}, 0.1)
  // .fromTo(shapes, 0.1, {drawSVG:"0%"}, {drawSVG:"10%", immediateRender:false}, "+=0.1")
  // .staggerTo(shapes, 1, {drawSVG:"90% 100%"}, 0.5)
  // .to(shapes, 1, {scale:0.5, drawSVG:"100%", stroke:"white", strokeWidth:6, transformOrigin:"50% 50%"})
  // .staggerTo(shapes, 0.5, {stroke:"red", scale:1.5, opacity:0}, 0.2)

  var infinity = document.querySelector('#infinity g circle');

  var app = {
    init: function init() {
      animation.init();
    },
    removeClasses: function removeClasses(classElement) {
      var elements = document.querySelectorAll('.' + classElement);
      console.log(elements);
      elements.forEach(function (el) {
        el.classList.remove(classElement);
      });
    }
  };

  var svg = {
    element: document.querySelector('svg'),
    followPathCircle: document.querySelector('#circlePath'),
    followPath: document.querySelector('animateMotion'),
    infoCircles: document.querySelectorAll('.st6'),
    infoBox: document.querySelector('#infoBox polygon')
  };

  var animation = {
    timeline: new TimelineMax(),
    time: 60,
    delay: function delay(i) {
      var delayArray = [animation.time / 11, animation.time / 4, animation.time / 2.65, animation.time / 2.02, animation.time / 1.62, animation.time / 1.29, animation.time / 1.09, animation.time / 1];
      return delayArray[i];
    },
    init: function init() {
      svg.followPathCircle.addEventListener('click', animation.loop);
    },
    loop: function loop() {
      svg.followPath.setAttribute('dur', animation.time + 's');
      svg.followPath.beginElement();
      animation.openInfo();
      svg.element.classList.remove('hidden');
    },
    openInfo: function openInfo() {
      svg.infoCircles.forEach(function (circle, i) {
        var delay = true;
        animation.hideInfo(circle, i);
        animation.showInfo(circle, i, delay);
        animation.hideInfo(circle, i, delay);

        circle.addEventListener('click', function (e) {
          if (!e.target.classList.contains('active')) {
            app.removeClasses('active');
            animation.hideInfo(circle, i);
            animation.showInfo(circle, i);
          } else {
            animation.hideInfo(circle, i);
          }
        });
      });

      var timelineCircle = new TimelineMax();
      timelineCircle.to(svg.followPathCircle, 1, { opacity: 0 }).delay(animation.delay(svg.infoCircles.length - 1) + 2);
    },
    showInfo: function showInfo(el, i, delay) {
      var timelineAnimation = new TimelineMax({ yoyo: true });

      timelineAnimation.add(function () {
        el.classList.add('active');
      }).from(el, 1, { scale: 0, transformOrigin: "50% 50%", ease: Elastic.easeOut }).to(infoBoxes[i], 0.3, { scaleY: 1, opacity: 1, y: 0, transformOrigin: "0% 100%", ease: Back.easeOut });

      if (delay) {
        timelineAnimation.delay(animation.delay(i));
      }
    },
    hideInfo: function hideInfo(el, i, delay) {

      infoBoxes.forEach(function (infoBox) {
        var timelineAnimationBack = new TimelineMax({ yoyo: true });

        timelineAnimationBack.add(function () {
          el.classList.remove('active');
        }).to(infoBox, 0.3, { scaleY: 0, opacity: 0, y: 100, transformOrigin: "0% 100%", ease: Back.easeOut });

        if (delay) {
          timelineAnimationBack.delay(animation.delay(i + 1));
        }
      });
    }
  };
  app.init();
})();