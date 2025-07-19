<template>
  <div class="chai-table-demo">
    <h2>ChaiTable 组件演示</h2>

    <!-- 基础表格示例 -->
    <el-card class="demo-card" shadow="never">
      <template #header>
        <h3>基础表格</h3>
      </template>

      <ChaiTable
        :data="basicTableData"
        :columns="basicColumns"
        :loading="loading"
        :pagination="pagination"
        :show-search="false"
        @page-change="handlePageChange"
        @refresh="handleRefresh"
      >
        <!-- 状态列 -->
        <template #status="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>

        <!-- 操作列 -->
        <template #actions="{ row }">
          <el-button type="text" size="small" @click="handleEdit(row)"> 编辑 </el-button>
          <el-button type="text" size="small" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </ChaiTable>
    </el-card>

    <!-- 带搜索的表格示例 -->
    <el-card class="demo-card" shadow="never">
      <template #header>
        <h3>带搜索的表格</h3>
      </template>

      <ChaiTable
        :data="searchTableData"
        :columns="searchColumns"
        :loading="loading"
        :pagination="searchPagination"
        :search-form="searchForm"
        :show-selection="true"
        @page-change="handleSearchPageChange"
        @search="handleSearch"
        @reset="handleReset"
        @refresh="handleSearchRefresh"
        @selection-change="handleSelectionChange"
      >
        <!-- 搜索表单项 -->
        <template #search-items="{ searchForm }">
          <el-form-item label="姓名">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入姓名"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="部门">
            <el-select
              v-model="searchForm.department"
              placeholder="请选择部门"
              clearable
              style="width: 150px"
            >
              <el-option label="技术部" value="tech" />
              <el-option label="产品部" value="product" />
              <el-option label="运营部" value="operation" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="searchForm.status"
              placeholder="请选择状态"
              clearable
              style="width: 120px"
            >
              <el-option label="在职" :value="1" />
              <el-option label="离职" :value="0" />
            </el-select>
          </el-form-item>
        </template>

        <!-- 工具栏左侧 -->
        <template #toolbar-left="{ selectedRows }">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增员工
          </el-button>
          <el-button type="danger" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </template>

        <!-- 工具栏右侧 -->
        <template #toolbar-right>
          <el-button @click="handleExport">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </template>

        <!-- 部门列 -->
        <template #department="{ row }">
          <el-tag :type="getDepartmentType(row.department)">
            {{ getDepartmentName(row.department) }}
          </el-tag>
        </template>

        <!-- 状态列 -->
        <template #status="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />
        </template>

        <!-- 操作列 -->
        <template #actions="{ row }">
          <el-button type="text" size="small" @click="handleEdit(row)"> 编辑 </el-button>
          <el-button type="text" size="small" @click="handleView(row)"> 查看 </el-button>
          <el-button type="text" size="small" @click="handleDelete(row)"> 删除 </el-button>
        </template>
      </ChaiTable>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Download } from '@element-plus/icons-vue'
import ChaiTable from '@/components/common/ChaiTable.vue'
import type { ChaiTableColumn } from '@/components/common/ChaiTable.vue'

// 基础表格数据
const basicTableData = ref([
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', status: 1 },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', status: 0 },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', status: 1 },
  { id: 4, name: '赵六', age: 32, email: 'zhaoliu@example.com', status: 1 },
  { id: 5, name: '钱七', age: 27, email: 'qianqi@example.com', status: 0 },
])

const basicColumns: ChaiTableColumn[] = [
  { prop: 'id', label: 'ID', width: 80, sortable: true },
  { prop: 'name', label: '姓名', width: 120, sortable: true },
  { prop: 'age', label: '年龄', width: 100, sortable: true },
  { prop: 'email', label: '邮箱', width: 200 },
  { prop: 'status', label: '状态', width: 100, slots: { default: 'status' } },
]

