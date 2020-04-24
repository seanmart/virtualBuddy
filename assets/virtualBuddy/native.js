import Core from './core'
import {minMax, lerp, getPosition} from './helpers'

export default class extends Core{
  constructor(options){
    super(options)

    this.isTicking = false
    this.isCalculating = false

  }

  init(){
    this.handleScroll = this.handleScroll.bind(this)
    this.addScroll()
    super.init()
  }

  addScroll(){
    window.addEventListener('scroll', this.handleScroll)
  }

  handleScroll(e){
    if (!this.isTicking) this.checkScroll()
  }

  handleResize(){
    if (window.innerWidth !== this.windowwidth) {
      super.handleResize()
      this.checkScroll()
    }
  }


  checkScroll(){

    this.isTicking = true

    window.requestAnimationFrame(()=>{
      this.updateScroll(window.scrollY)
      this.isTicking = false
    })

  }

  updateWindow() {
    this.windowheight = screen.availHeight;
    this.windowwidth = window.innerWidth;
    this.limit = this.el.offsetHeight - this.windowheight;
  }

  updatePositions(){
    this.sections.forEach(s => {
      s.position = getPosition(s.el)
      s.position.top += this.scroll.top
      s.position.bottom += this.scroll.top
    })

    this.elements.forEach(e => {
      e.position = getPosition(e.el)
      e.position.top += this.scroll.top
      e.position.bottom += this.scroll.top

      this.updateValues(e)

    })
  }
}
