<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  const { params } = route
  const { path } = params as { path: string | string[] }
  
  // 获取重定向路径
  let redirectPath: string
  if (Array.isArray(path)) {
    redirectPath = '/' + path.join('/')
  } else if (path) {
    redirectPath = path.startsWith('/') ? path : '/' + path
  } else {
    redirectPath = '/'
  }
  
  // 延迟一帧后重定向，确保页面能够正确刷新
  requestAnimationFrame(() => {
    router.replace(redirectPath)
  })
})
</script>