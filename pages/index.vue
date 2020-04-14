<template lang="html">
  <div id="examples">
    <div class="content">
      <h1>Examples</h1>
      <nuxt-link to="hoverButton">Hover Button</nuxt-link>
      <nuxt-link to="objectAnimation">Object Animation</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
#examples{
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center
}

#examples h1{
  display: block;
  font-size: 6vw;
  margin-bottom: 5vw;
}

#examples a{
  display: block;
}
</style>
