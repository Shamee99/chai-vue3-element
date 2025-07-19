<template>
  <div class="chai-table-wrapper">
    <!-- 搜索表单 -->
    <div v-if="searchForm && showSearch" class="search-form">
      <el-form :model="searchForm" :inline="true" label-width="auto" class="search-form-content">
        <slot name="search-items" :searchForm="searchForm" />
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :loading="loading">
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

    <!-- 表格工具栏 -->
    <div v-if="showToolbar" class="table-toolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left" :selectedRows="selectedRows">
          <el-button v-if="showRefresh" type="primary" @click="handleRefresh">
            <el-icon><RefreshRight /></el-icon>
            刷新
          </el-button>
        </slot>
      </div>
      <div class="toolbar-right">
        <slot name="toolbar-right">
          <el-tooltip content="刷新" placement="top">
            <el-button type="text" @click="handleRefresh">
              <el-icon><RefreshRight /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip content="密度" placement="top">
            <el-dropdown @command="handleSizeChange">
              <el-button type="text">
                <el-icon><Operation /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="large">宽松</el-dropdown-item>
                  <el-dropdown-item command="default">默认</el-dropdown-item>
                  <el-dropdown-item command="small">紧凑</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
        </slot>
      </div>
    </div>

    <!-- Element Plus Table -->
    <el-table
      ref="tableRef"
      :data="data"
      :loading="loading"
      :height="height"
      :max-height="maxHeight"
      :size="currentSize"
      :border="border"
      :stripe="stripe"
      :show-header="showHeader"
      :highlight-current-row="highlightCurrentRow"
      :row-key="rowKey"
      :default-sort="defaultSort"
      :tooltip-effect="tooltipEffect"
      :show-summary="showSummary"
      :sum-text="sumText"
      :summary-method="summaryMethod"
      :span-method="spanMethod"
      :select-on-indeterminate="selectOnIndeterminate"
      :indent="indent"
      :lazy="lazy"
      :load="load"
      :tree-props="treeProps"
      :table-layout="tableLayout"
      :scrollbar-always-on="scrollbarAlwaysOn"
      :flexible="flexible"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
      @cell-click="handleCellClick"
      @cell-dblclick="handleCellDblclick"
      @cell-contextmenu="handleCellContextmenu"
      @row-click="handleRowClick"
      @row-contextmenu="handleRowContextmenu"
      @row-dblclick="handleRowDblclick"
      @header-click="handleHeaderClick"
      @header-contextmenu="handleHeaderContextmenu"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
      @header-dragend="handleHeaderDragend"
      @expand-change="handleExpandChange"
      v-bind="$attrs"
    >
      <!-- 选择列 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        width="55"
        :reserve-selection="reserveSelection"
        :selectable="selectable"
      />

      <!-- 索引列 -->
      <el-table-column v-if="showIndex" type="index" label="序号" width="60" :index="indexMethod" />

      <!-- 数据列 -->
      <template v-for="column in columns" :key="column.prop || column.label">
        <el-table-column
          v-if="!column.hidden"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :render-header="column.renderHeader"
          :sortable="column.sortable"
          :sort-method="column.sortMethod"
          :sort-by="column.sortBy"
          :sort-orders="column.sortOrders"
          :resizable="column.resizable"
          :formatter="column.formatter"
          :show-overflow-tooltip="column.showOverflowTooltip"
          :align="column.align"
          :header-align="column.headerAlign"
          :class-name="column.className"
          :label-class-name="column.labelClassName"
          :filters="column.filters"
          :filter-placement="column.filterPlacement"
          :filter-multiple="column.filterMultiple"
          :filter-method="column.filterMethod"
          :filtered-value="column.filteredValue"
        >
          <template v-if="column.slots?.default" #default="scope">
            <slot :name="column.slots.default" v-bind="scope" />
          </template>
          <template v-if="column.slots?.header" #header="scope">
            <slot :name="column.slots.header" v-bind="scope" />
          </template>
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页 -->
    <div v-if="showPagination && pagination" class="pagination-wrapper">
      <el-pagination
        v-model:current-page="pagination.pageNo"
        v-model:page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes || [10, 20, 50, 100]"
        :small="pagination.small"
        :disabled="pagination.disabled"
        :background="pagination.background !== false"
        :layout="pagination.layout || 'total, sizes, prev, pager, next, jumper'"
        :total="pagination.total"
        :hide-on-single-page="pagination.hideOnSinglePage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @prev-click="handlePrevClick"
        @next-click="handleNextClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SortOrder, TableColumnCtx, TableInstance } from 'element-plus'
import { Operation, Refresh, RefreshRight, Search } from '@element-plus/icons-vue'

