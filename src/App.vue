/* eslint-disable */

<template lang="html">
  <main>
    <header>
      <h1>Virtual Buddy</h1>
    </header>
    <blocks />
  </main>
</template>

<script>
import blocks from "@/components/blocks";
export default {
  components: { blocks }
};
</script>
<style lang="less">
* {
  margin: 0px;
  padding: 0px;
  line-height: 1;
  box-sizing: border-box;
}

html {
  font-family: "arial";
  background: white;
}

main {
  padding: 150px 0px 0px;
}

header {
  position: fixed;
  z-index: 100;
  top: 0px;
  left: 0px;
  right: 0px;
  padding: 50px 10vw;
  mix-blend-mode: difference;
  color: white;

  h1 {
    mix-blend-mode: difference;
    color: white;
  }
}
</style>
