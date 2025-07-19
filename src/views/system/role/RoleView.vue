<template>
  <div class="role-management container-wrapper">
    <!-- ChaiTable 组件 -->
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
        <el-form-item label="角色名称">
          <el-input v-model="searchForm.roleName" placeholder="请输入角色名称" clearable />
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
          新增角色
        </el-button>
        <el-button type="success" :disabled="selectedRows.length === 0" @click="handleBatchDelete">
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
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
        <el-button type="text" size="small" @click="handlePermission(row)">
          <el-icon><Key /></el-icon>
          分配权限
        </el-button>
        <el-button type="text" size="small" @click="handleDelete(row)" class="danger">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
      </template>
    </ChaiTable>

    <!-- 新增角色组件 -->
    <AddRole v-model:visible="addDialogVisible" @success="handleAddSuccess" />

    <!-- 编辑角色组件 -->
    <EditRole
      v-model:visible="editDialogVisible"
      :role-data="currentRole"
      @success="handleEditSuccess"
    />

    <!-- 权限分配组件 -->
    <PermissionRole
      v-model:visible="permissionDialogVisible"
      :role-data="currentRole"
      @success="handlePermissionSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import { Delete, Edit, Key, Plus } from '@element-plus/icons-vue'
import ChaiTable from '@/components/common/ChaiTable.vue'
import AddRole from './components/Add.vue'
import EditRole from './components/Edit.vue'
import PermissionRole from './components/Permission.vue'
import type { Role, RoleQueryParams, RoleStatus } from './api/role.types'
import {
  createRoleListParams,
  deleteRole,
  getRoleList,
  updateRoleStatus
} from './api/role'

// 响应式数据
const loading = ref(false)
const tableData = ref<Role[]>([])
const selectedRows = ref<Role[]>([])

// 对话框显示状态
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const currentRole = ref<Role | null>(null)

// 查询参数
const searchForm = reactive({
  roleName: '',
  status: undefined,
})

// 表格列配置
const tableColumns = [
  {
    prop: 'roleName',
    label: '角色名称',
    minWidth: 120,
    showOverflowTooltip: true,
  },
  {
    prop: 'roleCode',
    label: '角色标识',
    minWidth: 100,
    showOverflowTooltip: true,
  },
  {
    prop: 'roleDesc',
    label: '角色描述',
    minWidth: 120,
    align: 'center',
  },
  {
    prop: 'status',
    label: '状态',
    width: 100,
    align: 'center',
    slots: {
      default: 'status',
    },
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 180,
    align: 'center',
  },
  {
    prop: 'actions',
    label: '操作',
    width: 280,
    align: 'center',
    fixed: 'right',
    slots: {
      default: 'actions',
    },
  },
]

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})
// 分页配置
const paginationConfig = computed(() => ({
  pageNo: pagination.pageNo,
  pageSize: pagination.pageSize,
  total: pagination.total,
  pageSizes: [10, 20, 50, 100],
}))

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const queryParams: RoleQueryParams = {}
    if (searchForm.roleName !== '') {
      queryParams.roleName = searchForm.roleName
    }
    if (searchForm.status !== '') {
      queryParams.status = Number(searchForm.status)
    }

    // 创建请求参数
    const params = createRoleListParams(pagination.pageNo, pagination.pageSize, queryParams)
    // 调用API获取数据
    const response = await getRoleList(params)

    tableData.value = response.records
    pagination.total = response.total
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  queryParams.pageNo = 1
  loadData()
}

// 重置搜索
const handleReset = () => {
  Object.assign(queryParams, {
    roleName: '',
    roleKey: '',
    status: undefined,
    pageNo: 1,
    pageSize: 10,
  })
  loadData()
}

// 新增角色
const handleAdd = () => {
  addDialogVisible.value = true
}

// 编辑角色
const handleEdit = (row: Role) => {
  currentRole.value = { ...row }
  editDialogVisible.value = true
}

// 删除角色
const handleDelete = async (row: Role) => {
  await ElMessageBox.confirm(`确定要删除角色"${row.roleName}"吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })

  await deleteRole(row.id!)
  ElMessage.success('删除成功')
  await loadData()
}

// 分配权限
const handlePermission = (row: Role) => {
  currentRole.value = { ...row }
  permissionDialogVisible.value = true
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的角色')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个角色吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      },
    )

    const ids = selectedRows.value.map((row) => row.id!)
    // await batchDeleteRole(ids)
    ElMessage.success('批量删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 切换状态
const handleStatusChange = async (row: Role) => {
  try {
    await updateRoleStatus(row.id!, row.status)
    ElMessage.success('状态更新成功')
    loadData()
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
    // 恢复原状态
    row.status = row.status === RoleStatus.ENABLED ? RoleStatus.DISABLED : RoleStatus.ENABLED
  }
}

// 分页变化
const handlePageChange = (page: number, size: number) => {
  queryParams.pageNo = page
  queryParams.pageSize = size
  loadData()
}

// 刷新
const handleRefresh = () => {
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: Role[]) => {
  selectedRows.value = selection
}

// 新增成功回调
const handleAddSuccess = () => {
  loadData()
}

// 编辑成功回调
const handleEditSuccess = () => {
  loadData()
}

// 权限分配成功回调
const handlePermissionSuccess = () => {
  loadData()
}

// 组件挂载时加载数据
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.role-management {
  padding: 0;
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
</style>
