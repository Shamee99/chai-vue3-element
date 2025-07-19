<template>
  <el-dialog
    v-model="dialogVisible"
    title="分配权限"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="permission-content">
      <div class="permission-header">
        <span class="role-info">角色：{{ roleData?.roleName }}</span>
        <div class="tree-actions">
          <el-button size="small" @click="expandAll">展开全部</el-button>
          <el-button size="small" @click="collapseAll">收起全部</el-button>
          <el-button size="small" @click="checkAll">全选</el-button>
          <el-button size="small" @click="uncheckAll">取消全选</el-button>
        </div>
      </div>

      <div class="permission-tree">
        <el-tree
          ref="treeRef"
          :data="permissionTree"
          :props="treeProps"
          show-checkbox
          node-key="id"
          :default-checked-keys="checkedPermissions"
          :default-expanded-keys="expandedKeys"
          :default-expand-all="false"
          :check-strictly="false"
        >
          <template #default="{ node, data }">
            <span class="tree-node">
              <el-icon v-if="data.icon" class="node-icon">
                <component :is="data.icon" />
              </el-icon>
              <span class="node-label">{{ data.menuName }}</span>
              <el-tag v-if="data.menuType" size="small" :type="getMenuTypeTag(data.menuType)" class="node-type" effect="dark">
                {{ getMenuTypeText(data.menuType) }}
              </el-tag>
            </span>
          </template>
        </el-tree>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { ElTree } from 'element-plus'
import { ElMessage } from 'element-plus'
import type { Role } from '../api/role.types'
import { assignRolePermissions, getRolePermissions } from '../api/role'
import { getMenuTree } from '@/views/system/menu/api/menu.ts'
import { MenuTree } from '@/views/system/menu/api/menu.types.ts'
import { getMenuTypeTag, getMenuTypeText } from '@/utils/menu-helpers.ts'

interface Props {
  visible: boolean
  roleData?: Role | null
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  roleData: null,
})

const emit = defineEmits<Emits>()

// 响应式数据
const treeRef = ref<InstanceType<typeof ElTree>>()
const loading = ref(false)
const permissionTree = ref<MenuTree[]>([])

// 计算属性：对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

// 树形组件属性
const treeProps = {
  children: 'children',
  label: 'label',
}

// 已选中的权限
const checkedPermissions = ref<string[]>([])
// 默认展开的节点
const expandedKeys = ref<string[]>([])


// 监听对话框显示状态和角色数据
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      loadPermissionTree()
      if (props.roleData) {
        loadRolePermissions()
      }
    }
  },
)

watch(
  () => props.roleData,
  (newData) => {
    if (newData && props.visible) {
      loadRolePermissions()
    }
  },
)

// 加载权限树
const loadPermissionTree = async () => {
  permissionTree.value = await getMenuTree()
}

// 加载角色权限
const loadRolePermissions = async () => {
  if (!props.roleData?.id) return

  const permissions = await getRolePermissions(props.roleData.id)
  checkedPermissions.value = permissions

  // 获取选中节点的所有父节点，用于默认展开
  expandedKeys.value = getParentKeys(permissions, permissionTree.value)

  // 等待DOM更新后设置选中状态
  await nextTick(() => {
    if (treeRef.value) {
      treeRef.value.setCheckedKeys(checkedPermissions.value)
    }
  })
}

// // 获取节点类型文本
// const getNodeTypeText = (type: string) => {
//   return MENU_TYPE_TEXT_MAP[type as keyof typeof MENU_TYPE_TEXT_MAP] || ''
// }

// 展开全部
const expandAll = () => {
  const allKeys = getAllNodeKeys(permissionTree.value)
  allKeys.forEach((key) => {
    treeRef.value?.getNode(key)?.expand()
  })
}

// 收起全部
const collapseAll = () => {
  const allKeys = getAllNodeKeys(permissionTree.value)
  allKeys.forEach((key) => {
    treeRef.value?.getNode(key)?.collapse()
  })
}

// 全选
const checkAll = () => {
  const allKeys = getAllNodeKeys(permissionTree.value)
  treeRef.value?.setCheckedKeys(allKeys)
}

// 取消全选
const uncheckAll = () => {
  treeRef.value?.setCheckedKeys([])
}

// 获取所有节点的key
const getAllNodeKeys = (nodes: MenuTree[]): string[] => {
  const keys: string[] = []
  const traverse = (items: MenuTree[]) => {
    items.forEach((item) => {
      keys.push(item.id)
      if (item.children) {
        traverse(item.children)
      }
    })
  }
  traverse(nodes)
  return keys
}

// 获取选中节点的所有父节点key，用于默认展开
const getParentKeys = (checkedKeys: string[], nodes: MenuTree[]): string[] => {
  const parentKeys: string[] = []
  const nodeMap = new Map<string, MenuTree>()
  const parentMap = new Map<string, string>()

  // 构建节点映射和父子关系映射
  const buildMaps = (items: MenuTree[], parent?: MenuTree) => {
    items.forEach((item) => {
      nodeMap.set(item.id, item)
      if (parent) {
        parentMap.set(item.id, parent.id)
      }
      if (item.children) {
        buildMaps(item.children, item)
      }
    })
  }

  buildMaps(nodes)

  // 对于每个选中的节点，找到其所有父节点
  checkedKeys.forEach((key) => {
    let currentKey = key
    while (parentMap.has(currentKey)) {
      const parentKey = parentMap.get(currentKey)!
      if (!parentKeys.includes(parentKey)) {
        parentKeys.push(parentKey)
      }
      currentKey = parentKey
    }
  })

  return parentKeys
}

// 处理关闭
const handleClose = () => {
  emit('update:visible', false)
}

// 处理提交
const handleSubmit = async () => {
  if (!treeRef.value || !props.roleData?.id) return

  try {
    loading.value = true

    // 获取选中的节点（包括半选中状态的父节点）
    const checkedKeys = treeRef.value.getCheckedKeys() as string[]
    // 获取半选中的节点 keys
    const halfCheckedKeys = treeRef.value.getHalfCheckedKeys() as string[]
    const allCheckedKeys = [...new Set([...checkedKeys, ...halfCheckedKeys])]
    // 调用API分配权限
    await assignRolePermissions({
      roleId: props.roleData.id,
      permissionIds: allCheckedKeys,
    })

    ElMessage.success('权限分配成功')
    emit('success')
    handleClose()
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载权限树
onMounted(() => {
  loadPermissionTree()
})
</script>

<style scoped>
.permission-content {
  max-height: 500px;
}

.permission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.role-info {
  font-weight: 500;
  color: #303133;
}

.tree-actions {
  display: flex;
  gap: 8px;
}

.permission-tree {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.node-icon {
  font-size: 16px;
  color: #606266;
}

.node-label {
  flex: 1;
}

.node-type {
  margin-left: auto;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

:deep(.el-tree-node__content) {
  height: 32px;
}

:deep(.el-tree-node__label) {
  flex: 1;
}
</style>
