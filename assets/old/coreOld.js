import { getTransform, minMax, getValue, rotateRect } from "./helpers";

export default class {
  constructor(options) {

    Object.assign(this,options)

    this.elements = [];
    this.sections = [];

    this.events = {
      scroll: {},
      resize: {},
      mousemove: {},
      mouseup: {}
    };

    this.windowheight = 0;
    this.windowwidth = 0;
    this.limit = 0;

    this.scroll = { top: 0, bottom: this.windowheight, diff: 0 };
    this.direction = 'down'
    this.mouse = { x: 0, y: 0 };

    this.init()

  }



  // INIT ///////////////////////////////////////////////////////////////////////////////////////

  init() {
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    window.addEventListener("resize", this.handleResize);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);

  }

  initLoad(){
    window.scrollTo(0,0)
    this.scroll = {top: 0, bottom: this.windowheight}

    this.initSections();
    this.initElements();
    this.update();

  }

  initSections() {
    this.sections.forEach(section => {
      section.inView = false;
      section.visible = false;
    })
  }

  initElements() {
    this.elements.forEach(element => {

      let options = element.options
      delete element.options

      element.computed = { top: 0, left: 0, right: 0, bottom: 0 };
      element.position = { top: 0, left: 0, right: 0, bottom: 0 };
      element.inView = false
      element.visible = false;
      element.scrolled = 0
      element.duration = 0
      element.offsetTop = 0
      element.offsetBottom = 0

      if (element.onMouseOver || element.onMouseEnter || element.onMouseLeave) {
        element.mouseover = false;
        element.mousemoveEvent = this.addEvent('mousemove',() => this.handleElementMouseOver(element))
      }

      this.updateElement(element,options)
      this.updateComputed(element)

    });
  }



  // ADD ///////////////////////////////////////////////////////////////////////////////////////

  addWindow(el) {
    this.el = el;
  }

  addSection(el, options = {}) {
    this.sections.push({ ...options, el });
  }

  addElement(el, options = {}) {
    this.elements.push({options, el });
    el.setAttribute("data-element","");
  }

  addEvent(type, fn){
    let id = Object.keys(this.events[type]).length
    this.events[type][id] = fn
    return id
  }



  // REMOVE //////////////////////////////////////////////////////////////////////////////////////

  removeSection(el){
    let index = this.find(el,this.sections,true)
    this.sections.splice(index,1)
  }

  removeElement(el){
    let index = this.find(el,this.elements,true)
    let element = this.elements[index]

    if (element.mousemoveEvent){
      delete this.events.mousemove[element.mousemoveEvent]
    }

    this.elements.splice(index,1)
  }



  // CHECK //////////////////////////////////////////////////////////////////////////////////////

  checkSection(section){
    let padding = this.windowheight
    let inView = section.top - padding <= this.scroll.bottom && section.bottom + padding >= this.scroll.top;
    let visible = section.top <= this.scroll.bottom && section.bottom >= this.scroll.top;

    if (inView || section.inView){

      let offset = Math.max(section.top - this.windowheight, 0);
      let limit = section.bottom - offset;
      let scrolled = minMax(this.scroll - offset, 0, limit);
      let percent = minMax(scrolled / limit, 0, 1);

      if (section.onEnter && visible && !section.visible) section.onEnter(this.direction, this.smooth);
      if (section.onScroll && (visible || section.visible)) section.onScroll({ scrolled, percent },this.smooth);
      if (section.onLeave && !visible && section.visible) section.onLeave(this.direction,this.smooth);

      if (inView && !section.inView) {
        section.el.style.opacity = "";
        section.el.style.pointerEvents = "";
      }

      if (!inView && section.inView) {
        section.el.style.opacity = 0;
        section.el.style.pointerEvents = "none";
      }

      section.inView = inView;
      section.visible = visible;

    }
  }

  checkElement(element){

    let {computed, offsetTop, offsetBottom, inside, duration, inView} = element
    let {top, bottom} = this.scroll

    offsetTop += inside ? element.height : 0
    offsetBottom += inside ? element.height : 0

    let scrolltop = (duration || top) + offsetTop
    let scrollbottom = (inView ? top + element.top : bottom) - offsetBottom
    let visible = computed.top <= scrollbottom && computed.bottom >= scrolltop

    console.log(element)

    if (visible || element.visible){

      let limit = scrollbottom - scrolltop + element.height
      let scrolled = visible ? scrollbottom - computed.top : this.direction == 'down' ? limit : 0
      let percent = scrolled / limit

      if (element.onEnter && visible && !element.visible) element.onEnter(this.direction,this.smooth);
      if (element.onScroll && (visible || element.visible)) element.onScroll({ scrolled, percent },this.smooth);
      if (element.onLeave && !visible && element.visible) element.onLeave(this.direction,this.smooth);
      if (element.onMouseOver || element.onMouseEnter || element.onMouseLeave) this.handleElementMouseOver(element)


      if (element.transform && this.smooth || element.mobile){

        let amount = element.transform.d ? this.scroll.diff : scrolled

        if (element.transform.x) transform.x = amount * (-element.transform.x / 10);
        if (element.transform.y) transform.y = amount * (-element.transform.y / 10);
        if (element.transform.r) transform.r = amount * (element.transform.r / 100)

        element.transform.values = transform

        this.transform(element.el, transform.x, transform.y, transform.r);
        this.updateComputed(element, transform)

      }

      element.visible = visible

    }
  }



  // HANDLE //////////////////////////////////////////////////////////////////////////////////////

  handleResize() {
    if (!this.smooth) return
    Object.keys(this.events.resize).forEach(key => {
      this.events.resize[key]()
    })

    this.update();
    this.checkScroll(true);
  }

  handleMouseMove(e) {
    this.mouse.y = this.scroll.top + e.clientY;
    this.mouse.x = e.clientX;

    Object.keys(this.events.mousemove).forEach(key => {
      this.events.mousemove[key](e)
    })

  }

  handleMouseUp() {
    Object.keys(this.events.mouseup).forEach(key => {
      this.events.mouseup[key]()
    })
  }

  handleElementMouseOver(el) {
    let computed = el.computed;
    let mouseover =
      this.mouse.y >= computed.top &&
      this.mouse.y <= computed.bottom &&
      this.mouse.x >= computed.left &&
      this.mouse.x <= computed.right;

    let computedHeight = computed.bottom - computed.top;
    let computedWidth = computed.right - computed.left;
    let computedMouse = {
      x: minMax(this.mouse.x - computed.left, 0, computedWidth),
      y: minMax(this.mouse.y - computed.top, 0, computedHeight)
    };

    if (el.onMouseEnter && mouseover && !el.mouseover) el.onMouseEnter(this.mouse, this.smooth);
    if (el.onMouseLeave && !mouseover && el.mouseover) el.onMouseLeave(this.mouse, this.smooth);
    if (el.onMouseOver && mouseover) el.onMouseOver(computedMouse, this.smooth);

    el.mouseover = mouseover;
  }



  // UPDATE //////////////////////////////////////////////////////////////////////////////////////

  update() {
    this.updateWindow();
    this.updateSections();
  }

  updateScroll(scroll) {
    this.direction = scroll > this.scroll.top ? "down" : "up";
    this.scroll.diff = scroll - this.scroll.top
    this.mouse.y += scroll - this.scroll.top;
    this.scroll.top = scroll;
    this.scroll.bottom = scroll + this.windowheight

    Object.keys(this.events.scroll).forEach(key => {
      this.events.scroll[key](e)
    })

    this.sections.forEach(s => this.checkSection(s))
    this.elements.forEach(e => this.checkElement(e))
  }

  updateWindow() {
    this.windowheight = window.innerHeight;
    this.windowwidth = window.innerWidth;
    this.limit = this.el.offsetHeight - this.windowheight;
  }

  updateSections() {
    this.sections.forEach(section => {

      let sb = section.el.getBoundingClientRect();
      let st = getTransform(section.el)

      section.top = sb.top - st.y;
      section.bottom = section.top + sb.height;

      let elements = section.el.querySelectorAll("[data-element]");

      elements.forEach(el => {

        let element = this.find(el, this.elements)

        let eb = el.getBoundingClientRect();
        let et = getTransform(el)
        let r = rotateRect(et.r,element.el.offsetHeight,element.el.offsetWidth)

        let position = {}

        position.height = el.offsetHeight;
        position.width = el.offsetWidth;
        position.top = eb.top - et.y - st.y - r.top;
        position.left = eb.left - et.x - r.left;
        position.bottom = position.top + position.height
        position.right = position.left + position.width
        position.inView = position.top < this.windowheight

        element.position = position

        if (element.updates){
          if (update.offsetTop) element.offsetTop = getValue(element.updates.offsetTop,element.el)
          if (update.offsetBottom) element.offsetBottom = getValue(element.updates.offsetBottom,element.el)
          if (update.duration) element.duration = getValue(element.updates.duration, element.el)
        }

      });
    });
  }

  updateComputed(element, transform = {x:0, y:0, r: 0}){

    element.computed.top = element.position.top + transform.y;
    element.computed.bottom = element.position.bottom + transform.y;
    element.computed.left = element.position.left + transform.x;
    element.computed.right = element.position.right + transform.x;

    if (transform.r){
      let r = rotateRect(transform.r,element.height,element.width)
      element.computed.top -= r.top
      element.computed.left -= r.left
      element.computed.bottom += r.bottom
      element.computed.right += r.right
    }
  }

  updateElement(element, options) {

    let transform = {}
    let updates = {}

    if (options.delta) transform.d = options.delta
    if (options.rotate) transform.r = options.rotate
    if (options.x) transform.x = options.x
    if (options.y) transform.y = options.y

    if (options.offsetTop || options.offset) updates.offsetTop = options.offsetTop || options.offset;
    if (options.offsetBottom || options.offset) updates.offsetBottom = options.offsetBottom || options.offset;
    if (options.duration) updates.duration = options.duration

    if (Object.keys(transform) > 0) element.transform = transform
    if (Object.keys(updates) > 0) element.updates = updates
  }


  // TRANSFORM //////////////////////////////////////////////////////////////////////////////////////

  transform(el, x = 0, y = 0, r = 0) {
    let transform = ""
    if (x || y) transform = `matrix3d(1,0,0.00,0,0.00,1,0.00,0,0,0,1,0,${x},${y},0,1) `;
    if (r) transform += `rotate3d(0,0,1,${r}deg)`

    el.style.webkitTransform = transform;
    el.style.msTransform = transform;
    el.style.transform = transform;
  }



  // FIND /////////////////////////////////////////////////////////////////////////////////////////

  find(el,array,index){
    return index
    ? array.findIndex(e => e.el == el)
    : array.find(e => e.el == el)
  }

}
