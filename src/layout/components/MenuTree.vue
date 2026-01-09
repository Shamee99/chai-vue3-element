<template>
  <el-menu class="menu-tree" :default-active="activeMenu" :collapse="collapsed" router>
    <template v-for="menu in menus" :key="menu.id">
      <MenuItem :menu="menu" :collapsed="collapsed" :level="0" @menu-click="handleMenuClick" />
    </template>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { PermissionTreeNode } from '@/router/permission-router.types.ts'
import MenuItem from './MenuItem.vue'

interface Props {
  menus: PermissionTreeNode[]
  collapsed?: boolean
}

interface Emits {
  (e: 'menu-click', menu: PermissionTreeNode): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const route = useRoute()

const activeMenu = computed(() => route.path)

const handleMenuClick = (menu: PermissionTreeNode) => {
  emit('menu-click', menu)
}
</script>

<style scoped>
.menu-tree {
  width: 100%;
  border: none;
  overflow: hidden;
}

.menu-tree:not(.el-menu--collapse) {
  overflow-y: auto;
}

.menu-tree.el-menu--collapse {
  overflow: hidden;
}
</style>
