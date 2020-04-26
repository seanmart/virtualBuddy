<template lang="html">
  <div id="follower" class="container" ref="page">
    <div class="circle-container" ref="container">
      <div class="circle" ref="circle">
        <nuxt-link to="/">click me</nuxt-link>
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
    this.$vb.init(this.$refs.page, false)
    this.$vb.addElement(this.$refs.container,{onMouseOver: this.onMouseOver})

    window.addEventListener('resize',this.getCircle)
    this.getCircle()
  },
  methods: {
    onMouseOver({entering, leaving, active, x, y}) {

      if (active){
        this.mouse.x = x - this.circle.left - (this.circle.width / 2)
        this.mouse.y = y - this.circle.top - (this.circle.height / 2)
        if (!this.ticking) this.handleAnimation()
      }

      if (entering){
        this.lerpAmount = .2
      }

      if (leaving){
        this.lerpAmount = .025
        this.mouse.x = 0
        this.mouse.y = 0
        this.handleAnimation()
      }

    },
    handleAnimation(){
      this.ticking = Math.abs(this.button.x - this.mouse.x) > .1 || Math.abs(this.button.y - this.mouse.y) > .1

      if (this.ticking){
        window.requestAnimationFrame(()=>{
          this.button.x = this.$vb.lerp(this.button.x, this.mouse.x,this.lerpAmount)
          this.button.y = this.$vb.lerp(this.button.y, this.mouse.y,this.lerpAmount)
          this.transform()
          this.handleAnimation()
        })
      }
    },
    transform(){
      if (!this.$refs.circle) return
      this.$vb.transform(this.$refs.circle,this.button.x,this.button.y)
    },
    getCircle(){
      let circleRect = this.$refs.circle.getBoundingClientRect();
      let containerRect = this.$refs.container.getBoundingClientRect();
      let transform = this.$vb.getTransform(this.$refs.circle)

      this.circle = {
        height: circleRect.height,
        width: circleRect.width,
        top: circleRect.top - containerRect.top - transform.y,
        left: circleRect.left - containerRect.left - transform.x
      }
    }
  }
};
</script>

<style lang="css">
#follower{
  height: 200vh
}

#follower .circle-container {
  width: 600px;
  height: 600px;
  max-width: 100%;
  max-height: 100%;
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


</style>
