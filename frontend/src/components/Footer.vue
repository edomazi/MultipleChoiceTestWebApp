<template>
  <div class="footer">
    <template v-if="computeLoggedIn">
      <img src="../../public/images/Quiz-Banner.png" alt="banner" class="image">
    </template>
    <template v-else>
      <img src="../../public/images/banner2.jpg" alt="banner" class="image">
    </template>
  </div>
</template>

<script>
export default {
  name: "Footer",
  computed: {
    computeLoggedIn() {
      return localStorage.getItem('token');
    },
  }
}
</script>

<style scoped>
.image{
  max-width: 100%;
  height: auto;
  min-height: 100%;
  background-position: center;
  background-size: cover;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  color: white;
  text-align: center;
  z-index: -9999;
}
</style>
