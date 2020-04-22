import {getValue, getPosition, getTransform, getRotation, transform, minMax, lerp} from './helpers'

export default class {
  constructor(options){
    Object.assign(this,options)

    this.el = null

    this.elements = []
    this.sections = []

    this.events = {
      mouseover: [],
      mouseup:[],
      scroll: [],
      resize:[]
    }

    this.scroll = {
      top: 0,
      bottom: 0,
      diff: 0,
      direction: 'down'
    }

    this.mouse = {
      x: 0,
      y: 0
    }

    this.windowheight = 0
    this.windowwidth = 0
    this.limit = 0

    this.init()

  }



  // INIT ------------------------------------------------------------------------------------------

  init(){
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    window.addEventListener("resize", this.handleResize);
    window.addEventListener("mousemove", this.handleMouseOver);
    window.addEventListener("mouseup", this.handleMouseUp);
  }

  initLoad(){
    window.scrollTo(0,0)
    this.updateWindow()

    this.scroll = {top: 0, bottom: this.windowheight, diff: 0, direction: 'down'}

    this.updatePositions()

  }



  // ADD -------------------------------------------------------------------------------------------

  addWindow(el){
    this.el = el;
  }

  addSection(el, o = {}){

    let s = {}

    s.el = el
    s.position = {}
    s.active = false
    s.visible = false
    s.inView = false
    s.limit = 0

    this.updateSection(s,o)

    this.sections.push(s)

  }

  addElement(el, o = {}){

    let e = {}

    e.el = el
    e.position = {}
    e.values = {}
    e.transform = {x:0, y:0, r:0}
    e.visible = false

    this.updateElement(e,o)
    this.elements.push(e)
    el.setAttribute("data-element","");

  }



  // REMOVE ----------------------------------------------------------------------------------------

  removeSection(el){
    let index = this.sections.findIndex(i => i.el == el)
    let s = this.sections[index]

    if (s.onMouseOver){
      let eventIndex = this.events.mouseover.findIndex(i => i.el == el)
      this.events.mouseover.splice(eventIndex,1)
    }

    this.sections.splice(index,1)
  }

  removeElement(el){
    let index = this.elements.findIndex(i => i.el == el)
    let e = this.elements[index]

    if (e.onMouseOver){
      let eventIndex = this.events.mouseover.findIndex(i => i.el == el)
      this.events.mouseover.splice(eventIndex,1)
    }

    this.elements.splice(index,1)
  }



  // CHECK -----------------------------------------------------------------------------------------

  checkSection(e){
    let {position, events} = e
    let {top, bottom} = this.scroll

    let active = position.top - this.windowheight <= bottom && position.bottom + this.windowheight >= top
    let visible = position.top <= bottom && position.bottom >= top

    if (active || e.active){

      let scrolled = e.inView ? this.scroll.top : this.scroll.bottom - e.position.top

      if (e.onEnter && visible && !e.visible) e.onEnter(this.scroll)
      if (e.onScroll) e.onScroll({scrolled, percent, scroll: this.scroll})
      if (e.onLeave && !visible && e.visible) e.onLeave(this.scroll)

      e.active = active
    }
  }

  checkElement(e){

    let visible = e.start <= this.scroll.top && e.end >= this.scroll.top

    if (visible || e.visible ){

      let scroll = this.scroll
      let scrolled = scroll.top - e.start
      let percent = minMax(scrolled / (e.distance),0,1)

      if (e.onEnter && visible && !e.visible) e.onEnter()
      if (e.onScroll) e.onScroll({scrolled, percent, scroll})
      if (e.onLeave && !visible && e.visible) e.onLeave(scroll)

      if ((e.x || e.y || e.r) && (this.smooth || e.mobile)){

        let p = percent

        let t = {
          x: e.x * p,
          y: e.y * p,
          r: e.r * p
        }

        transform(e.el, t.x, t.y, t.r)
        e.transform = t

      }

      e.visible = visible

    }

  }



  // HANDLE ----------------------------------------------------------------------------------------

  handleResize(){
    this.updateWindow();
    this.updatePositions();
    this.events.resize.forEach(event => event.fn())
  }

