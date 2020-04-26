<template lang="html">
  <div id="percent">
    <div class="container boxes" ref="page">
        <div class="box" :class="{active: active.box1}" ref="box1">{{percent.box1}}%</div>
        <div class="box" :class="{active: active.box2}" ref="box2">{{percent.box2}}%</div>
        <div class="box" :class="{active: active.box3}" ref="box3">{{percent.box3}}%</div>
    </div>
    <div class="container lines" :style="{top: offset, bottom: offset}">
      <div class="line"><p>Outside</p></div>
      <div class="line"><p>Inside</p></div>
      <div class="line"><p>Transform</p></div>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
export default {
  data(){
    return{
      delay: false,
      rotation: false,
      offset: '25vh',
      percent:{
        box1:0,
        box2:0,
        box3:0
      },
      active:{
        box1:false,
        box2:false,
        box3:false
      }
    }
  },
  mounted(){
    this.$vb.init(this.$refs.page)

    this.$vb.addSection(this.$refs.page)

    this.$vb.addElement(this.$refs.box1,{
      offset: this.offset,
      onScroll: (e)=> this.percent.box1 = Math.round(e.percent * 100),
      onEnter:()=> this.active.box1 = true,
      onLeave:()=> this.active.box1 = false
    })

    this.$vb.addElement(this.$refs.box2,{
      inside: true,
      offset: this.offset,
      onScroll: (e)=> this.percent.box2 = Math.round(e.percent * 100),
      onEnter:()=> this.active.box2 = true,
      onLeave:()=> this.active.box2 = false
    })

    this.$vb.addElement(this.$refs.box3,{
      rotate: '270deg',
      delay: 2,
      y: -2,
      mobile: true,
      offset: this.offset,
      onScroll: (e)=> this.percent.box3 = Math.round(e.percent * 100),
      onEnter:()=> this.active.box3 = true,
      onLeave:()=> this.active.box3 = false
    })

  }
}
</script>

<style lang="css">
#percent{
  height: 300vh;
  overflow: hidden;
}

#percent .boxes{
  position: relative;
  z-index: 1;
  padding-top: 100vh;
  display: flex;
  justify-content: center;
}

#percent .box{
  flex: 0 0 auto;
  height: 10vw;
  background: blue;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5vw;
  border: 1px solid black;
}

#percent .box.active{
  background: red;
}

#percent .lines{
  position: fixed;
  width: 100vw;
  padding-top: 0px;
  padding-bottom: 0px;
  left: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
}


#percent .line{
  border: 3px dashed blue;
  background: rgba(0, 0, 255, 0.1);
  height: 100%;
  background: rgba(0,0,255,.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

#percent .line p{
  font-size: 3vw;
  font-weight: 700;
  text-align: center;
  color: blue;
}

#percent .box,
#percent .line{
  flex: 1 1 33.333%;
  margin: 0px 1vw;
}

@media screen and (max-width: 600px){
  #percent .line p{
    font-size: 8vw;
    transform: rotate(90deg);
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
    color: blue;
  }
}

</style>
