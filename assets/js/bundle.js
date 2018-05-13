'use strict';

(function () {

  var shapes = document.querySelector('.st6');
  var infoBoxes = document.querySelectorAll('.st7');

  // tl.staggerFromTo(shapes, 1, {drawSVG:'100%'}, {drawSVG:'50% 50%'}, 0.1)
  // .fromTo(shapes, 0.1, {drawSVG:'0%'}, {drawSVG:'10%', immediateRender:false}, '+=0.1')
  // .staggerTo(shapes, 1, {drawSVG:'90% 100%'}, 0.5)
  // .to(shapes, 1, {scale:0.5, drawSVG:'100%', stroke:'white', strokeWidth:6, transformOrigin:'50% 50%'})
  // .staggerTo(shapes, 0.5, {stroke:'red', scale:1.5, opacity:0}, 0.2)

  var infinity = document.querySelector('#infinity g circle');

  var app = {
    init: function init() {
      animation.init();
      water.animation();
      catfish.draggable();
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
    aquaponics: document.querySelector('#aquaponics'),
    followPathCircle: document.querySelector('#circlePath'),
    followPath: document.querySelector('animateMotion'),
    infoCircles: document.querySelectorAll('.st6'),
    infoBoxes: document.querySelectorAll('#infoBox g.infoBoxGroup'),
    water: document.querySelector('#water'),
    waterClipped: document.querySelector('#clip-path-water'),
    waterOne: document.querySelector('#clipped-water path'),
    waterTwo: document.querySelector('#clipped-water2 path'),
    catfish: document.querySelector('#catfish'),
    lettuce: document.querySelector('#lettuce .green'),
    roots: document.querySelector('.roots')
  };

  var water = {
    speed: 20,
    animation: function animation() {
      var timelineWater = new TimelineMax();
      var timelineWater2 = new TimelineMax();
      timelineWater.to(svg.waterOne, water.speed, { x: -1435, repeat: -1, ease: Power0.easeNone });
      timelineWater2.to(svg.waterTwo, water.speed, { x: -835, repeat: -1, ease: Power0.easeNone });
    }
  };

  var catfish = {
    draggable: function draggable() {
      Draggable.create(svg.catfish, { type: 'x,y', edgeResistance: 0.65, bounds: svg.element, onRelease: catfish.inWater });
    },
    inWater: function inWater() {
      if (this.hitTest(svg.waterClipped, '80%')) {
        Draggable.get(svg.catfish).disable();
        animation.loop();
        catfish.putInWater();
        console.log('the fish is in the water');
      }
    },
    putInWater: function putInWater() {
      var timelineInWater = new TimelineMax();
      timelineInWater.to(svg.catfish, 1, { scale: .3, x: 300, y: 375, transformOrigin: '50% 50%', ease: Back.easeOut });
      catfish.swim();
    },
    swim: function swim() {
      var timelineSwim = new TimelineMax();
      timelineSwim.fromTo(svg.catfish, 1, { rotation: 10 }, { rotation: -10, yoyo: true, repeat: -1, ease: Power0.easeNone });
    }
  };

  var lettuce = {
    grow: function grow() {
      var timelineLettuce = new TimelineMax();
      var timelineRoots = new TimelineMax();

      timelineRoots.fromTo(svg.roots, animation.delay(svg.infoCircles.length - 1), { scaleY: 0 }, { scaleY: 1 }).delay(animation.delay(0));

      timelineLettuce.fromTo(svg.lettuce, animation.delay(svg.infoCircles.length), { opacity: 0, scale: 0.2, yPercent: 30, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, yPercent: 0 }).add(function () {
        lettuce.harvest(timelineLettuce);
      });
    },
    harvest: function harvest(tl) {
      tl.to(svg.lettuce, 0.5, { opacity: 0.9, scale: 0.9, ease: Power0.easeNone, yoyo: true, repeat: -1 });
      svg.lettuce.addEventListener('click', function () {
        animation.hideInfo();
        animation.harvested(tl);
        console.log('harvested the lettuce!');
      });
    }
  };

  var animation = {
    time: 30,
    init: function init() {
      TweenMax.to(svg.aquaponics, 1, { xPercent: 35, ease: Back.easeOut });
    },
    harvested: function harvested(tl) {
      svg.element.classList.add('hidden');
      svg.catfish.classList.add('hidden');
      tl.to(svg.lettuce, 1, { scale: 2, x: '50' });
      TweenMax.to(svg.aquaponics, 1, { xPercent: -42.5, ease: Back.easeOut });
    },
    delay: function delay(i) {
      var delayArray = [animation.time / 11, animation.time / 4, animation.time / 2.65, animation.time / 2.02, animation.time / 1.62, animation.time / 1.29, animation.time / 1.09, animation.time / 1];
      return delayArray[i];
    },
    loop: function loop() {
      svg.followPath.setAttribute('dur', animation.time + 's');
      svg.followPath.beginElement();
      lettuce.grow();
      animation.openInfo();
      TweenMax.to(svg.aquaponics, 1, { xPercent: 0, ease: Back.easeOut });
      svg.element.classList.remove('hidden');
    },
    openInfo: function openInfo() {

      var timelineCircle = new TimelineMax();

      timelineCircle.to(svg.followPathCircle, 1, { opacity: 0 }).delay(animation.delay(svg.infoCircles.length - 1));

      svg.infoCircles.forEach(function (circle, i) {
        var delay = true;
        animation.hideInfo();
        animation.showInfo(circle, i, delay);
        animation.hideInfo(i, delay, circle);

        circle.addEventListener('click', function (e) {
          if (!e.target.classList.contains('active')) {
            animation.hideInfo();
            animation.showInfo(circle, i);
          } else {
            animation.hideInfo();
          }
        });
      });
    },
    showInfo: function showInfo(el, i, delay) {
      var timelineAnimation = new TimelineMax({ yoyo: true });

      timelineAnimation.add(function () {
        el.classList.add('active');
      }).from(el, 1, { scale: 0, transformOrigin: '50% 50%', ease: Elastic.easeOut, immediateRender: true }).to(svg.infoBoxes[i].querySelector('polygon'), 0.3, { scaleY: 1, opacity: 1, y: 0, transformOrigin: '0% 100%', ease: Back.easeOut }, '-=1').to(svg.infoBoxes[i].querySelector('.infoText'), 0.5, { opacity: 1, scaleY: 1, transformOrigin: '0% 100%', ease: Back.easeOut }, '+=-1');

      if (delay) {
        timelineAnimation.delay(animation.delay(i));
      }
    },
    hideInfo: function hideInfo(i, delay, el) {
      svg.infoBoxes.forEach(function (infoBox) {
        var timelineAnimationBack = new TimelineMax({ yoyo: true });

        timelineAnimationBack.to(infoBox.querySelector('polygon'), 0.3, { scaleY: 0, opacity: 0, y: 100, transformOrigin: '0% 100%', ease: Back.easeOut, onComplete: app.removeClasses('active') }).to(infoBox.querySelector('.infoText'), 0.5, { opacity: 0, scaleY: 0, transformOrigin: '0% 100%', ease: Back.easeOut }, '+=-0.5');

        if (delay) {
          timelineAnimationBack.add(function () {
            el.classList.remove('active');
          }, '+=-1').delay(animation.delay(i + 1));
        }
      });
    }
  };

  app.init();
})();