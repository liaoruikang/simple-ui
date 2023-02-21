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
      size="small"
      ref="input"
      :maxLength="30"
      showLimit
      placeholder="测试文本"
      type="text"
      v-model="value"
      :formatter="value => '￥' + value + ' &'"
      clearable
    >
      <!-- 
      <template #append>
        <button @click="$refs.input.focus(), $refs.input.select()">获取焦点并全选</button>
      </template>
      <template #prepend>
        <button @click="$refs.input.blur()">失去焦点</button>
      </template>
      <template #prefix></template>
      <template #suffix>测试</template> -->
    </s-input>
    <s-input
      tabindex="5"
      placeholder="测试文本"
      :rows="5"
      showLimit
      autofocus
      :maxLength="30"
      :formatter="value => '￥' + value + ' &'"
      type="textarea"
      v-model="value"
      clearable
    ></s-input>
    <s-input
      size="small"
      type="number"
      number-type="float"
      :precision="1"
      tabindex="5"
      placeholder="测试文本"
      :step="0.395"
      strictly-step
      :rows="5"
      showLimit
      :maxLength="30"
      :formatter="value => '￥' + value + ' &'"
      v-model="value"
      clearable
    ></s-input>
    <s-input
      size="large"
      type="password"
      tabindex="5"
      placeholder="测试文本"
      showLimit
      show-password
      :maxLength="30"
      v-model="value"
      clearable
    ></s-input>
    {{ value }}
  </div>
</template>
<script setup>
import { ref } from 'vue'
const value = ref(65.3)

const c = val => {
  console.log(val)
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
