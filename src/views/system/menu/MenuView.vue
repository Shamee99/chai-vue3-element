<template>
  <div class="menu-management container-wrapper">
    <div class="menu-layout">
      <!-- 左侧菜单树 -->
      <div class="menu-tree-panel">
        <MenuTree
          ref="menuTreeRef"
          title="菜单结构"
          :show-actions="false"
          v-model:selected-id="selectedMenuId"
          v-model:menu-type="selectMenuType"
          @node-click="handleTreeNodeClick"
          @refresh="handleTreeRefresh"
        />
      </div>

      <!-- 右侧菜单列表 -->
      <div class="menu-table-panel">
        <ChaiTable
          :data="tableData"
          :columns="tableColumns"
          :loading="loading"
          :pagination="paginationConfig"
          :search-form="searchForm"
          :show-selection="false"
          @page-change="handlePageChange"
          @search="handleSearch"
          @reset="handleReset"
          @refresh="handleRefresh"
          @selection-change="handleSelectionChange"
        >
          <!-- 搜索表单项 -->
          <template #search-items="{ searchForm }">
            <el-form-item label="菜单名称">
              <el-input v-model="searchForm.menuName" placeholder="请输入菜单名称" clearable />
            </el-form-item>
            <el-form-item label="菜单类型" style="width: 200px">
              <el-select v-model="searchForm.menuType" placeholder="请选择菜单类型" clearable>
                <el-option
                  v-for="option in menuTypeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" style="width: 200px">
              <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
                <el-option
                  v-for="option in STATUS_OPTIONS"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </template>

          <!-- 工具栏左侧 -->
          <template #toolbar-left="{ selectedRows }">
            <el-button type="primary" @click="handleAdd(selectedMenuId)">
              <el-icon><Plus /></el-icon>
              新增菜单
            </el-button>
            <el-button type="primary" :disabled="selectedRows.length === 0" @click="handleExport">
              <el-icon><Download /></el-icon>
              导出选中
            </el-button>
          </template>

          <!-- 工具栏右侧 -->
          <template #toolbar-right>
            <el-tooltip content="展开/折叠" placement="top">
              <el-button type="text" @click="handleToggleExpand">
                <el-icon><Operation /></el-icon>
              </el-button>
            </el-tooltip>
          </template>

          <!-- 菜单图标列 -->
          <template #icon="{ row }">
            <el-icon v-if="row.icon">
              <component :is="row.icon" />
            </el-icon>
          </template>

          <!-- 菜单类型列 -->
          <template #menuType="{ row }">
            <el-tag :type="getMenuTypeTag(row.menuType)" size="small" effect="dark">
              {{ getMenuTypeText(row.menuType) }}
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

    <!-- 菜单表单弹窗组件 -->
    <MenuAdd
      v-model:visible="addDialogVisible"
      :menu-data="currentMenu"
      :default-parent-id="defaultParentId"
      :default-parent-menu-type="defaultParentMenuType"
      @success="handleFormSuccess"
    />

    <MenuEdit
      v-model:visible="editDialogVisible"
      :menu-data="currentMenu"
      @success="handleFormSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ElButton, ElIcon, ElMessage, ElMessageBox, ElSwitch, ElTag } from 'element-plus'
import { Delete, Download, Edit, Operation, Plus } from '@element-plus/icons-vue'
import ChaiTable from '@/components/common/ChaiTable.vue'
import MenuTree from './components/MenuTree.vue'
import MenuAdd from './components/Add.vue'
import MenuEdit from './components/Edit.vue'
import { MenuType, STATUS_OPTIONS } from '@/constants/FreezeConst.ts'
import { getMenuTypeTag, getMenuTypeText } from '@/utils/menu-helpers.ts'
import { PageParams } from '@/components/common/api/page.types.ts'
import { createMenuListParams, deleteMenu, getMenuPage } from '@/views/system/menu/api/menu.ts'
import { MenuQueryParams, SysMenu } from '@/views/system/menu/api/menu.types.ts'

// 响应式数据
const loading = ref(false)
const selectedRows = ref<SysMenu[]>([])
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const currentMenu = ref<SysMenu | null>(null)
const defaultParentId = ref<string>()
const defaultParentMenuType = ref<MenuType>()
const expandAll = ref(false)

// 菜单树相关
const menuTreeRef = ref<InstanceType<typeof MenuTree>>()
const selectedMenuId = ref('')
const selectMenuType = ref<MenuType>(MenuType.DIRECTORY)

// 搜索表单
const searchForm = reactive({
  parentId: '',
  menuName: '',
  status: '',
})

const menuTypeOptions = [
  { label: '目录', value: 1 as const },
  { label: '菜单', value: 2 as const },
  { label: '按钮', value: 3 as const },
]

// 分页配置
const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0,
})

// 计算属性
const paginationConfig = computed(() => ({
  pageNo: pagination.pageNo,
  pageSize: pagination.pageSize,
  total: pagination.total,
  pageSizes: [10, 20, 50, 100],
}))