  handleMouseOver(event){

    if (!this.smooth) return

    this.mouse.y = this.scroll.top + event.clientY;
    this.mouse.x = event.clientX;

    this.events.mouseover.forEach(e => e.fn(this.mouse))
  }

  handleElementMouseOver(e){

    let top = e.position.top + e.transform.y
    let bottom = e.position.bottom + e.transform.y
    let left = e.position.left + e.transform.x
    let right = e.position.right + e.transform.x

    let hover =
      this.mouse.y >= top &&
      this.mouse.y <= bottom &&
      this.mouse.x >= left &&
      this.mouse.x <= right;

    if (hover || e.hover){

      e.onMouseOver({
        entering: !e.hover && hover,
        leaving: e.hover && !hover,
        active: e.hover && hover,
        x: minMax(this.mouse.x - left, 0, right - left),
        y: minMax(this.mouse.y - top, 0, bottom - top)
      })

      e.hover = hover

    }
  }

  handleMouseUp(){
    this.events.mouseup.forEach(event => event.fn())
  }



  // UPDATE ----------------------------------------------------------------------------------------


  updateWindow(){
    this.windowheight = window.innerHeight;
    this.windowwidth = window.innerWidth;
    this.limit = this.el.offsetHeight - this.windowheight;
  }

  updateScroll(scroll){
    this.scroll.direction = scroll > this.scroll.top ? "down" : "up";
    this.scroll.diff = scroll - this.scroll.top
    this.mouse.y += scroll - this.scroll.top;
    this.scroll.top = scroll;
    this.scroll.bottom = scroll + this.windowheight

    this.sections.forEach( s => this.checkSection(s))
    this.elements.forEach( e => this.checkElement(e))

    this.events.scroll.forEach(event => event.fn(this.scroll))

  }

  updatePositions(){}

  updateValues(e){

    let position = e.position
    let duration = getValue(e.values.duration,e.el)
    let inside = e.inside ? position.height : 0

    let offset = {
      start: getValue(e.values.offsetStart,e.el) + inside,
      end: getValue(e.values.offsetEnd,e.el) + inside
    }

    e.start = Math.max (position.top + offset.start - this.windowheight,0)
    e.end = duration ? e.start + duration : position.bottom - offset.end

    e.x = isNaN(e.values.x) ? getValue(e.values.x,e.el) : (e.values.x / 10) * (e.end - e.start)
    e.y = isNaN(e.values.y) ? getValue(e.values.y,e.el) : (e.values.y / 10) * (e.end - e.start)
    e.r = isNaN(e.values.r) ? getValue(e.values.r,e.el) : (e.values.r / 100) * (e.end - e.start)

    e.end += e.y + getRotation(e.r, position.height, position.width).bottom
    e.distance = e.end - e.start

  }

  updateElement(e,o,updateValues = false){
    e.log = o.log || null
    e.inside = o.inside || false
    e.mobile = o.mobile || false

    // transform
    e.values.x = o.x || 0,
    e.values.y = o.y || 0,
    e.values.r = o.rotate || 0
    e.values.duration = o.duration || 0,
    e.values.offsetStart = o.offsetStart || o.offset || 0,
    e.values.offsetEnd = o.offsetEnd || o.offset || 0

    // events
    e.onScroll = o.onScroll || null
    e.onEnter = o.onEnter || null
    e.onLeave = o.onLeave || null
    e.onMouseOver = o.onMouseOver || null

    let index = this.events.mouseover.findIndex(i => i.el == e.el)
    if (index < 0 && e.onMouseOver) this.events.mouseover.push({el: e.el, fn: ()=> this.handleElementMouseOver(e)})
    if (index >= 0 && !e.onMouseOver) this.events.mouseover.splice(index,1)

    if (updateValues) this.updateValues(e)

  }

  updateSection(s,o){

    // events
    s.onScroll = o.onScroll || null
    s.onEnter = o.onEnter || null
    s.onLeave = o.onLeave || null
    s.onMouseOver = o.onMouseOver || null

    let index = this.events.mouseover.findIndex(i => i.el == s.el)
    if (index < 0 && s.onMouseOver) this.events.mouseover.push({el: s.el, fn: ()=> this.handleElementMouseOver(s)})
    if (index >= 0 && !s.onMouseOver) this.events.mouseover.splice(index,1)

  }
}
