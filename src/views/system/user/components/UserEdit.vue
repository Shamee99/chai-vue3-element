<template>
  <!-- 用户编辑表单对话框 -->
  <el-dialog v-model="dialogVisible" title="编辑用户" width="600px" @close="handleDialogClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名（登录账号）" disabled />
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
              <el-option
                v-for="role in roleListData"
                :key="role.id"
                :label="role.roleName"
                :value="role.id"
              />
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
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item>
            <el-alert
              title="编辑模式下不支持修改密码，如需修改密码请使用密码重置功能"
              type="info"
              :closable="false"
              show-icon
            />
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
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { User } from '../api/user.types.ts'
import { detail, updateUser } from '../api/user.ts'
import { getDeptTree } from '../../dept/api/dept.ts'
import type { DeptTree } from '../../dept/api/dept.types.ts'
import type { Role } from '@/views/system/role/api/role.types'
import { getEnableRoleList } from '@/views/system/role/api/role'

// Props 和 Emits
interface Props {
  visible?: boolean
  userData?: User | null
  userId: string
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  userData: null,
  userId: null,
})

const emit = defineEmits<Emits>()

// 响应式数据
const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const deptTreeData = ref<DeptTree[]>([])
const roleListData = ref<Role[]>([])

// 表单数据
const form = reactive<User & { deptId?: string | number; roleIds: string[] }>({
  id: '',
  nickname: '',
  realName: '',
  gender: 0,
  email: '',
  phone: '',
  status: 1,
  deptId: '',
  roleIds: [],
})

// 表单验证规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }],
  roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }],
  deptId: [{ required: true, message: '请选择所属部门', trigger: 'change' }],
}

// 角色映射函数
const parseRoleToIds = (roleString: string): string[] => {
  if (!roleString) return []
  // 根据角色名称找到对应的ID
  const roleNames = roleString.split(',')
  const roleIds: string[] = []

  roleNames.forEach((roleName) => {
    const role = roleListData.value.find((r) => r.roleName === roleName.trim())
    if (role) {
      roleIds.push(role.id)
    }
  })

  return roleIds
}

// 监听 props 变化
watch(
  () => props.visible,
  async (newVal) => {
    dialogVisible.value = newVal
    if (newVal) {
      // 确保部门和角色数据已加载
      if (deptTreeData.value.length === 0) {
        await loadDeptTreeData()
      }
      if (roleListData.value.length === 0) {
        await loadEnableRoleList()
      }
      Object.assign(form, await detail(props.userId))
    }
  },
)

watch(
  () => dialogVisible.value,
  (newVal) => {
    emit('update:visible', newVal)
  },
)

// 加载部门树数据
const loadDeptTreeData = async () => {
  const response = await getDeptTree()
  deptTreeData.value = response || []
}

// 加载角色数据
const loadEnableRoleList = async () => {
  roleListData.value = await getEnableRoleList()
}

// 组件挂载时加载部门和角色数据
onMounted(() => {
  loadDeptTreeData()
  loadEnableRoleList()
})

// 方法
const handleEdit = (userData: User) => {
  Object.assign(form, {
    ...userData,
    roleIds: userData.roleIds,
    deptId: userData.deptId ? userData.deptId.toString() : undefined,
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate()

  // 准备提交数据
  const submitData: User = {
    ...form,
    deptId: form.deptId,
  }

  // 编辑用户
  await updateUser(submitData)
  ElMessage.success('编辑成功')

  dialogVisible.value = false
  emit('success')
}

const resetForm = () => {
  Object.assign(form, {
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
    deptId: undefined,
    roleIds: [],
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
  resetForm()
}

// 暴露方法给父组件
defineExpose({
  handleEdit,
})
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
