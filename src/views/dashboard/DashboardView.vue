<template>
  <div class="dashboard-fullscreen">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-cards">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">累计用户</div>
              <div class="stat-value">36,000</div>
              <div class="stat-trend positive">+8%</div>
            </div>
            <div class="stat-icon user">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-chart">
              <svg width="80" height="30" viewBox="0 0 80 30">
                <path d="M5,25 Q20,5 35,15 T65,10" stroke="#409EFF" stroke-width="2" fill="none" />
              </svg>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">当日订单</div>
              <div class="stat-value">16,580</div>
              <div class="stat-trend positive">+70%</div>
            </div>
            <div class="stat-icon order">
              <el-icon><ShoppingCart /></el-icon>
            </div>
            <div class="stat-chart">
              <svg width="80" height="30" viewBox="0 0 80 30">
                <path d="M5,20 Q20,10 35,15 T65,8" stroke="#F56C6C" stroke-width="2" fill="none" />
              </svg>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">新增用户</div>
              <div class="stat-value">16,499</div>
              <div class="stat-trend positive">+90%</div>
            </div>
            <div class="stat-icon new-user">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="stat-chart">
              <svg width="80" height="30" viewBox="0 0 80 30">
                <path d="M5,22 Q20,12 35,18 T65,10" stroke="#67C23A" stroke-width="2" fill="none" />
              </svg>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-info">
              <div class="stat-title">用户留存率</div>
              <div class="stat-value">100</div>
              <div class="stat-trend positive">+100%</div>
            </div>
            <div class="stat-icon retention">
              <el-progress
                type="circle"
                :percentage="100"
                :width="50"
                :show-text="false"
                color="#E6A23C"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表和数据分析 -->
    <el-row :gutter="20" class="charts-section">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>分析概览</span>
              <div class="chart-tabs">
                <el-button
                  type="text"
                  :class="{ active: activeTab === 'month' }"
                  @click="activeTab = 'month'"
                  >月报</el-button
                >
                <el-button
                  type="text"
                  :class="{ active: activeTab === 'year' }"
                  @click="activeTab = 'year'"
                  >年报</el-button
                >
              </div>
            </div>
          </template>
          <div class="chart-container">
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-color" style="background-color: #409eff"></span>
                <span>累计用户</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background-color: #f56c6c"></span>
                <span>新增用户</span>
              </div>
            </div>
            <div class="bar-chart">
              <div class="chart-y-axis">
                <div class="y-label">8,00</div>
                <div class="y-label">6,00</div>
                <div class="y-label">4,00</div>
                <div class="y-label">2,00</div>
                <div class="y-label">0</div>
              </div>
              <div class="chart-bars">
                <div class="bar-group" v-for="(item, index) in chartData" :key="index">
                  <div class="bar bar-primary" :style="{ height: item.primary + '%' }"></div>
                  <div class="bar bar-secondary" :style="{ height: item.secondary + '%' }"></div>
                  <div class="bar-label">{{ item.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="progress-card">
          <template #header>
            <span>数据统计</span>
          </template>
          <div class="progress-list">
            <div class="progress-item">
              <div class="progress-info">
                <span class="progress-label">浙江</span>
                <span class="progress-value">100%</span>
              </div>
              <el-progress :percentage="100" color="#67C23A" :show-text="false" />
            </div>
            <div class="progress-item">
              <div class="progress-info">
                <span class="progress-label">湖南</span>
                <span class="progress-value">90%</span>
              </div>
              <el-progress :percentage="90" color="#67C23A" :show-text="false" />
            </div>
            <div class="progress-item">
              <div class="progress-info">
                <span class="progress-label">浙江</span>
                <span class="progress-value">84%</span>
              </div>
              <el-progress :percentage="84" color="#409EFF" :show-text="false" />
            </div>
            <div class="progress-item">
              <div class="progress-info">
                <span class="progress-label">湖南</span>
                <span class="progress-value">80%</span>
              </div>
              <el-progress :percentage="80" color="#409EFF" :show-text="false" />
            </div>
            <div class="progress-item">
              <div class="progress-info">
                <span class="progress-label">湖南</span>
                <span class="progress-value">70%</span>
              </div>
              <el-progress :percentage="70" color="#409EFF" :show-text="false" />
            </div>
            <div class="progress-item">
              <div class="progress-info">
                <span class="progress-label">湖南</span>
                <span class="progress-value">60%</span>
              </div>
              <el-progress :percentage="60" color="#409EFF" :show-text="false" />
            </div>
            <div class="progress-item">
              <div class="progress-info">
                <span class="progress-label">湖南</span>
                <span class="progress-value">50%</span>
              </div>
              <el-progress :percentage="50" color="#409EFF" :show-text="false" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据表格和最新动态 -->
    <el-row :gutter="20" class="bottom-section">
      <el-col :span="14">
        <el-card class="table-card">
          <template #header>
            <span>数据统计</span>
          </template>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="position" label="职位" width="150" />
            <el-table-column prop="department" label="部门" width="120" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="phone" label="手机号码" width="130" />
            <el-table-column label="操作" width="100">
              <template #default>
                <el-button type="text" size="small">
                  <el-icon><Edit /></el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card class="activity-card">
          <template #header>
            <span>最新动态</span>
          </template>
          <div class="activity-list">
            <div class="activity-item" v-for="(item, index) in activityData" :key="index">
              <div class="activity-avatar">
                <el-avatar :size="32" :src="item.avatar" />
              </div>
              <div class="activity-content">
                <div class="activity-text">{{ item.text }}</div>
                <div class="activity-time">{{ item.time }}</div>
              </div>
              <div class="activity-status">
                <el-tag :type="item.status === '运营总监' ? 'success' : 'info'" size="small">
                  {{ item.status }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ShoppingCart, User, UserFilled } from '@element-plus/icons-vue'

const activeTab = ref('month')

const chartData = ref([
  { label: '周一', primary: 60, secondary: 40 },
  { label: '周二', primary: 80, secondary: 60 },
  { label: '周三', primary: 70, secondary: 50 },
  { label: '周四', primary: 90, secondary: 70 },
  { label: '周五', primary: 85, secondary: 65 },
  { label: '周六', primary: 95, secondary: 75 },
  { label: '周日', primary: 60, secondary: 60 },
])

const tableData = ref([
  {
    name: '王小虎',
    position: '前端工程师',
    department: '技术部',
    email: 'wangxiaohu@example.com',
    phone: '138****1234',
  },
  {
    name: '李小红',
    position: '产品经理',
    department: '产品部',
    email: 'lixiaohong@example.com',
    phone: '139****5678',
  },
  {
    name: '张小明',
    position: '后端工程师',
    department: '技术部',
    email: 'zhangxiaoming@example.com',
    phone: '137****9012',
  },
])

const activityData = ref([
  {
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    text: '新增了 7,802 名用户，增长率为 10%',
    time: '2022-07-01',
    status: '运营总监',
  },
  {
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    text: '新增了 1,449 名用户，增长率为 10%',
    time: '2022-07-01',
    status: '运营总监',
  },
])
</script>

<style scoped>
.dashboard-fullscreen {
  min-height: 100vh;
  background: linear-gradient(135deg, #f4f6ff 0%, #c8d8f9 100%);
  padding: 24px;
  overflow-x: hidden;
}

.stats-cards {
  margin-bottom: 24px;
}

.stat-card {
  height: 140px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  position: relative;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 12px;
}

.stat-trend.positive {
  color: #67c23a;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.user {
  background-color: #409eff;
}

.stat-icon.order {
  background-color: #f56c6c;
}

.stat-icon.new-user {
  background-color: #67c23a;
}

.stat-icon.retention {
  background-color: transparent;
}

.stat-chart {
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 0.3;
}

.charts-section {
  margin-bottom: 24px;
}

.chart-card {
  height: 420px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-tabs .el-button {
  margin-left: 10px;
}

.chart-tabs .el-button.active {
  color: #409eff;
}

.chart-container {
  height: 300px;
  padding: 20px 0;
}

.chart-legend {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.bar-chart {
  display: flex;
  height: 200px;
  align-items: flex-end;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  margin-right: 20px;
  font-size: 12px;
  color: #666;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  flex: 1;
  height: 100%;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.bar {
  width: 20px;
  min-height: 4px;
  border-radius: 2px;
}

.bar-primary {
  background-color: #409eff;
}

.bar-secondary {
  background-color: #f56c6c;
}

.bar-label {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.progress-card {
  height: 420px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.progress-label {
  color: #333;
}

.progress-value {
  color: #666;
}

.bottom-section {
  margin-bottom: 24px;
}

.table-card {
  min-height: 320px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.activity-card {
  min-height: 320px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 12px;
  color: #999;
}
</style>
