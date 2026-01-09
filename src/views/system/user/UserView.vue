<template>
  <div class="user-management container-wrapper">
    <div class="user-layout">
      <!-- 左侧部门树 -->
      <div class="dept-tree-panel">
        <DeptTree
          ref="deptTreeRef"
          title="选择部门"
          :show-actions="false"
          v-model:selected-id="selectedDeptId"
          @node-click="handleDeptSelect"
        />
      </div>

      <!-- 右侧用户列表 -->
      <div class="user-table-panel">
        <ChaiTable
          :data="tableData"
          :columns="tableColumns"
          :loading="loading"
          :pagination="paginationConfig"
          :search-form="searchForm"
          :show-selection="true"
          @page-change="handlePageChange"
          @search="handleSearch"
          @reset="handleReset"
          @refresh="handleRefresh"
          @selection-change="handleSelectionChange"
        >
          <!-- 搜索表单项 -->
          <template #search-items="{ searchForm }">
            <el-form-item label="用户名">
              <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
            </el-form-item>
            <el-form-item label="状态" style="width: 200px">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
          </template>

          <!-- 工具栏左侧 -->
          <template #toolbar-left="{ selectedRows }">
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              新增用户
            </el-button>
            <el-button type="primary" :disabled="selectedRows.length === 0" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出选中
            </el-button>
          </template>

          <!-- 工具栏右侧 -->
          <!--          <template #toolbar-right>-->
          <!--            <el-tooltip content="下载模板" placement="top">-->
          <!--              <el-button type="text" @click="handleDownloadTemplate">-->
          <!--                <el-icon><Document /></el-icon>-->
          <!--              </el-button>-->
          <!--            </el-tooltip>-->
          <!--            <el-tooltip content="导入数据" placement="top">-->
          <!--              <el-button type="text" @click="handleImport">-->
          <!--                <el-icon><Upload /></el-icon>-->
          <!--              </el-button>-->
          <!--            </el-tooltip>-->
          <!--          </template>-->

          <!-- 角色列 -->
          <template #role="{ row }">
            <el-tag
              v-for="role in row.roles"
              :type="role === '超级管理员' ? 'danger' : 'primary'"
              size="small"
              style="margin-right: 5px"
            >
              {{ role }}
            </el-tag>
          </template>

          <!-- 状态列 -->
          <template #status="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @click="handleStatusChange(row)"
            />
          </template>

          <!-- 操作列 -->
          <template #actions="{ row }">
            <el-button type="text" size="small" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button type="text" size="small" @click="handleResetPassword(row)">
              <el-icon><Key /></el-icon>
              重置密码
            </el-button>
            <el-button type="text" size="small" class="danger" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </ChaiTable>
      </div>
    </div>

    <!-- 用户新增弹窗组件 -->
    <UserAdd
      v-model:visible="addDialogVisible"
      :default-dept-id="selectedDeptId"
      @success="handleFormSuccess"
    />

    <!-- 用户编辑弹窗组件 -->
    <UserEdit
      v-model:visible="editDialogVisible"
      :user-data="currentUser"
      :user-id="currentUserId"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElButton, ElIcon, ElMessage, ElMessageBox, ElSwitch, ElTag } from 'element-plus'
import { Delete, Document, Download, Edit, Key, Plus, Upload } from '@element-plus/icons-vue'
import type { User, UserQueryParams } from './api/user.types'
import {
  createUserListParams,
  deleteUser,
  getUserList,
  resetUserPassword,
  updateUserStatus,
} from './api/user'
import ChaiTable from '@/components/common/ChaiTable.vue'
import DeptTree from '@/views/system/dept/components/DeptTree.vue'
import UserAdd from './components/UserAdd.vue'
import UserEdit from './components/UserEdit.vue'
import type { Dept } from '@/views/system/dept/api/dept.types'

const loading = ref(false)
const selectedRows = ref<User[]>([])
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const currentUser = ref<User | null>(null)
const currentUserId = ref<string | null>(null)

// 部门树相关
const deptTreeRef = ref<InstanceType<typeof DeptTree>>()
const selectedDeptId = ref('')

// 分页配置
const paginationConfig = computed(() => ({
  pageNo: pagination.pageNo,
  pageSize: pagination.pageSize,
  total: pagination.total,
  pageSizes: [10, 20, 50, 100],
}))

