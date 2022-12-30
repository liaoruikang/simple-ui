<template>
  <input type="text" class="simple-input" v-model="value" @input="onInput" />
</template>
<script>
import { defineComponent, ref } from 'vue'
import { inputProps, inputEmits } from './inputConfig'
export default defineComponent({
  name: 's-input',
  props: inputProps,
  emits: inputEmits,
  setup(props, { emit }) {
    const value = ref(props.modelValue)
    const onInput = () => {
      emit('update:modelValue', value.value)
    }
    return {
      onInput,
      value,
    }
  },
})
</script>
<style lang="less" scoped></style>
