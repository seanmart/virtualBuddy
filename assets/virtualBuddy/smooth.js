import Core from './core'
import VirtualScroll from 'virtual-scroll'
import {minMax, lerp, transform, round, getPosition, getTransform, getRotation} from './helpers'

export default class extends Core{
  constructor(options){

    let scrollbar = {
      round: false,
      color: '#bbb',
      thickness: 10,
      el: null,
      scroll: 0,
      offset: 0,
      last: 0,
      timeout: null
    }

    options.scrollbar = Object.assign({},scrollbar,options.scrollbar || {})

    super(options)

    this.delta = 0
    this.isScrolling = false
    this.isTouchingScrollbar = false
    this.inertia = this.inertia || .075

  }



  // INIT ///////////////////////////////////////////////////////////////////////////////////////

  init(){
    super.init()

    this.touchScrollbar = this.touchScrollbar.bind(this)
    this.moveScrollbar = this.moveScrollbar.bind(this)
    this.releaseScrollbar = this.releaseScrollbar.bind(this)
    this.handleDelta = this.handleDelta.bind(this)

    this.addScrollbar()
    this.addScroll()

    document.documentElement.style.cssText += ';overflow: hidden; height: 100vh; transform: translate3d(0,0,0)'

  }

  initLoad(){
    super.initLoad()
    this.delta = 0
    this.scrollbar.scroll = 0
    this.updateScrollbar()
  }



  // ADD ///////////////////////////////////////////////////////////////////////////////////////

  addScroll(){

    this.vs = new VirtualScroll({
      el: this.el,
      mouseMultiplier: navigator.platform.indexOf('Win') > -1 ? 1 : 0.25,
      touchMultiplier: 3,
      useKeyboard: false,
      passive: true
    })

    this.vs.on(this.handleDelta)

  }



  // HANDLE //////////////////////////////////////////////////////////////////////////////////////

  handleDelta(e){
    this.delta = minMax(this.delta - e.deltaY,0,this.limit)
    if (!this.isScrolling && !this.isTouchingScrollbar) this.checkScroll()
  }

  handleResize(){
    this.updateScrollbar()
    super.handleResize()
    this.checkScroll(true)
  }


  // CHECK //////////////////////////////////////////////////////////////////////////////////////

  checkSection(section){
    super.checkSection(section)
    if (section.active) transform(section.el,0,-this.scroll.top)
  }

  checkScroll(force = false){

    this.isScrolling = Math.abs(this.delta - this.scroll.top) > 1

    if (this.isScrolling || force){

      window.requestAnimationFrame(()=>{
        let scroll = lerp(this.scroll.top, this.delta, this.inertia)
        this.updateScroll(scroll)
        this.transformScrollbar()
        this.checkScroll()
      })

    } else {
      let scroll = Math.floor(this.scroll.top)
      this.updateScroll(scroll)
      this.transformScrollbar()
    }

  }



  // SCROLLBARS //////////////////////////////////////////////////////////////////////////////////

  addScrollbar(){

    this.scrollbar.el = document.createElement('span')
    this.scrollbar.el.style.cssText = `transition: opacity .5s;
                                       opacity: 0;
                                       border-radius: ${this.scrollbar.cap ? this.scrollbar.thickness : 0}px;
                                       background: ${this.scrollbar.color};
                                       position:fixed;
                                       z-index: 1000;
                                       top: 0px;
                                       right: 0px;
                                       width: ${this.scrollbar.thickness}px;`

    document.body.append(this.scrollbar.el);

    this.scrollbar.el.addEventListener('mousedown', this.touchScrollbar)
    this.events.mouseover.push({el: this.scrollbar.el, fn: this.moveScrollbar})
    this.events.mouseup.push({el: this.scrollbar.el, fn: this.releaseScrollbar})

  }

  updateScrollbar(){
    let scrollbarHeight = this.windowheight * (this.windowheight / (this.limit + this.windowheight))
    this.scrollbar.el.style.height = scrollbarHeight + 'px'
  }

  touchScrollbar(e){
    this.isTouchingScrollbar = true
    this.scrollbar.offset = e.clientY
    this.scrollbar.scroll = this.scroll.top
    this.scrollbar.el.style.opacity = 1
  }

  moveScrollbar({x,y}){
    if (this.isTouchingScrollbar){
      let difference = ((y - this.scrollbar.offset) / this.windowheight) * (this.limit + this.windowheight)
      this.delta = minMax(this.scrollbar.scroll + difference, 0, this.limit)
      this.checkScroll()
    }
  }

  releaseScrollbar(){
    this.isTouchingScrollbar = false
    this.scrollbar.el.style.opacity = 0
  }

  transformScrollbar(){

      clearTimeout(this.scrollbar.timeout)
      this.scrollbar.el.style.opacity = 1
      let distance = this.windowheight * (this.scroll.top / (this.limit + this.windowheight))
      transform(this.scrollbar.el,0,distance)
      this.scrollbar.timeout = setTimeout(()=> this.scrollbar.el.style.opacity = 0, 300)

  }

  updatePositions(){
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

          this.updateValues(e)

        }

      })
    })
  }

}
