import { getTranslate, minMax, getValue } from "./helpers";

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

    this.scroll = { top: 0, bottom: this.windowheight };
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

      element.transform = { x: 0, y: 0 };
      element.computed = { top: 0, left: 0, right: 0, bottom: 0 };
      element.inView = false;
      element.visible = false;
      element.scrolled = 0

      element.updates = [];
      if (element.offset) element.updates.push(["offset", element.offset]);
      if (element.duration) element.updates.push(["duration", element.duration]);


      if (element.onMouseOver || element.onMouseEnter || element.onMouseLeave) {
        element.mouseover = false;
        element.mousemoveEvent = this.addEvent('mousemove',() => {
          this.handleElementMouseOver(element)
        })
      }

      this.updateElement(element);
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
    this.elements.push({ ...options, el });
    el.setAttribute("data-element","");
  }

  addEvent(type, fn){
    let id = Object.keys(this.events[type]).length
    this.events[type][id] = fn
    return id
  }



  // REMOVE //////////////////////////////////////////////////////////////////////////////////////

  removeSection(el){
    let index = this.sections.findIndex(e => e.el == el)
    this.sections.splice(index,1)
  }

  removeElement(el){
    let index = this.elements.findIndex(e => e.el == el)
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
      let duration = section.bottom - offset;
      let scrolled = minMax(this.scroll - offset, 0, duration);
      let percent = minMax(scrolled / duration, 0, 1);

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

  checkElement(element, fn){
    let padding = this.windowheight / 4
    let inView = element.computed.top - padding <= this.scroll.bottom && element.computed.bottom + padding >= this.scroll.top;
    let visible = element.computed.top <= this.scroll.bottom && element.computed.bottom >= this.scroll.top;

    if (inView || element.inView){

      let offset = Math.max(element.top - this.windowheight, 0);
      let duration = element.computed.bottom - offset;
      let scrolled = minMax(this.scroll.top - offset, 0, duration);
      let percent = minMax(scrolled / duration, 0, 1);

      if (element.onEnter && visible && !section.visible) element.onEnter(this.direction,this.smooth);
      if (element.onScroll && (visible || section.visible)) element.onScroll({ scrolled, percent },this.smooth);
      if (element.onLeave && !visible && section.visible) element.onLeave(this.direction,this.smooth);

      if (element.onMouseOver || element.onMouseEnter || element.onMouseLeave) this.handleElementMouseOver(element)

      element.inView = inView;
      element.visible = visible;

      if (this.smooth || element.mobile){
        if (element.x) element.transform.x = (scrolled * -element.x) / 10;
        if (element.y) element.transform.y = (scrolled * -element.y) / 10;
        if (element.rotate) element.transform.rotate = scrolled * element.rotate / 100

        this.transform(element.el, element.transform.x, element.transform.y, element.transform.rotate);
      }

      element.computed.top = element.top + element.transform.y;
      element.computed.bottom = element.bottom + element.transform.y;
      element.computed.left = element.left + element.transform.x;
      element.computed.right = element.right + element.transform.x;

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
    this.updateSectionsAndElements();
  }

  updateScroll(scroll) {
    this.direction = scroll > this.scroll.top ? "down" : "up";
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

  updateSectionsAndElements() {
    this.sections.forEach(section => {

      let sb = section.el.getBoundingClientRect();
      let st = getTranslate(section.el) || {x:0,y:0}

      section.top = sb.top - st.y;
      section.bottom = section.top + sb.height;

      let elements = section.el.querySelectorAll("[data-element]");

      elements.forEach(el => {

        let element = this.elements.find(e => e.el == el)

        let eb = el.getBoundingClientRect();
        let et = getTranslate(el) || {x:0,y:0}

        element.top = eb.top - et.y - st.y;
        element.left = eb.left - et.x;
        element.bottom = element.top + eb.height;
        element.right = element.left + eb.width;

        element.computed.top = element.top + element.transform.y;
        element.computed.bottom = element.bottom + element.transform.y;
        element.computed.left = element.left + element.transform.x;
        element.computed.right = element.right + element.transform.x;

        this.updateElement(element);
      });
    });
  }

  updateElement(element) {
    element.updates.forEach(update => {
      let key = update[0]
      let value = update[1]
      element[key] = getValue(value, element.el);
    });
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


}
