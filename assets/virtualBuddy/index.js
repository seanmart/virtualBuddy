import {lerp, transform, minMax, getTransform, getRotation, getPosition, getValue, isMobile} from './helpers'

export default class{
  constructor(){

    this.inertia = this.mobile ? .2 : .075
    this.mobile = isMobile()

    this.window = {
      height: null,
      width: null,
      el: document.documentElement
    }

    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleVisibility = this.handleVisibility.bind(this);
    this.handleScroll = this.handleScroll.bind(this)

    window.addEventListener('resize', this.handleResize)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('visibility', this.handleVisibility)
    window.addEventListener('scroll', this.handleScroll)

    document.body.style.overscrollBehavior = 'none'

    this.init()

  }



  // -----------------------------------------------------------------------------------------------
  // INIT
  // -----------------------------------------------------------------------------------------------



  init(el, s = false){

    this.elements = []
    this.sections = []
    this.isTicking = false
    this.keepTicking = false

    this.page = {
      el: null,
      limit: 0
    }

    this.scroll = {
      window: 0,
      top:0,
      bottom: 0,
      last: 0,
      diff: 0,
      direction: null
    }

    this.events = {
      mousemove: [],
      mouseup:[],
      scroll: [],
      resize:[]
    }

    this.mouse = {
      x: 0,
      y: 0
    }

    if (el) this.addPage(el)
    if (s) this.addSection(el)

    window.scrollTo(0,0)
    this.updateWindow()

  }


  // -----------------------------------------------------------------------------------------------
  // ADD
  // -----------------------------------------------------------------------------------------------



  addPage(el, isSection){
    this.page.el = el
    el.style.cssText = `position: fixed; top: 0px; left: 0px; right: 0px;`
    this.updatePage()
    if (isSection) this.addSection(el)
  }

  addSection(el,o = {}){
    let s = {
      el: el,
      transform: {x: 0, y: 0, r:0},
      position: getPosition(el),
      visible: false,
      inView: false,
      hover: false
    }

    this.updateSectionOptions(s,o)
    el.setAttribute("data-section","");
    el.style.willChange = 'transform'
    this.sections.push(s)

    return {el: el, update: (o)=> {
      this.updateSectionOptions(s,o)
      this.checkScroll(true)
    }}
  }

  addElement(el,o = {}){
    let e = {
      el: el,
      values: {},
      transform:{x: 0, y: 0, r:0},
      position: getPosition(el),
      visible: 0,
      hover: false,
      continue: false
    }

    this.updateElementOptions(e,o)
    el.setAttribute("data-element","");
    el.style.willChange = 'transform'
    this.elements.push(e)

    return {el: el, update: (o)=> this.updateElementOptions(e,o)}
  }

  addEvent(type, el, fn){
    let index = this.events[type].findIndex(i => i.el == el)
    if (index < 0) this.events[type].push({el,fn})
  }



  // -----------------------------------------------------------------------------------------------
  // REMOVE
  // -----------------------------------------------------------------------------------------------



  removeEvent(type,el){
    let index = this.events[type].findIndex(i => i.el == el)
    if (index > -1) this.events[type].splice(index,1)
  }



  // -----------------------------------------------------------------------------------------------
  // CHECK
  // -----------------------------------------------------------------------------------------------



  checkScroll(force = false){
    this.isTicking = this.scroll.window !== this.scroll.top

    if (this.isTicking || this.keepTicking || force){
      window.requestAnimationFrame(()=>{

        this.scroll.last = this.scroll.top
        this.scroll.top = lerp(this.scroll.top, this.scroll.window, this.inertia)
        this.scroll.bottom = this.scroll.top + this.window.height
        this.scroll.diff = Math.round(this.scroll.top - this.scroll.last)
        this.scroll.direction = this.scroll.last > this.scroll.top ? 'up' : 'down'
        this.mouse.y += this.scroll.top - this.scroll.last
        this.keepTicking = false

        this.checkSections()
        this.checkElements()

        !force && this.checkScroll()
      })
    }
  }

  checkSections(){

    this.sections.forEach(s => {

      let inView = s.start - this.window.height <= this.scroll.bottom && s.end + this.window.height >= this.scroll.top

      if (inView || s.inView){

        if (inView && !s.inView){
          s.el.style.opacity = ""
          s.el.style.pointerEvents = ""
        }

        if (!inView && s.inView){
          s.el.style.opacity = 0
          s.el.style.pointerEvents = "none"
        }


        let visible = s.start <= this.scroll.top && s.end >= this.scroll.top

        if (visible || s.visible){

          let scroll = this.scroll
          let scrolled = scroll.top - s.start
          let percent = minMax(scrolled / (s.distance),0,1)

          if (s.onEnter && visible && !s.visible) s.onEnter()
          if (s.onScroll) s.onScroll({scrolled, percent, scroll})
          if (s.onLeave && !visible && s.visible) s.onLeave(scroll)
          if (s.onMouseOver) this.handleMouseOver(s)

          s.visible = visible
        }

        transform(s.el, 0,-this.scroll.top)

        s.inView = inView

      }
    })
  }

