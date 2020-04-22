import Native from "./native";
import Smooth from "./smooth";
import {getTransform, lerp} from './helpers'

export default class {
  constructor(options = {}) {

    this.lerp = lerp
    this.getTransform = getTransform
    this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    this.instance = this.isMobile ? new Native({...options, smooth: false}) : new Smooth({...options,smooth: true});
  }

  addWindow(el, options) {
    this.instance.addWindow(el, options);
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
