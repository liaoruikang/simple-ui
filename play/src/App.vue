<template>
  <button @click="change">换肤</button>
  <div class="app_container">
    <s-timershaft v-model="value" :proportion="120" :value-format="f"></s-timershaft>

    {{ value }}
  </div>
</template>
<script setup>
import { ref } from 'vue'
const value = ref(new Date())

const f = ref('hh:mm:ss')

const c = val => {
  console.log(val)
}

const change = () => {
  document.documentElement.classList.toggle('dark')
  f.value = 'hh:mm'
}
</script>
<style lang="scss" scoped>
.app_container {
  width: 50%;
  height: 600px;
  margin: 100px auto;
}
</style>