// 列配置接口
export interface ChaiTableColumn {
  prop?: string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: boolean | 'left' | 'right'
  renderHeader?: (data: { column: TableColumnCtx<any>; $index: number }) => any
  sortable?: boolean | 'custom'
  sortMethod?: (a: any, b: any) => number
  sortBy?: string | string[] | ((row: any, index: number) => string)
  sortOrders?: Array<'ascending' | 'descending' | null>
  resizable?: boolean
  formatter?: (row: any, column: TableColumnCtx<any>, cellValue: any, index: number) => any
  showOverflowTooltip?: boolean
  align?: 'left' | 'center' | 'right'
  headerAlign?: 'left' | 'center' | 'right'
  className?: string
  labelClassName?: string
  filters?: Array<{ text: string; value: any }>
  filterPlacement?: string
  filterMultiple?: boolean
  filterMethod?: (value: any, row: any, column: TableColumnCtx<any>) => boolean
  filteredValue?: any[]
  hidden?: boolean
  slots?: {
    default?: string
    header?: string
  }
}

// 搜索表单接口
export interface ChaiTableSearchForm {
  [key: string]: any
}

// 分页配置接口
export interface ChaiTablePagination {
  pageNo: number
  pageSize: number
  total: number
  pageSizes?: number[]
  small?: boolean
  disabled?: boolean
  background?: boolean
  layout?: string
  hideOnSinglePage?: boolean
}

// 排序配置接口
export interface ChaiTableSortConfig {
  prop: string
  order: SortOrder
}

// Props 定义
interface ChaiTableProps {
  // 数据相关
  data: any[]
  loading?: boolean

  // 列配置
  columns: ChaiTableColumn[]

  // 表格配置
  height?: string | number
  maxHeight?: string | number
  size?: 'large' | 'default' | 'small'
  border?: boolean
  stripe?: boolean
  showHeader?: boolean
  highlightCurrentRow?: boolean
  rowKey?: string | ((row: any) => string)
  defaultSort?: { prop: string; order: SortOrder }
  tooltipEffect?: 'dark' | 'light'
  showSummary?: boolean
  sumText?: string
  summaryMethod?: (data: { columns: TableColumnCtx<any>[]; data: any[] }) => string[]
  spanMethod?: (data: {
    row: any
    column: TableColumnCtx<any>
    rowIndex: number
    columnIndex: number
  }) => number[] | { rowspan: number; colspan: number }
  selectOnIndeterminate?: boolean
  indent?: number
  lazy?: boolean
  load?: (row: any, treeNode: any, resolve: (data: any[]) => void) => void
  treeProps?: { hasChildren?: string; children?: string }
  tableLayout?: 'fixed' | 'auto'
  scrollbarAlwaysOn?: boolean
  flexible?: boolean

  // 选择功能
  showSelection?: boolean
  reserveSelection?: boolean
  selectable?: (row: any, index: number) => boolean

  // 索引功能
  showIndex?: boolean
  indexMethod?: (index: number) => number

  // 功能配置
  showToolbar?: boolean
  showRefresh?: boolean
  showSearch?: boolean
  showPagination?: boolean

  // 分页配置
  pagination?: ChaiTablePagination

  // 搜索表单
  searchForm?: ChaiTableSearchForm
}

// Emits 定义
interface ChaiTableEmits {
  // 分页事件
  (e: 'update:pageNo', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'update:searchForm', value: ChaiTableSearchForm): void

  // 选择事件
  (e: 'selection-change', selection: any[]): void
  (e: 'select', selection: any[], row: any): void
  (e: 'select-all', selection: any[]): void

  // 排序和筛选事件
  (e: 'sort-change', data: { column: TableColumnCtx<any>; prop: string; order: SortOrder }): void
  (e: 'filter-change', filters: Record<string, any[]>): void

  // 搜索事件
  (e: 'search', searchForm: ChaiTableSearchForm): void
  (e: 'reset'): void
  (e: 'refresh'): void

  // 分页事件
  (e: 'page-change', data: { pageNo: number; pageSize: number }): void
  (e: 'size-change', size: number): void
  (e: 'current-change', pageNo: number): void
  (e: 'prev-click', pageNo: number): void
  (e: 'next-click', pageNo: number): void

