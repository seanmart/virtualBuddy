<template lang="html">
  <div id="home" class="container" ref="page">
    <div class="section" ref="section" v-for="a in 4" :key="a">
      <div
        v-for="b in 20"
        :key="b"
        ref="item"
        class="item"
        :class="getClass()"
        />
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
export default {
  mounted(){

    this.$vb.init(this.$refs.page)

    this.$refs.section.forEach(e => this.$vb.addSection(e))

    this.$refs.item.forEach(e => this.$vb.addElement(e,{
      x: this.rand(-5,5),
      y: this.rand(-5,5),
      rotate: `${this.rand(0,100)}deg`,
      delay: this.rand(0,5)
    }))

    gsap.fromTo(this.$refs.item,.5,{scale: 0,rotate: -20},{opacity: 1, scale: 1, rotate: 0,stagger: this.mobile ? 0 : .02})

  },
  data(){
    return{
      mobile: true,
      momentum: 0,
      count: 40
    }
  },
  methods: {
    rand(min, max){
      if (min < 0) return Math.floor(min + Math.random() * (Math.abs(min) + max))
      return Math.floor(Math.random() * max) + min
    },
    getClass(){

      let int = this.rand(0,80)

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

#home{
  overflow: hidden;
}

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
