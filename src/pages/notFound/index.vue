<template>
  <div class="notFound-wrap">
    <h2 class="text">404</h2>
    <p class="desc">Page Not Found</p>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>

<style lang="scss" scoped>
.notFound-wrap {
  @include fcol();
  width: 100vw;
  height: 100vh;
  background: #231a13;
  .text {
    font-size: 48px;
    color: #f8b700;
  }
  .desc {
    padding-top: 20px;
    font-size: 20px;
    color: #fff;
  }
}
</style>
