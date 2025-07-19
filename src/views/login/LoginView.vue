<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="@/assets/logo.svg" alt="Logo" class="logo" />
        <h2 class="title">Chai Admin</h2>
        <p class="subtitle">系统管理平台</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
            clearable
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>

        <el-form-item>
          <div class="login-options">
            <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <div class="demo-accounts">
          <p class="demo-title">演示账号：</p>
          <div class="demo-buttons">
            <el-button size="small" @click="fillDemoAccount('superAdmin')">
              超级管理员
            </el-button>
            <el-button size="small" @click="fillDemoAccount('admin')">
              管理员
            </el-button>
            <el-button size="small" @click="fillDemoAccount('user')">
              普通用户
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="login-bg">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user-store.ts'
import { useUIStore } from '@/stores/ui-store.ts'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()
const uiStore = useUIStore()

// 表单引用
const loginFormRef = ref<FormInstance>()

// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 其他状态
const loading = ref(false)
const rememberMe = ref(false)

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 登录处理
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    // 表单验证
    await loginFormRef.value.validate()

    loading.value = true

    // 调用登录接口（这里使用模拟登录）
    await userStore.login(loginForm)

    // 记住密码处理
    if (rememberMe.value) {
      uiStore.setRememberedCredentials(loginForm.username, loginForm.password)
    } else {
      uiStore.clearRememberedCredentials()
    }

    ElMessage.success('登录成功')
    await router.push('/')
  } finally {
    loading.value = false
  }
}

// 填充演示账号
const fillDemoAccount = (type: 'superAdmin' | 'admin' | 'user') => {
  if (type === 'superAdmin') {
    loginForm.username = 'superAdmin'
    loginForm.password = '123456'
  } else if (type === 'admin') {
    loginForm.username = 'admin'
    loginForm.password = '123456'
  } else {
    loginForm.username = 'user'
    loginForm.password = '123456'
  }
}

// 初始化
onMounted(() => {
  // 恢复记住的密码
  if (uiStore.rememberedUsername && uiStore.rememberedPassword) {
    loginForm.username = uiStore.rememberedUsername
    loginForm.password = uiStore.rememberedPassword
    rememberMe.value = true
  }
})
</script>

<style scoped>
.login-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.login-box {
  position: relative;
  z-index: 10;
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.login-form {
  margin-bottom: 20px;
}

.captcha-container {
  display: flex;
  gap: 12px;
}

.captcha-input {
  flex: 1;
}

.captcha-image {
  width: 100px;
  height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
}

.captcha-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
}

.login-footer {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.demo-accounts {
  text-align: center;
}

.demo-title {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
}

.demo-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 背景装饰 */
.login-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-box {
    width: 90%;
    padding: 30px 20px;
  }

  .demo-buttons {
    flex-direction: column;
  }
}
</style>
