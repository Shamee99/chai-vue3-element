<template>
  <div class="dept-management container-wrapper">
    <div class="dept-layout">
      <!-- 左侧部门树 -->
      <div class="dept-tree-panel">
        <DeptTree
          ref="deptTreeRef"
          title="组织架构"
          :show-actions="true"
          v-model:selected-id="selectedDeptId"
          @node-click="handleTreeNodeClick"
          @node-action="handleTreeNodeAction"
          @refresh="handleTreeRefresh"
        />
      </div>

      <!-- 右侧部门列表 -->
      <div class="dept-table-panel">
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
            <el-form-item label="部门名称">
              <el-input v-model="searchForm.deptName" placeholder="请输入部门名称" clearable />
            </el-form-item>
            <!--            <el-form-item label="负责人">-->
            <!--              <el-input v-model="searchForm.leader" placeholder="请输入负责人" clearable />-->
            <!--            </el-form-item>-->
            <el-form-item label="状态" style="width: 200px">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                <el-option label="正常" value="1" />
                <el-option label="停用" value="0" />
              </el-select>
            </el-form-item>
          </template>

          <!-- 工具栏左侧 -->
          <template #toolbar-left="{ selectedRows }">
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              新增部门
            </el-button>
            <el-button type="primary" :disabled="selectedRows.length === 0" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出选中
            </el-button>
          </template>

          <!-- 关联角色 -->
          <template #roles="{ row }">
            <el-tag
              style="margin-right: 5px"
              v-for="role in row.roleNames"
              :type="role === '超级管理员' ? 'danger' : 'primary'"
              size="small"
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
            <el-button type="text" size="small" class="danger" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </ChaiTable>
      </div>
    </div>

    <!-- 部门表单弹窗组件 -->
    <DeptAdd
      v-model:visible="addDialogVisible"
      :dept-data="currentDept"
      @success="handleFormSuccess"
    />

    <DeptEdit
      v-model:visible="editDialogVisible"
      :dept-data="currentDept"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElButton, ElMessage, ElMessageBox, ElSwitch, ElTag } from 'element-plus'
import { Delete, Download, Edit, Operation, Plus } from '@element-plus/icons-vue'
import { Dept, DeptQueryParams } from './api/dept.types'
import { createDeptListParams, deleteDept, getDeptList, updateDeptStatus } from './api/dept'
import ChaiTable from '@/components/common/ChaiTable.vue'
import DeptTree from './components/DeptTree.vue'
import DeptAdd from './components/Add.vue'
import DeptEdit from './components/Edit.vue'
import { PageParams } from '@/components/common/api/page.types.ts'

const loading = ref(false)
const selectedRows = ref<Dept[]>([])
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const currentDept = ref<Dept | null>(null)
const expandAll = ref(false)

// 树形组件相关
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
  { prop: 'deptName', label: '部门名称', width: 150, sortable: true },
  { prop: 'leader', label: '负责人', width: 120 },
  { prop: 'roleNames', label: '关联角色', width: 200, slots: { default: 'roles' } },
  { prop: 'phone', label: '联系电话', width: 150 },
  { prop: 'email', label: '邮箱', width: 200 },
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
  { prop: 'actions', label: '操作', width: 180, fixed: 'right', slots: { default: 'actions' } },
]

const searchForm = reactive({
  parentId: '',
  deptName: '',
  leader: '',
  status: '',
})

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})

// 表格数据
const tableData = ref<Dept[]>([])

// 树形节点点击事件
const handleTreeNodeClick = (data: Dept) => {
  // 根据选中的树节点过滤表格数据
  if (data.id) {
    searchForm.parentId = data.id
    handleSearch()
  }
}

// 树形节点操作
const handleTreeNodeAction = (command: string, data: Dept) => {
  switch (command) {
    case 'add':
      handleAddChild(data)
      break
    case 'edit':
      handleEdit(data)
      break
    case 'delete':
      handleDelete(data)
      break
  }
}

// 树形刷新事件
const handleTreeRefresh = () => {
  // 可以在这里添加额外的刷新逻辑
}

