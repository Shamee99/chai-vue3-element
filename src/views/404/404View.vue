<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-image">
        <svg viewBox="0 0 404 300" class="error-svg">
          <!-- 404数字 -->
          <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="error-text">
            404
          </text>
          <!-- 装饰元素 -->
          <circle cx="100" cy="100" r="20" class="decoration-circle" />
          <circle cx="300" cy="200" r="15" class="decoration-circle" />
          <rect x="320" y="80" width="30" height="30" class="decoration-rect" />
        </svg>
      </div>

      <div class="error-info">
        <h1 class="error-title">页面不存在</h1>
        <p class="error-description">
          抱歉，您访问的页面不存在或已被删除。
        </p>
        <p class="error-suggestion">
          请检查URL是否正确，或者返回首页继续浏览。
        </p>

        <div class="error-actions">
          <el-button type="primary" @click="goHome">
            <el-icon><House /></el-icon>
            返回首页
          </el-button>
          <el-button @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回上页
          </el-button>
        </div>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.error-page {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.error-content {
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 600px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.error-image {
  margin-bottom: 30px;
}

.error-svg {
  width: 300px;
  height: 200px;
  max-width: 100%;
}

.error-text {
  font-size: 80px;
  font-weight: bold;
  fill: #409eff;
  font-family: 'Arial', sans-serif;
}

.decoration-circle {
  fill: #67c23a;
  opacity: 0.6;
  animation: pulse 2s ease-in-out infinite;
}

.decoration-rect {
  fill: #e6a23c;
  opacity: 0.6;
  animation: rotate 3s linear infinite;
  transform-origin: center;
}

.error-info {
  margin-top: 20px;
}

.error-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin: 0 0 16px 0;
}

.error-description {
  font-size: 16px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.error-suggestion {
  font-size: 14px;
  color: #999;
  margin: 0 0 30px 0;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.error-actions .el-button {
  padding: 12px 24px;
  font-size: 14px;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(64, 158, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 20%;
  right: 15%;
  animation-delay: 1s;
  background: rgba(103, 194, 58, 0.1);
}

.shape-3 {
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 20%;
  animation-delay: 2s;
  background: rgba(230, 162, 60, 0.1);
}

.shape-4 {
  width: 120px;
  height: 120px;
  bottom: 30%;
  right: 10%;
  animation-delay: 3s;
  background: rgba(245, 108, 108, 0.1);
}

/* 动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-10px);
  }
  75% {
    transform: translateY(-30px) translateX(5px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-content {
    margin: 20px;
    padding: 30px 20px;
  }

  .error-svg {
    width: 250px;
    height: 150px;
  }

  .error-text {
    font-size: 60px;
  }

  .error-title {
    font-size: 24px;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .error-actions .el-button {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .error-svg {
    width: 200px;
    height: 120px;
  }

  .error-text {
    font-size: 48px;
  }

  .error-title {
    font-size: 20px;
  }
}
</style>
