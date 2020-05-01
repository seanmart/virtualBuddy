import Main from './main'
import Smooth from './smooth'

import {lerp, transform, minMax, getTransform, getOffset, isMobile} from './helpers'

export default class{
  constructor(){

    Object.assign(this,{},{
      getOffset: getOffset,
      getTransform: getTransform,
      transform: transform,
      minMax: minMax,
      lerp: lerp,
      mobile: isMobile()
    })

    this.instance = this.mobile ? new Main() : new Smooth()
    this.instance.init()

    console.log(this.instance)
  }

  init(el, s){
    this.instance.init(el, s)
  }

  addPage(el,s){
    this.instance.addPage(el,s)
  }

  addSection(el, o){
    this.instance.addSection(el, o)
  }

  addElement(el, o){
    this.instance.addElement(el, o)
  }

}
