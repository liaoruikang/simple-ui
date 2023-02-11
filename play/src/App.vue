<template>
  <div class="app_container">
    <s-timeline
      v-model="value"
      value-format="yyyy-MM-dd hh:mm:ss"
      format="hh:mm:ss"
      infinite
    ></s-timeline>
    {{ value }}
  </div>
</template>
<script setup>
import { ref } from 'vue'
const value = ref(new Date())
</script>
<style lang="less">
* {
  margin: 0;
}
</style>
<style lang="less" scoped>
.app_container {
  width: 50%;
  height: 600px;
  margin: 100px auto;
}
</style>
