import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getUserInfoApi, loginApi, refreshTokenApi } from '@/views/login/api/login.ts'
import type { LoginRequest, UserInfo } from '@/views/login/api/login.types.ts'

export const useUserStore = defineStore(
  'user',
  () => {
    // 状态
    const token = ref<string>('')
    const refreshToken = ref<string>('')
    const userInfo = ref<UserInfo | null>(null)

    // 计算属性
    const isLoggedIn = computed(() => !!token.value)
    const isSuperAdmin = computed(() => {
      return (
        userInfo.value?.roles?.includes('super_admin') ||
        userInfo.value?.roles?.includes('admin') ||
        userInfo.value?.username === 'admin'
      )
    })

    // 登录
    const login = async (loginData: LoginRequest): Promise<void> => {
      try {
        const response = await loginApi(loginData)

        token.value = response.accessToken
        refreshToken.value = response.refreshToken

        // 登录成功后获取用户信息
        // await getUserInfo()
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    }

    // 登出
    const logout = (): void => {
      token.value = ''
      refreshToken.value = ''
      userInfo.value = null
    }

    // 获取用户信息
    const getUserInfo = async (): Promise<void> => {
      try {
        const response = await getUserInfoApi()
        userInfo.value = response.data
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    }

    // 刷新token
    const refreshUserToken = async (): Promise<void> => {
      try {
        const response = await refreshTokenApi({ refreshToken: refreshToken.value })

        token.value = response.token
        refreshToken.value = response.refreshToken
      } catch (error) {
        console.error('刷新token失败:', error)
        // 刷新失败，清除所有认证信息
        logout()
        throw error
      }
    }

    // 检查权限
    const hasPermission = (permission: string): boolean => {
      if (!userInfo.value?.permissions) return false
      return userInfo.value.permissions.includes(permission)
    }

    // 检查角色
    const hasRole = (role: string): boolean => {
      if (!userInfo.value?.roles) return false
      return userInfo.value.roles.includes(role)
    }

    // 初始化用户信息（应用启动时调用）
    const initUserInfo = async (): Promise<void> => {
      if (token.value && !userInfo.value) {
        try {
          await getUserInfo()
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // 如果获取用户信息失败，清除token
          logout()
        }
      }
    }

    return {
      // 状态
      token,
      refreshToken,
      userInfo,

      // 计算属性
      isLoggedIn,
      isSuperAdmin,

      // 方法
      login,
      logout,
      getUserInfo,
      refreshUserToken,
      hasPermission,
      hasRole,
      initUserInfo,
    }
  },
  {
    persist: {
      key: 'user-store',
      storage: localStorage,
      paths: ['token', 'refreshToken', 'userInfo'],
    },
  },
)
