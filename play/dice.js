/* ============================================================
   dice.js — reusable animated dice roller (no dependencies)
   ------------------------------------------------------------
   Adapted for caul from the war-of-princes module. Game-agnostic
   and result-first: the caller decides the values (so game logic
   stays authoritative and testable) and this only animates toward
   them. Theme via the --dice-* CSS variables.

   Dice.roll({
     mount, dice:[{sides,value?,tag?,shape?}], duration, stagger,
     animateOnly:[i,...], classify:fn(die)->cls, renderFace:fn(die),
     onSettle:fn(dice)
   })
   Shapes: "d12" (pentagon SVG), "d6"/"square" (tile).
   ============================================================ */
(function (global) {
  "use strict";

  function reduceMotion() {
    return !!(global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  function rnd(sides) { return 1 + Math.floor(Math.random() * sides); }

  function faceText(die, renderFace) {
    if (renderFace) return renderFace(die);
    return String(die.value);
  }
  function writeFace(die, text) {
    if (die.numEl) die.numEl.textContent = text;
    else die.el.textContent = text;
  }
  function shapeSVG(shape) {
    if (shape === "d12") {
      // pentagon silhouette (reads as a polyhedral die) + faint facets
      return '<svg class="dice-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
             '<polygon class="dice-poly" points="50,4 94,37 77,94 23,94 6,37"/>' +
             '<path class="dice-facet" d="M50,4 L50,56 M6,37 L50,56 L94,37 M23,94 L50,56 L77,94"/>' +
             '</svg>';
    }
    return "";
  }

  function roll(opts) {
    var mount = opts.mount;
    if (!mount) throw new Error("Dice.roll: opts.mount is required");
    if (mount._dice && mount._dice.cancel) mount._dice.cancel();

    var duration = opts.duration != null ? opts.duration : 620;
    var stagger  = opts.stagger  != null ? opts.stagger  : 60;
    var classify = opts.classify || function () { return ""; };
    var renderFace = opts.renderFace;
    var animateOnly = opts.animateOnly;
    var animate = !reduceMotion();

    var dice = (opts.dice || []).map(function (spec, i) {
      var sides = spec.sides || 12;
      return {
        sides: sides,
        value: (spec.value != null) ? spec.value : rnd(sides),
        tag: spec.tag || "",
        shape: spec.shape || opts.shape || "square",
        index: i
      };
    });

    var stage = document.createElement("div");
    stage.className = "dice-stage";
    dice.forEach(function (die) {
      var el = document.createElement("div");
      el.className = "dice-die shape-" + die.shape + (die.tag ? " " + die.tag : "");
      var svg = shapeSVG(die.shape);
      if (svg) { el.innerHTML = svg + '<span class="dice-num"></span>'; die.numEl = el.querySelector(".dice-num"); }
      die.el = el;
      stage.appendChild(el);
    });
    mount.innerHTML = "";
    mount.appendChild(stage);

    var timers = [], intervals = [], remaining = dice.length, finished = false;

    function settle(die) {
      var cls = "dice-die shape-" + die.shape + " settling";
      if (die.tag) cls += " " + die.tag;
      var extra = classify(die);
      if (extra) cls += " " + extra;
      die.el.className = cls;
      writeFace(die, faceText(die, renderFace));
    }
    function finish() {
      if (finished) return;
      finished = true;
      if (opts.onSettle) opts.onSettle(dice);
    }
    function shouldAnimate(die) {
      if (!animate) return false;
      if (!animateOnly) return true;
      return animateOnly.indexOf(die.index) !== -1;
    }

    if (!dice.length) { finish(); return { stage: stage, dice: dice, cancel: function () {} }; }

    dice.forEach(function (die) {
      if (!shouldAnimate(die)) {
        settle(die);
        if (--remaining === 0) finish();
        return;
      }
      die.el.classList.add("rolling");
      var iv = setInterval(function () { writeFace(die, String(rnd(die.sides))); }, 70);
      intervals.push(iv);
      var t = setTimeout(function () {
        clearInterval(iv);
        settle(die);
        if (--remaining === 0) finish();
      }, duration + die.index * stagger);
      timers.push(t);
    });

    timers.push(setTimeout(finish, duration + dice.length * stagger + 300));

    var handle = {
      stage: stage,
      dice: dice,
      cancel: function () { intervals.forEach(clearInterval); timers.forEach(clearTimeout); }
    };
    mount._dice = handle;
    return handle;
  }

  global.Dice = { roll: roll };
})(window);
