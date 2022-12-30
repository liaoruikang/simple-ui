
import { defineComponent, ref } from 'vue'
import { inputProps, inputEmits } from './inputConfig'
const __sfc_input__ = defineComponent({
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

__sfc_input__.__scopeId='data-v-1672382421269'
import { vModelText as _vModelText, withDirectives as _withDirectives, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

export function render(_ctx, _cache) {
  return _withDirectives((_openBlock(), _createElementBlock("input", {
    type: "text",
    class: "simple-input",
    "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.value) = $event)),
    onInput: _cache[1] || (_cache[1] = (...args) => (_ctx.onInput && _ctx.onInput(...args)))
  }, null, 544 /* HYDRATE_EVENTS, NEED_PATCH */)), [
    [_vModelText, _ctx.value]
  ])
}
__sfc_input__.render = render
export default __sfc_input__