import VirtualBuddy from "@/assets/virtualBuddy";
import {lerp, transform, minMax, getTransform, getRotation, isMobile} from '@/assets/virtualBuddy/helpers'
import Vue from "vue";

let instance = new VirtualBuddy()

let vb = {
  init(el,s){
    instance.init(el,s)
  },
  addPage(el){
    instance.addPage(el)
  },
  addSection(el,o){
    return instance.addSection(el,o)
  },
  addElement(el,o){
    return instance.addElement(el,o)
  },
  getRotation: getRotation,
  getTransform: getTransform,
  transform: transform,
  minMax: minMax,
  lerp: lerp,
  mobile: isMobile
}

Object.defineProperty(Vue.prototype, "$vb", {value: vb});
