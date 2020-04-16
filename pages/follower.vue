<template lang="html">
  <div id="follower" class="container" v-page v-section>
    <div
      class="circle-container"
      v-element="{onMouseEnter, onMouseOver,onMouseLeave}"
      ref="container"
      >
      <div class="circle" ref="circle">
        <nuxt-link to="/">
          click me
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lerpAmount: .2,
      circle: {},
      hover: false,
      ticking: false,
      button:{x:0,y:0},
      mouse:{x:0,y:0}
    };
  },
  mounted() {
    window.addEventListener('resize',this.getCircle)
    this.getCircle()
  },
  methods: {
    onMouseOver(mouse, smooth) {
      if (!smooth) return
      this.mouse.x = mouse.x - this.circle.left - (this.circle.width / 2)
      this.mouse.y = mouse.y - this.circle.top - (this.circle.height / 2)

      if (!this.ticking) this.handleAnimation()

    },
    onMouseEnter(mouse, smooth){
      if (!smooth) return
      this.lerpAmount = .2
    },
    onMouseLeave(mouse, smooth) {
      if (!smooth) return
      this.lerpAmount = .05
      this.mouse.x = 0
      this.mouse.y = 0
      this.handleAnimation()
    },
    handleAnimation(){
      this.ticking = Math.abs(this.button.x - this.mouse.x) > .1 || Math.abs(this.button.y - this.mouse.y) > .1

      if (this.ticking){
        window.requestAnimationFrame(()=>{
          this.button.x = this.$virtualbuddy.lerp(this.button.x, this.mouse.x,this.lerpAmount)
          this.button.y = this.$virtualbuddy.lerp(this.button.y, this.mouse.y,this.lerpAmount)
          this.transform()
          this.handleAnimation()
        })
      }
    },
    transform(){
      this.$refs.circle.style.transform = `translate(${this.button.x}px,${this.button.y}px)`;
    },
    getCircle(){
      let circleRect = this.$refs.circle.getBoundingClientRect();
      let containerRect = this.$refs.container.getBoundingClientRect();
      let translate = this.$virtualbuddy.getTranslate(this.$refs.circle)

      this.circle = {
        height: circleRect.height,
        width: circleRect.width,
        top: circleRect.top - containerRect.top - translate.y,
        left: circleRect.left - containerRect.left - translate.x
      }
    }
  }
};
</script>

<style lang="css">
#follower{
  height: 210vh;
}

#follower .circle-container {
  width: 40vw;
  height: 100vh;
  margin: auto;
  border: 3px dashed blue;
  background: rgba(0, 0, 255, 0.1);
  border-radius: 20px;
  position: relative;
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

#follower .circle {
  width: 150px;
  height: 150px;
}

#follower a {
  height: 100%;
  width: 100%;
  text-transform: uppercase;
  font-size: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: blue;
  color: white;
  border-radius: 50%;
  border: 1px solid black;
}

@media screen and (max-width: 600px){
  #follower .circle-container{
    width: 100%;
  }
}

</style>
