<template>
  <div
    class="s-input"
    :style="{
      height: !isNaN(height) ? height + 'px' : height
    }"
  >
    <input
      ref="input"
      class="s-input_inner"
      v-model="value"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="oninput"
      type="text"
      @change="emit('change', value)"
    />
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue'
import { inputProps, inputEmits } from './inputConfig'
export default defineComponent({
  props: inputProps,
  emits: inputEmits,
  name: 's-input',
  setup({ modelValue }, { emit }) {
    const value = ref(modelValue)
    const input = ref(null)

    onMounted(() => {
      console.log(input)
    })

    const oninput = () => {
      emit('update:modelValue', value.value)
      emit('input', value.value)
      setTimeout(() => {}, 300)
    }

    return {
      value,
      oninput,
      emit
    }
  }
})
</script>
<style lang="scss" scoped>
@use '@simple-ui/theme-chalk/src/input';
</style>
