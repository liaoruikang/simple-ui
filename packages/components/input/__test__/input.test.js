import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import input from '../src/input.vue'

describe('input.vue', () => {
  test('textarea test', async () => {
    const wrapper = mount(input, {
      props: {
        type: 'textarea',
      },
    })
    expect(wrapper.exists()).toBe(true)
    const textarea = wrapper.find('.s-textarea')
    expect(textarea.exists()).toBe(true)
    await wrapper.setProps({
      autoSize: {
        minRows: 1,
        max: 10,
      },
    })
    expect(wrapper.vm.autoSize).toBeTypeOf('object')
  })
})
