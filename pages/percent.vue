<template lang="html">
  <div id="percent" v-page>
    <div class="content" v-section>
      <div class="box" :class="{active: active.box1}" v-element="box1.props">{{percent.box1}}%</div>
      <div class="box" :class="{active: active.box2}" v-element="box2.props">{{percent.box2}}%</div>
      <div class="box" :class="{active: active.box3}" v-element="box3.props">{{percent.box3}}%</div>
    </div>
    <div class="lines" :style="{top: offset, bottom: offset}">
      <div class="line"><p>{{box1.label}}</p></div>
      <div class="line"><p>{{box2.label}}</p></div>
      <div class="line"><p>{{box3.label}}</p></div>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
export default {
  data(){
    return{
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
  computed:{
    box1(){
      return{
        label: 'Outside',
        props:{
          offset: this.offset,
          onScroll: (e)=> this.percent.box1 = Math.round(e.percent * 100),
          onEnter:()=> this.active.box1 = true,
          onLeave:()=> this.active.box1 = false
        }
      }
    },
    box2(){
      return{
        label: 'Inside',
        props:{
          inside: true,
          offset: this.offset,
          onScroll: (e)=> this.percent.box2 = Math.round(e.percent * 100),
          onEnter:()=> this.active.box2 = true,
          onLeave:()=> this.active.box2 = false
        }
      }
    },
    box3(){
      return{
        label: 'Transform',
        props:{
          rotate: '360deg',
          y: -2,
          mobile: true,
          offset: this.offset,
          onScroll: (e)=> this.percent.box3 = Math.round(e.percent * 100),
          onEnter:()=> this.active.box3 = true,
          onLeave:()=> this.active.box3 = false
        }
      }
    },
  }
}
</script>

<style lang="css">
#percent{
  height: 300vh;
  overflow: hidden;
}

#percent .content{
  position: relative;
  z-index: 1;
  padding-top: 100vh;
  display: flex;
  justify-content: center;
}

#percent .box{
  flex: 0 0 auto;
  width: 25vw;
  height: 10vw;
  margin: 3vw;
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
  border-top: 1px solid blue;
  position: fixed;
  left: 0px;
  width: 100vw;
  border-top: 3px dashed blue;
  border-bottom: 3px dashed blue;
  background: rgba(0, 0, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}


#percent .line{
  width: 25vw;
  margin: 3vw;
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
  text-transform: uppercase;
  color: blue;
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
