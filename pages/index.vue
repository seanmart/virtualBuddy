<template lang="html">
  <div id="home" class="container" v-page>
    <div class="section" v-section v-for="(section,a) in sections" :key="a">
      <div
        ref="item"
        class="item"
        v-for="(item,b) in section"
        :key="b"
        v-element="{...item.props, momentum}"
        :class="item.class"
        />
    </div>
    <button v-if="!mobile" type="button" @click="toggleMomentum">Use {{momentum ? 'Scroll' : 'Momentum'}}</button>
  </div>
</template>

<script>
import gsap from 'gsap'
export default {
  mounted(){
    this.mobile = this.$virtualbuddy.isMobile
    gsap.fromTo(this.$refs.item,.5,{scale: 0,rotate: -20},{opacity: 1, scale: 1, rotate: 0,stagger: this.mobile ? 0 : .03})
  },
  data(){
    return{
      mobile: true,
      momentum: 0,
      count: 40
    }
  },
  computed:{
    sections(){
      let sections = []

      for (let a = 1; a <= 4; a++){
        let items = []
        for (let b = 1; b <= this.count; b++){
          items.push({
            class: this.getClass(),
            props: this.getProps(a,b)
          })
        }
        sections.push(items)
      }

      return sections
    }
  },
  methods: {
    getProps(a,b) {
      return {
        x: this.rand(-5,5),
        y: this.rand(-5,5),
        rotate: `${this.rand(-50,50)}deg`,
        mobile: true,
        log: a == 1 && b == 1
      };
    },
    rand(min, max){

      if (min < 0){
        return Math.floor(min + Math.random() * (Math.abs(min) + max))
      }

      return Math.floor(Math.random() * max) + min
    },
    getClass(){
      let int = this.rand(1,80)
      return{
        circle: int % 5 == 0,
        zigzag: int % 4 == 0,
        red: int >= 70 && int <= 80,
        black: int >= 50 && int <= 60,
        yellow: int >= 30 && int <= 40
      }
    },
    toggleMomentum(){
      this.momentum = this.momentum ? 0 : 10
    }
  }
};
</script>

<style lang="css">

#home{
  overflow: hidden;
}

#home button{
  position: fixed;
  bottom: 10%;
  left: 10%;
  outline: none;
  border: 1px solid blue;
  background: white;
  color: blue;
  padding: 10px 20px;
  font-size: inherit;
}

#home .section {
  display: flex;
  flex-wrap: wrap;
}

#home .item {
  flex: 0 0 auto;
  width: 15vw;
  height: 15vw;
  margin: 0.5vw;
  background: blue;
  opacity: 0;
  border: 1px solid black;
}

#home .item.red{
  background: red;
}

#home .item.black{
  background: black;
  border: 1px solid white;
}

#home .item.yellow{
  background: yellow;
}

#home .item.circle{
  border-radius: 50%;
}

#home .item.zigzag{
  background:
    linear-gradient(135deg, white 25%, transparent 25%) -25px 0,
    linear-gradient(225deg, white 25%, transparent 25%) -25px 0,
    linear-gradient(315deg, white 25%, transparent 25%),
    linear-gradient(45deg,  white 25%, transparent 25%);
  background-size: 50px 50px;
  background-color: blue;
}

#home .item.red.zigzag{
  background:
    linear-gradient(135deg, white 25%, transparent 25%) -25px 0,
    linear-gradient(225deg, white 25%, transparent 25%) -25px 0,
    linear-gradient(315deg, white 25%, transparent 25%),
    linear-gradient(45deg,  white 25%, transparent 25%);
  background-size: 50px 50px;
  background-color: red;
}

#home .item.black.zigzag{
  background:
    linear-gradient(135deg, white 25%, transparent 25%) -25px 0,
    linear-gradient(225deg, white 25%, transparent 25%) -25px 0,
    linear-gradient(315deg, white 25%, transparent 25%),
    linear-gradient(45deg,  white 25%, transparent 25%);
  background-size: 50px 50px;
  background-color: black;
  border: 1px solid black;
}

#home .item.yellow.zigzag{
  background:
    linear-gradient(135deg, white 25%, transparent 25%) -25px 0,
    linear-gradient(225deg, white 25%, transparent 25%) -25px 0,
    linear-gradient(315deg, white 25%, transparent 25%),
    linear-gradient(45deg,  white 25%, transparent 25%);
  background-size: 50px 50px;
  background-color: yellow;
}

@media screen and (max-width: 600px){
  #home button{
    bottom: 50px;
  }

  #home .item{
    width: 19vw;
    height: 19vw;
  }
}



</style>
