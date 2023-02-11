
import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  computed
} from 'vue'
import { timelineEmits, timelineProps } from './timelineConfig'
import useDateFormat from '@simple-ui/hooks/useDateFormat'

const __sfc_timeline__ = defineComponent({
  name: 's-timeline',
  emits: timelineEmits,
  props: timelineProps,
  setup(props, { emit, expose }) {
    const update = ref(0)
    const currentDate = ref(null)
    const currentTime = ref(null)
    const infinite = ref(props.infinite)
    const minTime = ref(props.minTime)
    const maxTime = ref(props.maxTime)
    const left = ref(0)
    const lineList = reactive([])
    const currentTimestamp = ref(0)
    let axisRef = ref()
    let mainRef = ref()
    let timer = null
    let intervalTimer = null
    let downX = 0
    let proportion = 120
    let zoom = 120
    let isMove = false
    let infoWidth = 0
    const type = props.type
    const format = props.format
    const valueFormat = props.valueFormat
    const time = computed(() => {
      switch (type) {
        case 'datetime':
          let date = new Date(`${currentDate.value} ${currentTime.value}`)
          const dateFormat = format || valueFormat || 'yyyy-MM-dd hh:mm:ss'
          date = useDateFormat(date, dateFormat)
          return date
        case 'time':
          const timeFormat =
            format.replace(/date|yy|yyyy|M|MM|d|dd|timestamp/g, '') ||
            valueFormat.replace(/date|yy|yyyy|M|MM|d|dd|timestamp/g, '') ||
            'hh:mm:ss'
          const time = useDateFormat(
            `1970-01-01 ${currentTime.value}`,
            timeFormat
          )
          return time
      }
    })

    const formatTime = (time, type = 'time') => {
      if (type == 'time') {
        if (typeof time != 'number') return null
        let h = parseInt((time / 1000 / 60 / 60) % 24)
        let m = parseInt((time / 1000 / 60) % 60)
        let s = parseInt((time / 1000) % 60)
        h = h < 10 ? `0${h}` : h
        m = m < 10 ? `0${m}` : m
        s = s < 10 ? `0${s}` : s
        return `${h}:${m}:${s}`
      } else if (type == 'timestamp') {
        if (!isNaN(time?.split(':')[0])) {
          let [h, m, s] = time.split(':').map((item) => {
            return parseInt(item)
          })
          h = h * 1000 * 60 * 60
          m = m * 1000 * 60
          s = s * 1000
          return h + m + s
        } else {
          const date = new Date()
          let timestamp = date.getHours() * 60 * 60 * 1000
          timestamp += date.getMinutes() * 60 * 1000
          timestamp += date.getSeconds() * 1000
          return timestamp
        }
      }
    }

    const updateTime = (option, emitName) => {
      let date
      switch (type) {
        case 'datetime':
          date = new Date(
            `${option?.date || currentDate.value} ${
              option?.time || currentTime.value
            }`
          )
          const dateFormat = valueFormat || 'date'
          date = useDateFormat(date, dateFormat)
          emit(emitName, date)
          break
        case 'time':
          const timeFormat =
            valueFormat.replace(/date|yy|yyyy|M|MM|d|dd|timestamp/g, '') ||
            'hh:mm:ss'
          const time = useDateFormat(
            `1970-01-01 ${option?.time || currentTime.value}`,
            timeFormat
          )
          emit(emitName, time)
          break
      }
    }

    const initData = (modelValue) => {
      try {
        if (typeof minTime === 'string') {
          minTime.value = formatTime(minTime.value, 'timestamp')
        } else if (minTime.value.toString().length > 8) {
          throw new Error(
            'If the minTime length exceeds the limit, the length should be less than 8.'
          )
        }
        if (typeof maxTime === 'string') {
          maxTime.value = formatTime(maxTime.value, 'timestamp')
        } else if (maxTime.value.toString().length > 8) {
          throw new Error(
            'If the maxTime length exceeds the limit, the length should be less than 8.'
          )
        }
        if (maxTime.value < 1000) {
          maxTime.value = 0
        }
        if (minTime.value < 1000) {
          minTime.value = 0
        }

        let date
        switch (type) {
          case 'datetime':
            date = useDateFormat(modelValue, 'yyyy-MM-dd hh:mm:ss')
            currentDate.value = date.split(' ')[0]
            currentTime.value = date.split(' ')[1]
            break
          case 'time':
            date = useDateFormat(
              `1970-01-01 ${modelValue}`,
              'yyyy-MM-dd hh:mm:ss'
            )
            currentDate.value = date.split(' ')[0]
            currentTime.value = date.split(' ')[1]
            break
        }
        currentTimestamp.value = formatTime(currentTime.value, 'timestamp')
      } catch (error) {
        throw new Error(error)
      }
    }
    initData(props.modelValue)

    watch(
      () => currentTime.value,
      () => {
        updateTime(null, 'update:modelValue')
      }
    )

    onMounted(() => {
      initAxis()
      location()
      initAxis()

      window.addEventListener('resize', resize)
      window.addEventListener('mouseup', up)
      window.addEventListener('keydown', keydown)
      window.addEventListener('keyup', keyup)
      mainRef.value.addEventListener('wheel', wheel, { passive: false })
      clearInterval(intervalTimer)
      intervalTimer = setInterval(() => {
        update.value = !update.value
      }, 1000)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('keydown', keydown)
      window.addEventListener('keyup', keyup)
      clearInterval(intervalTimer)
    })

    const initAxis = (delay = { ld: 0, rd: 0 }) => {
      infoWidth = (120 / proportion) * mainRef.value.offsetWidth
      axisRef.value.style.width = infoWidth * 3 + 'px'
      const { min, max } = getTimestampLimit(delay)
      let timestamp = min
      let i = 0
      lineList.length = 0
      while (timestamp <= max) {
        const left = (timestamp / 86400000) * infoWidth
        const x =
          (currentTimestamp.value / 86400000) * infoWidth +
          infoWidth -
          mainRef.value.offsetWidth / 2
        if (left >= x - 30 && left <= x + mainRef.value.offsetWidth + 30) {
          lineList.push({
            time: i % 10 == 0 ? formatTime(timestamp) : '',
            timestamp,
            left,
            lineType: i % 10 == 0 ? 'line' : 'simpleLine'
          })
        }
        timestamp += 86400000 / zoom
        i++
      }
    }

    const location = (timestamp) => {
      if (timestamp) {
        currentTimestamp.value = timestamp
        currentTime.value = formatTime(currentTimestamp.value, 'time')
      }
      const x =
        (currentTimestamp.value / 86400000) * infoWidth +
        infoWidth -
        mainRef.value.offsetWidth / 2
      left.value = -x
    }

    const down = (e) => {
      window.addEventListener('mousemove', move)
      const rect = axisRef.value.getBoundingClientRect()
      downX = e.pageX - rect.left
    }

    const move = (e) => {
      isMove = true
      const rect = mainRef.value.getBoundingClientRect()
      let x = e.pageX - rect.left - downX
      if (infinite.value) {
        if (x > -(infoWidth - mainRef.value.offsetWidth / 2)) {
          x = -(infoWidth + infoWidth / 2 - mainRef.value.offsetWidth / 2)
          downX =
            downX + (infoWidth / 2 + infoWidth - mainRef.value.offsetWidth / 2)
          const date = new Date(
            new Date(currentDate.value).getTime() - 86400000
          )
          const d = `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`
          currentDate.value = d
        }
      } else if (
        x >
        -(
          infoWidth * (timeLimit(minTime.value) / 86400000) +
          infoWidth -
          mainRef.value.offsetWidth / 2
        )
      ) {
        x = -(
          infoWidth * (timeLimit(minTime.value) / 86400000) +
          infoWidth -
          mainRef.value.offsetWidth / 2
        )
      }
      // 是否无限滚动
      if (infinite.value) {
        if (x < -(infoWidth + infoWidth - mainRef.value.offsetWidth / 2)) {
          x = -(infoWidth - mainRef.value.offsetWidth / 2)
          downX = downX - infoWidth
          const date = new Date(
            new Date(currentDate.value).getTime() + 86400000
          )
          const d = `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`
          currentDate.value = d
        }
      } else if (
        x <
        -(
          infoWidth * (timeLimit(maxTime.value) / 86400000) +
          infoWidth -
          mainRef.value.offsetWidth / 2
        )
      ) {
        x = -(
          infoWidth * (timeLimit(maxTime.value) / 86400000) +
          infoWidth -
          mainRef.value.offsetWidth / 2
        )
      }
      currentTimestamp.value =
        ((Math.abs(x) - infoWidth + mainRef.value.offsetWidth / 2) /
          infoWidth) *
        86400000
      currentTimestamp.value = timeLimit(currentTimestamp.value)
      currentTime.value = formatTime(currentTimestamp.value)
      left.value = x
      initAxis()
    }

    const resize = () => {
      initAxis()
      location()
    }

    const up = () => {
      setTimeout(() => {
        if (isMove) {
          updateTime(
            { date: currentDate.value, time: currentTime.value },
            'change'
          )
        }
        isMove = false
      }, 0)
      window.removeEventListener('mousemove', move)
    }

    const wheel = (e) => {
      if (e.wheelDelta > 0) {
        // 缩小刻度
        if (proportion > 90) {
          proportion = proportion - 2
        } else if (proportion <= 90 && proportion > 60) {
          proportion = proportion - 1.8
        } else if (proportion <= 60 && proportion > 45) {
          proportion = proportion - 1.2
        } else if (proportion <= 45 && proportion > 30) {
          proportion = proportion - 0.9
        } else if (proportion <= 30 && proportion > 20) {
          proportion = proportion - 0.6
        } else if (proportion <= 20 && proportion > 15) {
          proportion = proportion - 0.4
        } else if (proportion <= 15 && proportion > 10) {
          proportion = proportion - 0.3
        } else if (proportion <= 10 && proportion > 5) {
          proportion = proportion - 0.2
        } else if (proportion <= 5 && proportion > 3) {
          proportion = proportion - 0.1
        } else if (proportion <= 3 && proportion > 1) {
          proportion = proportion - 0.06
        } else if (proportion > 0.5) {
          proportion = proportion - 0.02
        }
      } else {
        // 放大刻度
        if (proportion < 120 && proportion > 90) {
          proportion = proportion + 2
        } else if (proportion <= 90 && proportion > 60) {
          proportion = proportion + 1.8
        } else if (proportion <= 60 && proportion > 45) {
          proportion = proportion + 1.2
        } else if (proportion <= 45 && proportion > 30) {
          proportion = proportion + 0.9
        } else if (proportion <= 30 && proportion > 20) {
          proportion = proportion + 0.6
        } else if (proportion <= 20 && proportion > 15) {
          proportion = proportion + 0.4
        } else if (proportion <= 15 && proportion > 10) {
          proportion = proportion + 0.3
        } else if (proportion <= 10 && proportion > 5) {
          proportion = proportion + 0.2
        } else if (proportion <= 5 && proportion > 3) {
          proportion = proportion + 0.1
        } else if (proportion <= 3 && proportion > 1) {
          proportion = proportion + 0.06
        } else {
          proportion = proportion + 0.02
        }
        if (proportion > 120) {
          proportion = 120
        }
      }
      if (proportion > 90) {
        zoom = 120 * (120 / 120)
      } else if (proportion <= 90 && proportion > 60) {
        zoom = 120 * (120 / 90)
      } else if (proportion <= 60 && proportion > 45) {
        zoom = 120 * (120 / 60)
      } else if (proportion <= 45 && proportion > 30) {
        zoom = 120 * (120 / 45)
      } else if (proportion <= 30 && proportion > 20) {
        zoom = 120 * (120 / 30)
      } else if (proportion <= 20 && proportion > 15) {
        zoom = 120 * (120 / 20)
      } else if (proportion <= 15 && proportion > 10) {
        zoom = 120 * (120 / 15)
      } else if (proportion <= 10 && proportion > 5) {
        zoom = 120 * (120 / 10)
      } else if (proportion <= 5 && proportion > 3) {
        zoom = 120 * (120 / 5)
      } else if (proportion <= 3 && proportion > 1) {
        zoom = 120 * (120 / 3)
      } else {
        zoom = 120 * (120 / 1)
      }
      initAxis()
      location()
    }

    const jump = async (e) => {
      if (isMove) return
      if (e?.pageX !== undefined) {
        const rect = mainRef.value.getBoundingClientRect()
        const offsetX = e.pageX - rect.left + Math.abs(left.value) - infoWidth
        currentTimestamp.value = (offsetX / infoWidth) * 86400000
        currentTime.value = formatTime(currentTimestamp.value)
      } else if (typeof e === 'number') {
        currentTimestamp.value += e
        currentTime.value = formatTime(currentTimestamp.value)
      } else {
        throw new Error('Type error: The value should be a number.')
      }
      // 如果开启无限轴则先执行动画后再进行无缝跳转
      if (infinite.value) {
        location()
        if (currentTimestamp.value < 0) {
          const date = new Date(
            new Date(currentDate.value).getTime() - 86400000
          )
          const d = `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}`
          currentDate.value = d
          let step = Math.abs(currentTimestamp.value)
          initAxis({
            ld: step,
            rd: 0
          })
        } else {
          if (currentTimestamp.value > 86400000) {
            const date = new Date(
              new Date(currentDate.value).getTime() + 86400000
            )
            const d = `${date.getFullYear()}-${
              date.getMonth() + 1
            }-${date.getDate()}`
            currentDate.value = d
          }
          initAxis({
            ld: 0,
            rd: 0
          })
        }
        currentTimestamp.value = timeLimit(currentTimestamp.value)
        currentTime.value = formatTime(currentTimestamp.value)
        axisRef.value.style.transition = 'left 0.3s'
        await new Promise((resolve) => {
          setTimeout(() => {
            axisRef.value.style.transition = 'none'
            resolve()
          }, 300)
        })
      } else {
        axisRef.value.style.transition = 'left 0.3s'
        setTimeout(() => {
          axisRef.value.style.transition = 'none'
        }, 300)
      }
      currentTimestamp.value = timeLimit(currentTimestamp.value)
      currentTime.value = formatTime(currentTimestamp.value)
      location()
      initAxis()
      updateTime({ date: currentDate.value, time: currentTime.value }, 'change')
    }

    const keydown = (e) => {
      switch (e.keyCode) {
        case 37:
          // 左方向
          currentTimestamp.value -= 1500 * proportion
          currentTimestamp.value = timeLimit(currentTimestamp.value)
          currentTime.value = formatTime(currentTimestamp.value)
          initAxis()
          location()
          break
        case 39:
          //  右方向
          currentTimestamp.value += 1500 * proportion
          currentTimestamp.value = timeLimit(currentTimestamp.value)
          currentTime.value = formatTime(currentTimestamp.value)
          initAxis()
          location()
          break
        case 107:
          //  放大
          wheel({
            wheelDelta: 1
          })
          break
        case 109:
          //  缩小
          wheel({
            wheelDelta: -1
          })
          break
      }
    }

    const keyup = (e) => {
      if (e.keyCode == 37 || e.keyCode == 39) {
        clearTimeout(timer)
        updateTime(
          { date: currentDate.value, time: currentTime.value },
          'input'
        )
        timer = setTimeout(() => {
          updateTime(
            { date: currentDate.value, time: currentTime.value },
            'change'
          )
        }, 300)
      }
    }

    const calibration = (timestamp) => {
      if (timestamp >= 86400000) return 86400000
      const h = Math.floor((timestamp / 1000 / 60 / 60) % 24) * 1000 * 60 * 60
      const m = Math.floor((timestamp / 1000 / 60) % 60) * 1000 * 60
      const s = Math.round((timestamp / 1000) % 60) * 1000
      return h + m + s
    }

    const timeLimit = (timestamp, type = 'deafult') => {
      if (infinite.value) {
        if (timestamp < 0) {
          // const date = new Date(new Date(currentDate.value).getTime() - 86400000)
          // const d = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          return 86399000 + timestamp
        } else if (timestamp > 86400000) {
          // const date = new Date(new Date(currentDate.value).getTime() + 86400000)
          // const d = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          return timestamp - 86400000
        } else {
          return timestamp
        }
      }
      if (type == 'deafult') {
        if (timestamp == undefined) return 86399000
        timestamp = calibration(timestamp)
        return timestamp < minTime.value
          ? minTime.value
          : timestamp > maxTime.value
          ? maxTime.value
          : timestamp
      } else if (type == 'boolean') {
        return timestamp < minTime.value
          ? false
          : timestamp > maxTime.value
          ? false
          : true
      }
      // const today = `${new Date().getFullYear()}-${
      //   new Date().getMonth() + 1
      // }-${new Date().getDate()}`
      // if (currentDate.value == today) {
      //   if (type == 'deafult') {
      //     if (timestamp == undefined) return formatTime(null, 'timestamp')
      //     timestamp = calibration(timestamp)
      //     return timestamp < 0
      //       ? 0
      //       : timestamp > formatTime(null, 'timestamp')
      //       ? formatTime(null, 'timestamp')
      //       : timestamp
      //   } else if (type == 'boolean') {
      //     return timestamp < 0 ? false : timestamp > formatTime(null, 'timestamp') ? false : true
      //   }
      // } else {
      //   if (type == 'deafult') {
      //     if (timestamp == undefined) return 86399000
      //     timestamp = calibration(timestamp)
      //     return timestamp < 0 ? 0 : timestamp > 86399000 ? 86399000 : timestamp
      //   } else if (type == 'boolean') {
      //     return timestamp < 0 ? false : timestamp > 86399000 ? false : true
      //   }
      // }
    }

    const getTimestampLimit = (delay) => {
      const x =
        (currentTimestamp.value / 86400000) * infoWidth +
        infoWidth / 2 -
        mainRef.value.offsetWidth / 2
      let min =
        ((Math.abs(x) + infoWidth / 2) / infoWidth) * 86400000 - delay.ld * 2
      let max =
        ((Math.abs(x) + infoWidth / 2 + mainRef.value.offsetWidth) /
          infoWidth) *
          86400000 +
        delay.rd * 2
      min = parseInt(min / 1000 / 60 / 60) * 1000 * 60 * 60
      if (zoom == 120 * (120 / 120)) {
        if ((min / 1000 / 60 / 60) % 2 !== 0) {
          min = (min / 1000 / 60 / 60 - 1) * 1000 * 60 * 60
        }
      } else if (zoom == 120 * (120 / 90)) {
        if ((min / 1000 / 60 / 60) % 3 !== 0) {
          min =
            (min / 1000 / 60 / 60 - ((min / 1000 / 60 / 60) % 3)) *
            1000 *
            60 *
            60
        }
      } else if (zoom == 120 * (120 / 45)) {
        if ((min / 1000 / 60 / 60) % 3 !== 0) {
          min =
            (min / 1000 / 60 / 60 - ((min / 1000 / 60 / 60) % 6)) *
            1000 *
            60 *
            60
        }
      }

      return {
        min,
        max
      }
    }

    expose({
      location,
      jump
    })

    return {
      lineList,
      left,
      currentTime,
      currentTimestamp,
      down,
      wheel,
      currentDate,
      timeLimit,
      infinite,
      update,
      jump,
      axisRef,
      mainRef,
      time
    }
  }
})

