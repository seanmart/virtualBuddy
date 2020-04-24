import Core from './core'
import {getTransform, lerp} from './helpers'

export default class {
  constructor(options = {}) {

    this.lerp = lerp
    this.getTransform = getTransform
    this.mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    this.instance = new Core({...options, mobile: this.mobile})
    //this.instance = this.isMobile ? new Native({...options, smooth: false}) : new Smooth({...options,smooth: true});
  }

  addWindow(el) {
    this.instance.addWindow(el);
  }

  addContainer(el) {
    this.instance.addContainer(el);
  }

  addPage(el) {
    this.instance.addPage(el);
  }

  addSection(el, options) {
    return this.instance.addSection(el, options);
  }

  removeSection(el){
    this.instance.removeSection(el)
  }

  addElement(el, options) {
    return this.instance.addElement(el, options);
  }

  removeElement(el){
    this.instance.removeElement(el)
  }

  updateElement(el, options){
    console.log('updating')
    let element = this.instance.elements.find((e)=> e.el === el)
    this.instance.updateElement(element,options,true)
  }

  load() {
    this.instance.initLoad();
  }

}
