<template lang="html">
  <div id="percent" v-page>
    <div class="content" v-section>
      <div class="box" :class="{active: active.box1}" v-element="box1.props">{{percent.box1}}%</div>
      <div class="box" :class="{active: active.box2}" v-element="box2.props">{{percent.box2}}%</div>
      <div class="box" :class="{active: active.box3}" v-element="box3.props">{{percent.box3}}%</div>
    </div>
    <div class="lines" :style="{top: offset, bottom: offset}">
      <p>{{box1.label}}</p>
      <p>{{box2.label}}</p>
      <p>{{box3.label}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      offset: '25vh',
      percent:{
        box1: 0,
        box2:0,
        box3:0
      },
      active:{
        box1: false,
        box2:false,
        box3: false
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
        label: 'Rotation',
        props:{
          rotate: 10,
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
  width: 200px;
  height: 200px;
  background: red;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  margin: 40px;
}

#percent .box.active{
  background: blue;
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


#percent .lines p{
  width: 200px;
  height: 100%;
  font-size: 25px;
  font-weight: 700;
  background: rgba(0,0,255,.1);
  margin: 40px;
  text-align: center;
  text-transform: uppercase;
  color: blue;
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
