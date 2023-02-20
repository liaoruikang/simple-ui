export const props = {
  modelValue: {
    type: [Number, String]
  },
  placeholder: {
    type: String,
    default: '请输入内容'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'text'
  },
  autoSize: {
    type: [Object, Boolean],
    default: false
  },
  rows: {
    type: Number,
    default: 1
  },
  readonly: {
    type: Boolean,
    default: false
  },
  maxLength: {
    type: Number
  },
  showLimit: {
    type: Boolean,
    default: false
  },
  formatter: {
    type: Function
  },
  clearable: {
    type: Boolean,
    default: false
  },
  max: {
    type: Number
  },
  min: {
    type: Number
  },
  numberType: {
    type: String,
    default: 'int' // int float
  },
  precision: {
    type: Number,
    validator(value) {
      return value <= 100 && value >= 0
    }
  },
  step: {
    type: Number,
    default: 1
  },
  strictlyStep: {
    type: Boolean,
    default: false
  },
  showControl: {
    type: Boolean,
    default: true
  },

  showPassword: {
    type: Boolean,
    default: false
  }
}
export const emits = [
  'update:modelValue',
  'change',
  'input',
  'input:lazy',
  'clear'
]