// 新增部门
const handleAdd = () => {
  currentDept.value = null
  addDialogVisible.value = true
}

// 新增下级部门
const handleAddChild = (row: Dept) => {
  currentDept.value = {
    id: '',
    deptName: '',
    deptCode: '',
    parentId: row.id,
    orderNum: 0,
    leader: '',
    phone: '',
    email: '',
    status: 1,
  }
  addDialogVisible.value = true
}

// 编辑部门
const handleEdit = (row: Dept) => {
  currentDept.value = { ...row }
  editDialogVisible.value = true
}

// 表单提交成功回调
const handleFormSuccess = () => {
  loadData()
  // 刷新树形数据
  if (deptTreeRef.value) {
    deptTreeRef.value.loadTreeData()
  }
}

const handleSearch = () => {
  pagination.pageNo = 1
  loadData()
}

const handleReset = () => {
  Object.assign(searchForm, {
    parentId: '',
    deptName: '',
    leader: '',
    status: '',
  })
  selectedDeptId.value = ''
  if (deptTreeRef.value) {
    deptTreeRef.value.clearSelection()
  }
  pagination.pageNo = 1
  loadData()
}

const handleDelete = async (row: Dept) => {
  await ElMessageBox.confirm(`确定要删除部门 "${row.deptName}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })

  // 调用删除API
  if (row.id) {
    await deleteDept(row.id)
    ElMessage.success('删除成功')
    // 重新加载数据
    await loadData()
    // 刷新树形数据
    if (deptTreeRef.value) {
      deptTreeRef.value.loadTreeData()
    }
  }
}

const handleStatusChange = async (row: Dept) => {
  try {
    if (row.id) {
      await updateDeptStatus(row.id, row.status)
      ElMessage.success(`部门状态已${row.status ? '启用' : '停用'}`)
      // 刷新树形数据以同步状态
      if (deptTreeRef.value) {
        deptTreeRef.value.loadTreeData()
      }
    }
  } catch (error) {
    console.error('更新部门状态失败:', error)
    ElMessage.error('更新部门状态失败')
    // 恢复原状态
    row.status = row.status ? 0 : 1
  }
}

// 展开/折叠
const handleToggleExpand = () => {
  expandAll.value = !expandAll.value
  ElMessage.info(expandAll.value ? '已展开所有' : '已折叠所有')
}

// 表格事件处理
const handleRefresh = () => {
  loadData()
  // 刷新树形数据
  if (deptTreeRef.value) {
    deptTreeRef.value.loadTreeData()
  }
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
const handleSelectionChange = (selection: Dept[]) => {
  selectedRows.value = selection
}

// 分页事件处理
const handlePageChange = (page: PageParams) => {
  pagination.pageNo = page.pageNo
  pagination.pageSize = page.pageSize
  loadData()
}

const loadData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const queryParams: DeptQueryParams = {}
    if (searchForm.deptName) {
      queryParams.deptName = searchForm.deptName
    }
    if (searchForm.leader) {
      queryParams.leader = searchForm.leader
    }
    if (searchForm.status !== '') {
      queryParams.status = Number(searchForm.status)
    }
    if (searchForm.parentId !== '') {
      queryParams.parentId = searchForm.parentId
    }

    // 创建请求参数
    const params = createDeptListParams(pagination.pageNo, pagination.pageSize, queryParams)

    // 调用API获取数据
    const response = await getDeptList(params)

    tableData.value = response.records
    pagination.total = response.total
  } catch (error) {
    console.error('获取部门列表失败:', error)
    ElMessage.error('获取部门列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.dept-management {
  padding: 0;
  height: 100%;
}

.dept-layout {
  display: flex;
  height: 100%;
  gap: 16px;
}

.dept-tree-panel {
  width: 300px;
  flex-shrink: 0;
}

.dept-table-panel {
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
  .dept-layout {
    flex-direction: column;
    height: auto;
  }

  .dept-tree-panel {
    width: 100%;
    height: 300px;
  }

  .dept-table-panel {
    width: 100%;
  }
}
</style>
