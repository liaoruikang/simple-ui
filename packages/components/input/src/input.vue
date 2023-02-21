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
      :rows="autoSize ? undefined : rows"
      :readonly="readonly"
      :tabindex="tabindex"
      @input="oninput"
      @blur="change(), emit('blur', $event)"
      @focus="emit('focus', $event)"
      @select="onSelect"
    />
    <span class="s-textarea__limit" v-if="showLimit">
      {{ textLength }} / {{ maxLength || '~' }}
    </span>
  </div>
  <div class="s-input" :class="`s-input--${size}`" v-else>
    <div
      class="s-input__prepend"
      :style="{
        cursor: 'pointer',
      }"
      v-if="type === 'number' && showControl"
      @mousedown="controlChange('sub')"
    >
      <s-icon class="s-input__prepend--sub" icon="s-icon-sub"></s-icon>
    </div>
    <div class="s-input__prepend" v-else-if="slot_keys.includes('prepend')">
      <slot name="prepend"></slot>
    </div>

    <div
      class="s-input__wrapper"
      :class="{
        'is-prepend': slot_keys.includes('prepend') || (type === 'number' && showControl),
        'is-append': slot_keys.includes('append') || (type === 'number' && showControl),
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
        :tabindex="tabindex"
        @keydown.enter="change"
        @input="oninput"
        @blur="change(), emit('blur', $event)"
        @focus="emit('focus', $event)"
        @select="onSelect"
      />

      <span tabindex="-1" class="s-input__tool" v-if="!disabled" v-show="value">
        <span class="s-input__tool--clear" v-if="clearable" @click="clear">
          <s-icon icon="s-icon-clear"></s-icon>
        </span>
        <span
          class="s-input__tool--password"
          v-if="showPassword && type === 'password'"
          @click="showPass = !showPass"
        >
          <s-icon :icon="showPass ? 's-icon-eye-hide' : 's-icon-eye-show'"></s-icon>
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
      <s-icon class="s-input__append--add" icon="s-icon-add"></s-icon>
    </div>
    <div class="s-input__append" v-else-if="slot_keys.includes('append')">
      <slot name="append"></slot>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, computed, toRefs, onMounted, watch, nextTick } from 'vue'
import { props, emits } from './config'
import SIcon from '../../icon/index'
export default defineComponent({
  name: 's-input',
  components: { SIcon },
  props,
  emits,
  setup(props, { emit, slots, expose }) {
    const { type, autoSize, maxLength, showLimit, tabindex, modelValue } = toRefs(props)
    const slot_keys = reactive(Object.keys(slots))
    const showPass = ref(false)
    const textarea = ref()
    const input = ref()
    let value = ref('')
    let textLength = ref(0)
    let oldValue = ''
    let timer = null
    let key
    let isInit = false
    const { numberType, formatter, min, max, precision, strictlyStep, step, autofocus, rows } =
      props

    const filterValue = value => {
      if (formatter) {
        const reg = new RegExp(`[${key.map(item => '\\' + item).join('')}]`, 'g')
        value = value.replace(new RegExp(reg, 'g'), '')
        return value
      }
      return value
    }

    // 过滤非法数字
    const filterNumber = (value, float = true) => {
      if (!value?.split) {
        return Number(value).toString()
      }
      value = numberType === 'float' ? value : parseInt(value).toString()
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
        value = ((value * 10000) / (step * 10000)) * step
        if (max && value > max) value -= step
        return fn?.(value) || Number(value).toString()
      }
      return value
    }

    const init = async () => {
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
        await nextTick()
        emit('update:modelValue', value.value)
      }
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
        e.target?.selectionEnd <= value.value.length
      ) {
        const length = value.value.length
        value.value = value.value.replace(new RegExp(reg, 'g'), '')
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

    const getRow = () => {
      const style = getComputedStyle(textarea.value)
      textarea.value.style.height = 0
      const padding =
        Number(filterNumber(style.paddingTop)) + Number(filterNumber(style.paddingBottom))
      return parseInt(
        (textarea.value.scrollHeight - padding) / Number(filterNumber(style.lineHeight))
      )
    }

    const row = ref(1)

    const oninput = e => {
      // number限制
      if (type.value === 'number') {
        value.value = filterValue(value.value)
        value.value = filterNumber(value.value)
        if (formatter) value.value = formatter(value.value)
      } else if (type.value === 'textarea' && autoSize.value) {
        row.value = getRow()
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
        value.value = filterValue(value.value)
        value.value = value.value === '.' ? min?.toString() || '0' : value.value
        value.value = value.value === '-' ? min?.toString() || '0' : value.value
        value.value = filterNumber(value.value)
        value.value = numberLimit(value.value, setPrecision)
        value.value = checkStep(value.value, setPrecision)
        if (formatter) value.value = formatter(value.value)
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
      value.value = filterValue(value.value)
      value.value = Number(value.value)
      switch (type) {
        case 'sub':
          value.value = (value.value * 10000 - step * 10000) / 10000
          break
        case 'add':
          console.log(value.value)
          value.value = (value.value * 10000 + step * 10000) / 10000
          console.log(value.value)
          break
      }
      value.value = numberLimit(value.value, setPrecision)
      console.log(value.value)
      value.value = checkStep(value.value, setPrecision)
      console.log(value.value)
      if (formatter) value.value = formatter(value.value)
      console.log(value.value)
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

    const autosize_styles = computed(() => {
      if (textarea.value) {
        const textarea_height = getComputedStyle(textarea.value)
          .getPropertyValue('--s-textarea-height')
          .replace(/px/g, '')
        if (autoSize.value) {
          const style = {}
          style.minHeight = textarea_height * (autoSize.value.minRows || 1) + 'px'
          if (autoSize.value.maxRows) {
            style.maxHeight = textarea_height * autoSize.value.maxRows + 'px'
          }
          style.height = textarea_height * row.value + 'px'
          return style
        } else {
          const style = {
            minHeight: textarea_height + 'px',
          }
          return style
        }
      } else {
        return {}
      }
    })

    onMounted(() => {
      if (autofocus) focus()
      if (type.value === 'textarea' && autoSize.value) row.value = getRow()
    })

    watch(
      modelValue,
      val => {
        value.value = val ?? ''
        if (!isInit) {
          init()
          isInit = true
        }
        textLength.value = filterValue(val?.toString()).length
      },
      {
        immediate: true,
      }
    )

    const focus = () => {
      if (type.value === 'textarea') {
        textarea.value.focus()
      } else {
        input.value.focus()
      }
    }

    const select = async () => {
      if (type.value === 'textarea') {
        textarea.value.select()
      } else {
        input.value.select()
      }
    }

    const blur = () => {
      if (type.value === 'textarea') {
        textarea.value.blur()
      } else {
        input.value.blur()
      }
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

      textLength.value = filterValue(value.value?.toString()).length

      emit('update:modelValue', value.value)
      emit('input', value.value)
      emit('clear')
    }

    // 防止事件多次触发
    let isSelect = false
    let selectTimer = null
    const onSelect = e => {
      if (isSelect) return
      clearTimeout(selectTimer)
      selectTimer = setTimeout(() => {
        isSelect = false
        clearTimeout(selectTimer)
      }, 100)
      isSelect = true
      emit('select', e)
    }

    expose({
      focus,
      blur,
      select,
      clear,
    })

    return {
      value,
      oninput,
      type,
      emit,
      slot_keys,
      autosize_styles,
      textarea,
      input,
      rows,
      change,
      maxLength,
      showLimit,
      textLength,
      clear,
      showPass,
      controlChange,
      tabindex,
      onSelect,
      autoSize,
    }
  },
})
</script>
