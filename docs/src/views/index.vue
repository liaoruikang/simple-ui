<template>
  <div class="index_container">
    <div class="nav_container fixed top-0 left-0 h-50px w-full">
      <nav class="flex justify-between items-center w-8/12 h-full m-auto">
        <div class="logo">
          <img src="@/static/images/logo.svg" />
        </div>
        <div class="menu h-full">
          <div class="h-full flex">
            <div
              class="p-10px h-full text-center m-10px border-solid border-b leading-50px cursor-pointer transition hover:text-cyan-500 hover:border-cyan-500"
              :class="{
                ' text-cyan-500': index === active,
                'text-white': index !== active,
                ' border-cyan-500': index === active,
                'border-transparent': index !== active
              }"
              v-for="(item, index) in nav"
              :key="index"
              @click="active = index"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </nav>
    </div>

    <section class="content">
      <router-view></router-view>
    </section>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
const nav = ['首页', '指南', '组件', '更新日志']
const active = ref(0)
</script>
<style lang="scss" scoped>
.index_container {
  .nav_container {
    border-bottom: 1px solid;
    border-image: linear-gradient(
        90deg,
        #249fd4ff,
        #0098a4ff,
        #5229b7ff,
        #41d47bb0
      )
      1;
  }
}
</style>
