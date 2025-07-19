<template>
  <div class="menu-tree-container">
    <el-card class="tree-card">
      <template #header>
        <div class="tree-header">
          <span class="tree-title">{{ title }}</span>
          <div class="tree-actions" v-if="showActions">
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

      <div class="tree-content">
        <el-tree
          ref="treeRef"
          :data="treeData"
          :props="treeProps"
          :default-expand-all="expandAll"
          :expand-on-click-node="false"
          :highlight-current="true"
          node-key="id"
          @node-click="handleNodeClick"
        >
          <template #default="{ node, data }">
            <div class="tree-node">
              <div class="node-content">
                <el-icon v-if="data.icon" class="node-icon">
                  <component :is="data.icon" />
                </el-icon>
                <span class="node-label">{{ node.label }}</span>
                <el-tag
                  v-if="data.menuType && getMenuTypeText(data.menuType) != ''"
                  :type="getMenuTypeTag(data.menuType)"
                  size="small"
                  effect="dark"
                  class="node-tag"
                >
                  {{ getMenuTypeText(data.menuType) }}
                </el-tag>
              </div>
              <div class="node-actions" v-if="showActions">
                <el-button type="text" size="small" @click.stop="handleNodeAction('add', data)">
                  <el-icon><Plus /></el-icon>
                </el-button>
                <el-button type="text" size="small" @click.stop="handleNodeAction('edit', data)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button
                  type="text"
                  size="small"
                  class="danger"
                  @click.stop="handleNodeAction('delete', data)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </template>
        </el-tree>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElButton, ElCard, ElIcon, ElTag, ElTooltip, ElTree } from 'element-plus'
import { Delete, Edit, Operation, Plus, Refresh } from '@element-plus/icons-vue'
import { MenuTree } from '@/views/system/menu/api/menu.types.ts'
import { getMenuTree } from '@/views/system/menu/api/menu.ts'
import { getMenuTypeTag, getMenuTypeText } from '@/utils/menu-helpers.ts'


interface Props {
  title?: string
  data?: MenuTree[]
  showActions?: boolean
  selectedId?: string | number
}

interface Emits {
  (e: 'node-click', data: MenuTree): void
  (e: 'node-action', action: string, data: MenuTree): void
  (e: 'refresh'): void
  (e: 'update:selectedId', id: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '菜单树',
  data: () => [],
  showActions: true,
  selectedId: '',
})

const emit = defineEmits<Emits>()

const treeRef = ref<InstanceType<typeof ElTree>>()
const expandAll = ref(false)
const loading = ref(false)

const treeProps = {
  children: 'children',
  label: 'menuName',
  value: 'id',
}

const treeData = ref<MenuTree[]>([])

// 监听选中ID变化
watch(
  () => props.selectedId,
  (newId) => {
    if (newId && treeRef.value) {
      treeRef.value.setCurrentKey(newId)
    }
  },
  { immediate: true },
)

const handleNodeClick = (data: MenuTree) => {
  emit('update:selectedId', data.id)
  emit('update:menuType', data.menuType)
  emit('node-click', data)
}

const handleNodeAction = (action: string, data: MenuTree) => {
  emit('node-action', action, data)
}

const handleRefresh = () => {
  loadTreeData()
  emit('refresh')
}

const handleToggleExpand = (forceExpand?: boolean) => {
  if (forceExpand !== undefined) {
    expandAll.value = forceExpand
  } else {
    expandAll.value = !expandAll.value
  }
  if (treeRef.value) {
    const nodes = treeRef.value.store.nodesMap
    for (const nodeId in nodes) {
      nodes[nodeId].expanded = expandAll.value
    }
  }
}

// 加载树形数据
const loadTreeData = async () => {
  loading.value = true
  try {
    treeData.value = await getMenuTree()
    // 数据加载完成后默认展开所有节点
    setTimeout(() => {
      expandAll.value = true
      if (treeRef.value) {
        const nodes = treeRef.value.store.nodesMap
        for (const nodeId in nodes) {
          nodes[nodeId].expanded = true
        }
      }
    }, 100)
  } finally {
    loading.value = false
  }
}

// 组件挂载时自动加载数据
onMounted(() => {
  loadTreeData()
})

// 暴露方法
defineExpose({
  refresh: handleRefresh,
  toggleExpand: handleToggleExpand,
  loadTreeData,
})
</script>

<style scoped>
.menu-tree-container {
  height: 100%;
}

.tree-card {
  height: 100%;
  border-radius: 8px;
}

.tree-card :deep(.el-card__body) {
  padding: 0;
  height: calc(100% - 60px);
  overflow: hidden;
}

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tree-title {
  color: #303133;
}

.tree-actions {
  display: flex;
  gap: 4px;
}

.tree-content {
  height: 100%;
  overflow-y: auto;
  padding: 12px;
}

.tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 4px 0;
}

.node-content {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.node-icon {
  margin-right: 8px;
  color: #606266;
}

.node-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-tag {
  margin-left: 8px;
  font-size: 10px;
  height: 18px;
  line-height: 16px;
}

.node-actions {
  display: none;
  gap: 4px;
  margin-left: 8px;
}

.tree-node:hover .node-actions {
  display: flex;
}

.danger {
  color: #f56c6c;
}

.danger:hover {
  color: #f56c6c;
  background-color: #fef0f0;
}

:deep(.el-tree-node__content) {
  height: auto;
  padding: 4px 0;
}

:deep(.el-tree-node__content:hover) {
  background-color: #f5f7fa;
}
</style>
