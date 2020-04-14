import Native from "./native";
import Smooth from "./smooth";
import {getTranslate, lerp} from './helpers'

export default class {
  constructor(options = {}) {

    this.lerp = lerp
    this.getTranslate = getTranslate

    let mobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    this.instance = mobile || options.smooth == false ? new Native(options) : new Smooth(options);
  }

  addWindow(el, options) {
    this.instance.addWindow(el, options);
  }

  addSection(el, options) {
    this.instance.addSection(el, options);
  }

  removeSection(el){
    this.instance.removeSection(el)
  }

  addElement(el, options) {
    this.instance.addElement(el, options);
  }

  removeElement(el){
    this.instance.removeElement(el)
  }

  load() {
    this.instance.initLoad();
  }

}
