export const inputProps = {
  modelValue: {
    type: [Number, String],
  },
  placeholder: {
    type: String,
    default: '请输入内容',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'text',
  },
  autoSize: {
    type: [Object, Boolean],
    default: false,
  },
  rows: {
    type: Number,
    default: 1,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  maxLength: {
    type: Number,
  },
  showLimit: {
    type: Boolean,
    default: false,
  },
  formatter: {
    type: Function,
  },
}
export const inputEmits = ['update:modelValue', 'change', 'input', 'input:lazy']
