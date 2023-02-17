export const inputProps = {
  modelValue: {
    type: [Number, String],
  },
  placeholder: {
    type: String,
    default: '请输入',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
}
export const inputEmits = ['update:modelValue', 'change', 'input']
