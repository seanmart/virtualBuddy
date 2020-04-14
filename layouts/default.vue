<template>
  <div v-window>
    <nuxt />
    <p class="credentials">© seancode 2020</p>
  </div>
</template>
<script>
export default {};
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

a{
  font-size: 3vw;
  padding: 1vw 2vw;
  margin: 1vw 0px;
  color: white;
  text-decoration: none;
  background: blue;
  border-radius: .5vw;
  display: inline-block;
}

.credentials{
  position: fixed;
  left: 0px;
  bottom: 0px;
  right: 0px;
  text-align: center;
  padding: 20px;
}
</style>
