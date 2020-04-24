import {getPosition, getTransform, getRotation, minMax, getValue, lerp, transform} from './helpers'

export default class{
  constructor(options = {}){
    Object.assign(this,options)

    this.elements = []
    this.sections = []
    this.isTicking = false
    this.inertia = .075

    this.window = {
      html: document.documentElement,
      body: document.body
    }

    this.page = {
      el: null,
      limit: 0
    }

    this.scroll = {
      window: 0,
      top:0,
      bottom:0,
      last: 0,
      direction: null
    }

    this.mouse = {
      x: 0,
      y: 0
    }

    this.events = {
      mousemove: [],
      mouseup:[],
      scroll: [],
      resize:[]
    }

    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
    this.handleScroll = this.handleScroll.bind(this)

    window.addEventListener('resize', this.handleResize)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('visibility', this.handleVisibility)
    window.addEventListener('scroll', this.handleScroll)

    this.window.html.style.cssText = `height: 100vh; width: 100w; overflow: auto;`
  }



  // -----------------------------------------------------------------------------------------------
  // ADD
  // -----------------------------------------------------------------------------------------------


  addPage(el){
    this.page.el = el
    this.scroll.top = 0
    this.scroll.window = 0
    this.scroll.bottom = this.window.height
    this.scroll.last = 0
    this.page.el.style.cssText = `position: fixed; top: 0px; left: 0px; right: 0px;`

    window.scrollTo(0,0)
    this.update()
  }

  addSection(el,o = {}){
    let s = {
      el: el,
      transform:{},
      position:{},
      visible: false
    }

    this.updateSection(s,o)
    el.setAttribute("data-section","");
    el.style.willChange = 'transform'
    this.sections.push(s)
  }

  addElement(el,o = {}){
    let e = {
      el: el,
      values: {},
      transform: {},
      position: {},
      visible: 0
    }

    this.updateElement(e,o)
    el.setAttribute("data-element","");
    el.style.willChange = 'transform'
    this.elements.push(e)
  }



  // -----------------------------------------------------------------------------------------------
  // REMOVE
  // -----------------------------------------------------------------------------------------------



  removePage(){

  }

  removeSection(el){
    let index = this.sections.findIndex(e => e.el == el)
    this.removeEvent(el, 'mousemove')
    this.sections.splice(index,1)
  }

  removeElement(el){
    let index = this.elements.findIndex(e => e.el == el)
    this.removeEvent(el, 'mousemove')
    this.elements.splice(index,1)
  }

  removeEvent(el, type){
    let index = this.events[type].findIndex(i => i.el == el)
    if (index > -1) this.events[type].splice(index,1)
  }



  // -----------------------------------------------------------------------------------------------
  // CHECK
  // -----------------------------------------------------------------------------------------------



  checkScroll(force = false){
    this.isTicking = Math.abs(this.scroll.window - this.scroll.top) > 1

    if (this.isTicking || force){
      window.requestAnimationFrame(()=>{

        this.scroll.last = this.scroll.top
        this.scroll.top = lerp(this.scroll.top, this.scroll.window, this.inertia)
        this.scroll.bottom = this.scroll.top + this.window.height
        this.scroll.direction = this.scroll.last > this.scroll.top ? 'up' : 'down'

        this.checkSections()
        this.checkElements()

        if (!force) this.checkScroll()
      })
    }
  }

  checkSections(){
    this.sections.forEach(s => {

      if (s.start - this.window.height <= this.scroll.bottom && s.end + this.window.height >= this.scroll.top){

        let visible = s.start <= this.scroll.top && s.end >= this.scroll.top
        if (visible || s.visible){

          let scroll = this.scroll
          let scrolled = scroll.top - s.start
          let percent = minMax(scrolled / (s.distance),0,1)

          if (s.onEnter && visible && !s.visible) s.onEnter()
          if (s.onScroll) s.onScroll({scrolled, percent, scroll})
          if (s.onLeave && !visible && s.visible) s.onLeave(scroll)

          s.visible = visible
        }

        transform(s.el, 0,-this.scroll.top)
        
      }
    })
  }

