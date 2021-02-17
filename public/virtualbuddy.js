function runVirtualBuddy() {
  let isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  let scroll = {
      top: 0,
      bottom: 0,
      last: 0,
      diff: 0,
      direction: null,
      create: createScrollItem
    },
    resize = {
      width: window.innerHeight,
      height: window.innerHeight,
      create: createResizeItem
    },
    mouse = {
      x: 0,
      y: 0
    },
    smooth = {
      create: createSmooth,
      destroy: destroySmooth
    },
    $smooth = {
      on: false,
      height: 0,
      inertia: 0,
      limit: 0,
      el: null,
      container: null;
    },
    $scroll = {
      busy: false,
      itemsBusy: false,
      functions: [],
      items: []
    },
    $resize = {
      items: [],
      functions: []
    };

  window.virtualbuddy = { scroll, resize, mouse, smooth };
  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleResize);
  window.addEventListener("mousemove", handleMouse);

  // SMOOTH //////////////////////////////////////////

  function createSmooth(options = {}) {
    options.el = options.el || "body";
    options.container = options.container || "html";

    $smooth.el = document.querySelector(options.el);
    $smooth.container = document.querySelector(options.container);
    $smooth.limit = options.limit || 0;
    $smooth.inertia = options.inertia ? options.inertia * 0.1 : 0.1;
    toogleSmooth();
    setSmoothHeight();
  }

  function destroySmooth() {
    smoothOff();
    $smooth.el = null;
    $smooth.container = null;
    $smooth.limit = 0;
    $smooth.inertia = 0;
  }

  function smoothOn() {
    let offset = scroll.top;
    $smooth.on = true;

    $smooth.container.style.cssText = `height:${$smooth.el.offsetHeight}px;`;

    $smooth.el.style.cssText = `position:fixed;
                                top: ${$smooth.el.offsetTop}px;
                                left: 0px;
                                right: 0px;
                                transform: translateY(${-offset}px);`;

    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overscrollBehavior = "none";
  }

  function smoothOff() {
    $smooth.on = false;
    $smooth.el.style.cssText = "";
    $smooth.container.style.cssText = "";
    document.documentElement.style.overscrollBehavior = "";
    document.body.style.overscrollBehavior = "";
  }

  function checkSmooth() {
    let scrollY = lerp(scroll.top, window.scrollY, $smooth.inertia);
    if (Math.abs(scrollY - window.scrollY) < 0.02) scrollY = window.scrollY;
    $scroll.busy = scrollY != window.scrollY;

    updateScroll(scrollY);

    window.requestAnimationFrame(() => {
      runScroll();
      transform($smooth.el, { y: -scroll.top });
      if ($scroll.busy) checkSmooth();
    });
  }

  function toogleSmooth() {
    if (resize.width < $smooth.limit && $smooth.on) smoothOff();
    if (resize.width >= $smooth.limit && !$smooth.on) smoothOn();
  }

  function setSmoothHeight() {
    $smooth.height = $smooth.el.offsetHeight;
    $smooth.container.style.height = $smooth.height + "px";
  }

  // SCROLL //////////////////////////////////////////

  function handleScroll() {
    if ($scroll.busy) return;
    $smooth.on ? checkSmooth() : checkScroll();
  }

  function checkScroll() {
    updateScroll(window.scrollY);
    $scroll.busy = true;
    window.requestAnimationFrame(() => {
      runScroll();
      $scroll.busy = false;
      if ($scroll.itemsBusy) runItems();
    });
  }

  function updateScroll(scrollY) {
    scroll.last = scroll.top;
    scroll.top = scrollY;
    scroll.bottom = scroll.top + resize.height;
    scroll.diff = scroll.top - scroll.last;
    scroll.direction =
      scroll.diff > 0 ? "down" : scroll.diff < 0 ? "up" : "stopped";
  }

  function runScroll() {
    $scroll.items.forEach(item => {
      let visible = isVisible(item.pos);
      if (!item.visible && !visible) return;

      item.entering = visible && !item.visible;
      item.leaving = !visible && item.visible;
      item.visible = visible;

      item.realProgress =
        1 - clamp((item.pos.bottom - scroll.top) / item.duration);

      !item.busy && runItem(item);
    });
  }

  function runItem(item) {
    let progress = clamp(lerp(item.progress, item.realProgress, item.inertia));
    item.progress =
      Math.abs(progress - item.realProgress) < 0.001
        ? item.realProgress
        : progress;
    item.busy = item.progress != item.realProgress;

    item.onEnter && item.entering && item.onEnter({ ...scroll, progress });
    item.onLeave && item.leaving && item.onLeave({ ...scroll, progress });
    item.onScroll && item.visible && item.onScroll({ ...scroll, progress });

    item.busy && window.requestAnimationFrame(() => runItem(item));
  }

  function createScrollEvent(fn) {
    $scroll.functions.push(fn);
  }

  function createScrollItem(el, options = {}) {
    el = typeof el == "string" ? document.querySelector(el) : el;

    let pos = getPosition(el);
    let onEnter = options.onEnter || null;
    let onLeave = options.onLeave || null;
    let onScroll = options.onScroll || null;
    let inertia = options.inertia ? options.inertia * 0.01 : 1;
    let duration =
      pos.top < resize.height ? pos.bottom : pos.height + resize.height;
    let progress = 0;
    let visible = false;
    let realProgress = 0;
    let entering = false;
    let leaving = false;
    let busy = false;

    $scroll.items.push({
      el,
      pos,
      onEnter,
      onLeave,
      onScroll,
      visible,
      inertia,
      duration,
      progress,
      realProgress,
      entering,
      leaving,
      busy
    });
  }

  function isVisible(pos) {
    return pos.top - 300 < scroll.bottom && pos.bottom + 300 > scroll.top;
  }

  // RESIZE //////////////////////////////////////////

  function handleResize() {
    if (isMobile && !changedOrientation()) return
    updateResize();
    handleScroll();
  }

  function updateResize() {
    resize.height = window.innerHeight;
    resize.width = window.innerWidth;

    if ($smooth.on) setSmoothHeight();
    if ($smooth.limit) toogleSmooth();

    $scroll.items.forEach(item => {
      item.pos = getPosition(item.el);
      item.duration =
        item.pos.top < resize.height
          ? item.pos.bottom
          : item.pos.height + resize.height;
    });
  }

  function createResizeItem() {}

  // MOUSE //////////////////////////////////////////

  function handleMouse() {}

  // HELP //////////////////////////////////////////

  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  function transform(el, { x = 0, y = 0, r = 0, s = 1 }) {
    let rad = r * (Math.PI / 180);
    let dx = Math.cos(rad) * s;
    let dy = Math.sin(rad) * s;
    let transform = `matrix(${dx},${dy},${-dy},${dx},${x},${y})`;
    el.style.webkitTransform = transform;
    el.style.msTransform = transform;
    el.style.transform = transform;
  }
  
  function changed orientation(){
    return resize.width !== window.innerWidth
  }

  function log(content) {
    console.log(content);
  }

  function clamp(num, max = 1, min = 0) {
    return Math.max(Math.min(num, max), min);
  }

  function getTransform(el) {
    let transform = { x: 0, y: 0, r: 0, s: 1 };

    if (window.getComputedStyle) {
      let style = getComputedStyle(el, null);

      let ts =
        style.getPropertyValue("-webkit-transform") ||
        style.getPropertyValue("-moz-transform") ||
        style.getPropertyValue("-ms-transform") ||
        style.getPropertyValue("-o-transform") ||
        style.getPropertyValue("transform");

      let mat = ts.match(/^matrix\((.+)\)$/);

      if (mat) {
        let m = mat[1].split(",").map(v => parseFloat(v));

        let angle = Math.atan2(m[1], m[0]);
        let denom = Math.pow(m[0], 2) + Math.pow(m[1], 2);
        let scaleX = Math.sqrt(denom);
        let scaleY = (m[0] * m[3] - m[2] * m[1]) / scaleX;
        let skewX = Math.atan2(m[0] * m[2] + m[1] * m[3], denom);

        transform.x = m[4];
        transform.y = m[5];
        transform.r = angle / (Math.PI / 180);
        transform.s = scaleY;
      }
    }
    return transform;
  }

  function getPosition(el) {
    let w = el.offsetWidth;
    let h = el.offsetHeight;

    let bounds = el.getBoundingClientRect();
    let t = getTransform(el);
    let offset = getOffset(t.x, t.y, t.r, t.s, h, w);
    let position = {};

    position.height = h;
    position.width = w;
    position.top = scroll.top + bounds.top - offset.y + offset.ry - offset.sy;
    position.left = bounds.left - offset.x + offset.rx - offset.sy;
    position.bottom = position.top + position.height;
    position.right = position.left + position.width;

    return position;
  }

  function getOffset(x = 0, y = 0, r = 0, s = 1, h = 0, w = 0) {
    let sh = h * s;
    let sw = w * s;
    let sx = (w - sw) / 2;
    let sy = (h - sh) / 2;
    let rx = 0;
    let ry = 0;

    if (r !== 0) {
      let a = (r * Math.PI) / 180;
      let xAx = Math.cos(a);
      let xAy = Math.sin(a);
      let xc = 0;
      let yc = 0;
      let ox = sw / 2;
      let oy = sh / 2;
      xc -= ox;
      yc -= oy;

      let arr = [
        [xc * xAx - yc * xAy + ox, xc * xAy + yc * xAx + oy],
        [(xc + sw) * xAx - yc * xAy + ox, (xc + sw) * xAy + yc * xAx + oy],
        [
          (xc + sw) * xAx - (yc + sh) * xAy + ox,
          (xc + sw) * xAy + (yc + sh) * xAx + oy
        ],
        [xc * xAx - (yc + sh) * xAy + ox, xc * xAy + (yc + sh) * xAx + oy]
      ];

      rx = Math.max(arr[0][0], arr[1][0], arr[2][0], arr[3][0]) - sw;
      ry = Math.max(arr[0][1], arr[1][1], arr[2][1], arr[3][1]) - sh;
    }

    return { x, y, rx, ry, sx, sy };
  }
}

runVirtualBuddy();