  checkElements(){
    this.elements.forEach(e => {

      let visible = e.start <= this.scroll.top && e.end >= this.scroll.top

      if (visible || e.visible || e.continue ){

        let scroll = this.scroll
        let scrolled = scroll.top - e.start
        let percent = minMax(scrolled / (e.distance),0,1)

        if (e.onEnter && visible && !e.visible) e.onEnter()
        if (e.onScroll) e.onScroll({scrolled, percent, scroll})
        if (e.onLeave && !visible && e.visible) e.onLeave(scroll)
        if (e.onMouseOver) this.handleMouseOver(e)

        e.continue = false

        if ((e.x || e.y || e.r) && (!this.mobile || e.mobile)){

          if (e.delay){
            e.delay.y = lerp(e.delay.y, percent, e.delay.v)
            e.continue = Math.abs(e.delay.y - percent) > .001
            percent = e.delay.y
          }

          let t = {
            x: e.x * percent,
            y: e.y * percent,
            r: e.r * percent
          }

          transform(e.el, t.x, t.y, t.r)
          e.transform = t

        }

        if (e.continue) this.keepTicking = true
        e.visible = visible

      }
    })
  }



  // -----------------------------------------------------------------------------------------------
  // UPDATE
  // -----------------------------------------------------------------------------------------------



  update(){

    this.updateScroll()
    this.updatePage()
    this.updateWindow()

    this.sections.forEach(s => {

      s.position = getPosition(s.el)
      this.updateSection(s)
      let t = getTransform(s.el)

      s.el.querySelectorAll("[data-element]").forEach(el => {

        let e = this.elements.find(e => e.el == el)

        if (e){
          e.position = getPosition(e.el)
          e.position.top -= t.y
          e.position.bottom -= t.y
          e.position.left -= t.x
          e.position.right -= t.x

          this.updateElement(e)
        }
      })

    })
  }

  updateScroll(){
    this.scroll.window = window.scrollY
  }

  updatePage(){
    this.page.limit = this.page.el.offsetHeight
    this.window.el.style.height = `${this.page.limit}px`
  }

  updateWindow(){
    this.window.height = window.innerHeight
    this.window.width = window.innerWidth
  }

  updateSection(s){
    s.start = Math.max(s.position.top - this.window.height,0)
    s.end = s.position.bottom
    s.distance = s.end - s.start
  }

  updateSectionOptions(s,o){
    s.onScroll = o.onScroll || null
    s.onEnter = o.onEnter || null
    s.onLeave = o.onLeave || null
    s.onMouseOver = o.onMouseOver || null

    s.onMouseOver
    ? this.addEvent('mousemove',s.el,()=> this.handleMouseOver(s))
    : this.removeEvent('mousemove', s.el)

    this.updateSection(s)
  }

  updateElement(e){
    let duration = getValue(e.values.duration,e.el)
    let inside = e.inside ? e.position.height : 0
    let offsetBottom= getValue(e.values.offsetBottom,e.el) + inside
    let offsetTop = getValue(e.values.offsetTop,e.el) + inside

    e.start = Math.max (e.position.top + offsetBottom - this.window.height,0)
    e.end = duration ? e.start + duration : e.position.bottom - offsetTop

    e.x = isNaN(e.values.x) ? getValue(e.values.x,e.el) : (e.values.x / 10) * (e.end - e.start)
    e.y = isNaN(e.values.y) ? getValue(e.values.y,e.el) : (e.values.y / 10) * (e.end - e.start)
    e.r = isNaN(e.values.r) ? getValue(e.values.r,e.el) : (e.values.r / 100) * (e.end - e.start)

    e.end += e.y + getRotation(e.r, e.position.height, e.position.width).bottom
    e.distance = e.end - e.start
  }

  updateElementOptions(e,o){
    e.inside = o.inside || e.inside || null
    e.mobile = o.mobile || e.mobile || false
    e.delay = o.delay ? {y: 0, v: .15 / Math.abs(o.delay)} : null

    e.values.x = -o.x || e.values.x || 0,
    e.values.y = -o.y || e.values.y || 0,
    e.values.r = o.rotate || e.values.r || 0
    e.values.duration = o.duration || e.values.duration || 0,
    e.values.offsetTop = o.offsetTop || o.offset || e.values.offsetTop || 0,
    e.values.offsetBottom = o.offsetBottom || o.offset || e.values.offsetBottom || 0

    e.onScroll = o.onScroll || e.onScroll || null
    e.onEnter = o.onEnter || e.onEnter || null
    e.onLeave = o.onLeave || e.onLeave || null
    e.onMouseOver = o.onMouseOver || e.onMouseOver || null
    e.onResize = o.onResize || e.onResize || null

    e.onMouseOver
    ? this.addEvent('mousemove',e.el,()=> this.handleMouseOver(e))
    : this.removeEvent('mousemove', e.el)

    this.updateElement(e)

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
    if (this.mobile && this.window.width == window.innerWidth) return
    this.update()
    this.checkScroll(true)
    this.events.resize.forEach(i => i.fn())
  }

  handleMouseMove(e){
    if (this.mobile) return

    this.mouse.y = this.scroll.top + event.clientY;
    this.mouse.x = event.clientX;

    this.events.mousemove.forEach(i => i.fn(e))
  }

  handleVisibility(){
    if (!document.hidden) this.update()
  }

  handleMouseOver(e){

    if (e.start > this.scroll.top || e.end < this.scroll.top) return

    let transform = e.transform || {x:0, y:0}

    let top = e.position.top + transform.y
    let bottom = e.position.bottom + transform.y
    let left = e.position.left + transform.x
    let right = e.position.right + transform.x

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

}
