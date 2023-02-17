<template>
  <div class="s-input" :class="{ 'is-disabled': disabled }">
    <div class="s-input__prepend" v-if="slot_keys.includes('prepend')">
      <slot name="prepend"></slot>
    </div>
    <div
      class="s-input__wrapper"
      :class="{
        'is-prepend': slot_keys.includes('prepend'),
        'is-append': slot_keys.includes('append'),
      }"
    >
      <span class="s-input__prefix" v-if="slot_keys.includes('prefix')">
        <slot name="prefix"></slot>
      </span>
      <input
        ref="input"
        class="s-input__inner"
        v-model="value"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="oninput"
        type="text"
        @change="emit('change', value)"
      />
      <span class="s-input__suffix" v-if="slot_keys.includes('suffix')">
        <slot name="suffix"></slot>
      </span>
    </div>
    <div class="s-input__append" v-if="slot_keys.includes('append')">
      <slot name="append"></slot>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, reactive } from 'vue'
import { inputProps, inputEmits } from './inputConfig'
export default defineComponent({
  props: inputProps,
  emits: inputEmits,
  name: 's-input',
  setup({ modelValue }, { emit, slots }) {
    const value = ref(modelValue)
    const slot_keys = reactive(Object.keys(slots))

    const oninput = () => {
      emit('update:modelValue', value.value)
      emit('input', value.value)
      setTimeout(() => {}, 300)
    }

    return {
      value,
      oninput,
      emit,
      slot_keys,
    }
  },
})
</script>