// 基础表格列配置
const tableColumns = [
  { prop: 'username', label: '用户名', width: 120, sortable: true },
  { prop: 'nickname', label: '昵称', width: 120 },
  { prop: 'deptName', label: '所属部门', width: 130 },
  { prop: 'email', label: '邮箱', width: 180 },
  { prop: 'phone', label: '手机号', width: 130 },
  {
    prop: 'role',
    label: '角色',
    width: 180,
    slots: {
      default: 'role',
    },
  },
  {
    prop: 'status',
    label: '状态',
    width: 120,
    align: 'center',
    slots: {
      default: 'status',
    },
  },
  { prop: 'createTime', label: '创建时间', width: 180, sortable: true },
  { prop: 'actions', label: '操作', width: 270, fixed: 'right', slots: { default: 'actions' } },
]

const searchForm = reactive({
  username: '',
  status: '',
  deptId: '', // 添加部门ID搜索条件
})

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})

// 表格数据
const tableData = ref<User[]>([])

// 部门选择事件
const handleDeptSelect = (data: Dept) => {
  if (data.id) {
    selectedDeptId.value = data.id.toString()
    searchForm.deptId = data.id
    handleSearch()
  }
}

// 新增用户
const handleAdd = () => {
  addDialogVisible.value = true
}

// 编辑用户
const handleEdit = (row: User) => {
  currentUser.value = { ...row }
  currentUserId.value = row.id
  editDialogVisible.value = true
}

// 表单提交成功回调
const handleFormSuccess = () => {
  loadData()
}

const handleSearch = () => {
  pagination.pageNo = 1
  loadData()
}

const handleReset = () => {
  Object.assign(searchForm, {
    username: '',
    status: '',
    deptId: '', // 重置部门ID
  })
  selectedDeptId.value = ''
  if (deptTreeRef.value) {
    deptTreeRef.value.clearSelection()
  }
  pagination.pageNo = 1
  loadData()
}

const handleDelete = async (row: User) => {
  await ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })

  // 调用删除API
  if (row.id) {
    await deleteUser(row.id)
    ElMessage.success('删除成功')
    // 重新加载数据
    await loadData()
  }
}

const handleStatusChange = async (row: User) => {
  if (row.id) {
    await updateUserStatus(row.id, row.status)
    ElMessage.success(`用户状态已${row.status ? '启用' : '禁用'}`)
  }
}

const handleResetPassword = async (row: User) => {
  await ElMessageBox.confirm(`确定要重置用户 "${row.username}" 的密码吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })

  // 调用重置密码API
  if (row.id) {
    await resetUserPassword(row.id)
    ElMessage.success('密码重置成功，新密码为：123456')
  }
}

// vxe-table 事件处理
const handleRefresh = () => {
  loadData()
}

const handleExport = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要导出的数据')
    return
  }
  console.log('导出数据:', selectedRows.value)
  ElMessage.success('导出成功')
}
// 选择改变
const handleSelectionChange = (selection: User[]) => {
  selectedRows.value = selection
}

// 分页事件处理
const handlePageChange = (data: { pageNo: number; pageSize: number }) => {
  pagination.pageNo = data.pageNo
  pagination.pageSize = data.pageSize
  loadData()
}

// 工具栏事件处理
const handleDownloadTemplate = () => {
  ElMessage.info('下载模板功能待实现')
}

const handleImport = () => {
  ElMessage.info('导入数据功能待实现')
}

const loadData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const queryParams: UserQueryParams = {}
    if (searchForm.username) {
      queryParams.username = searchForm.username
    }
    if (searchForm.status !== '') {
      queryParams.status = Number(searchForm.status)
    }
    if (searchForm.deptId !== '') {
      queryParams.deptId = searchForm.deptId
    }

    // 创建请求参数
    const params = createUserListParams(pagination.pageNo, pagination.pageSize, queryParams)

    // 调用API获取数据
    const response = await getUserList(params)

    tableData.value = response.records
    pagination.total = response.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.user-management {
  padding: 0;
  height: 100%;
}

.user-layout {
  display: flex;
  height: 100%;
  gap: 16px;
}

.dept-tree-panel {
  width: 300px;
  flex-shrink: 0;
}

.user-table-panel {
  flex: 1;
  min-width: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.danger {
  color: #f56c6c;
}

.dialog-footer {
  text-align: right;
}

.toolbar-left {
  display: flex;
  gap: 8px;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

/* 操作列设置弹窗样式 */
.ml-2 {
  margin-left: 8px;
}

.text-gray-500 {
  color: #6b7280;
  font-size: 12px;
}

.dialog-footer {
  text-align: right;
}

.dialog-footer .el-button {
  margin-left: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .dept-tree-panel {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .user-layout {
    flex-direction: column;
    height: auto;
  }

  .dept-tree-panel {
    width: 100%;
    height: 300px;
  }

  .user-table-panel {
    width: 100%;
  }
}
</style>
