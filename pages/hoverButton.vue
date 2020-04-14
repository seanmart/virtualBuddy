<template lang="html">
  <div id="hover-button" v-page>
    <div class="section" v-section>
      <div
        class="item"
        v-element="{onMouseEnter, onMouseOver,onMouseLeave}"
        ref="container"
      >
        <div class="circle-container" ref="circle">
          <nuxt-link to="/">
            click me
          </nuxt-link>
        </div>
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
    onMouseOver(mouse) {
      this.mouse.x = mouse.x - this.circle.left - (this.circle.width / 2)
      this.mouse.y = mouse.y - this.circle.top - (this.circle.height / 2)

      if (!this.ticking) this.handleAnimation()

    },
    onMouseEnter(){
      this.lerpAmount = .2
    },
    onMouseLeave() {
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
#hover-button{
  min-height: 200vh;
  padding: 0px;
}
#hover-button .section {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

#hover-button .item {
  flex: 0 0 auto;
  width: 40vw;
  height: 40vw;
  margin: 0.5vw;
  border: 3px dashed blue;
  background: rgba(0, 0, 255, 0.1);
  border-radius: 20px;
  position: relative;
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

#hover-button .item .circle-container {
  width: 10vw;
  height: 10vw;
}

#hover-button .item a {
  display: block;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.25s;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 1.2vw;
  margin: 0px;
}

#hover-button .item .circle:active {
  transform: scale(1.05);
}

#hover-button .item.hover .circle {
  transform: scale(1);
  opacity: 1;
}
</style>
