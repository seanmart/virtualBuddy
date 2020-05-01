import Main from './main.js'
import {lerp, transform, getRotation, getPosition, getTransform, getValue, minMax} from './helpers'

export default class extends Main{
  constructor(){
    super()

    this.inertia = .075
    this.delayTicking = false
    document.body.style.overscrollBehavior = 'none'
  }



  // -----------------------------------------------------------------------------------------------
  // INIT
  // -----------------------------------------------------------------------------------------------



  init(el, s){
    super.init(el,s)
    this.page.limit = 0
  }



  // -----------------------------------------------------------------------------------------------
  // ADD
  // -----------------------------------------------------------------------------------------------



  addPage(el,s){
    super.addPage(el,s)
    el.style.cssText = `position: fixed; top: 0px; left: 0px; right: 0px;`
    this.updatePage()
  }



  // -----------------------------------------------------------------------------------------------
  // CHECK
  // -----------------------------------------------------------------------------------------------


  checkScroll(){

    let scrollY = window.scrollY
    this.isTicking = Math.abs(scrollY - this.scroll.top) > .2

    window.requestAnimationFrame(()=>{
      super.checkScroll(lerp(this.scroll.top, scrollY, this.inertia))
      this.isTicking && this.checkScroll()
      !this.isTicking && !this.delayTicking && this.checkDelay(this.elements)
    })
  }

  checkDelay(els){
    els = els.filter((e)=> e.continue)
    this.delayTicking = els.length > 0 && !this.isTicking

    window.requestAnimationFrame(()=>{
      els.forEach(e => this.checkElement(e))
      if (this.delayTicking) this.checkDelay(els)
    })

  }

  checkSection(s){
    super.checkSection(s)

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

      transform(s.el, 0,-this.scroll.top)
    }

  }


  checkTransform(e, props){

    if (e.delay){
      let percent = lerp(e.percent,props.percent, e.delay)

      if (Math.abs(props.percent - percent) > .0001){
        props.continue = true
        props.percent = percent
      }
    }

    super.checkTransform(e, props)
  }


  // -----------------------------------------------------------------------------------------------
  // UPDATE
  // -----------------------------------------------------------------------------------------------



  update(){

    this.updatePage()
    this.updateWindow()

    this.sections.forEach(s => {

      s.position = getPosition(s.el)
      this.updateSection(s)

      let sectionTransform = getTransform(s.el)

      s.el.querySelectorAll("[data-element]").forEach(el => {

        let e = this.elements.find(e => e.el == el)

        if (e){

          e.position = getPosition(e.el)

          e.position.top -= sectionTransform.y
          e.position.bottom -= sectionTransform.y
          e.position.left -= sectionTransform.x
          e.position.right -= sectionTransform.x

          this.updateElement(e)
        }
      })

    })
  }

  updatePage(){
    this.page.limit = this.page.el.offsetHeight
    this.window.el.style.height = `${this.page.limit}px`
  }

  // -----------------------------------------------------------------------------------------------
  // HANDLE
  // -----------------------------------------------------------------------------------------------

  handleScroll(){
    if (!this.isTicking) this.checkScroll()
  }

}