  // 表格事件
  (
    e: 'cell-mouse-enter',
    row: any,
    column: TableColumnCtx<any>,
    cell: HTMLTableCellElement,
    event: Event,
  ): void
  (
    e: 'cell-mouse-leave',
    row: any,
    column: TableColumnCtx<any>,
    cell: HTMLTableCellElement,
    event: Event,
  ): void
  (
    e: 'cell-click',
    row: any,
    column: TableColumnCtx<any>,
    cell: HTMLTableCellElement,
    event: Event,
  ): void
  (
    e: 'cell-dblclick',
    row: any,
    column: TableColumnCtx<any>,
    cell: HTMLTableCellElement,
    event: Event,
  ): void
  (
    e: 'cell-contextmenu',
    row: any,
    column: TableColumnCtx<any>,
    cell: HTMLTableCellElement,
    event: Event,
  ): void
  (e: 'row-click', row: any, column: TableColumnCtx<any>, event: Event): void
  (e: 'row-contextmenu', row: any, column: TableColumnCtx<any>, event: Event): void
  (e: 'row-dblclick', row: any, column: TableColumnCtx<any>, event: Event): void
  (e: 'header-click', column: TableColumnCtx<any>, event: Event): void
  (e: 'header-contextmenu', column: TableColumnCtx<any>, event: Event): void
  (e: 'current-row-change', currentRow: any, oldCurrentRow: any): void
  (
    e: 'header-dragend',
    newWidth: number,
    oldWidth: number,
    column: TableColumnCtx<any>,
    event: Event,
  ): void
  (e: 'expand-change', row: any, expanded: boolean): void
}

const props = withDefaults(defineProps<ChaiTableProps>(), {
  loading: false,
  size: 'default',
  border: true,
  stripe: false,
  showHeader: true,
  highlightCurrentRow: false,
  tooltipEffect: 'dark',
  showSummary: false,
  sumText: '合计',
  selectOnIndeterminate: true,
  indent: 16,
  lazy: false,
  tableLayout: 'fixed',
  scrollbarAlwaysOn: false,
  flexible: false,
  showSelection: false,
  reserveSelection: false,
  showIndex: false,
  showToolbar: true,
  showRefresh: true,
  showSearch: true,
  showPagination: true,
})

const emit = defineEmits<ChaiTableEmits>()

// 响应式数据
const tableRef = ref<TableInstance>()
const selectedRows = ref<any[]>([])
const currentSize = ref(props.size)

// 计算属性
const pageNo = computed({
  get: () => props.pagination?.pageNo || 1,
  set: (value: number) => emit('update:pageNo', value),
})

const pageSize = computed({
  get: () => props.pagination?.pageSize || 10,
  set: (value: number) => emit('update:pageSize', value),
})

const total = computed(() => props.pagination?.total || 0)

// 事件处理函数
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
  emit('selection-change', selection)
}

const handleSelect = (selection: any[], row: any) => {
  emit('select', selection, row)
}

const handleSelectAll = (selection: any[]) => {
  emit('select-all', selection)
}

const handleSortChange = (data: {
  column: TableColumnCtx<any>
  prop: string
  order: SortOrder
}) => {
  emit('sort-change', data)
}

const handleFilterChange = (filters: Record<string, any[]>) => {
  emit('filter-change', filters)
}

const handleSearch = () => {
  if (props.searchForm) {
    emit('search', props.searchForm)
  }
}

const handleReset = () => {
  if (props.searchForm) {
    // 重置搜索表单
    Object.keys(props.searchForm).forEach((key) => {
      props.searchForm![key] = ''
    })
    emit('update:searchForm', props.searchForm)
  }
  emit('reset')
}

const handleRefresh = () => {
  emit('refresh')
}

const handleSizeChange = (size: number | string) => {
  if (typeof size === 'number') {
    pageSize.value = size
    emit('size-change', size)
    emit('page-change', { pageNo: pageNo.value, pageSize: size })
  } else {
    // 表格尺寸变化
    currentSize.value = size as 'large' | 'default' | 'small'
  }
}

const handleCurrentChange = (_pageNo: number) => {
  pageNo.value = _pageNo
  emit('current-change', _pageNo)
  emit('page-change', { pageNo: _pageNo, pageSize: pageSize.value })
}

const handlePrevClick = (pageNo: number) => {
  emit('prev-click', pageNo)
}

const handleNextClick = (pageNo: number) => {
  emit('next-click', pageNo)
}

// 表格事件处理
const handleCellMouseEnter = (
  row: any,
  column: TableColumnCtx<any>,
  cell: HTMLTableCellElement,
  event: Event,
) => {
  emit('cell-mouse-enter', row, column, cell, event)
}

const handleCellMouseLeave = (
  row: any,
  column: TableColumnCtx<any>,
  cell: HTMLTableCellElement,
  event: Event,
) => {
  emit('cell-mouse-leave', row, column, cell, event)
}

const handleCellClick = (
  row: any,
  column: TableColumnCtx<any>,
  cell: HTMLTableCellElement,
  event: Event,
) => {
  emit('cell-click', row, column, cell, event)
}

