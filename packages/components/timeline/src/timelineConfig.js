export const timelineProps = {
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
}
export const timelineEmits = ['update:modelValue', 'input', 'change']