// 搜索表格数据
const searchTableData = ref([
  { id: 1, name: '张三', department: 'tech', position: '前端工程师', status: 1, salary: 15000 },
  { id: 2, name: '李四', department: 'product', position: '产品经理', status: 1, salary: 18000 },
  { id: 3, name: '王五', department: 'tech', position: '后端工程师', status: 1, salary: 16000 },
  { id: 4, name: '赵六', department: 'operation', position: '运营专员', status: 0, salary: 12000 },
  { id: 5, name: '钱七', department: 'tech', position: 'UI设计师', status: 1, salary: 14000 },
  { id: 6, name: '孙八', department: 'product', position: '产品助理', status: 1, salary: 10000 },
  { id: 7, name: '周九', department: 'operation', position: '运营经理', status: 1, salary: 20000 },
  { id: 8, name: '吴十', department: 'tech', position: '测试工程师', status: 0, salary: 13000 },
])

const searchColumns: ChaiTableColumn[] = [
  { prop: 'id', label: 'ID', width: 80, sortable: true },
  { prop: 'name', label: '姓名', width: 120, sortable: true },
  { prop: 'department', label: '部门', width: 120, slots: { default: 'department' } },
  { prop: 'position', label: '职位', width: 150 },
  { prop: 'salary', label: '薪资', width: 120, sortable: true },
  { prop: 'status', label: '状态', width: 100, slots: { default: 'status' } },
]

// 分页数据
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 5,
})

const searchPagination = reactive({
  current: 1,
  pageSize: 10,
  total: 8,
})

// 搜索表单
const searchForm = reactive({
  name: '',
  department: '',
  status: '',
})

const loading = ref(false)
const selectedRows = ref<any[]>([])

// 事件处理
const handlePageChange = (data: { current: number; pageSize: number }) => {
  pagination.current = data.current
  pagination.pageSize = data.pageSize
  ElMessage.info(`切换到第 ${data.current} 页，每页 ${data.pageSize} 条`)
}

const handleSearchPageChange = (data: { current: number; pageSize: number }) => {
  searchPagination.current = data.current
  searchPagination.pageSize = data.pageSize
  ElMessage.info(`搜索表格切换到第 ${data.current} 页，每页 ${data.pageSize} 条`)
}

const handleRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('基础表格刷新成功')
  }, 1000)
}

const handleSearchRefresh = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    ElMessage.success('搜索表格刷新成功')
  }, 1000)
}

const handleSearch = (form: any) => {
  console.log('搜索参数:', form)
  ElMessage.info('执行搜索操作')
}

const handleReset = () => {
  ElMessage.info('重置搜索条件')
}

const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
  console.log('选中的行:', selection)
}

const handleAdd = () => {
  ElMessage.info('新增员工')
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑员工: ${row.name}`)
}

const handleView = (row: any) => {
  ElMessage.info(`查看员工: ${row.name}`)
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定要删除员工 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    ElMessage.success(`删除员工 ${row.name} 成功`)
  } catch {
    ElMessage.info('已取消删除')
  }
}

const handleBatchDelete = () => {
  ElMessage.info('批量删除操作')
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const handleStatusChange = (row: any) => {
  ElMessage.success(`${row.name} 状态已${row.status ? '启用' : '禁用'}`)
}

// 工具函数
const getDepartmentType = (department: string) => {
  const types: Record<string, string> = {
    tech: 'primary',
    product: 'success',
    operation: 'warning',
  }
  return types[department] || 'info'
}

const getDepartmentName = (department: string) => {
  const names: Record<string, string> = {
    tech: '技术部',
    product: '产品部',
    operation: '运营部',
  }
  return names[department] || department
}

onMounted(() => {
  ElMessage.success('ChaiTable 组件演示页面加载完成')
})
</script>

<style scoped>
.chai-table-demo {
  padding: 20px;
}

.demo-card {
  margin-bottom: 20px;
}

.demo-card:last-child {
  margin-bottom: 0;
}

h2 {
  margin-bottom: 20px;
  color: #303133;
}

h3 {
  margin: 0;
  color: #606266;
  font-size: 16px;
}
</style>
