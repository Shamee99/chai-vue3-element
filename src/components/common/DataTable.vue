<template>
  <div class="data-table">
    <!-- 搜索区域 -->
    <div v-if="searchConfig" class="search-section">
      <el-form
        ref="searchFormRef"
        :model="searchForm"
        :inline="searchConfig.inline"
        :label-width="searchConfig.labelWidth"
        class="search-form"
      >
        <el-form-item
          v-for="item in searchConfig.items"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
        >
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 'input'"
            v-model="searchForm[item.prop]"
            :placeholder="item.placeholder"
            clearable
          />

          <!-- 选择器 -->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="searchForm[item.prop]"
            :placeholder="item.placeholder"
            clearable
          >
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>

          <!-- 日期选择器 -->
          <el-date-picker
            v-else-if="item.type === 'date'"
            v-model="searchForm[item.prop]"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left">
          <el-button
            v-if="showAdd"
            type="primary"
            @click="$emit('add')"
          >
            <el-icon><Plus /></el-icon>
            新增
          </el-button>
          <el-button
            v-if="showBatchDelete && selectedRows.length > 0"
            type="danger"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </slot>
      </div>

      <div class="toolbar-right">
        <slot name="toolbar-right">
          <el-button
            type="text"
            @click="handleRefresh"
            :loading="loading"
          >
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </slot>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      ref="tableRef"
      :data="data"
      :loading="loading"
      row-key="id"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      v-bind="tableProps"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        align="center"
      />

      <!-- 序号列 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        width="60"
        align="center"
        :index="getIndex"
      />

      <!-- 数据列 -->
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        v-bind="column"
      >
        <template #default="{ row, column: col, $index }">
          <slot
            :name="column.prop"
            :row="row"
            :column="col"
            :index="$index"
            :value="row[column.prop]"
          >
            {{ column.formatter ? column.formatter(row, col, row[column.prop]) : row[column.prop] }}
          </slot>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-if="showActions"
        label="操作"
        :width="actionWidth"
        fixed="right"
        align="center"
      >
        <template #default="{ row, $index }">
          <slot name="actions" :row="row" :index="$index">
            <el-button
              v-if="showEdit"
              type="text"
              size="small"
              @click="$emit('edit', row)"
            >
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button
              v-if="showDelete"
              type="text"
              size="small"
              class="danger"
              @click="handleDelete(row)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </slot>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination" class="pagination">
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="pageSizes"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Search, Refresh, Plus, Delete, Edit } from '@element-plus/icons-vue'
import type { TableColumn, SearchForm } from '@/types/global'

interface Props {
  // 表格数据
  data: any[]
  columns: TableColumn[]
  loading?: boolean

  // 搜索配置
  searchConfig?: SearchForm

  // 分页配置
  showPagination?: boolean
  total?: number
  pageSize?: number
  pageNo?: number
  pageSizes?: number[]

  // 功能开关
  showSelection?: boolean
  showIndex?: boolean
  showActions?: boolean
  showAdd?: boolean
  showEdit?: boolean
  showDelete?: boolean
  showBatchDelete?: boolean

  // 样式配置
  actionWidth?: number | string
  tableProps?: Record<string, any>
}

interface Emits {
  (e: 'search', params: any): void
  (e: 'reset'): void
  (e: 'refresh'): void
  (e: 'add'): void
  (e: 'edit', row: any): void
  (e: 'delete', row: any): void
  (e: 'batch-delete', rows: any[]): void
  (e: 'selection-change', rows: any[]): void
  (e: 'sort-change', sort: any): void
  (e: 'size-change', size: number): void
  (e: 'current-change', page: number): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  showPagination: true,
  pageSize: 10,
  pageNo: 1,
  pageSizes: () => [10, 20, 50, 100],
  showSelection: false,
  showIndex: true,
  showActions: true,
  showAdd: true,
  showEdit: true,
  showDelete: true,
  showBatchDelete: true,
  actionWidth: 150,
  tableProps: () => ({})
})

const emit = defineEmits<Emits>()

// 搜索表单
const searchFormRef = ref()
const searchForm = reactive<Record<string, any>>({})

// 选中行
const selectedRows = ref<any[]>([])

// 初始化搜索表单
if (props.searchConfig) {
  props.searchConfig.items.forEach(item => {
    searchForm[item.prop] = ''
  })
}

// 计算序号
const getIndex = (index: number) => {
  return (props.pageNo - 1) * props.pageSize + index + 1
}

// 搜索
const handleSearch = () => {
  emit('search', { ...searchForm })
}

// 重置
const handleReset = () => {
  searchFormRef.value?.resetFields()
  Object.keys(searchForm).forEach(key => {
    searchForm[key] = ''
  })
  emit('reset')
}

// 刷新
const handleRefresh = () => {
  emit('refresh')
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条数据吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    emit('delete', row)
  } catch {
    // 用户取消
  }
}

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条数据吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    emit('batch-delete', selectedRows.value)
  } catch {
    // 用户取消
  }
}

// 选择变化
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
  emit('selection-change', rows)
}

// 排序变化
const handleSortChange = (sort: any) => {
  emit('sort-change', sort)
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  emit('size-change', size)
}

// 当前页变化
const handleCurrentChange = (page: number) => {
  emit('current-change', page)
}
</script>

<style scoped>
.data-table {
  background: white;
  border-radius: 8px;
  padding: 16px;
}

.search-section {
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.search-form {
  margin-bottom: 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 8px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}

:deep(.el-button.danger) {
  color: #f56c6c;
}

:deep(.el-button.danger:hover) {
  color: #f78989;
}
</style>
