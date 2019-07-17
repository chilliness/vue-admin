<template>
  <div class="warning-wrap">
    <h2 class="text">警告! 权限异常</h2>
    <p class="desc">Warning! Permission exception</p>
  </div>
</template>

<script>
export default {
  name: 'Warning'
};
</script>

<style lang="scss" scoped>
.warning-wrap {
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
