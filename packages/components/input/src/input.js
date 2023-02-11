
import { defineComponent, onMounted, ref } from 'vue'
import { inputProps, inputEmits } from './inputConfig'
const __sfc_input__ = defineComponent({
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

__sfc_input__.__scopeId='data-v-1676132153405'
import { vModelText as _vModelText, createElementVNode as _createElementVNode, withDirectives as _withDirectives, normalizeStyle as _normalizeStyle, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = ["placeholder", "disabled"]

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", {
    class: "s-input",
    style: _normalizeStyle({
      height: !isNaN(_ctx.height) ? _ctx.height + 'px' : _ctx.height
    })
  }, [
    _withDirectives(_createElementVNode("input", {
      ref: "input",
      class: "s-input_inner",
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.value) = $event)),
      placeholder: _ctx.placeholder,
      disabled: _ctx.disabled,
      onInput: _cache[1] || (_cache[1] = (...args) => (_ctx.oninput && _ctx.oninput(...args))),
      type: "text",
      onChange: _cache[2] || (_cache[2] = $event => (_ctx.emit('change', _ctx.value)))
    }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_1), [
      [_vModelText, _ctx.value]
    ])
  ], 4 /* STYLE */))
}
__sfc_input__.render = render
export default __sfc_input__