  checkElements(){
    this.elements.forEach(e => {

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
    })
  }



  // -----------------------------------------------------------------------------------------------
  // UPDATE
  // -----------------------------------------------------------------------------------------------



  update(){

    this.updateScroll()

    this.window.height = window.innerHeight
    this.window.width = window.innerWidth
    this.page.limit = this.page.el.offsetHeight
    this.window.body.style.height = `${this.page.limit}px`

    this.sections.forEach(s => {

      s.position = getPosition(s.el)
      s.start = Math.max (s.position.top - this.window.height,0)
      s.end = s.position.bottom
      s.distance = s.end - s.start

      let t = getTransform(s.el)

      s.el.querySelectorAll("[data-element]").forEach(el => {

        let e = this.elements.find(e => e.el == el)

        if (e){
          e.position = getPosition(e.el)
          e.position.top -= t.y
          e.position.bottom -= t.y
          e.position.left -= t.x
          e.position.right -= t.x

          this.updateValues(e)
        }
      })

    })
  }

  updateScroll(){
    this.scroll.window = window.scrollY
  }

  updateValues(e){
    let duration = getValue(e.values.duration,e.el)
    let inside = e.inside ? e.position.height : 0
    let offsetStart = getValue(e.values.offsetStart,e.el) + inside
    let offsetEnd = getValue(e.values.offsetEnd,e.el) + inside

    e.start = Math.max (e.position.top + offsetStart - this.window.height,0)
    e.end = duration ? e.start + duration : e.position.bottom - offsetStart

    e.x = isNaN(e.values.x) ? getValue(e.values.x,e.el) : (e.values.x / 10) * (e.end - e.start)
    e.y = isNaN(e.values.y) ? getValue(e.values.y,e.el) : (e.values.y / 10) * (e.end - e.start)
    e.r = isNaN(e.values.r) ? getValue(e.values.r,e.el) : (e.values.r / 100) * (e.end - e.start)

    e.end += e.y + getRotation(e.r, e.position.height, e.position.width).bottom
    e.distance = e.end - e.start
  }

  updateSection(s,o){
    s.onScroll = o.onScroll || null
    s.onEnter = o.onEnter || null
    s.onLeave = o.onLeave || null
    s.onMouseOver = o.onMouseOver || null

    let index = this.events.mousemove.findIndex(i => i.el == s.el)
    if (index < 0 && s.onMouseOver) this.events.mouseover.push({el: s.el, fn: ()=> this.handleMouseOver(s)})
    if (index >= 0 && !s.onMouseOver) this.events.mouseover.splice(index,1)
  }

  updateElement(e,o){
    e.inside = o.inside || false
    e.mobile = o.mobile || false

    e.values.x = -o.x || 0,
    e.values.y = -o.y || 0,
    e.values.r = o.rotate || 0
    e.values.duration = o.duration || 0,
    e.values.offsetStart = o.offsetStart || o.offset || 0,
    e.values.offsetEnd = o.offsetEnd || o.offset || 0

    e.onScroll = o.onScroll || null
    e.onEnter = o.onEnter || null
    e.onLeave = o.onLeave || null
    e.onMouseOver = o.onMouseOver || null

    let index = this.events.mousemove.findIndex(i => i.el == e.el)
    if (index < 0 && e.onMouseOver) this.events.mousemove.push({el: e.el, fn: ()=> this.handleMouseOver(e)})
    if (index >= 0 && !e.onMouseOver) this.events.mousemove.splice(index,1)
  }



  // -----------------------------------------------------------------------------------------------
  // HANDLE
  // -----------------------------------------------------------------------------------------------



  handleScroll(){
    this.updateScroll()
    if (!this.isTicking) this.checkScroll()
    this.events.scroll.forEach(e => e.fn())
  }

  handleResize(){
    this.update()
    this.checkScroll(true)
    this.events.resize.forEach(i => i.fn())
  }

  handleMouseMove(e){
    this.events.scroll.forEach(i => i.fn(e))
  }

  handleVisibility(){

  }

}
