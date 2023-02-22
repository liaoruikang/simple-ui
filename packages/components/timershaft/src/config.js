export const props = {
  modelValue: {
    type: [String, Number, Date],
    default: '00:00:00',
  },
  infinite: {
    type: Boolean,
    default: false,
  },
  format: {
    type: String,
    default: '',
  },
  minTime: {
    type: [String, Number],
    default: 1,
  },
  maxTime: {
    type: [String, Number],
    default: 86399999,
  },
  type: {
    type: String,
    default: 'datetime',
  },
  valueFormat: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'middle',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  proportion: {
    type: Number,
    default: 120,
    validator(value) {
      return value > 0 && value <= 120
    },
  },
  isZoom: {
    type: Boolean,
    default: true,
  },
  isJump: {
    type: Boolean,
    default: true,
  },
}
export const emits = ['update:modelValue', 'input', 'change']
