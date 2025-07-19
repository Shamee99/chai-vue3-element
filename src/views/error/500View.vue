<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-image">
        <svg viewBox="0 0 500 500" class="error-svg">
          <text x="50%" y="50%" text-anchor="middle" dy=".3em">500</text>
        </svg>
      </div>

      <div class="error-info">
        <h1>服务器错误</h1>
        <p>抱歉，服务器出现了一些问题，请稍后再试</p>

        <div class="error-actions">
          <el-button type="primary" @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            返回首页
          </el-button>
          <el-button @click="refresh">
            <el-icon><Refresh /></el-icon>
            刷新页面
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { HomeFilled, Refresh } from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const refresh = () => {
  window.location.reload()
}
</script>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f0f2f5;
  padding: 20px;
}

.error-content {
  text-align: center;
  max-width: 500px;
}

.error-image {
  margin-bottom: 32px;
}

.error-svg {
  width: 200px;
  height: 200px;
  fill: #f5222d;
  font-size: 48px;
  font-weight: bold;
}

.error-info h1 {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 16px 0;
}

.error-info p {
  font-size: 16px;
  color: #8c8c8c;
  margin: 0 0 32px 0;
  line-height: 1.5;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.error-actions .el-button {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
