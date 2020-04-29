import Main from './main'
import Smooth from './smooth'

import {lerp, transform, minMax, getTransform, getRotation, isMobile, testBrowser} from './helpers'

export default class{
  constructor(){

    Object.assign(this,{},{
      getRotation: getRotation,
      getTransform: getTransform,
      transform: transform,
      minMax: minMax,
      lerp: lerp,
      mobile: isMobile()
    })

    let test = testBrowser()
    console.log(test)

    this.instance = this.mobile ? new Main(this.mobile) : new Smooth()
    this.instance.init()

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
