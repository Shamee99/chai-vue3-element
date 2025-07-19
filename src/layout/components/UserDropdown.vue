<template>
  <el-dropdown @command="handleCommand">
    <div class="user-dropdown">
      <el-avatar
        :src="userInfo?.avatar"
        :size="32"
        class="user-avatar"
      >
        <el-icon><User /></el-icon>
      </el-avatar>
      <span class="user-name">{{ userInfo?.nickname || userInfo?.username || '用户' }}</span>
      <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="profile">
          <el-icon><User /></el-icon>
          个人中心
        </el-dropdown-item>
        <el-dropdown-item command="settings">
          <el-icon><Setting /></el-icon>
          系统设置
        </el-dropdown-item>
        <el-dropdown-item divided command="logout">
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user-store.ts'
import { useMenuStore } from '@/stores/menu-store.ts'
import { resetRouter } from '@/router'
import { User, Setting, SwitchButton, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const menuStore = useMenuStore()

// 计算属性
const userInfo = computed(() => userStore.userInfo)

// 处理下拉菜单命令
const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      // 跳转到个人中心
      router.push('/profile')
      break

    case 'settings':
      // 跳转到系统设置
      router.push('/settings')
      break

    case 'logout':
      await handleLogout()
      break
  }
}

// 处理退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 清除用户数据
    userStore.logout()

    // 清除菜单数据
    menuStore.clearMenuData()

    // 重置路由
    resetRouter()

    // 跳转到登录页
    router.push('/login')

    ElMessage.success('退出登录成功')
  } catch (error) {
    // 用户取消退出
  }
}
</script>

<style scoped>
.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  flex-shrink: 0;
}

.user-name {
  font-size: 14px;
  color: #333;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  font-size: 12px;
  color: #999;
  transition: transform 0.3s;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

:deep(.el-dropdown-menu__item .el-icon) {
  font-size: 14px;
}
</style>
