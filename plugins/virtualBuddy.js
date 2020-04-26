import VirtualBuddy from "@/assets/virtualBuddy";
import {lerp, transform, minMax, getTransform, getRotation} from '@/assets/virtualBuddy/helpers'
import Vue from "vue";

let instance = {}

let vb = {
  init(el){
    instance = new VirtualBuddy(el)
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
  lerp: lerp
}

Object.defineProperty(Vue.prototype, "$vb", {value: vb});
