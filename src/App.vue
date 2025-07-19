<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// 应用入口组件
</script>

<style>
#app {
  height: 100vh;
  overflow: hidden;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.5;
  color: #333;
  background-color: #f0f2f5;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Element Plus 样式覆盖 */
.el-menu {
  border-right: none !important;
  background-color: transparent !important;
}

.el-menu-item,
.el-sub-menu__title {
  color: rgba(255, 255, 255, 0.85) !important;
}

.el-menu-item:hover,
.el-sub-menu__title:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
}

.el-menu-item.is-active {
  background-color: #1890ff !important;
  color: #fff !important;
}
</style>