// 表格列配置
const tableColumns = [
  { prop: 'menuName', label: '菜单名称', width: 180, sortable: true },
  {
    prop: 'icon',
    label: '图标',
    width: 80,
    align: 'center',
    slots: { default: 'icon' },
  },
  {
    prop: 'menuType',
    label: '类型',
    width: 80,
    align: 'center',
    slots: { default: 'menuType' },
  },
  { prop: 'orderNum', label: '排序', width: 80, sortable: true },
  { prop: 'permissions', label: '权限标识', width: 180 },
  { prop: 'path', label: '路由地址', width: 150 },
  { prop: 'component', label: '组件路径', width: 200, showOverflowTooltip: true },
  {
    prop: 'status',
    label: '状态',
    width: 120,
    align: 'center',
    slots: { default: 'status' },
  },
  { prop: 'createTime', label: '创建时间', width: 180, sortable: true },
  {
    prop: 'actions',
    label: '操作',
    width: 200,
    fixed: 'right',
    slots: { default: 'actions' },
  },
]

// 模拟菜单数据
const tableData = ref<SysMenu[]>([])

// 树形节点点击事件
const handleTreeNodeClick = (data: SysMenu) => {
  console.log('选中菜单:', data)
  if (data.id) {
    selectedMenuId.value = data.id.toString()
    selectMenuType.value = data.menuType
    searchForm.parentId = data.id.toString()
    handleSearch()
  }
}

// 树形刷新事件
const handleTreeRefresh = () => {
  loadData()
}

// 新增菜单
const handleAdd = (selectMenuId?: string) => {
  debugger
  currentMenu.value = null
  defaultParentId.value = selectMenuId || undefined
  defaultParentMenuType.value = selectMenuType
  addDialogVisible.value = true
}

// 编辑菜单
const handleEdit = (row: SysMenu) => {
  currentMenu.value = { ...row }
  editDialogVisible.value = true
}

// 删除菜单
const handleDelete = async (row: SysMenu) => {
  await ElMessageBox.confirm(`确定要删除菜单 "${row.menuName}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })

  await deleteMenu(row.id)
  ElMessage.success('删除成功')
  await loadData()
}

// 状态切换
const handleStatusChange = (row: SysMenu) => {
  // const status = row.status === 1 ? '启用' : '停用'
  // ElMessage.success(`${status}成功`)
}

// 表单成功回调
const handleFormSuccess = () => {
  loadData()
  // 刷新左侧菜单树
  if (menuTreeRef.value) {
    menuTreeRef.value.refresh()
    // 延迟展开所有节点，确保数据加载完成
    setTimeout(() => {
      if (menuTreeRef.value) {
        menuTreeRef.value.toggleExpand(true)
      }
    }, 100)
  }
}

// 导出选中
const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}

// 展开/折叠
const handleToggleExpand = () => {
  expandAll.value = !expandAll.value
  ElMessage.info(expandAll.value ? '已展开所有' : '已折叠所有')
}

// 分页相关
const handlePageChange = (page: PageParams) => {
  pagination.pageNo = page.pageNo || 1
  pagination.pageSize = page.pageSize || 10
  loadData()
}

// 搜索
const handleSearch = () => {
  pagination.pageNo = 1
  loadData()
}

// 重置
const handleReset = () => {
  Object.assign(searchForm, {
    parentId: '',
    menuName: '',
    menuType: '',
    status: '',
  })
  selectedMenuId.value = ''
  loadData()
}

// 刷新
const handleRefresh = () => {
  loadData()
}

// 选择变化
const handleSelectionChange = (selection: SysMenu[]) => {
  selectedRows.value = selection
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const queryParams: MenuQueryParams = {}
    if (searchForm.menuName) {
      queryParams.menuName = searchForm.menuName
    }
    if (searchForm.status !== '') {
      queryParams.status = Number(searchForm.status)
    }
    if (searchForm.parentId !== '') {
      queryParams.parentId = searchForm.parentId
    }

    // 创建请求参数
    const params = createMenuListParams(pagination.pageNo, pagination.pageSize, queryParams)

    // 调用API获取数据
    const response = await getMenuPage(params)
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
.menu-management {
  padding: 0;
  height: 100%;
}

.container-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.menu-layout {
  display: flex;
  height: 100%;
  gap: 16px;
}

.menu-tree-panel {
  width: 280px;
  min-width: 280px;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.menu-table-panel {
  flex: 1;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.danger {
  color: #f56c6c;
}

.danger:hover {
  color: #f56c6c;
  background-color: #fef0f0;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .menu-layout {
    flex-direction: column;
    height: auto;
  }

  .menu-tree-panel {
    width: 100%;
    height: 300px;
    min-height: 300px;
  }

  .menu-table-panel {
    height: calc(100vh - 400px);
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  .menu-layout {
    gap: 12px;
  }

  .menu-tree-panel {
    height: 250px;
    min-height: 250px;
  }

  .menu-table-panel {
    height: calc(100vh - 350px);
    min-height: 400px;
  }
}
</style>
