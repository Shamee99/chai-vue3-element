<template>
  <!-- 用户新增表单对话框 -->
  <el-dialog
    v-model="dialogVisible"
    title="新增用户"
    width="600px"
    @close="handleDialogClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="80px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名（登录账号）" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="form.nickname" placeholder="请输入昵称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="真实名称" prop="realName">
            <el-input v-model="form.realName" placeholder="请输入真实名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" placeholder="请选择性别">
              <el-option label="男" value="1" />
              <el-option label="女" value="2" />
              <el-option label="未知" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="请确认密码" show-password />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="所属部门" prop="deptId">
            <el-tree-select
              v-model="form.deptId"
              :data="deptTreeData"
              :props="{ label: 'deptName', value: 'id', children: 'children' }"
              value-key="id"
              placeholder="请选择所属部门"
              check-strictly
              :render-after-expand="false"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="角色" prop="roleIds">
            <el-select
              v-model="form.roleIds"
              placeholder="请选择角色"
              multiple
              collapse-tags
              collapse-tags-tooltip
              style="width: 100%"
            >
              <el-option v-for="role in roleListData" :key="role.id" :label="role.roleName" :value="role.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { User } from '../api/user.types.ts'
import { addUser } from '../api/user.ts'
import { getDeptTree } from '../../dept/api/dept.ts'
import type { DeptTree } from '../../dept/api/dept.types.ts'
import type { Role } from '@/views/system/role/api/role.types'
import { getEnableRoleList } from '@/views/system/role/api/role'

// Props 和 Emits
interface Props {
  visible?: boolean
  defaultDeptId?: string
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  defaultDeptId: ''
})

const emit = defineEmits<Emits>()

// 响应式数据
const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const deptTreeData = ref<DeptTree[]>([])
const roleListData = ref<Role[]>([])

// 表单数据
const form = reactive<User & { deptId?: string | number; roleIds: string[] }>({
  id: undefined,
  username: '',
  nickname: '',
  realName: '',
  gender: '0',
  email: '',
  phone: '',
  role: '',
  status: 1,
  createTime: '',
  password: '',
  confirmPassword: '',
  deptId: undefined,
  roleIds: []
})

// 表单验证规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  roleIds: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  deptId: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
  ]
}

// 监听 props 变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
  if (newVal) {
    // 确保部门数据已加载
    if (deptTreeData.value.length === 0) {
      loadDeptTreeData()
    }

    // 重置表单
    resetForm()
    // 设置默认部门
    if (props.defaultDeptId) {
      form.deptId = props.defaultDeptId
    }
  }
})

watch(() => dialogVisible.value, (newVal) => {
  emit('update:visible', newVal)
})

// 加载部门树数据
const loadDeptTreeData = async () => {
  const response = await getDeptTree()
  deptTreeData.value = response || []
}

// 加载角色数据
const loadEnableRoleList = async () => {
  roleListData.value = await getEnableRoleList()
}

// 组件挂载时加载部门数据
onMounted(() => {
  loadDeptTreeData()
  loadEnableRoleList()
})

// 方法
const handleAdd = () => {
  resetForm()
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()

  // 新增用户
  await addUser(form)
  ElMessage.success('新增成功')

  dialogVisible.value = false
  emit('success')
}

const resetForm = () => {
  Object.assign(form, {
    id: '',
    username: '',
    nickname: '',
    realName: '',
    gender: '0',
    email: '',
    phone: '',
    role: '',
    status: 1,
    createTime: '',
    password: '',
    confirmPassword: '',
    deptId: undefined,
    roleIds: []
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
  resetForm()
}

// 暴露方法给父组件
defineExpose({
  handleAdd
})
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
