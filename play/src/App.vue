<template>
  <s-input v-model="value"></s-input>
  <s-alert></s-alert>
  <p>{{ value }}</p>
</template>
<script setup>
import { ref } from 'vue'

const value = ref('123')
</script>
<style lang="less" scoped></style>
