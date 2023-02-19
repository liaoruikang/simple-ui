<template>
  <div
    class="s-textarea"
    :class="{
      'is-disabled': disabled,
    }"
    v-if="type === 'textarea'"
  >
    <textarea
      class="s-textarea__inner"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      :style="autosize_styles"
      ref="textarea"
      :rows="rows"
      :readonly="readonly"
      @input="oninput"
      @blur="change"
    />
    <span class="s-textarea__limit" v-if="showLimit">
      {{ textLength }} / {{ maxLength || '~' }}
    </span>
  </div>
  <div class="s-input" v-else>
    <div class="s-input__prepend" v-if="slot_keys.includes('prepend')">
      <slot name="prepend"></slot>
    </div>
    <div
      class="s-input__wrapper"
      :class="{
        'is-prepend': slot_keys.includes('prepend'),
        'is-append': slot_keys.includes('append'),
        'is-disabled': disabled,
      }"
    >
      <span class="s-input__prefix" v-if="slot_keys.includes('prefix')">
        <slot name="prefix"></slot>
      </span>
      <input
        ref="input"
        class="s-input__inner"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :type="type"
        :readonly="readonly"
        @keydown.enter="change"
        @blur="change"
        @input="oninput"
      />
      <span class="s-input__limit" v-if="showLimit">
        {{ textLength }} / {{ maxLength || '~' }}
      </span>
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
import { defineComponent, reactive, ref, computed, toRefs } from 'vue'
import { inputProps, inputEmits } from './input'
export default defineComponent({
  props: inputProps,
  emits: inputEmits,
  name: 's-input',
  setup(props, { emit, slots }) {
    const { type, rows, readonly, maxLength, showLimit } = toRefs(props)
    const value = ref(props.modelValue)
    const slot_keys = reactive(Object.keys(slots))
    const textLength = ref(value.value?.length)
    const textarea = ref()

    let oldValue = ''
    let timer = null
    let key
    const autosize = props.autoSize

    const formatter = props.formatter

    // 初始格式化
    if (formatter) {
      key = formatter(value.value)
        .replace(new RegExp(`[${value.value}]`, 'g'), '')
        .split('')
      value.value = formatter(value.value)
      emit('update:modelValue', value.value)
    }

    const oninput = e => {
      const { value: targetValue } = e.target
      value.value = targetValue

      // 处理格式化
      if (formatter) {
        const reg = new RegExp(`[${key.map(item => '\\' + item).join('')}]`, 'g')

        // 处理删除文本
        if (e.inputType == 'deleteContentBackward' && e.target.selectionEnd == value.value.length) {
          const length = value.value.length
          value.value = value.value.replace(new RegExp(reg, 'g'), '')
          value.value = formatter(value.value)
          if (value.value.length !== length) {
            const arr = value.value.replace(new RegExp(reg, 'g'), '').split('')
            arr.splice(arr.length - 1, 1)
            value.value = formatter(arr.join(''))
          }
        }
        value.value = value.value.replace(new RegExp(reg, 'g'), '')

        // 格式化后最大值输入校准
        if (maxLength.value && value.value.length > maxLength.value) {
          value.value = value.value.slice(0, maxLength.value)
        }

        textLength.value = value.value.length
        textLength.value = value.value.length
        value.value = formatter(value.value)
      } else {
        // 最大值输入
        if (maxLength.value && value.value.length > maxLength.value) {
          value.value = value.value.slice(0, maxLength.value)
        }

        textLength.value = value.value.length
      }

      emit('update:modelValue', value.value)
      emit('input', value.value)

      clearTimeout(timer)
      timer = setTimeout(() => {
        emit('input:lazy', value.value)
        clearTimeout(timer)
      }, 300)
    }

    const change = () => {
      if (value.value !== oldValue) {
        emit('change', value.value)
        oldValue = value.value
      }
    }

    const autosize_styles = computed(() => {
      if (textarea.value) {
        const textarea_height = getComputedStyle(textarea.value)
          .getPropertyValue('--s-textarea-height')
          .replace(/px/g, '')
        if (autosize) {
          const style = {}
          style.minHeight = textarea_height * (autosize.minRows || 1) + 'px'
          if (autosize.maxRows) {
            style.maxHeight = textarea_height * autosize.maxRows + 'px'
          }
          return style
        } else {
          return {
            minHeight: textarea_height * rows.value + 'px',
          }
        }
      } else {
        return {}
      }
    })
    return {
      value,
      type,
      oninput,
      emit,
      slot_keys,
      autosize_styles,
      textarea,
      rows,
      change,
      readonly,
      maxLength,
      showLimit,
      textLength,
    }
  },
})
</script>
