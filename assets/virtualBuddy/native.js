import Core from './core'
import {minMax, lerp} from './helpers'

export default class extends Core{
  constructor(options){
    super(options)

    this.isTicking = false

  }

  init(){
    super.init()

    this.handleScroll = this.handleScroll.bind(this)

    this.addScroll()
  }

  addScroll(){
    window.addEventListener('scroll', this.handleScroll)
  }

  handleScroll(e){
    if (!this.isTicking) this.checkScroll()
  }

  checkScroll(){

    this.isTicking = true

    window.requestAnimationFrame(()=>{
      this.updateScroll(window.scrollY)
      this.isTicking = false
    })
  }
}
