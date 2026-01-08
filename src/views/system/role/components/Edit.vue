<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑角色"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="role-form">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="form.roleName" placeholder="请输入角色名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色标识" prop="roleCode">
            <el-input v-model="form.roleCode" placeholder="请输入角色标识" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="数据权限" prop="dataScope">
            <el-select
              v-model="form.dataScope"
              placeholder="请选择数据权限"
              clearable
              @change="handleDataScopeChange"
            >
              <el-option label="全部数据权限" :value="1" />
              <el-option label="本部门数据权限" :value="2" />
              <el-option label="本部门及以下数据权限" :value="3" />
              <el-option label="仅本人数据权限" :value="4" />
              <el-option label="自定义数据权限" :value="5" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示顺序" prop="sortOrder">
            <el-input-number
              v-model="form.sortOrder"
              :min="0"
              :max="999"
              style="width: 100%"
              placeholder="请输入显示顺序"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 数据权限部门选择（仅当选择自定义数据权限时显示） -->
      <el-row v-if="form.dataScope === 5" :gutter="20">
        <el-col :span="24">
          <el-form-item label="权限部门" prop="deptIds">
            <el-tree
              ref="deptTreeRef"
              :data="deptTreeData"
              :props="{
                label: 'deptName',
                children: 'children',
                value: 'id',
              }"
              node-key="id"
              show-checkbox
              default-expand-all
              check-strictly
              :default-checked-keys="form.deptIds || []"
              class="dept-tree"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注" prop="roleDesc">
            <el-input
              v-model="form.roleDesc"
              type="textarea"
              :rows="4"
              placeholder="请输入备注信息"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { Role, RoleFormData } from '../api/role.types'
import { detail, updateRole } from '../api/role'
import { getDeptTree } from '../../dept/api/dept'
import type { DeptTree } from '../../dept/api/dept.types'

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
const formRef = ref<FormInstance>()
const deptTreeRef = ref()
const loading = ref(false)
const deptTreeData = ref<DeptTree[]>([])

// 计算属性：对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value),
})

// 表单数据
const form = reactive<RoleFormData & { id?: string }>({
  id: '',
  roleName: '',
  roleCode: '',
  sortOrder: 0,
  status: 1,
  roleDesc: '',
  dataScope: undefined,
  deptIds: [],
})

// 表单验证规则
const rules: FormRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '角色名称长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  roleCode: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: '角色标识只能包含字母、数字和下划线，且以字母开头',
      trigger: 'blur',
    },
  ],
  sortOrder: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
}

// 加载部门树数据
const loadDeptTree = async () => {
  try {
    deptTreeData.value = await getDeptTree()
  } catch (error) {
    console.error('加载部门树失败:', error)
    ElMessage.error('加载部门树失败')
  }
}

// 数据权限变化处理
const handleDataScopeChange = (value: number) => {
  if (value !== 5) {
    // 非自定义数据权限，清空部门选择
    form.deptIds = []
  }
}

// 监听对话框显示状态
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      if (props.roleData) {
        loadRoleData()
      }
      // 加载部门树
      loadDeptTree()
    }
  },
)

// 加载角色数据
const loadRoleData = async () => {
  if (props.roleData) {
    const roleId = props.roleData.id
    const roleData = await detail(roleId)
    Object.assign(form, roleData)

    // 如果有dataScope但没有deptIds且是自定义数据权限，需要加载deptIds
    if (roleData.dataScope === 5) {
      try {
        const { getRoleDeptIds } = await import('../api/role')
        form.deptIds = await getRoleDeptIds(roleId)
      } catch (error) {
        console.error('加载角色部门失败:', error)
        form.deptIds = []
      }
    } else {
      form.deptIds = []
    }

    // 设置树的选中节点
    nextTick(() => {
      if (deptTreeRef.value && form.deptIds) {
        deptTreeRef.value.setCheckedKeys(form.deptIds)
      }
    })
  }
  formRef.value?.clearValidate()
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: '',
    roleName: '',
    roleCode: '',
    sortOrder: 0,
    status: 1,
    roleDesc: '',
    dataScope: undefined,
    deptIds: [],
  })
  formRef.value?.clearValidate()
}

// 处理关闭
const handleClose = () => {
  emit('update:visible', false)
  resetForm()
}

// 处理提交
const handleSubmit = async () => {
  if (!formRef.value || !form.id) return

  try {
    await formRef.value.validate()

    // 获取部门树选中的节点
    if (form.dataScope === 5 && deptTreeRef.value) {
      const checkedKeys = deptTreeRef.value.getCheckedKeys()
      form.deptIds = checkedKeys as string[]
    }

    loading.value = true
    await updateRole(form)

    ElMessage.success('编辑角色成功')
    emit('success')
    handleClose()
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.role-form {
  padding: 20px 0;
}

.dept-tree {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

<script lang="ts">
export default {
  name: 'RoleEdit',
}
</script>
