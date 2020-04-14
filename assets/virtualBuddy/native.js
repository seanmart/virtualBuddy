import Core from './core'

export default class extends Core{
  constructor(options){
    super(options)
  }

  init(){
    super.init()

    this.handleScroll = this.handleScroll.bind(this)

    this.addScroll()
  }

  addScroll(){
    window.addEventListener('scroll', this.handleScroll)
  }

  handleScroll(){
    super.handleScroll(window.scrollY)
  }

}
