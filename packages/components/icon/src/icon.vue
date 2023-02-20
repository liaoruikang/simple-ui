<template>
  <i class="s-icon">
    <svg class="icon" aria-hidden="true" :style="styles">
      <use :xlink:href="`#${icon}`"></use>
    </svg>
  </i>
</template>
<script>
import { computed, defineComponent, toRefs } from 'vue'
import { emits, props } from './icon'
import './iconfont'
export default defineComponent({
  name: 's-icon',
  props,
  emits,
  setup(props) {
    const { size, color } = props
    const { icon } = toRefs(props)

    const styles = computed(() => {
      return {
        width: size,
        height: size,
        fill: color,
        overflow: 'hidden'
      }
    })
    return { icon, styles }
  }
})
</script>
