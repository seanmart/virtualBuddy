<template lang="html">
  <div id="object-animation" v-page>
    <div class="header" v-section>
      <nuxt-link to="/">Back</nuxt-link>
    </div>
    <div class="section" v-section>
      <div
        class="item"
        v-for="i in 50"
        :key="i"
        v-element="randomXY()"
        :style="getStyle()"
        :class="{circle: rand(1,10) > 5}"
        />
    </div>
    <div class="section" v-section>
      <div
        class="item"
        v-for="i in 50"
        :key="i"
        v-element="randomXY()"
        :style="getStyle()"
        :class="{circle: rand(1,10) > 5}"
        />
    </div>
    <div class="section" v-section>
      <div
        class="item"
        v-for="i in 50"
        :key="i"
        v-element="randomXY()"
        :style="getStyle()"
        :class="{circle: rand(1,10) > 5}"
        />
    </div>
    <div class="section" v-section>
      <div
        class="item"
        v-for="i in 50"
        :key="i"
        v-element="randomXY()"
        :style="getStyle()"
        :class="{circle: rand(1,10) > 5}"
        />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    randomXY() {
      return {
        x: this.rand(0,9),
        y: this.rand(0,9)
      };
    },
    rand(min, max){
      return Math.round(Math.random() * max) + min
    },
    getColor(light){
      let min = light ? 100 : 5
      let max = light ? 200 : 100
      return `rgb(${this.rand(min,max)},${this.rand(min,max)},${this.rand(min,max)})`
    },
    getStyle(){
      return{
        opacity: Math.random()
      }
    }
  }
};
</script>

<style lang="css">
#object-animation {
  padding: 10vw;
  min-height: 200vh;
}

#object-animation .header{
  padding-bottom:10vw;
}

#object-animation .section {
  min-height: 200vh;
  display: flex;
  flex-wrap: wrap;
}

#object-animation .item {
  flex: 0 0 auto;
  width: 19vw;
  height: 19vw;
  margin: 0.5vw;
  background: blue;
}

#object-animation .item.circle{
  border-radius: 50%;
}
</style>
