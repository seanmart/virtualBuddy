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

    this.updateSections()
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

    this.updateElement(s,o)

    this.sections.push(s)

  }

  addElement(el, o = {}){

    let e = {}

    e.el = el
    e.visible = false
    e.position = {}
    e.view = {}

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

    let visible = e.view.start + e.transform.m <= this.scroll.bottom
                && e.view.end + e.transform.m >= this.scroll.top

    if (visible || e.visible ){

      let scrolled = e.inView ? this.scroll.top : this.scroll.bottom - (e.view.start + e.transform.m)
      let percent = minMax(scrolled / (e.view.duration + e.transform.m),0,1)

      if (e.onEnter && visible && !e.visible) e.onEnter(this.scroll)
      if (e.onScroll) e.onScroll({scrolled, percent, scroll: this.scroll})
      if (e.onLeave && !visible && e.visible) e.onLeave(this.scroll)

      if ((e.x || e.y || e.r || e.m) && (this.smooth || e.mobile)){

        let t = {
          x: e.x * percent,
          y: e.y * percent,
          r: e.r * percent,
          m: this.smooth ? lerp(e.transform.m,-this.scroll.diff * e.m,.1) : 0
        }

        transform(e.el, t.x, t.y + t.m, t.r)
        e.transform = t

      }

      e.visible = visible

    }

  }



  // HANDLE ----------------------------------------------------------------------------------------

  handleResize(){
    this.events.resize.forEach(event => event.fn())
    this.updateWindow();
    this.updateSections();
  }

  handleMouseOver(event){

    if (this.mobile) return

    this.mouse.y = this.scroll.top + event.clientY;
    this.mouse.x = event.clientX;

    this.events.mouseover.forEach(e => e.fn(this.mouse))
  }

  handleElementMouseOver(e){

    let top = e.position.top + e.transform.y
    let bottom = e.position.bottom + e.transform.y
    let left = e.position.left + e.transform.x
    let right = e.position.right + e.transform.x

    let mouseIsOver =
      this.mouse.y >= top &&
      this.mouse.y <= bottom &&
      this.mouse.x >= left &&
      this.mouse.x <= right;

    if (mouseIsOver || e.mouseIsOver){

      e.onMouseOver({
        entering: !e.mouseIsOver && mouseIsOver,
        leaving: e.mouseIsOver && !mouseIsOver,
        active: e.mouseIsOver && mouseIsOver,
        x: minMax(this.mouse.x - left, 0, right - left),
        y: minMax(this.mouse.y - top, 0, bottom - top)
      })

      e.mouseIsOver = mouseIsOver

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

  updateSections(){
    this.sections.forEach(s => {

      s.position = getPosition(s.el)
      s.inView = s.position.top < this.windowheight
      s.limit = s.inView ? s.position.bottom : this.windowheight + s.position.height

      let t = getTransform(s.el)

      s.el.querySelectorAll("[data-element]").forEach(el => {

        let e = this.elements.find(i => i.el == el)

        if (e){

          e.position = getPosition(el)
          e.position.top -= t.y
          e.position.bottom -= t.y
          e.position.left -= t.x
          e.position.right -= t.x


          let offsetTop = e.updates.offsetTop ? getValue(e.updates.offsetTop,el) : 0
          let offsetBottom = e.updates.offsetBottom ? getValue(e.updates.offsetBottom,el) : 0
          let duration = e.updates.duration ? getValue(e.updates.duration,el) : 0
          let rotation = getRotation(e.r, e.position.height, e.position.width)

          if (e.inside){
            offsetBottom += e.position.height
            offsetTop += e.position.height
          }

          e.inView = e.position.top < this.windowheight
          e.view.start = e.position.top + offsetTop
          e.view.end = e.position.bottom - offsetBottom + e.y + rotation.bottom

          e.view.duration = e.inView
          ? e.position.top - offsetBottom - offsetTop + e.position.height + e.y + rotation.bottom
          : this.windowheight - offsetBottom - offsetTop + e.position.height + e.y + rotation.bottom

        }
      })
    })
  }

  updateElement(e,o){
    e.log = o.log || null
    e.inside = o.inside || false
    e.mobile = o.mobile || false

    // transform
    if (!e.transform) e.transform = {x:0, y:0, r:0, m:0}
    e.x = o.x ? getValue(o.x,e.el) : 0,
    e.y = o.y ? -getValue(o.y,e.el) : 0,
    e.r = o.rotate ? getValue(o.rotate,e.el) : 0,
    e.m = o.momentum || 0

    // updates
    e.updates = {
      duration: o.duration || null,
      offsetTop: o.offsetTop || o.offset || null,
      offsetBottom: o.offsetBottom || o.offset || null
    }

    // events
    e.onScroll = o.onScroll || null
    e.onEnter = o.onEnter || null
    e.onLeave = o.onLeave || null
    e.onMouseOver = o.onMouseOver || null

    let index = this.events.mouseover.findIndex(i => i.el == e.el)
    if (index < 0 && e.onMouseOver) this.events.mouseover.push({el: e.el, fn: ()=> this.handleElementMouseOver(e)})
    if (index >= 0 && !e.onMouseOver) this.events.mouseover.splice(index,1)

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