__sfc_timeline__.__scopeId='data-v-1676132153507'
import { createElementVNode as _createElementVNode, toDisplayString as _toDisplayString, renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, normalizeClass as _normalizeClass, normalizeStyle as _normalizeStyle } from "vue"

const _hoisted_1 = /*#__PURE__*/_createElementVNode("div", { class: "scaleplate" }, null, -1 /* HOISTED */)
const _hoisted_2 = { class: "currentTime" }
const _hoisted_3 = { class: "time_item" }

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", {
    class: "timeline_container",
    ref: "mainRef",
    onMousedown: _cache[1] || (_cache[1] = (...args) => (_ctx.down && _ctx.down(...args)))
  }, [
    _hoisted_1,
    _createElementVNode("span", _hoisted_2, _toDisplayString(_ctx.time), 1 /* TEXT */),
    _createElementVNode("div", {
      class: "timeline_content",
      ref: "axisRef",
      style: _normalizeStyle({ left: _ctx.left + 'px' }),
      onClick: _cache[0] || (_cache[0] = (...args) => (_ctx.jump && _ctx.jump(...args)))
    }, [
      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.lineList, (item, index) => {
        return (_openBlock(), _createElementBlock("div", {
          class: _normalizeClass(["time", {
          'is-disabled':
            !_ctx.infinite && !_ctx.timeLimit(item.timestamp - 86400000, 'boolean')
        }]),
          key: index,
          style: _normalizeStyle({ left: item.left + 'px' })
        }, [
          _createElementVNode("span", _hoisted_3, _toDisplayString(item.time), 1 /* TEXT */),
          _createElementVNode("span", {
            class: _normalizeClass(item.lineType)
          }, null, 2 /* CLASS */)
        ], 6 /* CLASS, STYLE */))
      }), 128 /* KEYED_FRAGMENT */))
    ], 4 /* STYLE */)
  ], 544 /* HYDRATE_EVENTS, NEED_PATCH */))
}
__sfc_timeline__.render = render
export default __sfc_timeline__