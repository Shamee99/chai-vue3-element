<template>
  <div class="generator-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>代码生成器</span>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="表名">
          <el-input
            v-model="searchForm.tableName"
            placeholder="请输入表名"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="表注释">
          <el-input
            v-model="searchForm.tableComment"
            placeholder="请输入表注释"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 工具栏 -->
      <div class="toolbar">
        <el-button
          type="primary"
          :icon="Plus"
          @click="handleGenerate"
          :disabled="!selectedTables.length"
        >
          生成代码
        </el-button>
        <el-button
          type="primary"
          :icon="Download"
          @click="handleBatchGenerate"
          :disabled="!selectedTables.length"
        >
          批量生成
        </el-button>
      </div>

      <!-- 表格 -->
      <el-table
        v-loading="loading"
        :data="filteredTableList"
        @selection-change="handleSelectionChange"
        border
        stripe
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="tableName" label="表名" min-width="200" show-overflow-tooltip />
        <el-table-column prop="tableComment" label="表注释" min-width="200" show-overflow-tooltip />
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleGenerateSingle(row)">
              生成
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 生成配置对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="generatorForm" :rules="formRules" label-width="120px">
        <el-form-item label="表名" prop="tableName">
          <el-input v-model="generatorForm.tableName" disabled />
        </el-form-item>
        <el-form-item label="模块名" prop="moduleName">
          <el-input v-model="generatorForm.moduleName" placeholder="如：chai-admin-student" />
          <div class="form-tip">格式：chai-admin-{模块名}</div>
        </el-form-item>
        <el-form-item label="包名" prop="packageName">
          <el-input v-model="generatorForm.packageName" placeholder="如：org.shamee.student" />
          <div class="form-tip">格式：org.shamee.{模块名}</div>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="generatorForm.author" placeholder="请输入作者名称" />
        </el-form-item>
        <el-form-item label="表前缀" prop="tablePrefix">
          <el-input v-model="generatorForm.tablePrefix" placeholder="如：sys_（可选）" />
          <div class="form-tip">生成的类名会自动去除此前缀</div>
        </el-form-item>
        <el-form-item label="生成前端代码">
          <el-switch v-model="generatorForm.generateFrontend" />
        </el-form-item>
        <el-form-item label="覆盖已有文件">
          <el-switch v-model="generatorForm.overwrite" />
          <div class="form-tip warning">开启后会覆盖已存在的文件，请谨慎操作！</div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmGenerate" :loading="generating">
          确定生成
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Plus, Download, Edit } from '@element-plus/icons-vue'
import { getTableListApi, generateCodeApi, batchGenerateCodeApi } from './api/generator'
import type { TableInfo, GeneratorRequest } from './api/generator.types'

// 搜索表单
const searchForm = reactive({
  tableName: '',
  tableComment: '',
})

// 表格数据
const loading = ref(false)
const tableList = ref<TableInfo[]>([])
const selectedTables = ref<TableInfo[]>([])

// 过滤后的表格数据
const filteredTableList = computed(() => {
  let list = tableList.value
  if (searchForm.tableName) {
    list = list.filter((item) =>
      item.tableName.toLowerCase().includes(searchForm.tableName.toLowerCase()),
    )
  }
  if (searchForm.tableComment) {
    list = list.filter((item) =>
      item.tableComment?.toLowerCase().includes(searchForm.tableComment.toLowerCase()),
    )
  }
  return list
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('生成代码')
const generating = ref(false)
const formRef = ref<FormInstance>()

// 生成表单
const generatorForm = reactive<GeneratorRequest>({
  tableName: '',
  moduleName: '',
  packageName: '',
  author: 'shamee',
  generateFrontend: true,
  tablePrefix: '',
  overwrite: false,
})

// 表单验证规则
const formRules: FormRules = {
  moduleName: [
    { required: true, message: '请输入模块名', trigger: 'blur' },
    { pattern: /^chai-admin-[a-z]+$/, message: '格式：chai-admin-{模块名}', trigger: 'blur' },
  ],
  packageName: [
    { required: true, message: '请输入包名', trigger: 'blur' },
    { pattern: /^org\.shamee\.[a-z]+$/, message: '格式：org.shamee.{模块名}', trigger: 'blur' },
  ],
  author: [{ required: true, message: '请输入作者名称', trigger: 'blur' }],
}

// 加载表列表
const loadTableList = async () => {
  loading.value = true
  try {
    tableList.value = await getTableListApi()
  } catch (error) {
    ElMessage.error('加载表列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  // 过滤逻辑在 computed 中处理
}

// 重置
const handleReset = () => {
  searchForm.tableName = ''
  searchForm.tableComment = ''
}

// 表格选择变化
const handleSelectionChange = (selection: TableInfo[]) => {
  selectedTables.value = selection
}

// 单个生成
const handleGenerateSingle = (row: TableInfo) => {
  selectedTables.value = [row]
  handleGenerate()
}

// 打开生成对话框
const handleGenerate = () => {
  if (selectedTables.value.length === 0) {
    ElMessage.warning('请选择要生成的表')
    return
  }

  if (selectedTables.value.length > 1) {
    ElMessage.warning('请选择单个表进行配置，或使用批量生成')
    return
  }

  const table = selectedTables.value[0]
  generatorForm.tableName = table.tableName

  // 智能推断模块名和包名
  const tableName = table.tableName
  let moduleSuffix = tableName

  // 尝试去除常见前缀
  const prefixes = ['sys_', 't_', 'tb_', 'tbl_']
  for (const prefix of prefixes) {
    if (tableName.startsWith(prefix)) {
      moduleSuffix = tableName.substring(prefix.length)
      generatorForm.tablePrefix = prefix
      break
    }
  }

  // 提取第一个单词作为模块名
  const firstWord = moduleSuffix.split('_')[0]
  generatorForm.moduleName = `chai-admin-${firstWord}`
  generatorForm.packageName = `org.shamee.${firstWord}`

  dialogTitle.value = `生成代码 - ${table.tableName}`
  dialogVisible.value = true
}

// 批量生成
const handleBatchGenerate = async () => {
  if (selectedTables.value.length === 0) {
    ElMessage.warning('请选择要生成的表')
    return
  }

  try {
    const { value: config } = await ElMessageBox.prompt(
      '请输入批量生成配置（JSON格式）',
      '批量生成',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputValue: JSON.stringify(
          {
            moduleName: 'chai-admin-system',
            packageName: 'org.shamee.system',
            author: 'shamee',
            generateFrontend: true,
            tablePrefix: 'sys_',
            overwrite: false,
          },
          null,
          2,
        ),
      },
    )

    const batchConfig = JSON.parse(config)
    const tableNames = selectedTables.value.map((t) => t.tableName)

    generating.value = true
    await batchGenerateCodeApi({
      tableNames,
      ...batchConfig,
    })

    ElMessage.success('批量生成成功')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '批量生成失败')
    }
  } finally {
    generating.value = false
  }
}

// 确认生成
const handleConfirmGenerate = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      generating.value = true
      await generateCodeApi(generatorForm)

      ElMessage.success('代码生成成功')
      dialogVisible.value = false
    } catch (error: any) {
      ElMessage.error(error.message || '代码生成失败')
    } finally {
      generating.value = false
    }
  })
}

onMounted(() => {
  loadTableList()
})
</script>

<style scoped lang="scss">
.generator-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .search-form {
    margin-bottom: 20px;
  }

  .toolbar {
    margin-bottom: 20px;
  }

  .form-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;

    &.warning {
      color: #e6a23c;
    }
  }
}
</style>
