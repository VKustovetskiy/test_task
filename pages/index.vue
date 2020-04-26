<template>
  <section class="container">
    <user-card />
    <user-card />
    <user-card />
  </section>
</template>

<script>
import UserCard from '~/components/UserCard.vue'

export default {
  components: {
    UserCard
  }
}
</script>

<style lang="scss">
body {
  /* font-family: 'UbuntuItalic', sans-serif; */
}

.container {
  display: flex;
  min-height: 100vh;
  text-align: center;
  padding: 15px;
}

::selection {
  color: #fff;
  background-color: #83ba43;
}
</style>

