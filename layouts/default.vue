<template>
  <div id="page">
    <header>
      <nuxt-link to="/" class="logo">Virtual Buddy</nuxt-link>
      <nav>
        <nuxt-link to="follower">follower</nuxt-link>
        <nuxt-link to="percent">percent</nuxt-link>
        <nuxt-link to="sticky">sticky</nuxt-link>
      </nav>
    </header>

      <nuxt />

      <div class="background" />

    <footer>
      <p>© seanmware 2020</p>
    </footer>
  </div>
</template>
<script>
export default {};
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  font-size: 15px;
  color: black;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.container{
  padding: 150px 10vw;
}

.background{
  background: white;
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100vh;
  width: 100vw;
  z-index: -1;
}

a{
  text-decoration: none;
  display: inline-block;
  color: inherit;
}

header,
footer{
  position: fixed;
  z-index: 100;
  left: 0px;
  right: 0px;
  padding: 20px 10vw;
}

header{
  top: 0px;
  mix-blend-mode:difference;
  color: white;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: space-between;
  align-items: center;
}

header .logo{
  font-size: 50px;
  font-weight: bold;
  flex: 0 0 auto;
}

footer{
  flex: 0 0 auto;
  bottom: 0px;
  text-align: center;
}

nav{
  display: flex;
  flex-direction: row;
  margin-left: auto;
}

nav a{
  padding: 10px 20px;
  border: 1px solid white;
  color: white;
  border-radius: 5px;
  margin-left: 5px;
}

@media screen and (max-width: 600px){
  header .logo{
    font-size: 25px;
  }

  .container{
    padding-left: 0px;
    padding-right: 0px;
  }
}
</style>
