<template>
  <div class="home_container">
    <div class="banner"></div>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
</script>
<style lang="scss" scoped>
.home_container {
  .banner {
    height: 460px;
    background: linear-gradient(
      135deg,
      rgba(82, 63, 170, 0.7341960784313726) 0%,
      rgba(234, 155, 235, 0.9936862745098038) 100%
    );
  }
}
</style>
