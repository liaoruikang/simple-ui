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
      v-model="value"
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
    <div
      class="s-input__prepend"
      :style="{
        cursor: 'pointer',
      }"
      v-if="type === 'number' && showControl"
      @mousedown="controlChange('sub')"
    >
      <span class="s-input__prepend--sub">-</span>
    </div>
    <div class="s-input__prepend" v-else-if="slot_keys.includes('prepend')">
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
        v-model="value"
        :placeholder="placeholder"
        :disabled="disabled"
        :type="type === 'number' ? 'text' : showPass ? 'text' : type"
        :readonly="readonly"
        @keydown.enter="change"
        @blur="change"
        @input="oninput"
      />

      <span tabindex="-1" class="s-input__tool" v-if="!disabled" v-show="value">
        <span class="s-input__tool--clear" v-if="clearable" @click="clear">
          <i class="s-icon-clear"></i>
        </span>
        <span
          class="s-input__tool--password"
          v-if="showPassword && type === 'password'"
          @click="showPass = !showPass"
        >
          <i :class="showPass ? 's-icon-eye-hide' : 's-icon-eye-show'"></i>
        </span>
      </span>
      <span class="s-input__limit" v-if="showLimit && !disabled && type !== 'number'">
        {{ textLength }} / {{ maxLength || '~' }}
      </span>

      <span class="s-input__suffix" v-if="slot_keys.includes('suffix')">
        <slot name="suffix"></slot>
      </span>
    </div>
    <div
      class="s-input__append"
      :style="{
        cursor: 'pointer',
      }"
      v-if="type === 'number' && showControl"
      @mousedown="controlChange('add')"
    >
      <span class="s-input__append--add">+</span>
    </div>
    <div class="s-input__append" v-else-if="slot_keys.includes('append')">
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
    const { type, rows, maxLength, showLimit } = toRefs(props)
    const value = ref(props.modelValue)
    const slot_keys = reactive(Object.keys(slots))
    const textLength = ref(value.value.toString()?.length)
    const showPass = ref(false)
    const textarea = ref()

    let oldValue = ''
    let timer = null
    let key
    const { autosize, numberType, formatter, min, max, precision, strictlyStep, step } = props

    const filterValue = () => {
      const reg = new RegExp(`[${key.map(item => '\\' + item).join('')}]`, 'g')
      value.value = value.value.replace(new RegExp(reg, 'g'), '')
    }

    // 过滤非法数字
    const filterNumber = (value, float = true) => {
      if (!value?.split) {
        return Number(value).toString()
      }
      let isDot = false
      let number = value
        .split('')
        .filter((item, index) => {
          if (index === 0 && item === '-') return true
          if (float) {
            switch (numberType) {
              case 'float':
                if (item === '.' && !isDot) {
                  isDot = true
                  return true
                }
                return !isNaN(item)
              default:
                return !isNaN(item)
            }
          }
          return !isNaN(item)
        })
        .join('')
      return number
    }

    const setPrecision = number => {
      if (precision > 100 || precision < 0) throw new Error('"precision" It ranges from 0 to 100.')
      return precision !== undefined
        ? Number(number).toFixed(precision).toString()
        : Number(number).toString()
    }

    const numberLimit = (value, fn) => {
      if (value < min) {
        value = min.toString()
      } else if (value > max) {
        value = max.toString()
      }
      return fn?.(value) || Number(value).toString()
    }

    const textLimit = () => {
      if (type.value !== 'number') {
        // 格式化后最大值输入校准
        if (maxLength.value && value.value.toString().length > maxLength.value) {
          value.value = value.value.toString().slice(0, maxLength.value)
        }
        textLength.value = value.value.toString().length
      }
    }
    // 处理步长
    const checkStep = (value, fn) => {
      if (strictlyStep) {
        value = Math.floor((value * 10000) / (step * 10000)) * step
        return fn?.(value) || Number(value).toString()
      }
      return value
    }
    // 处理类型number
    if (type.value === 'number') {
      value.value = filterNumber(value.value)
      // 数值大小限制
      value.value = numberLimit(value.value, setPrecision)
      value.value = checkStep(value.value, setPrecision)

      emit('update:modelValue', value.value)
    } else {
      textLimit()
      emit('update:modelValue', value.value)
    }

    // 初始格式化
    if (formatter && type.value !== 'password') {
      key = formatter(value.value)
        .replace(new RegExp(`[${value.value}]`, 'g'), '')
        .split('')
      value.value = formatter(value.value)
      emit('update:modelValue', value.value)
    }

    // 处理格式化
    const formatValue = e => {
      if (type.value === 'password') {
        textLimit()
        return value.value
      }

      const reg = new RegExp(`[${key.map(item => '\\' + item).join('')}]`, 'g')

      // 处理删除文本
      if (
        (e?.inputType === 'deleteContentBackward' || e?.inputType === 'deleteWordBackward') &&
        e.target?.selectionEnd == value.value.length
      ) {
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

      if (type.value !== 'number') textLimit()

      value.value = formatter(value.value)
    }

    const oninput = e => {
      // number限制
      if (type.value === 'number') {
        filterValue()
        value.value = filterNumber(value.value)
        value.value = formatter(value.value)
      }

      // 处理格式化
      if (formatter) {
        formatValue(e)
      } else if (type.value !== 'number') {
        // 最大值输入
        textLimit()
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
      if (type.value === 'number') {
        filterValue()
        value.value = value.value === '.' ? min?.toString() || '0' : value.value
        value.value = value.value === '-' ? min?.toString() || '0' : value.value
        value.value = filterNumber(value.value)
        value.value = numberLimit(value.value, setPrecision)
        value.value = checkStep(value.value, setPrecision)
        value.value = formatter(value.value)
      }
      if (formatter) {
        formatValue()
      }
      emit('update:modelValue', value.value)
      if (value.value !== oldValue) {
        emit('change', value.value)
        oldValue = value.value
      }
    }

    let tiemrOut = null
    const stepChange = type => {
      filterValue()
      value.value = Number(value.value)
      switch (type) {
        case 'sub':
          value.value = (value.value * 10000 - step * 10000) / 10000
          break
        case 'add':
          value.value = (value.value * 10000 + step * 10000) / 10000
          break
      }
      value.value = numberLimit(value.value, setPrecision)
      value.value = checkStep(value.value, setPrecision)
      value.value = formatter(value.value)
      emit('update:modelValue', value.value)
    }
    const controlChange = type => {
      let timer = null

      stepChange(type)
      clearTimeout(tiemrOut)
      tiemrOut = setTimeout(() => {
        timer = setInterval(() => {
          stepChange(type)
        }, 100)
      }, 300)

      const up = () => {
        clearInterval(timer)
        clearTimeout(tiemrOut)
      }

      window.addEventListener('mouseup', up)
    }

    const clear = () => {
      if (type.value === 'number') {
        value.value = value.value = numberLimit('0', setPrecision)
      } else {
        value.value = ''
      }

      if (formatter) {
        formatValue()
      }

      emit('update:modelValue', value.value)
      emit('input', value.value)
      emit('clear')
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
      oninput,
      type,
      emit,
      slot_keys,
      autosize_styles,
      textarea,
      rows,
      change,
      maxLength,
      showLimit,
      textLength,
      clear,
      showPass,
      controlChange,
    }
  },
})
</script>
