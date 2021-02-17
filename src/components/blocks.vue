<template lang="html">
  <section id="blocks">
    <div class="scroll">
      <div v-for="i in 200" :key="i" class="block" :class="getClasses()">
        <h3>{{ i == 200 ? "end" : randomWord() }}</h3>
      </div>
    </div>
  </section>
</template>

<script>
import words from "@/assets/words";
export default {
  mounted() {
    window.virtualbuddy.smooth.create({
      limit: 600,
      el: ".scroll",
      container: "#blocks"
    });

    let blocks = document.querySelectorAll(".block");

    for (let i = 0; i < blocks.length; i++) {
      let block = blocks[i];
      let anim = this.getAnimation(block);

      window.virtualbuddy.scroll.create(block, {
        inertia: Math.random() * 10 + 1,
        onScroll: e => anim.progress(e.progress)
      });
    }
  },
  methods: {
    randomWord() {
      let x = parseInt(Math.random() * words.length - 1);
      return words[x];
    },
    getAnimation(el) {
      let rand = Math.random();
      return window.gsap.to(el, 1, {
        ease: "none",
        scale: rand * 1.5,
        rotate: rand > 0.5 ? rand * 200 : rand * -200,
        x: rand > 0.5 ? rand * 500 : rand * -500,
        y: rand * -200,
        paused: true
      });
    },
    getClasses() {
      let rand = Math.random();
      let rand2 = Math.random();
      let rand3 = Math.random();
      return {
        red: rand > 0.75,
        yellow: rand > 0.5 && rand < 0.75,
        black: rand > 0.25 && rand < 0.5,
        circle: rand2 > 0.7,
        zigzag: rand3 < 0.3
      };
    }
  }
};
</script>

<style lang="less">
#blocks {
  .scroll {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
    padding: 10px;
  }

  .block {
    will-change: transform;
    background: blue;
    border: 1px solid black;
    padding-bottom: 100%;
    position: relative;
    color: white;

    h3 {
      font-size: 2vw;
      position: absolute;
      top: 50%;
      left: 10%;
      padding: 10px;
    }

    &.red {
      background: red;
    }
    &.black {
      background: black;
    }
    &.yellow {
      color: black;
    }
    &.circle {
      border-radius: 50%;
    }
    &.zigzag {
      background: linear-gradient(135deg, white 25%, transparent 25%) -25px 0,
        linear-gradient(225deg, white 25%, transparent 25%) -25px 0,
        linear-gradient(315deg, white 25%, transparent 25%),
        linear-gradient(45deg, white 25%, transparent 25%);
      background-size: 50px 50px;
      background-color: blue;

      h3 {
        background: blue;
      }
    }

    &.red.zigzag {
      background: linear-gradient(135deg, white 25%, transparent 25%) -25px 0,
        linear-gradient(225deg, white 25%, transparent 25%) -25px 0,
        linear-gradient(315deg, white 25%, transparent 25%),
        linear-gradient(45deg, white 25%, transparent 25%);
      background-size: 50px 50px;
      background-color: red;

      h3 {
        background: red;
      }
    }

    &.black.zigzag {
      border: 1px solid black;
      background: linear-gradient(135deg, white 25%, transparent 25%) -25px 0,
        linear-gradient(225deg, white 25%, transparent 25%) -25px 0,
        linear-gradient(315deg, white 25%, transparent 25%),
        linear-gradient(45deg, white 25%, transparent 25%);
      background-size: 50px 50px;
      background-color: black;
      h3 {
        background: black;
      }
    }
    &.yellow.zigzag {
      background: linear-gradient(135deg, white 25%, transparent 25%) -25px 0,
        linear-gradient(225deg, white 25%, transparent 25%) -25px 0,
        linear-gradient(315deg, white 25%, transparent 25%),
        linear-gradient(45deg, white 25%, transparent 25%);
      background-size: 50px 50px;
      background-color: yellow;
      h3 {
        background: yellow;
      }
    }
  }

  @media screen and (max-width: 700px) {
    .scroll {
      grid-template-columns: 1fr 1fr;
    }
    .block h3{
      font-size: 25px;
    }
  }
}
</style>
