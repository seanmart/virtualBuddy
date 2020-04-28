import VirtualBuddy from "@/assets/virtualBuddy";
import {lerp, transform, minMax, getTransform, getRotation, isMobile} from '@/assets/virtualBuddy/helpers'
import Vue from "vue";

let instance = {}

let vb = {
  init(el, page){
    instance = new VirtualBuddy(el,page)
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
