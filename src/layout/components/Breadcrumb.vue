<template>
  <el-breadcrumb class="breadcrumb" separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.id">
      <el-icon v-if="item.icon">
        <component :is="item.icon" />
      </el-icon>
      <span>{{ item.menuName }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/stores/menu-store.ts'

const route = useRoute()
const menuStore = useMenuStore()

// 计算面包屑导航
const breadcrumbList = computed(() => {
  // 使用菜单store的getBreadcrumb方法，它能正确处理父子关系
  const breadcrumb = menuStore.getBreadcrumb(route.path)

  // 如果没有找到匹配的菜单路径，使用路由的meta信息
  if (breadcrumb.length === 0 && route.meta?.title) {
    return [
      {
        id: 0,
        menuName: route.meta.title as string,
        path: route.path,
        icon: route.meta.icon as string,
      },
    ]
  }

  return breadcrumb
})
</script>

<style scoped>
.breadcrumb {
  font-size: 14px;
}

:deep(.el-breadcrumb__item) {
  display: flex;
  align-items: center;
}

:deep(.el-breadcrumb__inner) {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #333;
  font-weight: normal;
}

:deep(.el-breadcrumb__inner:hover) {
  color: #1890ff;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #333;
  font-weight: 500;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover) {
  color: #333;
  cursor: default;
}
</style>