const handleCellDblclick = (
  row: any,
  column: TableColumnCtx<any>,
  cell: HTMLTableCellElement,
  event: Event,
) => {
  emit('cell-dblclick', row, column, cell, event)
}

const handleCellContextmenu = (
  row: any,
  column: TableColumnCtx<any>,
  cell: HTMLTableCellElement,
  event: Event,
) => {
  emit('cell-contextmenu', row, column, cell, event)
}

const handleRowClick = (row: any, column: TableColumnCtx<any>, event: Event) => {
  emit('row-click', row, column, event)
}

const handleRowContextmenu = (row: any, column: TableColumnCtx<any>, event: Event) => {
  emit('row-contextmenu', row, column, event)
}

const handleRowDblclick = (row: any, column: TableColumnCtx<any>, event: Event) => {
  emit('row-dblclick', row, column, event)
}

const handleHeaderClick = (column: TableColumnCtx<any>, event: Event) => {
  emit('header-click', column, event)
}

const handleHeaderContextmenu = (column: TableColumnCtx<any>, event: Event) => {
  emit('header-contextmenu', column, event)
}

const handleCurrentRowChange = (currentRow: any, oldCurrentRow: any) => {
  emit('current-row-change', currentRow, oldCurrentRow)
}

const handleHeaderDragend = (
  newWidth: number,
  oldWidth: number,
  column: TableColumnCtx<any>,
  event: Event,
) => {
  emit('header-dragend', newWidth, oldWidth, column, event)
}

const handleExpandChange = (row: any, expanded: boolean) => {
  emit('expand-change', row, expanded)
}

// 公开方法
const clearSelection = () => {
  tableRef.value?.clearSelection()
}

const getSelectionRows = () => {
  return selectedRows.value
}

const toggleRowSelection = (row: any, selected?: boolean) => {
  tableRef.value?.toggleRowSelection(row, selected)
}

const toggleAllSelection = () => {
  tableRef.value?.toggleAllSelection()
}

const toggleRowExpansion = (row: any, expanded?: boolean) => {
  tableRef.value?.toggleRowExpansion(row, expanded)
}

const setCurrentRow = (row: any) => {
  tableRef.value?.setCurrentRow(row)
}

const clearSort = () => {
  tableRef.value?.clearSort()
}

const clearFilter = (columnKeys?: string[]) => {
  tableRef.value?.clearFilter(columnKeys)
}

const doLayout = () => {
  tableRef.value?.doLayout()
}

const sort = (prop: string, order: SortOrder) => {
  tableRef.value?.sort(prop, order)
}

const scrollTo = (options: ScrollToOptions | number, yCoord?: number) => {
  tableRef.value?.scrollTo(options, yCoord)
}

const setScrollTop = (top: number) => {
  tableRef.value?.setScrollTop(top)
}

const setScrollLeft = (left: number) => {
  tableRef.value?.setScrollLeft(left)
}

// 暴露给父组件
defineExpose({
  clearSelection,
  getSelectionRows,
  toggleRowSelection,
  toggleAllSelection,
  toggleRowExpansion,
  setCurrentRow,
  clearSort,
  clearFilter,
  doLayout,
  sort,
  scrollTo,
  setScrollTop,
  setScrollLeft,
  tableRef,
})
</script>

<style scoped>
.chai-table-wrapper {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.search-form {
  padding: 20px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.search-form-content {
  margin-bottom: 0;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #fff;
}

.toolbar-left {
  display: flex;
  gap: 8px;
  align-items: center;
}

.toolbar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pagination-wrapper {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  background: #fff;
}

/* Element Plus Table 样式定制 */
:deep(.el-table) {
  border: none;
}

:deep(.el-table__header-wrapper) {
  background: #fafafa;
}

:deep(.el-table th.el-table__cell) {
  background: #fafafa;
  color: #606266;
  font-weight: 600;
  border-bottom: 1px solid #ebeef5;
}
:deep(.el-table th.el-table__cell > .cell) {
  font-weight: 600;
}

:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid #f5f7fa;
}

:deep(.el-table__body tr:hover > td) {
  background-color: #f5f7fa;
}

:deep(.el-table__body tr.current-row > td) {
  background-color: #ecf5ff;
}

:deep(.el-table--border) {
  border: 1px solid #ebeef5;
}

:deep(.el-table--border::after) {
  display: none;
}

:deep(.el-table__fixed-right) {
  border-left: 1px solid #ebeef5;
}

:deep(.el-table__fixed) {
  border-right: 1px solid #ebeef5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-form {
    padding: 16px;
  }

  .table-toolbar {
    padding: 12px 16px;
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }

  .pagination-wrapper {
    padding: 12px 16px;
    justify-content: center;
  }
}
</style>
