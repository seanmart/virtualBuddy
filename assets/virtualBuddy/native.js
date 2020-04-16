import Core from './core'
import {minMax, lerp} from './helpers'

export default class extends Core{
  constructor(options){
    super(options)

    this.isTicking = false

  }

  init(){
    this.handleOrientationChange = this.handleOrientationChange.bind(this);
    this.handleScroll = this.handleScroll.bind(this)

    window.addEventListener("orientationchange", this.handleOrientationChange);

    this.addScroll()
  }

  addScroll(){
    window.addEventListener('scroll', this.handleScroll)
  }

  handleScroll(e){
    if (!this.isTicking) this.checkScroll()
  }

  handleOrientationChange(){
    this.handleResize()
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
}
