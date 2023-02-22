export const props = {
  // common
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
  readonly: {
    type: Boolean,
    default: false,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  tabindex: {
    type: [Number, String],
    default: 1,
  },

  // textarea
  autoSize: {
    type: [Object, Boolean],
    default: false,
  },
  rows: {
    type: Number,
    default: 1,
  },
  prefixIcon: {
    type: String,
  },
  suffixIcon: {
    type: String,
  },

  // !number
  maxLength: {
    type: Number,
  },

  showLimit: {
    type: Boolean,
    default: false,
  },

  // !password
  formatter: {
    type: Function,
  },

  // !textarea
  clearable: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'middle',
    validator(value) {
      return ['small', 'middle', 'large'].includes(value)
    },
  },

  // number
  max: {
    type: Number,
  },
  min: {
    type: Number,
  },
  numberType: {
    type: String,
    default: 'int', // int float
  },
  precision: {
    type: Number,
    validator(value) {
      return value <= 100 && value >= 0
    },
  },
  step: {
    type: Number,
    default: 1,
  },
  strictlyStep: {
    type: Boolean,
    default: false,
  },
  showControl: {
    type: Boolean,
    default: true,
  },

  // password
  showPassword: {
    type: Boolean,
    default: false,
  },
}
export const emits = [
  'update:modelValue',
  'change',
  'input',
  'input:lazy',
  'clear',
  'select',
  'blur',
  'focus',
]
