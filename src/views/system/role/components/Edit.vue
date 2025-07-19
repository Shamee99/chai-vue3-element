<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑角色"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="role-form"
    >
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
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { Role, RoleFormData } from '../api/role.types'
import { detail, updateRole } from '../api/role'

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
  roleData: null
})

const emit = defineEmits<Emits>()

// 响应式数据
const formRef = ref<FormInstance>()
const loading = ref(false)

// 计算属性：对话框显示状态
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 表单数据
const form = reactive<RoleFormData & { id?: string }>({
  id: '',
  roleName: '',
  roleCode: '',
  sortOrder: 0,
  status: 1,
  roleDesc: ''
})

// 表单验证规则
const rules: FormRules = {
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '角色名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  roleCode: [
    { required: true, message: '请输入角色标识', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/,
      message: '角色标识只能包含字母、数字和下划线，且以字母开头',
      trigger: 'blur'
    }
  ],
  sortOrder: [
    { required: true, message: '请输入显示顺序', trigger: 'blur' }
  ]
}

// 监听对话框显示状态和角色数据
watch(() => props.visible, (newVal) => {
  if (newVal && props.roleData) {
    loadRoleData()
  }
})

watch(() => props.roleData, (newData) => {
  if (newData && props.visible) {
    loadRoleData()
  }
})

// 加载角色数据
const loadRoleData = async () => {
  if (props.roleData) {
    const roleId = props.roleData.id
    Object.assign(form, await detail(roleId))
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
    roleDesc: ''
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
