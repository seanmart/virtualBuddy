<template lang="html">
  <main class="container" ref="page" id="sticky">
      <section class="target">
        section 1
      </section>
      <section ref="el" class="sticky">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pretium interdum nulla,
        in tincidunt ante lacinia in. Aenean eu placerat libero. Mauris sed arcu at purus fringilla
        mattis vel iaculis eros. Sed at dolor tincidunt, fermentum lorem ac, lobortis nisi.
        Nulla sodales dui nec lacus consequat, et interdum metus rhoncus. Mauris at feugiat dui,
        sit amet porttitor neque. Cras hendrerit at velit id congue. In aliquam enim mi, at lacinia
        velit ultrices aliquam. Sed non ex velit. Sed pharetra eu dui non tincidunt. Curabitur
        nunc lacus, ultrices id pulvinar non, bibendum cursus nisi.

        In hac habitasse platea dictumst. Phasellus eu tellus feugiat, faucibus nulla luctus, vehicula
        lacus. Fusce consequat ultrices porttitor. Aliquam vestibulum ornare felis, sed vulputate neque
        feugiat a. Ut turpis tortor, pretium ac sem ut, faucibus bibendum augue. Curabitur ac tellus
        iaculis, aliquet risus a, malesuada massa. Vestibulum ante ipsum primis in faucibus orci luctus
        et ultrices posuere cubilia curae; Duis ac nisl a odio consectetur posuere at quis nisi.
        Ut risus augue, finibus eget velit eget, consequat ornare nisl.

        Praesent massa nulla, lobortis et magna vel, accumsan gravida ex. Vivamus semper urna eu ante
        rutrum interdum. Etiam mattis malesuada nisl. Phasellus varius laoreet sollicitudin. Nam dapibus
        dolor dapibus nunc placerat tristique. Cras porttitor porttitor lacus sed pretium. Cras
        pellentesque velit non lacus tincidunt mollis. Nam eget fermentum magna, vitae hendrerit sem.
        Integer vulputate pulvinar nisl, sit amet laoreet erat finibus eu. Sed nibh nulla, pulvinar
        eget maximus in, malesuada sit amet ante. Sed vitae sem quis diam consectetur venenatis
        tincidunt ut ipsum. Mauris sed elit hendrerit, sollicitudin turpis sit amet, sollicitudin
        nunc. Vestibulum accumsan ornare pretium. Nullam imperdiet mollis justo ut sollicitudin.
      </section>
      <section class="target">
        section 1
      </section>
  </main>
</template>

<script>
export default {
  mounted(){
    this.$vb.init(this.$refs.page,true)
    this.$vb.addElement(this.$refs.el,{
      sticky: true,
      duration: '100%y'
    })
  }
}
</script>

<style lang="css">
#sticky{
  padding-top: 100vh;
  padding-bottom: 100vh;
}

#sticky section{
  height: 700px;
  background: red;
  position: relative;
  z-index: 1
}

#sticky section.sticky{
  background: blue;
  color: white;
  padding: 3vw;
  font-size: 1.5vw;
  transform: translateY(-100%);
  z-index: 0
}
</style>
