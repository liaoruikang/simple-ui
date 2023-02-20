<template>
  <button @click="change">换肤</button>
  <div class="app_container">
    <!-- <s-timeline
      v-model="value"
      value-format="yyyy-MM-dd hh:mm:ss"
      format="hh:mm:ss"
      infinite
    ></s-timeline> -->
    <s-input
      v-model="value"
      type="password"
      number-type="float"
      :rows="2"
      :auto-size="{
        minRows: 0,
        maxRows: 10
      }"
      :max="1000"
      :precision="2"
      :max-length="20"
      clearable
      @input:lazy="c"
      show-limit
      show-password
      :step="0.8"
      strictly-step
      :formatter="(value) => '￥' + value"
    >
      <template #append>
        <button>测试</button>
      </template>
      <template #prepend>测试</template>
      <!-- <template #prefix></template> -->
      <!-- <template #suffix>测试</template> -->
    </s-input>
    {{ value }}
  </div>
</template>
<script setup>
import { ref } from 'vue'
const value = ref(65.3)

const c = (val) => {
  // console.log(val)
}

const change = () => {
  document.documentElement.classList.toggle('dark')
}
</script>
<style lang="scss" scoped>
.app_container {
  width: 50%;
  height: 600px;
  margin: 100px auto;
}
</style>
