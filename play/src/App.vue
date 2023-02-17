<template>
  <div class="app_container">
    <button @click="change">换肤</button>
    <!-- <s-timeline
      v-model="value"
      value-format="yyyy-MM-dd hh:mm:ss"
      format="hh:mm:ss"
      infinite
    ></s-timeline> -->
    <s-input v-model="value">
      <template #append>
        <button>测试</button>
      </template>
      <template #prepend>测试</template>
      <!-- <template #prefix></template> -->
      <template #suffix>测试</template>
    </s-input>
    {{ value }}
  </div>
</template>
<script setup>
import { ref } from 'vue'
const value = ref('')

const change = () => {
  document.documentElement.classList.toggle('dark')
}
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
