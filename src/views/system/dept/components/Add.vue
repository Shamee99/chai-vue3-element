<template>
  <!-- 部门表单对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" @close="handleDialogClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="上级部门" prop="parentId">
            <el-tree-select
              v-model="form.parentId"
              :data="deptTreeData"
              :props="{ value: 'id', label: 'deptName', children: 'children' }"
              placeholder="请选择上级部门"
              check-strictly
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="form.deptName" placeholder="请输入部门名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门编码" prop="deptCode">
            <el-input v-model="form.deptCode" placeholder="请输入部门编码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="form.orderNum" :min="0" placeholder="请输入显示排序" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="form.leader" placeholder="请输入负责人" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="部门状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">停用</el-radio>
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
import { reactive, ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { Dept, DeptTree } from '../api/dept.types.ts'
import { addDept, getDeptTree, updateDept } from '../api/dept.ts'

// Props 和 Emits
interface Props {
  visible?: boolean
  deptData?: Dept | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  deptData: null,
})

const emit = defineEmits<Emits>()

// 响应式数据
const formRef = ref<FormInstance>()
const dialogVisible = ref(false)
const dialogTitle = ref('新增部门')
const deptTreeData = ref<DeptTree[]>([])

// 表单数据
const form = reactive<Dept>({
  id: undefined,
  deptName: '',
  deptCode: '',
  parentId: '',
  orderNum: 0,
  leader: '',
  phone: '',
  email: '',
  status: 1
})

// 表单验证规则
const rules: FormRules = {
  deptName: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 30, message: '部门名称长度在 2 到 30 个字符', trigger: 'blur' },
  ],
  orderNum: [{ required: true, message: '请输入显示排序', trigger: 'blur' }],
  leader: [{ max: 20, message: '负责人长度不能超过 20 个字符', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
}

// 监听 props 变化
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal
    if (newVal) {
      loadDeptTree()
      // 新增模式
      dialogTitle.value = '新增部门'
      resetForm()
      if (props.deptData) {
        Object.assign(form, {
          ...props.deptData,
        })
      }
    }
  },
)

watch(
  () => dialogVisible.value,
  (newVal) => {
    emit('update:visible', newVal)
  },
)

// 方法
const loadDeptTree = async () => {
  try {
    deptTreeData.value = await getDeptTree()
  } catch (error) {
    console.error('获取部门树失败:', error)
    ElMessage.error('获取部门树失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate()
  // 新增部门
  await addDept(form)
  ElMessage.success('新增成功')

  dialogVisible.value = false
  emit('success')
}

const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    deptName: '',
    parentId: undefined,
    orderNum: 0,
    leader: '',
    phone: '',
    email: '',
    status: 1,
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
  resetForm()
}

// 暴露方法给父组件
defineExpose({
  handleAdd: () => {
    dialogTitle.value = '新增部门'
    resetForm()
    dialogVisible.value = true
  },
})
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
