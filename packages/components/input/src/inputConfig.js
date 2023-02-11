export const inputProps = {
  modelValue: {
    type: [Number, String],
  },
  height: {
    type: [Number, String],
    default: 20,
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
}
export const inputEmits = ['update:modelValue', 'change', 'input']
