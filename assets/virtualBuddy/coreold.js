import { getTransform, getPosition, transform, minMax, getValue, getRotation, round } from "./helpers";

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

    this.scroll = { top: 0, bottom: 0, diff: 0 };
    this.direction = 'down'
    this.mouse = { x: 0, y: 0 };

    this.init()

  }
  // INIT /////////////////////////////////////////////////////////////////////////////////////

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
    this.updateWindow();
    this.scroll = {top: 0, bottom: this.windowheight, diff: 0}
    this.updateSections()
  }



  //ADD ///////////////////////////////////////////////////////////////////////////////////////

  addWindow(el) {
    this.el = el;
  }

  addSection(el,options = {}){

    let s = {}

    s.el = el
    s.visible = false
    s.active = false
    s.position = {}

    s.onScroll = options.onScroll || null
    s.onEnter = options.onEnter || null
    s.onLeave = options.onLeave || null

    this.sections.push(s)

    return s

  }

  addElement(el,options = {}){

    let e = {}

    el.setAttribute("data-element","");

    e.el = el
    e.visible = false
    e.duration = 0
    e.offsetTop = 0
    e.offsetBottom = 0
    e.position = {top:0,left:0,right:0,bottom:0}
    e.computed = {x:0,y:0,r:0,top:0,left:0,bottom:0,right:0}

    this.updateElement(e,options)

    this.elements.push(e)

    return e

  }

  addEvent(type, fn){
    let key = Object.keys(this.events[type]).length
    this.events[type][key] = fn
    return key
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

  removeEvent(type, key){
   delete this.events[type][key]
  }



  //CHECK //////////////////////////////////////////////////////////////////////////////////////

  checkSection(section){

    let {position} = section

    let active = position.top - this.windowheight <= this.scroll.bottom && position.bottom + this.windowheight >= this.scroll.top
    let visible = position.top <= this.scroll.bottom && position.bottom >= this.scroll.top

    if (active || section.active){

      let limit = this.scroll.bottom - this.scroll.top + position.height
      let scrolled = visible ? scroll.bottom - position.top : this.direction == 'down' ? limit : 0
      let percent = scrolled / limit

      if (section.onEnter && visible && !section.visible) section.onEnter(this.direction,this.smooth);
      if (section.onScroll && (visible || section.visible)) section.onScroll({ scrolled, percent },this.smooth);
      if (section.onLeave && !visible && section.visible) section.onLeave(this.direction,this.smooth);

      if (active && !section.active) {
        section.el.style.opacity = "";
        section.el.style.pointerEvents = "";
      }

      if (!active && section.active) {
        section.el.style.opacity = 0;
        section.el.style.pointerEvents = "none";
      }

      section.active = active
      section.visible = visible
    }
  }

  checkElement(element){

    let {offsetTop, offsetBottom, position, inside, computed} = element

    let top = position.top + computed.top
    let bottom = position.bottom + computed.bottom

    offsetTop += element.inside ? position.height : 0
    offsetBottom += element.inside ? position.height : 0

    let scrolltop = (element.duration || this.scroll.top) + offsetTop
    let scrollbottom = (position.top < this.windowheight ? this.scroll.top + position.top : this.scroll.bottom) - offsetBottom
    let visible = top <= scrollbottom && bottom >= scrolltop

    if (visible || element.visible){

      let limit = scrollbottom - scrolltop + position.height
      let scrolled = visible ? scrollbottom - top : this.direction == 'down' ? limit : 0
      let percent = scrolled / limit


      // events ------------------------------------------------------------------------------------
      if (element.onEnter && visible && !element.visible) element.onEnter(this.direction,this.smooth);
      if (element.onScroll && (visible || element.visible)) element.onScroll({ scrolled, percent },this.smooth);
      if (element.onLeave && !visible && element.visible) element.onLeave(this.direction,this.smooth);
      if (element.onMouseOver || element.onMouseEnter || element.onMouseLeave) this.handleElementMouseOver(element)


      // transform ---------------------------------------------------------------------------------
      if (element.transform && (this.smooth || element.mobile)){

        let values = {x:0, y:0, r:0}

        if (element.momentum){

          if (element.transform.x) values.x = computed.x + this.scroll.diff * element.transform.x;
          if (element.transform.y) values.y = computed.y + this.scroll.diff * element.transform.y;
          if (element.transform.r) values.r = computed.r + this.scroll.diff * element.transform.r

        } else {

          let amount = position.top < this.windowheight ? scrolltop : scrollbottom - position.top

          if (element.transform.x) values.x = amount * element.transform.x;
          if (element.transform.y) values.y = amount * element.transform.y;
          if (element.transform.r) values.r = amount * element.transform.r;

          let rotation = getRotation(values.r,position.height, position.width)

          values.top = values.y - rotation.top,
          values.bottom = values.y + rotation.bottom,
          values.left = values.x - rotation.left,
          values.right = values.x + rotation.right

          element.computed = values
        }

        transform(element.el, values.x, values.y, values.r);

      }

      element.visible = visible

    }

  }



  //HANDLE //////////////////////////////////////////////////////////////////////////////////////

  handleResize() {
    Object.keys(this.events.resize).forEach(key => this.events.resize[key]())
    this.update();
  }

  handleMouseMove(e) {
    this.mouse.y = this.scroll.top + e.clientY;
    this.mouse.x = e.clientX;

    Object.keys(this.events.mousemove).forEach(key => this.events.mousemove[key](e))

  }

  handleMouseUp() {
    Object.keys(this.events.mouseup).forEach(key => this.events.mouseup[key]())
  }

  handleElementMouseOver(el) {
    let {position, computed} = el

    let values = {
      top: position.top + computed.top,
      left: position.left + computed.left,
      right: position.right + computed.right,
      bottom: position.bottom + computed.bottom
    }

    let mouseover =
      this.mouse.y >= values.top &&
      this.mouse.y <= values.bottom &&
      this.mouse.x >= values.left &&
      this.mouse.x <= values.right;

    let computedHeight = values.bottom - values.top;
    let computedWidth = values.right - values.left;
    let computedMouse = {
      x: minMax(this.mouse.x - values.left, 0, computedWidth),
      y: minMax(this.mouse.y - values.top, 0, computedHeight)
    };

    if (el.onMouseEnter && mouseover && !el.mouseover) el.onMouseEnter(this.mouse, this.smooth);
    if (el.onMouseLeave && !mouseover && el.mouseover) el.onMouseLeave(this.mouse, this.smooth);
    if (el.onMouseOver && mouseover) el.onMouseOver(computedMouse, this.smooth);

    el.mouseover = mouseover;
  }



  //UPDATE //////////////////////////////////////////////////////////////////////////////////////

  update(){
    this.updateWindow();
    this.updateSections();
  }

  updateWindow(){
    this.windowheight = window.innerHeight;
    this.windowwidth = window.innerWidth;
    this.limit = this.el.offsetHeight - this.windowheight;
  }

  updateScroll(scroll) {
    this.direction = scroll > this.scroll.top ? "down" : "up";
    this.scroll.diff = scroll - this.scroll.top
    this.mouse.y += scroll - this.scroll.top;
    this.scroll.top = scroll;
    this.scroll.bottom = scroll + this.windowheight

    this.sections.forEach(s => this.checkSection(s))
    this.elements.forEach(e => this.checkElement(e))

    Object.keys(this.events.scroll).forEach(key => this.events.scroll[key](e))
  }

  updateSections(){
    this.sections.forEach(section => {

      section.position = getPosition(section.el)

      let st = getTransform(section.el)
      let elements = section.el.querySelectorAll("[data-element]");

      elements.forEach(el => {

        let element = this.elements.find(e => e.el == el)

        element.position = getPosition(el,st)
        element.position.top -= st.y
        element.position.bottom -= st.y
        element.position.left -= st.x
        element.position.right -= st.x

        if(element.updates){
          Object.keys(element.updates).forEach( key => element[key] = getValue(element.updates[key],el))
        }

      })

    })
  }

  updateToScroll

  updateElement(e,o){

    e.inside = o.inside || null
    e.log = o.log || null
    e.momentum = o.momentum || null

    // events ---------------------------------------------------------------------
    e.onScroll = o.onScroll || null
    e.onEnter = o.onEnter || null
    e.onLeave = o.onLeave || null
    e.onMouseEnter = o.onMouseEnter || null
    e.onMouseLeave = o.onMouseLeave || null
    e.onMouseOver = o.onMouseOver || null

    // updates ---------------------------------------------------------------------
    let updates = {}
    if (o.duration) updates.duration = o.duration
    if (o.offsetTop || o.offset) updates.offsetTop = o.offsetTop || o.offset
    if (o.offsetBottom || o.offset) updates.offsetBottom = o.offsetBottom || o.offset

    e.update = Object.keys(updates).length > 0 ? updates : null


    // transform ---------------------------------------------------------------------
    let transform = {}
    if (o.x) transform.x = round(-o.x / 10,2)
    if (o.y) transform.y = round(-o.y / 10,2)
    if (o.rotate) transform.r = round(o.rotate / 100,2)

    e.transform = Object.keys(transform).length > 0 ? transform : null


    // mouseover ---------------------------------------------------------------------
    if (e.onMouseOver || e.onMouseEnter || e.onMouseLeave) {
        if (!e.mousemoveKey){
          e.mousemoveKey = this.addEvent('mousemove',() => this.handleElementMouseOver(e))
          e.mouseover = false;
        }
    } else if (e.mousemoveKey){
      this.removeEvent('mousemove',e.mousemoveKey)
    }

  }

}
