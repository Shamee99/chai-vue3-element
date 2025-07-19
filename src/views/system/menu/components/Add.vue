<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增菜单"
    width="700px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="menu-form">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="上级菜单" prop="parentId">
            <el-tree-select
              v-model="form.parentId"
              :data="menuTreeData"
              :props="{ value: 'id', label: 'menuName', children: 'children' }"
              placeholder="选择上级菜单"
              check-strictly
              :render-after-expand="false"
              value-key="id"
              :show-checkbox="false"
              filterable
              :default-expanded-keys="[0, 1, 2]"
              accordion
              clearable
              style="width: 100%"
            >
              <template #default="{ node, data }">
                <span>{{ data.menuName }}</span>
              </template>
            </el-tree-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="form.menuType">
              <el-radio :label="MenuType.DIRECTORY"
                >目录</el-radio
              >
              <el-radio
                :label="MenuType.MENU"
                >菜单</el-radio
              >
              <el-radio
                :label="MenuType.BUTTON"
                >按钮</el-radio
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单图标" prop="icon">
            <el-input
              v-model="form.icon"
              placeholder="请选择菜单图标"
              readonly
              @click="showIconSelector = true"
            >
              <template #prefix>
                <el-icon v-if="form.icon">
                  <component :is="form.icon" />
                </el-icon>
              </template>
              <template #suffix>
                <el-icon class="icon-selector-trigger">
                  <ArrowDown />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="显示排序" prop="sortOrder">
            <el-input-number v-model="form.sortOrder" :min="0" :max="999" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType !== 3">
          <el-form-item :label="form.isExternal === 0 ? '路由地址' : '外链地址'" prop="path">
            <el-input
              v-model="form.path"
              :placeholder="form.isExternal === 0 ? '请输入路由地址' : '请输入外链地址'"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="权限标识" prop="permsDirective" v-if="form.menuType !== 1">
            <el-input v-model="form.permissions" placeholder="请输入权限标识" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType === 2 && form.isExternal === 0">
          <el-form-item label="组件路径" prop="component">
            <el-input v-model="form.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="启用状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType !== 3">
          <el-form-item label="显示状态">
            <el-radio-group v-model="form.isVisible">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="form.menuType === 2">
        <el-col :span="12">
          <el-form-item label="是否外链">
            <el-radio-group v-model="form.isExternal">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否缓存">
            <el-radio-group v-model="form.isKeepalive">
              <el-radio :label="1">缓存</el-radio>
              <el-radio :label="0">不缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 图标选择器 -->
    <el-dialog v-model="showIconSelector" title="选择图标" width="600px" append-to-body>
      <div class="icon-selector">
        <div class="icon-search">
          <el-input v-model="iconSearchText" placeholder="搜索图标" clearable>
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="icon-grid">
          <div
            v-for="icon in filteredIcons"
            :key="icon"
            class="icon-item"
            :class="{ active: selectedIcon === icon }"
            @click="selectIcon(icon)"
          >
            <el-icon>
              <component :is="icon" />
            </el-icon>
            <span class="icon-name">{{ icon }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showIconSelector = false">取消</el-button>
        <el-button type="primary" @click="confirmIcon">确定</el-button>
      </template>
    </el-dialog>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ArrowDown, Search } from '@element-plus/icons-vue'
import { elementIcons } from '@/constants/ElementIcons.ts'
import { MenuTree, MenuType, SysMenu } from '@/views/system/menu/api/menu.types.ts'
import { addMenu, filterMenuTreeAsync, getMenuTree } from '@/views/system/menu/api/menu.ts'

interface Props {
  visible: boolean
  menuData?: SysMenu | null
  defaultParentId?: string
  defaultParentMenuType?: MenuType
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  menuData: null,
  defaultParentId: '',
  defaultParentMenuType: MenuType.DIRECTORY,
})

const emit = defineEmits<Emits>()

const formRef = ref<FormInstance>()
const loading = ref(false)
const showIconSelector = ref(false)
const iconSearchText = ref('')
const selectedIcon = ref('')
const menuTreeData = ref<MenuTree[]>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

const form = reactive<SysMenu>({
  parentId: '',
  menuName: '',
  menuType:
    props.defaultParentId === ''
      ? MenuType.DIRECTORY
      : props.defaultParentMenuType === MenuType.DIRECTORY
        ? MenuType.MENU
        : MenuType.BUTTON,
  sortOrder: 0,
  path: '',
  component: '',
  permissions: '',
  icon: '',
  status: 1,
  isExternal: 0,
  isKeepalive: 1,
  isVisible: 1,
})

const filteredIcons = computed(() => {
  if (!iconSearchText.value) {
    return elementIcons
  }
  return elementIcons.filter((icon) =>
    icon.toLowerCase().includes(iconSearchText.value.toLowerCase()),
  )
})

const rules: FormRules = {
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '请输入显示排序', trigger: 'blur' }],
  path: [
    {
      required: true,
      message: '请输入路由地址',
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (form.menuType !== 3 && !value) {
          callback(new Error('请输入路由地址'))
        } else {
          callback()
        }
      },
    },
  ],
  component: [
    {
      validator: (rule, value, callback) => {
        if (form.menuType === 2 && !value) {
          callback(new Error('请输入组件路径'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 监听对话框显示状态
watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      resetForm()
      loadMenuTree()
      debugger
      if (props.defaultParentId !== undefined) {
        form.parentId = props.defaultParentId
      }
    }
  },
)

const selectIcon = (icon: string) => {
  selectedIcon.value = icon
}

const confirmIcon = () => {
  form.icon = selectedIcon.value
  showIconSelector.value = false
}

const resetForm = () => {
  Object.assign(form, {
    parentId: '',
    menuName: '',
    menuType: MenuType.DIRECTORY,
    sortOrder: 0,
    path: '',
    component: '',
    permission: '',
    icon: '',
    status: 1,
    isExternal: 0,
    isKeepalive: 1,
    isVisible: 1,
  })
  formRef.value?.resetFields()
}

const handleClose = () => {
  emit('update:visible', false)
  resetForm()
}

const handleSubmit = async () => {
  try {
    if (!formRef.value) return
    await formRef.value.validate()
    loading.value = true

    // 新增
    await addMenu(form)

    ElMessage.success('新增菜单成功')
    emit('success')
    handleClose()
  } finally {
    loading.value = false
  }
}

const loadMenuTree = async () => {
  const allMenus = await getMenuTree()
  menuTreeData.value = await filterMenuTreeAsync(
    allMenus,
    async (menu) => menu.menuType === MenuType.BUTTON,
  )
}
</script>

<style scoped>
.menu-form {
  padding: 0 20px;
}

.icon-selector {
  max-height: 400px;
}

.icon-search {
  margin-bottom: 16px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.icon-item:hover {
  background-color: #f5f7fa;
  border-color: #c0c4cc;
}

.icon-item.active {
  background-color: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.icon-item .el-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.icon-name {
  font-size: 10px;
  text-align: center;
  word-break: break-all;
  line-height: 1.2;
}

.icon-selector-trigger {
  cursor: pointer;
  color: #c0c4cc;
}

.icon-selector-trigger:hover {
  color: #409eff;
}

.dialog-footer {
  text-align: right;
}
</style>
