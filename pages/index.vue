<template lang="html">
  <div id="home" class="container" v-page>
    <div class="section" v-section v-for="(section,a) in sections" :key="a">
      <div
        ref="item"
        class="item"
        v-for="(item,b) in section"
        :key="b"
        v-element="item.props"
        :class="item.class"
        />
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
export default {
  mounted(){
    let tl = gsap.timeline()
    tl.to(this.$refs.item,1,{opacity:1},0)
    tl.from(this.$refs.item,1,{scale: 0,rotate: -20,stagger: .05},.2)
  },
  computed:{
    sections(){
      let sections = []

      for (let a = 1; a <= 4; a++){
        let items = []
        for (let b = 1; b <= 40; b++){
          items.push({
            class: this.getClass(),
            props: this.getProps()
          })
        }
        sections.push(items)
      }

      return sections
    }
  },
  methods: {
    getProps() {
      return {
        x: this.rand(-9,9),
        y: this.rand(-4,9),
        rotate: this.rand(-5,5),
        mobile: true
      };
    },
    rand(min, max){

      if (min < 0){
        return min + Math.random() * (Math.abs(min) + max)
      }

      return Math.round(Math.random() * max) + min
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
    }
  }
};
</script>

<style lang="css">

#home .section {
  display: flex;
  flex-wrap: wrap;
}

#home .item {
  flex: 0 0 auto;
  width: 19vw;
  height: 19vw;
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



</style>
