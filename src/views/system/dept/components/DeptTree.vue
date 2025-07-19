<template>
  <el-card class="dept-tree-card">
    <template #header>
      <div class="tree-header">
        <span>{{ title }}</span>
        <div class="tree-actions">
          <el-tooltip content="刷新" placement="top">
            <el-button type="text" size="small" @click="handleRefresh">
              <el-icon><Refresh /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="展开/折叠" placement="top">
            <el-button type="text" size="small" @click="handleToggleExpand">
              <el-icon><Operation /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </template>

    <el-tree
      ref="treeRef"
      :data="treeData"
      :props="treeProps"
      :expand-on-click-node="false"
      :default-expand-all="false"
      :highlight-current="highlightCurrent"
      node-key="id"
      @node-click="handleNodeClick"
    >
      <template #default="{ node, data }">
        <div class="tree-node">
          <el-icon class="tree-icon">
            <OfficeBuilding />
          </el-icon>
          <span class="tree-label">{{ node.label }}</span>
          <div v-if="showActions" class="tree-node-actions" @click.stop>
            <el-dropdown
              trigger="click"
              @command="(command) => handleNodeAction(command, data)"
            >
              <el-button type="text" size="small">
                <el-icon><MoreFilled /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="add">新增下级</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>
    </el-tree>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  ElButton,
  ElCard,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElMessage,
  ElTooltip,
  ElTree
} from 'element-plus'
import {
  MoreFilled,
  OfficeBuilding,
  Operation,
  Refresh,
} from '@element-plus/icons-vue'
import { getDeptTree } from '@/views/system/dept/api/dept'
import type { DeptTree, Dept } from '@/views/system/dept/api/dept.types'

// Props 定义
interface Props {
  title?: string
  showActions?: boolean
  highlightCurrent?: boolean
  autoLoad?: boolean
  selectedId?: string
}

// Emits 定义
interface Emits {
  (e: 'node-click', data: Dept): void
  (e: 'node-action', action: string, data: Dept): void
  (e: 'refresh'): void
  (e: 'update:selectedId', id: string): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '组织架构',
  showActions: false,
  highlightCurrent: true,
  autoLoad: true,
  selectedId: ''
})

const emit = defineEmits<Emits>()

// 响应式数据
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref<DeptTree[]>([])
const expandAll = ref(true)
const loading = ref(false)

// 树形组件配置
const treeProps = {
  children: 'children',
  label: 'deptName',
}

// 监听选中ID变化
watch(() => props.selectedId, (newId) => {
  if (newId && treeRef.value) {
    treeRef.value.setCurrentKey(newId)
  }
}, { immediate: true })

// 节点点击事件
const handleNodeClick = (data: Dept) => {
  emit('node-click', data)
  if (data.id) {
    emit('update:selectedId', data.id)
  }
}

// 节点操作
const handleNodeAction = (command: string, data: Dept) => {
  emit('node-action', command, data)
}

// 展开/折叠切换
const handleToggleExpand = () => {
  if (!treeRef.value || treeData.value.length === 0) {
    ElMessage.warning('暂无数据')
    return
  }

  expandAll.value = !expandAll.value

  // 获取所有节点的key
  const getAllNodeKeys = (nodes: DeptTree[]): string[] => {
    let keys: string[] = []
    nodes.forEach((node) => {
      if (node.id) {
        keys.push(node.id)
      }
      if (node.children && node.children.length > 0) {
        keys = keys.concat(getAllNodeKeys(node.children))
      }
    })
    return keys
  }

  const allKeys = getAllNodeKeys(treeData.value)

  if (expandAll.value) {
    // 展开所有节点 - 使用正确的Element Plus API
    allKeys.forEach(key => {
      const node = treeRef.value?.getNode(key)
      if (node && !node.expanded) {
        node.expand()
      }
    })
  } else {
    // 折叠所有节点 - 使用正确的Element Plus API
    allKeys.forEach(key => {
      const node = treeRef.value?.getNode(key)
      if (node && node.expanded) {
        node.collapse()
      }
    })
  }
}

// 刷新数据
const handleRefresh = () => {
  loadTreeData()
  emit('refresh')
}

// 加载树形数据
const loadTreeData = async () => {
  loading.value = true
  try {
    treeData.value = await getDeptTree()
  } finally {
    loading.value = false
  }
}

// 清除选中
const clearSelection = () => {
  if (treeRef.value) {
    treeRef.value.setCurrentKey(null)
  }
  emit('update:selectedId', '')
}

// 设置选中节点
const setCurrentKey = (key: string | null) => {
  if (treeRef.value) {
    treeRef.value.setCurrentKey(key)
  }
}

// 获取当前选中节点
const getCurrentKey = () => {
  return treeRef.value?.getCurrentKey()
}

// 获取当前选中节点数据
const getCurrentNode = () => {
  return treeRef.value?.getCurrentNode()
}

// 暴露方法给父组件
defineExpose({
  loadTreeData,
  clearSelection,
  setCurrentKey,
  getCurrentKey,
  getCurrentNode,
  treeRef
})

// 组件挂载时自动加载数据
onMounted(() => {
  if (props.autoLoad) {
    loadTreeData()
  }
})
</script>

<style scoped>
.dept-tree-card {
  height: 100%;
}

.dept-tree-card :deep(.el-card__body) {
  padding: 0;
  height: calc(100% - 60px);
  overflow: auto;
}

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tree-actions {
  display: flex;
  gap: 4px;
}

.tree-node {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 0;
}

.tree-icon {
  margin-right: 8px;
  color: #606266;
}

.tree-label {
  flex: 1;
  font-size: 14px;
}

.tree-node-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-node:hover .tree-node-actions {
  opacity: 1;
}

/* 树形组件样式优化 */
:deep(.el-tree-node__content) {
  height: 36px;
  padding: 0 12px;
}

:deep(.el-tree-node__content:hover) {
  background-color: #f5f7fa;
}

:deep(.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content) {
  background-color: #e6f7ff;
  color: #409eff;
}
</style>
